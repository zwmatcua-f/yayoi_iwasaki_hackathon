// import logo from "./logo";
// import "./App.css";
import { useEffect, useState } from "react";
// import Form from "./Form";
import Timeline_post from "./Timeline_post";
import Timeline_contributions from "./Timeline_contributions"
// import Timeline_received from "./Timeline_received"
// import Timeline_sent from "./Timeline_sent"
import React from "react";
import users from "./Timeline_post";
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

interface State {
  selectedUser: User;
}

export type Contribution = {
  sender:string;
  receiver:string;
  message:string;
  point:number;
}

export type User = {
  id:string;
  name:string;
  age:number;
}


function Timeline() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const location = useLocation();
  const { selectedUser } = location.state as State;

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

  

  const fetchContributions = async () => {
    try {
      const res = await fetch("http://localhost:8000/timeline");
      if (!res.ok) {
        throw Error(`Failed to fetch users: ${res.status}`);
      }

      const contributionsJSON = await res.json();
      const data: Contribution[] = Object.values(contributionsJSON);
      setContributions(data);
      console.log(contributions);
    } catch (err) {
      console.error(err);
    }

  };
  
  useEffect(() => {
    fetchContributions();
  },[]);
  


  return (
    <div className="App">
      <header className="App-header">
        {/* <p>
          TIMELINE
          
        </p> */}
        
        <Stack spacing={2} direction="row" >
             <Button variant="outlined" component={Link} to="/views" state={{users:users, contributions:contributions,selectedUser:selectedUser,setContributions:setContributions}}
             >Dashboard
             </Button>
             <Button variant="outlined" component={Link} to="/user_selection"
             >User-Selection
             </Button>
        </Stack>
        

       

        
      </header>


      <main className="App-main">


        {/* <Form users={users} selectedUser={selectedUser} setSelectedUser={setSelectedUser}/> */}
        <Timeline_post contributions={contributions} setContributions={setContributions} users={users} setUsers={setUsers}/>
        <Timeline_contributions contributions={contributions} setContributions={setContributions} />
        {/* <Timeline_received contributions={contributions} setContributions={setContributions} />
        <Timeline_sent contributions={contributions} setContributions={setContributions} /> */}
        {/* <ul>
          {contributions.map((contribution) => {
            return <li key={contribution.contribution_id}>
              <span>{contribution.sender}{contribution.receiver}{contribution.message}{contribution.point}</span>
            </li>
          })}
        </ul> */}
      
      </main>

    </div>
  );

}

export default Timeline;


