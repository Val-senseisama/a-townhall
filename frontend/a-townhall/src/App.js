import React from "react";
import {  Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import ChatPage from "./pages/Chat";
import Homepage from "./pages/Home";
import "../src/login.css"


function App() {
  return (
    <div className="App">
    <Routes>
      <Route path="/" element=<Homepage />/>
      <Route path="/chat" element=<ChatPage /> />
    </Routes>
    </div>
  );
}

export default App;
