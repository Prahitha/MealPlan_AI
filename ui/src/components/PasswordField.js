import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure,
  useMergeRefs,
} from '@chakra-ui/react';
import { forwardRef, useRef } from 'react';
import { HiEye, HiEyeOff } from 'react-icons/hi';

/**
 * PasswordField is a custom Chakra UI component for rendering a password input field
 * with an option to toggle visibility.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.setPassword - Callback function to update the password state
 * @param {React.Ref} ref - Forwarded ref from parent component
 * @returns {JSX.Element} - Rendered PasswordField component
 */
export const PasswordField = forwardRef(({ setPassword, ...props }, ref) => {
  // State to manage the visibility of the password
  const { isOpen, onToggle } = useDisclosure();
  // Ref to access the input field
  const inputRef = useRef(null);
  // Merging forwarded ref with the internal ref
  const mergeRef = useMergeRefs(inputRef, ref);

  // Function to handle the password visibility toggle
  const onClickReveal = () => {
    onToggle();
    if (inputRef.current) {
      inputRef.current.focus({
        preventScroll: true,
      });
    }
  };

  return (
    <FormControl>
      <FormLabel htmlFor="password">Password</FormLabel>
      {/* InputGroup to organize the password input and visibility toggle button */}
      <InputGroup>
        {/* InputRightElement containing the visibility toggle button */}
        <InputRightElement>
          <IconButton
            variant="text"
            aria-label={isOpen ? 'Mask password' : 'Reveal password'}
            icon={isOpen ? <HiEyeOff /> : <HiEye />}
            onClick={onClickReveal}
          />
        </InputRightElement>
        {/* Actual password input field */}
        <Input
          id="password"
          ref={mergeRef}
          name="password"
          // Ternary operator to set the input type based on visibility state
          type={isOpen ? 'text' : 'password'}
          autoComplete="current-password"
          required
          // Callback to update the password state
          onChange={(e) => setPassword(e.target.value)}
          {...props}
        />
      </InputGroup>
    </FormControl>
  );
});

// Display name for the component (used in dev tools)
PasswordField.displayName = 'PasswordField';
