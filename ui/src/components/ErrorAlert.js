import React from 'react';
import { Box, Text, CloseButton, Alert, AlertIcon } from '@chakra-ui/react';

const ErrorAlert = ({ message, onClose }) => {
  return (
    <Alert status="error" borderRadius="md">
      <AlertIcon />
      <Box flex="1">
        <Text fontSize="sm" color="black">
          {message}
        </Text>
      </Box>
      <CloseButton size="sm" onClick={onClose} />
    </Alert>
  );
};

export default ErrorAlert;
