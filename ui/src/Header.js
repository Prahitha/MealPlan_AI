import React from 'react';
import {
    Box,
    Flex,
    Heading,
    Avatar,
  } from '@chakra-ui/react';

const Header =  () => {
    return (
        <Box>
        <Flex justify="space-between" align="center" p={4}>
          {/* Logo */}
          <Box flex="1/6">Your Logo</Box>
          <Heading as='h2' size='xl'>MealPlan AI</Heading>
          <Box flex="1/6" textAlign="right">
            <Avatar bg='green' size='2xs' />
          </Box>
        </Flex>
        </Box>
      )
  };
  
export default Header;
