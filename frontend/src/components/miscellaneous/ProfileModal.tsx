import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React, { Children } from 'react'
import { User } from '../../types/UserType'
import { FaRegEye } from "react-icons/fa";

type ProfileModalProps = {
    user: User | null;
    children?: React.ReactNode 
}

const ProfileModal:React.FC<ProfileModalProps> = ({user, children}) => {
    const { isOpen, onOpen, onClose} = useDisclosure()
  return (
    <>{children ? <span onClick={onOpen}>{children}</span> : (
        <IconButton 
            aria-label='eye-btn'
            display={{base: 'flex'}}
            icon={<FaRegEye />}
            onClick={onOpen}
        />
    )}
      <Modal size={'lg'} isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent h={'410px'}>
          <ModalHeader
          fontSize={'40px'}
          fontFamily={'Work sans'}
          display={'flex'}
          justifyContent={'center'}
          style={{textTransform: 'capitalize'}}
          >{user?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={'flex'}
            flexDir={'column'}
            alignItems={'center'}
            justifyContent={'space-between'}
          >
            <Image
              borderRadius={'full'}
              boxSize={'150px'}
              src={user?.pic}
              alt={user?.name}
            />
            <Text
            fontSize={{base: '28px', md: '30px'}}
            fontFamily={'Work sans'}
            >Email: {user?.email}</Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileModal