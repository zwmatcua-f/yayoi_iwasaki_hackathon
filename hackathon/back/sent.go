package main

import (
	"database/sql"
	"encoding/json"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"

	//"github.com/oklog/ulid"
	"log"
	//"math/rand"
	"net/http"
	"os"
	//"time"
	//"unicode/utf8"
)

type SentResForHTTPGet struct {
	ContributionId string `json:"contribution_id"`
	Sender         string `json:"sender"`
	Receiver       string `json:"receiver"`
	Message        string `json:"message"`
	Point          int    `json:"point"`
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

func handlerSent(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Headers", "*")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

	switch r.Method {
	case http.MethodGet:
		//クエリリクエスト取得
		v := r.URL.Query()
		name := ""

		for key := range v {
			name = v[key][0]
		}

		if len(name) == 0 {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		rows, err := db.Query("SELECT * FROM contribution WHERE SENDER=?", name)
		if err != nil {
			log.Printf("fail: db.Query, %v\n", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		// ②-3
		contributions := make([]SentResForHTTPGet, 0)
		for rows.Next() {
			var u SentResForHTTPGet
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

	default:
		log.Printf("fail: HTTP Method is %s\n", r.Method)
		w.WriteHeader(http.StatusBadRequest)
		return
	}
}

//func sent() {
//	fmt.Println("start!")
//
//	// ② /userでリクエストされたらnameパラメーターと一致する名前を持つレコードをJSON形式で返す
//
//	http.HandleFunc("/sent", handlerSent)
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
//
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
