import React, {useState} from 'react'

import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, effect, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react'
import {BellIcon, ChevronDownIcon} from "@chakra-ui/icons"
import ChatLoading from '../ChatLoading'
import { ChatState } from "../../Context/ChatProvider"
import ProfileModel from './ProfileModel'
import { useNavigate } from 'react-router-dom'
import { getSender } from '../../config/ChatLogics'
import UserListItem from '../UserAvatar/UserListItem'
import { BadgedButton } from "@react-md/badge";



import axios from 'axios'
const SideDrawer = () => {
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingChat, setLoadingChat] = useState()

  const {isOpen, onOpen, onClose} = useDisclosure()
  
  const {user, setSelectedChat, chats, setChats, notification, setNotification} = ChatState();
  const navigate = useNavigate();
  const toast = useToast()

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/")
  }

  const handleSearch = async() => {
    if(!search){
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      })
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const {data} = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error occured",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      })
    }
  }

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const {data} = await axios.post("/api/chat", {userId}, config);

      if(!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
      setLoadingChat(false);
      onClose();

    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      })
    }
  }

  return (
    <>
      <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bg="white"
      w="100%"
      p="5px 10px 5px 10px"
      >
        <Tooltip label="Search Users to chat"
         hasArrow placement='bottom-end'
         >
          <Button variant="ghost" onClick={onOpen}>
          <i class="fa-solid fa-magnifying-glass"></i>
          <Text display={{base: "none", md: "flex"}} px="4">
            Search User
          </Text>
          </Button>
         </Tooltip>

         <Text fontSize="2xl" fontFamily="Work sans">
          Talkrr         
         </Text>
         <div>
          <Menu>
            <MenuButton p={1}>
            <BadgedButton></BadgedButton>
             <BellIcon fontSize="2x1" m={1}/>
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No Messages"}
              {notification.map(notify => (
                <MenuItem key={notification._id} onClick={() => {
                setSelectedChat(notify.chat);
                setNotification(notification.filter((n) => n !== notify))}}>
                  {notify.chat.isGroupChat? 'New Message from ${notif.chat.chatName}' 
                   : `New Message from ${getSender(user, notify.chat.users)}`}
                </MenuItem>
                
              ))}
            </MenuList>
          </Menu>
          <Menu>
          <MenuButton as={Button}
           rightIcon={<ChevronDownIcon/>} 
           >
            <Avatar size='sm' cursor='pointed' name={user.name} src={user.picture}>

            </Avatar>
           </MenuButton>
           <MenuList>
           <ProfileModel user={user}>
            <MenuItem>My Profile</MenuItem>
           </ProfileModel>
            <MenuDivider/> 
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
           </MenuList>
          </Menu>
         </div>
      </Box>


      <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay/>
        <DrawerContent>
          <DrawerHeader borderBottomWidth='1px'>
            Search Users
          </DrawerHeader>
          <DrawerBody>
          <Box display='flex' pb={2}>
          <Input
            placeholder='Search by name or email'
            mr={2}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Button onClick={handleSearch}> Go</Button>
          </Box>
          {loading ?  ( <ChatLoading/> ) : (
            searchResult?.map((user) => ( 
              <UserListItem
               key={user._id}
               user={user}
               handleFunction={() => accessChat(user._id)}
               />
            ))
          )}
          {loadingChat && <Spinner ml="auto" display="flex"/>}
        </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideDrawer




