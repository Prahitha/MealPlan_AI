import React from "react";
import { Box, Flex, Heading, Avatar } from "@chakra-ui/react";
import RobotChef from './robot-chef.webp'

const Header = () => {
  return (
    <Flex justify="space-between" align="center" p={4}>
      {/* Logo */}
        <Box height={"80px"}>
        <img height={'80px'} src={RobotChef} alt="RoboChef Logo" />
        </Box>
      <Heading as="h2" color='#2D303C' size="xl">
        MealPlan AI
      </Heading>
        <Avatar bg="#2D303C" size="sm" />
    </Flex>
  );
};

export default Header;
