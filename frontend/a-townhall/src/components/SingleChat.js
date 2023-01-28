import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, FormControl, IconButton, Input, InputRightElement, Spinner, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { ChatState } from "../context/chatProvider";
import ProfileModal from "./miscellanos/profileModal";
import UpdateGroupChatModal from "./miscellanos/UpdateGroupChatModal";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import animationData from "../Animations/typing.json";
import Lottie from "lottie-react";

const ENDPOINT = "https://a-townhall.herokuapp.com/";

var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const [background, setBackground] = useState("https://i.pinimg.com/736x/8c/98/99/8c98994518b575bfd8c949e91d20548b.jpg");
    const toast = useToast();
  
    const defaultOptions = {
      loop: true,
      autoplay: true,
      animationData: animationData,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
      },
    };
    const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();
  
    const fetchMessages = async () => {
      if (!selectedChat) return;
  
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
  
        setLoading(true);
  
        const { data } = await axios.get(
          `/api/message/${selectedChat._id}`,
          config
        );
        setMessages(data);
        setLoading(false);
  
        socket.emit("join chat", selectedChat._id);
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to Load the Messages",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    };
  
    const sendMessage = async (event) => {
      if (event.key === "Enter" && newMessage) {
        socket.emit("stop typing", selectedChat._id);
        try {
          const config = {
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${user.token}`,
            },
          };
          setNewMessage("");
          const { data } = await axios.post(
            "/api/message",
            {
              content: newMessage,
              chatId: selectedChat,
            },
            config
          );
          socket.emit("new message", data);
          setMessages([...messages, data]);
        } catch (error) {
          toast({
            title: "Error Occured!",
            description: "Failed to send the Message",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        }
      }
    };
  
    useEffect(() => {
      socket = io(ENDPOINT);
      socket.emit("setup", user);
      socket.on("connected", () => setSocketConnected(true));
      socket.on("typing", () => setIsTyping(true));
      socket.on("stop typing", () => setIsTyping(false));
      // eslint-disable-next-line
    }, []);
  
    useEffect(() => {
      fetchMessages();
  
      selectedChatCompare = selectedChat;
      // eslint-disable-next-line
    }, [selectedChat]);
  
    useEffect(() => {
      socket.on("message recieved", (newMessageRecieved) => {
        if (
          !selectedChatCompare || // if chat is not selected or doesn't match current chat
          selectedChatCompare._id !== newMessageRecieved.chat._id
        ) {
          if (!notification.includes(newMessageRecieved)) {
            setNotification([newMessageRecieved, ...notification]);
            setFetchAgain(!fetchAgain);
          }
        } else {
          setMessages([...messages, newMessageRecieved]);
        }
      });
    });
  
    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        if(!socketConnected) return;

        if(!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;

            if(timeDiff >= timerLength && typing){
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };
  
    return (
      <>
        {selectedChat ? (
          <>
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              pb={3}
              px={2}
              width="100%"
              fontFamily="Work sans"
              display="flex"
              justifyContent={{ base: "space-between" }}
              alignItems="center"
            >
              <IconButton
                display={{ base: "flex", md: "none" }}
                icon={<ArrowBackIcon />}
                onClick={() => setSelectedChat("")}
              />
              {messages &&
                (!selectedChat.isGroupChat ? (
                  <> 
                    {getSender(user, selectedChat.users)}
                    <ProfileModal
                      user={getSenderFull(user, selectedChat.users)}
                    />
                  </>
                ) : (
                  <>
                    {selectedChat.chatName.toUpperCase()}
                    <UpdateGroupChatModal
                      fetchMessages={fetchMessages}
                      fetchAgain={fetchAgain}
                      setFetchAgain={setFetchAgain}
                    />
                  </>
                ))}
            </Text>
            <Box
              display="flex"
              flexDir="column"
              justifyContent="flex-end"
              p={3}
              bg={`url(${background})`}
              bgPosition="center"
              bgRepeat="no-repeat"
              bgSize="cover"
              width="100%"
              h="100%"
              borderRadius="lg"
              overflowY="hidden"
            >
            

              {loading ? (
                <Spinner
                  size="xl"
                  width={20}
                  h={20}
                  alignSelf="center"
                  margin="auto"
                />
              ) : (
                <div className="messages">
                  <ScrollableChat messages={messages} />
                </div>
              )}
  
              <FormControl
                onKeyDown={sendMessage}
                id="first-name"
                isRequired
                mt={3}
              >
                {istyping ? (
                  <div>
                    <Lottie
                      options={defaultOptions}
                      height={50}
                      width={70}
                      style={{ marginBottom: 15, marginLeft: 0 }}
                    />
                  </div>
                ) : (
                  <></>
                )}
                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Enter a message.."
                  value={newMessage}
                onChange={typingHandler}
                />
                <InputRightElement 
                  pointerEvents="all"
                  children={<IconButton 
                    colorScheme="blue.800"
                    aria-label='Call Segun'
                    size='lg'
                    icon={<i class="fa-regular fa-paper-plane-top"></i>}
                  />}
                />
              </FormControl>
            </Box>
          </>
        ) : (
          // to get socket.io on same page
          <Box display="flex" alignItems="center" justifyContent="center" h="100%">
            <Text fontSize="3xl" pb={3} fontFamily="Work sans">
              Click on a user to start chatting
            </Text>
          </Box>
        )}
      </>
    );
  };
  
  export default SingleChat;