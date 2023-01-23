import { Button} from "@chakra-ui/button";
import { Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, MenuDivider, MenuItem, Spinner, Tooltip, useToast } from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import React, { useState } from "react";
import { Box, Text } from "@chakra-ui/react";
import {  Menu, MenuButton, MenuList } from "@chakra-ui/react";
import { ChatState } from "../../context/chatProvider";
import ProfileModal from "./profileModal";
import { useDisclosure } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";
import { Effect } from "react-notification-badge"
import NotificationBadge from "react-notification-badge/lib/components/NotificationBadge";


const SideDrawer = ()=> {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState();

    const toast = useToast();
    const {user, setSelectedChat, chats, setChats, notification, setNotification} = ChatState();
    const navigate = useNavigate();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const handleSearch = async () => {
        if(!search){
            toast({
                title: "Please enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left"
            });
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers:{
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.get(`/api/user?search=${search}`, config);
          
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error occured",
                description:"Failed to load search results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            });
            return;
        }
    }


    const logOutHandler = () => {
        localStorage.removeItem("userInfo");
         navigate("/");
    }
    
    const accessChat = async(userId) => {
        console.log(userId);
        try { setLoadingChat(true);
            const config = {
              headers: {
                "Content-type": "application/json",
                Authorization: `Bearer ${user.token}`,
              },
            };
            const { data } = await axios.post(`/api/chat`, { userId }, config);
      
            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
            setLoadingChat(false);
            onClose();
        } catch (error) {
            toast({
                title: "Error fetching the chat",
                description:error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left"
            });
        }
    }
 return(
    <>
    <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        width="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={{ base: "md", md: "xl", lg: "2xl"}} fontFamily="Helvetica" textAlign="center">
          A Townhall ...
        </Text>

        <div>
        <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>{" "}
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logOutHandler} >Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer
      placement="left"
      onClose={onClose}
      isOpen={isOpen}>
        <DrawerOverlay />
            <DrawerContent>
                <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>

                <DrawerBody>
                <Box display="flex" pb={2}>
                <Input 
                    placeholder="Search by name or email"
                    mr={2}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                    <Button 
                    onClick={handleSearch}
                    >Go</Button>
                </Box>
                {loading ? (
                    <ChatLoading />
                ): (
                    searchResult?.map((user) => (
                        <UserListItem 
                            key={user._id}
                            user={user}
                            handleFunction={()=> accessChat(user._id)}
                        />
                    ))
                )}
                {loadingChat && <Spinner ml="auto" display="flex" />}
            </DrawerBody>

            </DrawerContent>
      
      </Drawer>
    </>
 )
}

export default SideDrawer;