import React, { useState } from "react";
import { InputGroup, InputRightElement } from "@chakra-ui/input";
import { Button } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router-dom";



function Register(props){
    const [show, setShow] = useState(false)
    const [name,  setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [pic, setPic] = useState();
    const [loading, setLoading] = useState(false);
    
  const [picLoading, setPicLoading] = useState(false);
    const toast = useToast()
    const navigate = useNavigate()

function handleClick(){
    setShow(!show)
}
const postDetails= (pics)=>{
    setPicLoading(true);
   if(pics === undefined){
    toast({
        title:"Please select an image",
        status:"warning",
        duration:5000,
        isClosable: true,
        position:"bottom"
    });
    return;
   }
   console.log(pics);

   if(pics.type === "image/jpeg" || pics.type === "image/png"){
    const data = new FormData();
    data.append("file", pics);
    data.append("upload_preset", "a-townhall");
    data.append("cloud_name", "dyzpvofax");
    fetch("https://api.cloudinary.com/v1_1/dyzpvofax/image/upload", {
        method: "post",
        body: data,
    }).then((res) => res.json())
    .then((data) => {
        console.log(data);
        setPic(data.url.toString());
        setPicLoading(false);
    }).catch((err) =>{
        console.log(err);
        setPicLoading(false);
    });
   }else{
        toast({
            title:"Please select an image",
            status:"warning",
            duration:5000,
            isClosable: true,
            position:"bottom"
        });
        setPicLoading(false);
        return;
   }
};

const submitHandler= async ()=>{
    setPicLoading(true)
    if(!name || !email || !password){
        toast({
            title:"Please fill all the fields",
            status:"warning",
            duration:5000,
            isClosable: true,
            position:"bottom"
        });
        setLoading(true);
        setPicLoading(false);
        return;
    }

    try {
        const config = {
            headers:{
                "Content-type":"application/json"
            },
        };
        const { data } = await axios.post("/api/user", {name, email, password, pic}, config);
        toast({
            title:"Registration Successful",
            status:"success",
            duration:5000,
            isClosable: true,
            position:"bottom"
        });

        localStorage.setItem("userInfo", JSON.stringify(data));
        setPicLoading(false);
        setLoading(false);
        navigate("/chat")
    } catch(error){
        toast({
            title:"Error occured",
            status:"error",
            duration:5000,
            isClosable: true,
            position:"bottom"
        });
        setLoading(false);
        setPicLoading(false);
    }
};



 return <div className="val-form">
             <div className="container">
             <div className="row justify-content-center">
               
        <div className="login">
            <form >
            <div className="text-center">
                <h2>A Townhall different ...</h2>
            </div>
            <div className="md-form mt-3">
                <input type="text"
                 className="form-control "
                  id="username"
                   placeholder="Username"
                    onChange={(e)=> setName(e.target.value)}
                   />
            
            </div>
            <div className="md-form mt-3">
                <input type="text" 
                className="form-control " 
                onChange={(e)=> setEmail(e.target.value)}
                placeholder="Email"
                 />
            
            </div>
            <div className="md-form mt-3">
                <InputGroup>
                <input type={show ? "text" : "password" }
                className="form-control " 
                onChange={(e)=> setPassword(e.target.value)}
                 placeholder="Password"/>
                 <InputRightElement width="4.5rem">
                 <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? "Hide" : "show"}
                 </Button>

                 </InputRightElement>
                 </InputGroup>
            </div>
            <div className="md-form mt-3">
                <input type="file" 
                className="form-control "
                 id="pic"
                 p={1.5}
                 accept="image/"
                 onChange={(e)=> postDetails(e.target.files[0])} />
                <label for="pic">Profile pic</label>
            </div>
            <p onClick= {props.switch}>Already have an account?</p> 
            <button type="button" className="btn btn-primary btn-mid w-75 mt-4 mx-4" onClick={submitHandler} isLoading={picLoading} > Sign up</button>

            </form>
        </div>
    </div>

    </div>
</div>
}

export default Register;