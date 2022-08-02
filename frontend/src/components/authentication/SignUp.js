import React from 'react'
// import { VStack } from '@chakra-ui/layout'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, useToast, VStack } from '@chakra-ui/react'
import { useState } from 'react'
import axios from "axios";
import {useNavigate} from "react-router-dom"

const SignUp = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [show, setShow] = useState(false);
    const [confirmpassword, setConfirmpassword] = useState();
    const [picture, setPicture] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const handleClick = () =>setShow(!show);

    const postDetails = (pics) =>{
     setLoading(true);
     if(pics === undefined){
        toast({
          title: "Please Select an image",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
     }
     if(pics.type ==='image/jpeg' || pics.type ==='image/png'){
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "Talkrr");
      data.append("cloud_name", "dpdifjexc");
      fetch("https://api.cloudinary.com/v1_1/dpdifjexc/image/upload", {
        method: "post", 
        body: data,
      }).then((res)=> res.json())
      .then(data =>{
        setPicture(data.url.toString());
        console.log(data.url.toString());
        setLoading(false)
      })
      .catch((err)=> {
        console.log(err);
        setLoading(false);
      })
     }else{
      toast({
        title: "Please Select an image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
     }
    }


    const submitHandler = async()=>{
     setLoading(true)
     if(!name || !email || !password || !confirmpassword){
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
     }
     if(password !== confirmpassword){
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
     }
     try {
      const config = {
        headers: {
          "Content-type": "application/json",

        },
      };
      const {data} = await axios.post(
        "/api/user",
        {name, email, password, picture},
        config
      );
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem('userInfo', JSON.stringify(data));
      setLoading(false);
      navigate('/chats')

     } catch (error) {
      toast({
        title: "Error Occured",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
     }
    }


  return (
    <VStack spacing='5px' color='black'>
    <FormControl id='first-name' isRequired>
        <FormLabel>Name</FormLabel>
            <Input 
                placeholder='Enter Your Name.'
                onChange={(e)=>setName(e.target.value)}
            />
        
    </FormControl>

    <FormControl id='email' isRequired>
        <FormLabel>Email</FormLabel>
            <Input 
                placeholder='Enter Your email.'
                onChange={(e)=>setEmail(e.target.value)}
            />
        
    </FormControl>

    <FormControl id='password' isRequired>
        <FormLabel>Password</FormLabel>
         <InputGroup>
            <Input 
                type={show?'text':'password'}
                placeholder='Enter Your password.'
                onChange={(e)=>setPassword(e.target.value)}
            />
            <InputRightElement width='4.5rem'>
              <Button h='1.75rem' size='sm' onClick={handleClick}>
                {show ? "Hide": "Show"}
              </Button>
            </InputRightElement>
         </InputGroup>
        
    </FormControl>
    <FormControl id='password' isRequired>
        <FormLabel>Confirm Password</FormLabel>
         <InputGroup>
            <Input 
                type={show?'text':'password'}
                placeholder='Confirm password.'
                onChange={(e)=>setConfirmpassword(e.target.value)}
            />
            <InputRightElement width='4.5rem'>
              <Button h='1.75rem' size='sm' onClick={handleClick}>
                {show ? "Hide": "Show"}
              </Button>
            </InputRightElement>
         </InputGroup>
    </FormControl>

    <FormControl id='pic' >
        <FormLabel>Upload Your Picture</FormLabel>
            <Input 
                type='file'
                p={1.5}
                accept='image/*'
                onChange={(e)=> postDetails(e.target.files[0])}
            />
        
    </FormControl>
    <Button
      colorScheme='blue'
      width='100%'
      style={{marginTop: 15}}
      onClick={submitHandler}
      isLoading = {loading}
      >
     Sign Up
    </Button>
    </VStack>
  )
}

export default SignUp