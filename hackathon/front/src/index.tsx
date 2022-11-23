import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Timeline from './Timeline';
import Timeline_tab from './Timeline_tab';
import reportWebVitals from './reportWebVitals';
import {Route, BrowserRouter, Routes} from "react-router-dom";

// ReactDOM.render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <div>
//         <Route path="/user_selection" element={<App/>}/> 
//         <Route path="/timeline" element={<Timeline/>}/>
//         {/* <Route path="/received" element={<Received/>}/>
//         <Route path="/sent" element={<Sent/>}/>
//         <Route path="/Totalpoint" element={<Totalpoint/>}/> */}
//       </div>
//     </BrowserRouter>
//   </React.StrictMode>,
//   document.getElementById("root")
// );


const rootElement = document.getElementById("root");
ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/user_selection" element={<App/>}/> 
      <Route path="/timeline" element={<Timeline/>}/>
      <Route path="/views" element={<Timeline_tab/>}/>
    </Routes>
  </BrowserRouter>,
  rootElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
