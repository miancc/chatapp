import styled from "styled-components"
import { useState, useEffect , useRef} from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { allUsersRoute, host } from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import { io } from "socket.io-client";
import { AiOutlineLogout } from 'react-icons/ai'
import Logout from '../components/Logout'
import {
  Box,
  Text,
  Grid, 
  Flex,  
  SimpleGrid,
  Avatar
 } from '@chakra-ui/react'


export default function Chats() {
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentUserName, setCurrentUserName] = useState(undefined);
  const [currentUserImage, setCurrentUserImage] = useState(undefined);

  useEffect( ()=>{
    const navigationTo = async () => {
      if (!localStorage.getItem('chat-app-user'))
      {
        navigate("/login");
      }
      else {
        setCurrentUser(await JSON.parse(localStorage.getItem('chat-app-user')));
        setIsLoaded(true);
      }
    }
    navigationTo();
   }, []);

   useEffect(()=>{
    if(currentUser){
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
      
      setCurrentUserImage(currentUser.avatarImage);
      setCurrentUserName(currentUser.username);
    }
   },[currentUser]);

  useEffect( () => {
    const getCurrentUser = async()=>{
      if( currentUser)  {
      if(currentUser.isAvatarImageSet){
        const data = await  axios.get(`${allUsersRoute}/${currentUser._id}`);
        setContacts(data.data);
      } else{
        navigate('/setAvatar');
      }
    }
    }
      getCurrentUser();
  }, [currentUser]);

  const handleChatChange = (chat) =>{
    setCurrentChat(chat);
  }

  return (
    <Grid
      templateColumns={{ base: '5fr', md: `.35fr 1fr` }}
      templateRows={{ base: '4em 1fr', md: '1fr' }}
      h={'100%'}
      w='100%'
      maxH={{ lg: '100vh', base: '100%' }}
      overflow={{ lg: 'hidden', base: 'hidden' }}
      sx={{
        '&::-webkit-scrollbar': {
          width: '3px',
          height: '10px',
          borderRadius: '15px',
          backgroundColor: `rgba(0, 0, 0, 0.05)`
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: `rgba(0, 0, 0, 0.05)`
        }
      }}
      backgroundColor={'#FFFFFF'}
    >
      <Contacts contacts={contacts} currentUser={currentUser}  changeChat={handleChatChange}/>
      <Box
        m={{ base: '2rem' }}
        h={{ lg: '90vh', base: '90%' }}
        gridColumn={{ base: 1, md: 2 }}
        
        // bg={{base:'#F5F8FF', md:'#FFFFF'}}
        borderRadius={'2rem'}
      >
        <Box
          h={{ lg: '10vh', base: '10%' }}
          bg={{base:'gray.100'}}
          borderRadius={'2rem'}
        >
          
            <Flex w={'100%'} flexDir={'column'} alignItems={'center'} justifyContent={'center'}>
            <SimpleGrid columns={[2]} mt={'2rem'} h={'100%'} w={'19.2rem'}>
              <Flex w={'100%'} justifyContent={'space-evenly'}>
                <Text fontSize={'2rem'} fontWeight={'semibold'} lineHeight={'2.1rem'}>
                  <Avatar 
                    src={currentUserImage}
                    alt="avatar"
                    size={{ base: 'sm' }}
                  position={'relative'}
                  zIndex={2}
                  _before={{
                    content: '""',
                    width: 'full',
                    height: 'full',
                    rounded: 'full',
                    transform: 'scale(1.125)',
                    bgGradient: 'linear(to-bl, red.400,pink.400)',
                    position: 'absolute',
                    zIndex: -1,
                    top: 0,
                    left: 0,
                  }}/>
                </Text>
                <Text
                  fontFamily={'Inter'}
                  fontSize={'1rem'}
                  fontWeight={'semibold'}
                  letterSpacing={'0.1rem'}
                  lineHeight={'1rem'}
                  mt={'0.2rem'}
                >
                  {currentUserName}
                </Text>
              </Flex>
              <Flex w={'100%'} justifyContent={'space-evenly'}>
                <Text fontSize={'2rem'} fontWeight={'semibold'} lineHeight={'1.4rem'}>
                <Logout />
                </Text>
                <Text
                  fontFamily={'Inter'}
                  fontSize={'1rem'}
                  fontWeight={'semibold'}
                  letterSpacing={'0.1rem'}
                  lineHeight={'1rem'}
                  mt={'0.2rem'}
                >
                  Logout
                </Text>
              </Flex>
            </SimpleGrid>
          </Flex>
         </Box>
         <Box
            m={{ base: '1rem' }}
            h={{ lg: '90vh', base: '80vh%' }}
            gridColumn={{ base: 1, md: 2 }}
            overflow={{ lg: 'none', md: 'auto', base: 'auto' }}
            bg={{base:'blue.100'}}
            borderRadius={'2rem'}
            p='2rem'
            
          >
            { isLoaded &&
              currentChat === undefined ?
              <Welcome currentUser={currentUser}/> : 
              <ChatContainer currentChat={currentChat} socket={socket} currentUser={currentUser} />
            }
          </Box>
      </Box>
    </Grid>
  )
}
