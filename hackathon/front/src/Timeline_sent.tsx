import { useEffect, useState } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import Fab from '@mui/material/Fab';
import EditIcon from '@mui/icons-material/Edit';
import * as React from 'react';

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
  contributions: Contribution[]
  setContributions:React.Dispatch<React.SetStateAction<Contribution[]>>
  users: User[];
  selectedUser: User
};



export default function Timeline_sent(props:Props) {
    const sentReq = "http://localhost:8000/sent?name="+ props.selectedUser.name;
  
    const fetchContributions = async () => {
      try {
        const res = await fetch(sentReq);
        if (!res.ok) {
          throw Error(`Failed to fetch users: ${res.status}`);
        }
  
        const contributionsJSON = await res.json();
        const data: Contribution[] = Object.values(contributionsJSON);
        props.setContributions(data);
        console.log(props.contributions);
      } catch (err) {
        console.error(err);
      }
  
    };
    
    useEffect(() => {
      fetchContributions();
    },[]);
    
    return (
        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
          {props.contributions.map((contribution)=>(
    
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
                <Avatar src="/broken-image.jpg" />
            </ListItemAvatar>
            <ListItemText
              primary={contribution.sender}
              secondary={
                <React.Fragment> TO_
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    fontSize={18}
                    color="text.primary"
                  >
                    {contribution.receiver}
                  </Typography>
                    <br></br>
                    {contribution.message} 
                </React.Fragment>
              }
            />
            
            {/* sentのタブでやる↓ */}
    
            <Fab size="small" color="secondary" aria-label="edit">
              <EditIcon/>
         　 </Fab>
            <Fab size="small" color="primary" aria-label="add">
              <DeleteIcon />
            </Fab>
          </ListItem>
          ))}
        </List>
      );
    }

    