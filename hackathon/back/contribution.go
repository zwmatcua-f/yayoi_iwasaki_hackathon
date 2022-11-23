package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
	"github.com/oklog/ulid"
	"log"
	"math/rand"
	"net/http"
	"os"
	_ "os/signal"
	_ "syscall"
	"time"
	"unicode/utf8"
)

type ContResForHTTPGet struct {
	ContributionId string `json:"contribution_id"`
	Sender         string `json:"sender"`
	Receiver       string `json:"receiver"`
	Message        string `json:"message"`
	Point          int    `json:"point"`
}

type ContReqForHTTPPost struct {
	ContributionId string `json:"contribution_id"`
	Sender         string `json:"sender"`
	Receiver       string `json:"receiver"`
	Message        string `json:"message"`
	Point          int    `json:"point"`
}

type ContReqForHTTPDELETE struct {
	DeleteId string `json:"delete_id"`
}

type ContReqForHTTPUPDATE struct {
	UpdateId    string `json:"update_id"`
	NewReceiver string `json:"new_receiver"`
	NewMessage  string `json:"new_message"`
	NewPoint    int    `json:"new_point"`
}

// ① GoプログラムからMySQLへ接続

func init() {

	err := godotenv.Load(".env_mysql")

	// もし err がnilではないなら、"読み込み出来ませんでした"が出力されます。
	if err != nil {
		fmt.Printf("読み込み出来ませんでした: %v", err)
	}

	mysqlUser := os.Getenv("MYSQL_USER")
	mysqlUserPwd := os.Getenv("MYSQL_PASSWORD")
	mysqlDatabase := os.Getenv("MYSQL_DATABASE")

	// ①-2
	_db, err := sql.Open("mysql", fmt.Sprintf("%s:%s@(localhost:3306)/%s", mysqlUser, mysqlUserPwd, mysqlDatabase))
	if err != nil {
		log.Fatalf("fail: sql.Open, %v\n", err)
	}
	//// ①-3
	if err := _db.Ping(); err != nil {
		log.Println(mysqlUser, mysqlUserPwd, mysqlDatabase)
		log.Fatalf("fail: _db.Ping, %v\n", err)
	}
	db = _db
}

func handlerTimeline(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Headers", "*")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

	switch r.Method {
	case http.MethodGet:
		rows, err := db.Query("SELECT * FROM contribution")
		if err != nil {
			log.Printf("fail: db.Query, %v\n", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		// ②-3
		contributions := make([]ContResForHTTPGet, 0)
		for rows.Next() {
			var u ContResForHTTPGet
			if err := rows.Scan(&u.ContributionId, &u.Sender, &u.Receiver, &u.Message, &u.Point); err != nil {
				log.Printf("fail: rows.Scan, %v\n", err)

				if err := rows.Close(); err != nil { // 500を返して終了するが、その前にrowsのClose処理が必要
					log.Printf("fail: rows.Close(), %v\n", err)
				}
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			contributions = append(contributions, u)
		}

		// ②-4
		bytes, err := json.Marshal(contributions)
		if err != nil {
			log.Printf("fail: json.Marshal, %v\n", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		_, err = w.Write(bytes)
		if err != nil {
			return
		}

	case http.MethodPost:
		fmt.Printf("post-start!")
		//リクエストボディを受け取る
		var d ContReqForHTTPPost
		if err := json.NewDecoder(r.Body).Decode(&d); err != nil {
			log.Printf("fail: decode, %v\n", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		t := time.Now()
		entropy := ulid.Monotonic(rand.New(rand.NewSource(t.UnixNano())), 0)
		id := ulid.MustNew(ulid.Timestamp(t), entropy)
		d.ContributionId = fmt.Sprintf("%s", id)
		fmt.Printf(d.ContributionId)

		tx, err := db.Begin()
		if err != nil {
			log.Fatal(err)
		}

		stmt, err := db.Prepare(
			"INSERT INTO contribution (CONTRIBUTION_ID, SENDER, RECEIVER ,MESSAGE, POINT) VALUES(?,?,?,?,?)")
		if err != nil {
			err := tx.Rollback()
			if err != nil {
				return
			}
			log.Fatal(err)
		}

		fmt.Printf("prepare_ok")

		fmt.Printf("d is %#v\n", d)

		//messageの長さ指定、ポイント制限
		if utf8.RuneCountInString(d.Message) > 200 {
			log.Printf("toolongMessage: , %v\n", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		if d.Point < 0 || d.Point > 999 {
			log.Printf("wrongPoints: , %v\n", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		_, err = stmt.Exec(d.ContributionId, d.Sender, d.Receiver, d.Message, d.Point)
		if err != nil {
			log.Printf("fail: , %v\n", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		if err := tx.Commit(); err != nil {
			log.Fatal(err)
		}
		w.WriteHeader(http.StatusOK)

		if err != nil {
			log.Printf("fail: db.Exec, %v\n", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

	case http.MethodDelete:

		//削除これで書く
		fmt.Printf("delete-start!")
		//リクエストボディを受け取る
		var d ContReqForHTTPDELETE
		if err := json.NewDecoder(r.Body).Decode(&d); err != nil {
			log.Printf("fail: decode, %v\n", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		//DELETEする
		tx, err := db.Begin()
		if err != nil {
			log.Fatal(err)
		}

		stmt, err := db.Prepare(
			"DELETE FROM contribution WHERE Contribution_Id=?")
		if err != nil {
			err := tx.Rollback()
			fmt.Printf("prepare_fail")
			if err != nil {
				return
			}
			log.Fatal(err)
		}

		fmt.Printf("prepare_ok")

		fmt.Printf("d is %#v\n", d)

		_, err = stmt.Exec(d.DeleteId)
		if err != nil {
			log.Printf("fail: , %v\n", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		if err := tx.Commit(); err != nil {
			log.Fatal(err)
		}
		w.WriteHeader(http.StatusOK)

		if err != nil {
			log.Printf("fail: db.Exec, %v\n", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

	case http.MethodPut:

		//変更はこれ
		fmt.Printf("update-start!")
		//リクエストボディを受け取る
		var d ContReqForHTTPUPDATE
		if err := json.NewDecoder(r.Body).Decode(&d); err != nil {
			log.Printf("fail: decode, %v\n", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		//ContributionIdが一致するものをSELECT
		//PUTする
		tx, err := db.Begin()
		if err != nil {
			log.Fatal(err)
		}

		stmt, err := db.Prepare(
			"UPDATE contribution SET RECEIVER=?, MESSAGE=?, POINT=? WHERE CONTRIBUTION_ID=?")
		if err != nil {
			err := tx.Rollback()
			fmt.Printf("prepare_fail")
			if err != nil {
				return
			}
			log.Fatal(err)
		}

		fmt.Printf("prepare_ok")

		fmt.Printf("d is %#v\n", d)

		_, err = stmt.Exec(d.NewReceiver, d.NewMessage, d.NewPoint, d.UpdateId)
		if err != nil {
			log.Printf("fail: , %v\n", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		if err := tx.Commit(); err != nil {
			log.Fatal(err)
		}
		w.WriteHeader(http.StatusOK)

		if err != nil {
			log.Printf("fail: db.Exec, %v\n", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

	default:
		log.Printf("fail: HTTP Method is %s\n", r.Method)
		w.WriteHeader(http.StatusBadRequest)
		return
	}
}

//func contribution() {
//	fmt.Println("timeline_start!")
//
//	// ② /userでリクエストされたらnameパラメーターと一致する名前を持つレコードをJSON形式で返す
//
//	http.HandleFunc("/timeline", handlerTimeline)
//	fmt.Printf("waiting...")
//
//	// ③ Ctrl+CでHTTPサーバー停止時にDBをクローズする
//	closeDBWithSysCall()
//
//	// 8000番ポートでリクエストを待ち受ける
//	log.Println("Listening...")
//	if err := http.ListenAndServe(":8000", nil); err != nil {
//		log.Fatal(err)
//	}

//}

// ③ Ctrl+CでHTTPサーバー停止時にDBをクローズする
//func closeDBWithSysCall() {
//	sig := make(chan os.Signal, 1)
//	signal.Notify(sig, syscall.SIGTERM, syscall.SIGINT)
//	go func() {
//		s := <-sig
//		log.Printf("received syscall, %v", s)
//		if err := db.Close(); err != nil {
//			log.Fatal(err)
//		}
//		log.Printf("success: db.Close()")
//		os.Exit(0)
//	}()
//}
