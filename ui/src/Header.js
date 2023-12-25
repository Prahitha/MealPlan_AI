import React from "react";
import { Box, Flex, Heading, Avatar } from "@chakra-ui/react";
import { ReactComponent as RobotIcon } from './robo-icon.svg';

const Header = () => {
  return (
    <Flex justify="space-between" align="center" p={4}>
      {/* Logo */}
      <Box height={"80px"}>
        <RobotIcon />
      </Box>
      <Heading as="h2" color="#2D303C" size="xl">
        MealPlan AI
      </Heading>
      <Avatar bg="#2D303C" size="sm" />
    </Flex>
  );
};

export default Header;
