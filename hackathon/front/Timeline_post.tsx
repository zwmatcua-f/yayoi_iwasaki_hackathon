import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { useEffect, useState } from "react";
import Fab from '@mui/material/Fab';
import SendIcon from '@mui/icons-material/Send';
import { useLocation } from "react-router-dom";

interface State {
  selectedUser: User;
}

type Contribution = {
   sender:string;
   receiver:string;
   message:string;
   point:number;
}

type User = {
    id:string;
    name:string;
    age:number;
}


type Props = {
    // onSubmit: (name: string, age:number) => void;
    // fetchUsers:() => Promise<void>
    // setSelectedUser: React.Dispatch<React.SetStateAction<User>> 
    contributions: Contribution[]
    setContributions:React.Dispatch<React.SetStateAction<Contribution[]>>
    users: User[];
    setUsers:React.Dispatch<React.SetStateAction<User[]>>
};



export default function BasicTextFields(props : Props) {
   
    const location = useLocation();
    const { selectedUser } = location.state as State;

    const [contribution, setContribution] = useState<Contribution>();
    const sender = selectedUser.name;
    const [receiver, setReceiver] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [point, setPoint] = useState<number>(0);

    const {users,setUsers} = props;
    console.log(selectedUser);

    // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    //     props.setContributions(([...(props.contributions as Contribution[]), contribution as Contribution]))
      
    // };

    const receiverhandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setReceiver(event.target.value);
    };
    const messagehandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    };
    const pointhandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
         setPoint(Number(event.target.value));
    };

    //POSTここから
    const onSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setContribution({
        sender:selectedUser.name,
        receiver: receiver,
        message: message,
        point: point,
      })
      
      console.log(contribution as Contribution);
  
      if (!message) {
        alert("Please enter message");
        return;
      }
  
      if (message.length > 200) {
        alert("Please enter message shorter than 200 characters");
        return;
      }
  
      if (point < 1 || point > 999) {
        alert("Please enter point 1 to 999");
        return;
      }
      
      try {
        const result = await fetch("http://localhost:8000/timeline", {
          method: "POST",
          body: JSON.stringify({
            sender,
            receiver,
            message,
            point
          }),
        });
        if (!result.ok) {
          throw Error(`Failed to create user: ${result.status}`);
        }
  
      } catch (err) {
        console.error(err);
      }
    }
    


    //POSTここまで

    //EDITここから

    //DELETEここから
      
  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
      onSubmit={onSubmit}
    >

      {/* ↓送り先 */}
      <TextField
          id="outlined-select-receiver"
          select
          label="Select Receiver"
          value={receiver}
          onChange={receiverhandleChange}
        >

          {props.users.map((option) => (
            <MenuItem key={option.id} value={option.name}>
              {option.name}
            </MenuItem>
          ))}
        
        
        </TextField>
       
       {/* ↓メッセージ */}
       <TextField
          id="outlined-textarea"
          label="message"
          placeholder=""
          multiline
          onChange={messagehandleChange}
        >
          {/* <input
            type={"string"}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></input> */}
          
        </TextField>

        {/* ↓ポイント数 */}
        <TextField
          id="standard-number"
          label="Point"
          type="number"
          InputLabelProps={{
            shrink: true,
          }}
          variant="standard"
          onChange={pointhandleChange}
        >
           {/* <input
             type={"number"}
             value={point}
             onChange={(e) => setPoint(Number(e.target.value))}
          ></input> */}
          
          
        </TextField>
        
        <button type={"submit"} >
        <Fab color="primary" aria-label="add">
          <SendIcon />
        </Fab>
        </button>

    </Box>
  )

}

