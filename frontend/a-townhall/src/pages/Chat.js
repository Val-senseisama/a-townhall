import React, { useState } from "react";
import { ChatState } from "../context/chatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/miscellanos/SiderDrawer";
import MyChats from "../components/miscellanos/MyChats";
import ChatBox from "../components/miscellanos/ChatBox";


const Chatpage = () => {
   const [fetchAgain, setFetchAgain] = useState(false);
   const { user } = ChatState();
 
   return (
     <div style={{ width: "100%" }}>
       {user && <SideDrawer />}
       <Box display="flex" justifyContent="space-between" width="100%" h="91.5vh" p="10px">
         {user && <MyChats fetchAgain={fetchAgain} />}
         {user && (
           <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
         )}
       </Box>
     </div>
   );
 };
 
export default Chatpage;