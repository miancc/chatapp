import React, { useState, useEffect, useRef } from 'react'
import { useAnimation } from 'framer-motion'
import { AiOutlineMenu } from 'react-icons/ai'
import { Contact } from './Contact'
import {
  Flex,
  Text,
  Button,
  useBreakpointValue,
  useOutsideClick,
} from '@chakra-ui/react'


export default function Contacts({ contacts, currentUser, changeChat }) {
   
    const [currentSelected, setCurrentSelected] = useState(undefined);
    const [open, setOpen] = useState(false)
    const controls = useAnimation()
    const isMobile = useBreakpointValue({ base: true, md: false })
    const navbarRef = useRef(null)
    

    const handleOpen = () => {
      setOpen(true)
      // controls.start(variants.visible)
    }
    const handleClose = () => {
      if (!isMobile) return
      setOpen(false)
      // controls.start(variants.hidden)
    }
    const click = () => {
      if (open) {
        return handleClose()
      }
      handleOpen()
    }

    //Put the navbar on close when page changed to a `md` size
  useEffect(() => {
    if (isMobile) {
      handleClose()
    } else {
      handleOpen()
    }
  }, [isMobile])

    const changeCurrentChat = (index, contact) => { 
        setCurrentSelected(index);
        changeChat(contact);
    };
    return (
      <>
      <Flex
        
        display={{ base: 'flex', md: 'none' }}
        justifyContent={'space-evenly'}
        alignItems={'center'}
        h={'100%'}
        mt={'0.1%'}
      >

        <Button marginRight={'3rem'} variant={'ghost'} colorScheme={'#9BA7C0'} onClick={click}>
          <AiOutlineMenu fontSize={'1.5rem'} />
        </Button>
      </Flex>
      <Flex
        boxShadow={{ base: '5px 0px 20px rgba(0,0,0,.2)', md: 'none' }}
        ref={navbarRef}
        initial={open ? 'visible' : 'hidden'}
        animate={controls}
        transition={{ type: 'tween' }}
        pt={{ lg: '3%', base: '10%' }}
        overflow={'hidden auto'}
        flexDir={'column'}
        alignItems={'center'}
        justifyContent={'center'}
        color={'#9BA7C0'}
        position={{ base: 'fixed', md: 'relative' }}
        zIndex={'overlay'}
        h="100%"
        maxH={'100vh'}
        sx={{
          '&::-webkit-scrollbar-thumb': {
            bgColor: 'rgba(255,255,255,.2)'
          }
        }}
        
      >
        
        <Flex
          width={'90%'}
          h="99%"
          flexDir={'column'}
          justifyContent={'space-between'}
          alignItems={'center'}
        >
          <Flex
            flexDir={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            width={'100%'}
            position="fixed"
          >
            
            <Text
              mt={'2%'}
              fontFamily={'Poppins'}
              fontWeight={'bold'}
              fontSize={'1.1rem'}
              lineHeight={'1.7rem'}
              textAlign={'center'}
              letterSpacing={'0.08rem'}
              textTransform={'uppercase'}
            >
              Chat with FullStack Developers
            </Text>
          </Flex>

          <Flex
            flexDir={'column'}
            width="100%"
            gap={1}
            mt={20}
          >
            {
                contacts.map((contact, index) => {
                    return (
                      <Contact key={contact._id}
                      onClick={()=>changeCurrentChat(index,contact)} 
                      active={index === currentSelected}
                       avatarImage={`data:image/svg+xml;base64,${contact.avatarImage}`}>
                        {contact.username}
                      </Contact>
                    )
                })
            }
          </Flex>
        </Flex>
      </Flex>
    </>
    )
}


