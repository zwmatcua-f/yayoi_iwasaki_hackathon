// import { useEffect, useState } from "react";
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import Divider from '@mui/material/Divider';
// import ListItemText from '@mui/material/ListItemText';
// import ListItemAvatar from '@mui/material/ListItemAvatar';
// import Avatar from '@mui/material/Avatar';
// import Typography from '@mui/material/Typography';
// import DeleteIcon from '@mui/icons-material/Delete';
// import Fab from '@mui/material/Fab';
// import EditIcon from '@mui/icons-material/Edit';
// import * as React from 'react';

// type Contribution = {
//   sender:string;
//   receiver:string;
//   message:string;
//   point:number;
// }

// type User = {
//    id:string;
//    name:string;
//    age:number;
// }

// type Props = {
//   contributions: Contribution[]
//   setContributions:React.Dispatch<React.SetStateAction<Contribution[]>>
//   users: User[];
//   selectedUser: User
// };



// export default function Timeline_ranking(props:Props) {
//     const [contributions, setContributions] = useState<Contribution[]>([]);
//     const rankingReq = "http://localhost:8000/Totalpoint?name="+ props.selectedUser;

//     const fetchContributions = async () => {
//       try {
//         const res = await fetch(rankingReq);
//         if (!res.ok) {
//           throw Error(`Failed to fetch users: ${res.status}`);
//         }
  
//         const contributionsJSON = await res.json();
//         const data: Contribution[] = Object.values(contributionsJSON);
//         setContributions(data);
//         console.log(contributions);
//       } catch (err) {
//         console.error(err);
//       }
  
//     };
    
//     useEffect(() => {
//       fetchContributions();
//     },[]);
    
    
//     return (
//         <p>
//         {props.contributions.point}
//         </p>
//       );
//     }

export default{}
