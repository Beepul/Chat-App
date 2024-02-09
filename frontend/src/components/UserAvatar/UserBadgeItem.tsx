import React from 'react'
import { User } from '../../types/UserType'
import { Box } from '@chakra-ui/react';
import { RxCross2 } from "react-icons/rx";

type UserBadgeItemProps = {
  user: User | null;
  handleFunction: () => void
}

const UserBadgeItem: React.FC<UserBadgeItemProps> = ({user,handleFunction}) => {
  return (
    <Box
    px={2}
    py={1}
    borderRadius={'lg'}
    m={1}
    mb={2}
    fontSize={12}
    cursor={'pointer'}
    onClick={handleFunction}
    bg={'purple'}
    color={'white'}
    display={'flex'}
    alignItems={'center'}
    gap={1}
    >
      {user?.name}
      <RxCross2 />
    </Box>
  )
}

export default UserBadgeItem