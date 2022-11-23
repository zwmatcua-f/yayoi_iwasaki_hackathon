
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Timeline_sent from './Timeline_sent';
import Timeline_received from './Timeline_received';
import Timeline_ranking from './Timeline_ranking';
import selectedUser from "./App"
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";
import {User} from './Timeline';
import {Contribution} from './Timeline';
import { useLocation } from "react-router-dom";

interface State {
  users: User[];
  contributions:Contribution[];
  setContributions:React.Dispatch<React.SetStateAction<Contribution[]>>
  selectedUser:User;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;


  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function Timeline_tab() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const location = useLocation();
  const  {users}  = location.state as State;
  const  {contributions}  = location.state as State;
  const {setContributions} = location.state as State;
  const {selectedUser} = location.state as State

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Sent" {...a11yProps(0)} />
          <Tab label="Received" {...a11yProps(1)} />
          <Tab label="Ranking" {...a11yProps(2)} />
        </Tabs>
        <Button variant="outlined" component={Link} to="/timeline"
          >Timeline
        </Button>
        <Button variant="outlined" component={Link} to="/user_selection"
          >User-Selection
        </Button>
      </Box>
      <TabPanel value={value} index={0}>
        <Timeline_sent contributions={contributions} users={users} setContributions={setContributions} selectedUser={selectedUser}/>
        Sent
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Timeline_received contributions={contributions} users={users} setContributions={setContributions} selectedUser={selectedUser}/>
        Received
      </TabPanel>
      <TabPanel value={value} index={2}>
        You got 
        {/* <Timeline_ranking contributions={contributions} users={users} setContributions={setContributions} selectedUser={selectedUser}/> */}
        pt!
      </TabPanel>
    </Box>
  );
}