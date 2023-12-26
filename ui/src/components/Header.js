import React from "react";
import { Box, Flex, Heading, Avatar, Text, Button } from "@chakra-ui/react";
import { Link } from 'react-router-dom';
import { ReactComponent as RobotIcon } from './robot-chef.svg';

const Header = ({ user, onLogout }) => {
  return (
    <Flex align="center" justify="space-between" paddingX={6}>
      {/* Logo */}
      <Box height={"80px"}>
        <Link href="/">
            <RobotIcon />
        </Link>
      </Box>
      <Heading as="h2" color="#2D303C" size="xl">
        MealPlan AI
      </Heading>
      {/* <Avatar bg="#2D303C" size="sm" /> */}
      <Flex align="center">
        {user ? (
          <Flex align="center">
            <Box marginRight={4}>
              <Avatar size="sm" name={user.displayName} />
            </Box>
            <Text color="#2D303C" marginRight={4}>{user.displayName}</Text>
            <Button onClick={onLogout} colorScheme="red" size="sm">
              Logout
            </Button>
          </Flex>
        ) : (
          <Link href="/login">
            <Button bg="#2D303C" color="white" _hover={{color: "#38A169"}} size="sm">
              Login
            </Button>
          </Link>
        )}
      </Flex>
    </Flex>
  );
};

export default Header;
