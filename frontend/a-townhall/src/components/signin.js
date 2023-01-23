import React, { useState } from "react";
import { InputGroup, InputRightElement } from "@chakra-ui/input"
import { Button } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";




function Login(props){

    const [show, setShow] = useState(false)
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading]= useState(false);
    const toast = useToast();
    const navigate = useNavigate()

    function handleClick(){
        setShow(!show)
    }

    const submitHandler = async () => {
        setLoading(true);
        if (!email || !password) {
          toast({
            title: "Please Fill all the Feilds",
            status: "warning",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
          return;
        }
    
        // console.log(email, password);
        try {
          const config = {
            headers: {
              "Content-type": "application/json",
            },
          };
    
          const { data } = await axios.post(
            "/api/user/login",
            { email, password },
            config
          );
    
          // console.log(JSON.stringify(data));
          toast({
            title: "Login Successful",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          localStorage.setItem("userInfo", JSON.stringify(data));
          setLoading(false);
          navigate("/chat");
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
        }
      };

 return <div className="val-form">
             <div className="container">
             <div className="row justify-content-center">
        <div className="login">
            <form action="form-control">
            <div className="text-center">
                <h2>A Townhall different ...</h2>
            </div>
          
            <div className="md-form mt-3">
                <input type="text"
                 className="form-control"
                 id="text" 
                placeholder="Email" 
                onChange={(e)=> setEmail(e.target.value)}/>
            </div>
            <div className="md-form mt-3">
            <div className="md-form mt-3">
                <InputGroup>
                <input type={show ? "text" : "password" }
                className="form-control" 
                onChange={(e)=> setPassword(e.target.value)}
                 placeholder="Password"/>
                 <InputRightElement width="4.5rem">
                 <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? "Hide" : "show"}
                 </Button>

                 </InputRightElement>
                 </InputGroup>
            </div>
                     </div>
            <p onClick= {props.switch} className="mt-4">Click here to open an account</p> 
           
            <button type="button" className="btn btn-primary btn-mid w-75 mt-4 mx-4" onClick={submitHandler} isLoading={loading}>Login</button>

           </form>
        </div>
    </div>

    </div>
</div>
}

export default Login;