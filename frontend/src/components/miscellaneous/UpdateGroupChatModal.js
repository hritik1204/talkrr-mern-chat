import { ViewIcon } from '@chakra-ui/icons';
import { IconButton, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, Button, useToast, Box, FormControl, Input, Spinner } from '@chakra-ui/react'
import axios from 'axios';
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import UserListItem from '../UserAvatar/UserListItem';


const UpdateGroupChatModal = ({fetchAgain, setFetchAgain, fetchMessages}) => {
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameloading] = useState(false);

    const toast = useToast();
    
    const {isOpen, onOpen, onClose} = useDisclosure();
    const {selectedChat, setSelectedChat, user} = ChatState();

    const handleRemove = async(user1) =>{
        if(selectedChat.groupAdmin._id !== user._id && user1._id !== user._id){
         toast({
          title: "Only admin can remove someone!",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
          });
         return;
        }
         try {
            setLoading(true); 

            const config = {
                headers : {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const {data} = await axios.put("api/chat/groupremove",{
                chatId: selectedChat._id,
                userId: user1._id
            },config);

            user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false)

        } catch (error) {
            toast({
                title: "Error occured!",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });   
        }
    }
    const handleAddUser = async(user1) =>{
       if(selectedChat.users.find((u)=> u._id === user1._id)){
        toast({
            title: "User Already in group!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          return;
       }

       if(selectedChat.groupAdmin._id !== user._id){
        toast({
            title: "Only admins can add someone!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
          return;
       }

       try {
        setLoading(true);


        const config = {
            headers : {
                Authorization: `Bearer ${user.token}`,
            },
        };


        const {data} = await axios.put("api/chat/groupadd", {
            chatId: selectedChat._id,
            userId: user1._id,
        }, config);

        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        fetchMessages();
        setLoading(false);
       } catch (error) {
        toast({
            title: "Error occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
       }
    }

    const handleRename = async() =>{
       if(!groupChatName) return

       try {
        setRenameloading(true)

        const config = {
            headers : {
                Authorization: `Bearer ${user.token}`,
            },
        };

        const {data} = await axios.put("/api/chat/rename", {
            chatId: selectedChat._id,
            chatName: groupChatName,
        }, config);

        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setRenameloading(false);
       } catch (error) {
        toast({
            title: "Error occured",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom-left",
          });
          setRenameloading(false);
       }
       setGroupChatName("");
    }
    const handleSearch = async (query) =>  {
        if(!query){
         setSearch(query)
           return;
        }

        try {
            setLoading(true)

            const config = {
                headers : {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const {data} = await axios.get(`api/user?search=${search}`, config);
            console.log(data);
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

    return (
        <>
          <IconButton display={{base: "flex"}} icon={<ViewIcon/>} onClick={onOpen} isCentered/>
    
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader
               fontSize="35px"
               fontFamily="Work sans"
               display="flex"
               justifyContent="center"
              >
              {selectedChat.chatName.toUpperCase()}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                    {selectedChat.users.map((user)=>(<UserBadgeItem
                        key={user._id}
                        user={user}
                        handleFunction={()=>handleRemove(user)}
                    />))}
                </Box>
                <FormControl display="flex">
                   <Input
                    placeholder='Chat Name'
                    mb={3}
                    value={groupChatName}
                    onChange={(e) => setGroupChatName(e.target.value)}
                   />
                   <Button
                     variant="solid"
                     colorScheme="teal"
                     ml={1}
                     isLoading={renameloading}
                     onClick={handleRename}
                   >
                    Update
                   </Button>
                </FormControl>
                <FormControl>
                    <Input
                        placeholder='Add User To User'
                        mb={1}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </FormControl>
                {loading ? (
                    <Spinner size="lg"/>
                ) : (
                    searchResult?.slice(0,4).map((user)=>(
                        <UserListItem
                            key={user._id}
                            user={user}
                            handleFunction={() => handleAddUser(user)}
                        />
                    ))
                )}
              </ModalBody>
    
              <ModalFooter>
                <Button colorScheme='red'  onClick={() => handleRemove(user)}>
                  Leave group
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
}

export default UpdateGroupChatModal