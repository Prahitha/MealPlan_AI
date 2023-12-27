import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

// Create a context to manage user authentication state
const AuthContext = createContext();

/**
 * AuthProvider component manages the user authentication state.
 * It uses the Firebase authentication service to detect changes in the user's authentication status.
 *
 * @param {Object} props - React component props.
 * @param {React.ReactNode} props.children - The child components that should have access to the authentication context.
 * @returns {React.ReactNode} The AuthProvider component.
 */
export const AuthProvider = ({ children }) => {
  // State to store the current user
  const [user, setUser] = useState(null);

  // Effect hook to subscribe to changes in the user's authentication status
  useEffect(() => {
    // Function to handle changes in authentication status
    const handleAuthStateChange = (user) => {
      setUser(user);
    };

    // Subscribe to changes in authentication status
    const unsubscribe = onAuthStateChanged(auth, handleAuthStateChange);

    // Cleanup function to unsubscribe when the component is unmounted
    return () => unsubscribe();
  }, []);

  // Provide the authentication context to child components
  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access the authentication context.
 * Throws an error if used outside of an AuthProvider.
 *
 * @returns {Object} An object containing the current user's authentication information.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);

  // Throw an error if used outside of an AuthProvider
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
