import * as React from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import { blue } from '@mui/material/colors';
import { Link } from "react-router-dom";
import Timeline_contributions from './Timeline_contributions';





export type User = {
  id:string;
  name:string;
  age:number;
}

type Props = {
  // onSubmit: (name: string, age:number) => void;
  // fetchUsers:() => Promise<void>
  setSelectedUser: React.Dispatch<React.SetStateAction<User>> 
  selectedUser : User
  users: User[];
};

export interface SimpleDialogProps {
  users: User[];
  selectedUser:User;
  open: boolean;
  //selectedValue: string;
  onClose: (value: User) => void;
}

function SimpleDialog(props: SimpleDialogProps) {
  const { users,selectedUser, onClose, open } = props;

  const handleClose = () => {
    onClose(selectedUser);
  };

  const handleListItemClick = (selectedUser:User) => {
    onClose(selectedUser);
  };


  const timelineLink = "/timeline";

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Select User</DialogTitle>
      <List sx={{ pt: 0 }}>
        {users.map((user) => (
          <ListItem button onClick={() => handleListItemClick(user)} key={user.id}  
          // component={Link} to={timelineLink} state={{selectedUser:selectedUser}}
          >
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                <PersonIcon />
              </Avatar>
            </ListItemAvatar>
            {user.name}
            <ListItemText />
          </ListItem>
        ))}
        {/* <ListItem autoFocus button onClick={() => handleListItemClick('addAccount')}>
          <ListItemAvatar>
            <Avatar>
              <AddIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Add account" />
        </ListItem> */}
      </List>
    </Dialog>
  );
}

export default function Form(props: Props) {
  const [open, setOpen] = React.useState(false);
  // const [selectedUser, setSelectedUser] = React.useState(user.name);

  
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (user:User) => {
    setOpen(false);
    props.setSelectedUser(user);
  };


  return (
    <div>
      <Typography variant="subtitle1"  component={Link} to="/timeline" state={{selectedUser:props.selectedUser}}>
        {props.selectedUser.name}
      </Typography>
      <br />
      <Button variant="outlined" onClick={handleClickOpen}>
        User Select
      </Button>
      <SimpleDialog
        users={props.users}
        selectedUser={props.selectedUser}
        open={open}
        onClose={handleClose}
      />
    </div>
  );
}


