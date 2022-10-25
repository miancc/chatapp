import React, { useState, useEffect , useRef} from 'react'
import styled from "styled-components"
import ChatInput from './ChatInput';
import {
  Heading,
  Avatar,
  Box,
  List,
  ListItem,
  ListIcon,
  Stack,
  Flex,
} from '@chakra-ui/react';
import axios from "axios";
import { getAllMessagesRoute, sendMessageRoute } from '../utils/APIRoutes'
import { v4 as uuidv4} from "uuid";
import { AiFillMessage } from 'react-icons/ai'

export default function ChatContainer({ currentChat, currentUser, socket }) {
  const [messages, setMessages] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const scrollRef = useRef();

  useEffect(() => {

    const fetchData = async () => {
      if(currentChat){
        const response = await axios.post(getAllMessagesRoute, {
          from: currentUser._id,
          to: currentChat._id,
        });
        setMessages(response.data);
      }
    }
    fetchData();
  }, [currentChat]);

  const handleSendMsg = async (msg) => {
    await axios.post(sendMessageRoute, {
      from: currentUser._id,
      to: currentChat._id,
      message: msg,
    });
    socket.current.emit("send-msg", {
      to: currentChat._id,
      from: currentUser._id,
      message: msg,
    });

    const msgs = [...messages];
    msgs.push({
      fromSelf: true,
      message: msg,
    });
    setMessages(msgs);
  };

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieved", (msg) => {
        setArrivalMessage({
          fromSelf: false,
          message: msg,
        });
      })
    }
  }, []);

  useEffect(()=>{
    arrivalMessage && setMessages((prev)=>[...prev,arrivalMessage]);
  },[arrivalMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {
        currentChat && (
          <Box
            w={'full'}
            boxShadow={'2xl'}
            rounded={'lg'}
            p={6}
            textAlign={'center'}>
              <Flex 
                ajustifyContent="center"
                alignItems="center"
                height="100%"
                direction="column"
              >
                <Avatar
                  size={'sm'}
                  src={currentChat.avatarImage}
                  alt={'Avatar Alt'}
                  mb={4}
                  pos={'relative'}
                  _after={{
                    content: '""',
                    w: 4,
                    h: 4,
                    bg: 'green.300',
                    border: '2px solid white',
                    rounded: 'full',
                    pos: 'absolute',
                    bottom: 0,
                    right: 3,
                  }}
                />
                <Heading fontSize={'2xl'} fontFamily={'body'}>
                  {currentChat.username}
                </Heading>
              </Flex>

              <Stack
                p={3}
                py={3}
                justifyContent={{
                  base: 'flex-start',
                  md: 'space-around',
                }}
                direction={{
                  base: 'column',
                  md: 'row',
                }}
                alignItems={{ md: 'center' }}>
                  <List w={'full'} spacing={3}>
                    {messages.map((message) => {
                      return (     
                          <ListItem w={'full'} ref={scrollRef} key={uuidv4()} textAlign={message.fromSelf ? 'right' : 'left'}  >
                            <ListIcon as={AiFillMessage} color='green.500' />
                            {message.message}
                          </ListItem>
                      );
                    })}
                  </List>
              </Stack>

              <Flex 
                ajustifyContent="center"
                alignItems="center"
                w="100%"
                direction="column">
                <ChatInput handleSendMsg={handleSendMsg} />
              </Flex>
          </Box>
        )
      }
    </>
  );
}

const Container = styled.div`
  display: grid;
  height: '100%';
  grid-template-rows: 10% 80% 10%;
  gap: 0.1rem;
  overflow: hidden;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    grid-template-rows: 15% 70% 15%;
  }
  .chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    .user-details {
      display: flex;
      align-items: center;
      gap: 1rem;
      .avatar {
        img {
          height: 3rem;
        }
      }
      .username {
        h3 {
          color: white;
          text-transform: capitalize;
        }
      }
    }
  }
  .chat-messages {
    padding: 1rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.2rem;
      &-thumb {
        background-color: #ffffff39;
        width: 0.1rem;
        border-radius: 1rem;
      }
    }
    .message {
      display: flex;
      align-items: center;
      .content {
        max-width: 40%;
        overflow-wrap: break-word;
        padding: 1rem;
        font-size: 1.1rem;
        border-radius: 1rem;
        color: #d1d1d1;
        @media screen and (min-width: 720px) and (max-width: 1080px) {
          max-width: 70%;
        }
      }
    }
    .sended {
      justify-content: flex-end;
      .content {
        background-color: #4f04ff21;
      }
    }
    .recieved {
      justify-content: flex-start;
      .content {
        background-color: #9900ff20;
      }
    }
  }
`;