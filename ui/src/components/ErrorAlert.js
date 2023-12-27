import React from 'react';
import { Box, Text, CloseButton, Alert, AlertIcon } from '@chakra-ui/react';

/**
 * ErrorAlert component displays an error alert with a close button.
 *
 * @param {Object} props - React component props.
 * @param {string} props.message - The error message to be displayed.
 * @param {Function} props.onClose - The function to be called when the close button is clicked.
 * @returns {React.ReactNode} The ErrorAlert component.
 */
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
