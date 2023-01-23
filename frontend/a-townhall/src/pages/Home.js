import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../components/signin";
import Register from "../components/signup";

function Homepage (){
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));

        if(user)navigate("/chat");
    }, [navigate]);

    const [account, setAccount] = useState(false)
    function Switch(event){
        console.log("I can switch");
        event.preventDefault();
        setAccount(prevValue => prevValue ? false : true)
    } 
    if(account === true){
        return <Login switch={Switch}/>
    }else{
        return <Register switch={Switch}/> 
    }
  }


export default Homepage;