import React from "react";
import { Box, Flex, Heading, Avatar, Button } from "@chakra-ui/react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as RobotIcon } from './robot-chef.svg';
import { auth } from './firebase'; 

/**
 * Header component displays the application's header, including the logo, title, and user information.
 *
 * @param {Object} props - React component props.
 * @returns {React.ReactNode} The Header component.
 */
const Header = ({ setUserId }) => {
  const location = useLocation();
  const userId  = location.state || '';
  const navigate = useNavigate();

  setUserId(userId);

  const onLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
      setUserId('');
    } catch (error) {
      console.error('Error logging out:', error.message);
    }
  };

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
      <Flex align="center">
        {userId ? (
          // Display user information and logout button if the user is logged in
          <Flex align="center">
            <Box marginRight={4}>
              <Avatar size="sm" />
            </Box>
            <Button onClick={onLogout} colorScheme="red" size="sm">
              Logout
            </Button>
          </Flex>
        ) : (
          // Display login button if the user is not logged in
          <Link to="/login">
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
