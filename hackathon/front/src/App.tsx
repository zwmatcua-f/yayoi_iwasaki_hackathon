// import logo from "./logo";
import "./App.css";
import { useEffect, useState } from "react";
import Form from "./Form";
// import Timeline from "./Timeline"
import React from "react";
// import { useRouter } from 'next/router';

export type User = {
  id:string;
  name:string;
  age:number;
}

function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = React.useState<User>({id:"",name:"",age:0});
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:8000/users");
      if (!res.ok) {
        throw Error(`Failed to fetch users: ${res.status}`);
      }

      const usersJSON = await res.json();
      const data: User[] = Object.values(usersJSON);
      setUsers(data);
      console.log(users);
    } catch (err) {
      console.error(err);
    }

  };
  
  useEffect(() => {
    fetchUsers();
  },[]);


  return (
    <div className="App">
      <header className="App-header">
        <p>
          UTTC大感謝祭
        </p>


        
      </header>


      <main className="App-main">


        <Form users={users} selectedUser={selectedUser} setSelectedUser={setSelectedUser} />
        {/* <Timeline users={users} setUsers={setUsers}/> */}
        
        {/* <ul>
          {users.map((user) => {
            return <li key={user.id}>
              <span>{user.name}</span>
            </li>
          })}
        </ul> */}
      
      </main>

    </div>
  );

}

export default App;


