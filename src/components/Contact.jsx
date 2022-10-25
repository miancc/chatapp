import { Box, Flex, Text,  Avatar } from '@chakra-ui/react'
import * as React from 'react'

export const Contact = ({ active, avatarImage, children, onClick }) => {
  return (
      <Flex
        w="full"
        px="2rem"
        flexDir={'row'}
        alignItems={'center'}
        justifyContent={'center'}
        h="5erm"
        cursor="pointer"
        userSelect="none"
        rounded="md"
        transition="all 0.2s"
        bg={active ? '#455690' : undefined}
        borderRadius={'1rem'}
        _hover={{ bg: '#B9C4F2' }}
        _active={{ bg: '#455690' }}
        onClick={onClick} 
      >
        <Flex
          alignItems={'center'}
          marginTop={'1.2rem'}
          marginRight={'1.1rem'}
          marginBottom={'1.6rem'}
          height={'100%'}
          width={'2.8rem'}
          fontSize="lg"
          color={active ? '#FFFFFF' : '#989EAD'}
        >
            <Avatar
                src={avatarImage}
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
                }}
            />
        </Flex>
        <Box flex="1" marginLeft={'.4rem'} fontWeight="bold" color={active ? '#FFFFFF' : '#989EAD'}>
          <Text fontSize={'1rem'} letterSpacing={'0.028rem'} lineHeight={'1rem'} fontFamily={'Poppins'}>
            {children}
          </Text>
        </Box>
      </Flex>
  )
}
