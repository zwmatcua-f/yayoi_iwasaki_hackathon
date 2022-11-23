import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

type Contribution = {
    sender:string;
    receiver:string;
    message:string;
    point:number;
}

type Props = {
    contributions: Contribution[];
    setContributions:React.Dispatch<React.SetStateAction<Contribution[]>>
};


export default function Timeline_contributions(props : Props) {
    const {contributions, setContributions} =props;

  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {contributions.map((contribution)=>(

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

        {/* <Fab size="small" color="secondary" aria-label="edit">
          <EditIcon />
     　 </Fab>
        <Fab size="small" color="primary" aria-label="add">
          <DeleteIcon />
        </Fab> */}
      </ListItem>
      ))}
    </List>
  );
}