import React, { useState, useEffect } from "react";
import { Box, Flex, Heading, Avatar, Button, HStack } from "@chakra-ui/react";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ReactComponent as RobotIcon } from './robot-chef.svg';
import { auth } from './firebase'; 

// Utility function to find the first non-null value
// const findFirstNonNull = (...values) => values.find(value => value !== null && value !== undefined);

/**
 * Header component displays the application's header, including the logo, title, and user information.
 *
 * @param {Object} props - React component props.
 * @returns {React.ReactNode} The Header component.
 */
const Header = ({ userIdProfile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Use userIdProfile directly and set it as the initial state
  const [userId, setUserId] = useState('');

  useEffect(() => {
    // Update userId state when userIdProfile prop changes
    const newUser = location.state && location.state.user ? location.state.user : location.pathname.split("/")[2] || '';
    setUserId(newUser);
  }, [location.state || userIdProfile]);

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
        <Link href="/" to="/">
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
            <HStack marginRight={4}>
              <Link to={`/users/${userId}/profile`}>
                <Avatar size="sm" />
              </Link>
              <Button onClick={onLogout} colorScheme="red" size="sm">
                Logout
              </Button>
            </HStack>
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
