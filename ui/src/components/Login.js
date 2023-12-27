import React, { useState } from 'react';
import {
    Box,
    Button,
    Flex,
    FormControl,
    Heading,
    Input,
    InputGroup,
    InputLeftElement,
    InputRightElement,
    Link,
    Stack,
    chakra,
} from '@chakra-ui/react';
import { FaUserAlt, FaLock } from "react-icons/fa";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { NavLink, useNavigate } from 'react-router-dom';
import { ReactComponent as RobotIcon } from './robot-chef.svg';
// import { PasswordField } from './PasswordField';

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

/**
 * Login component is responsible for rendering the login form and handling user authentication.
 *
 * @returns {React.ReactNode} The Login component.
 */
const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [user, setUser] = useState();

    const handleShowClick = () => setShowPassword(!showPassword);

    /**
     * Handles the login form submission and performs user authentication.
     *
     * @param {Event} e - The form submission event.
     */
    const onLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log(user);
                setUser(user);
                navigate('/', { state: { user: user.uid } });
                // <Route exact path="/" element={<Home user={user} onLogout={handleLogout} />} />
            })
            .catch((e) => {
                const errorCode = e.code;
                const errorMessage = e.message;
                console.log(errorCode, errorMessage);
            });
    };

    return (
        <Flex
        flexDirection="column"
        width="100wh"
        height="100vh"
        justifyContent="center"
        alignItems="center"
        >
        <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
        >
        <Link href="/">
          <RobotIcon />
        </Link>
        <Heading color="teal.400">Welcome</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
            <form>
            <Stack
                spacing={4}
                p="1rem"
                backgroundColor="whiteAlpha.900"
                boxShadow="md"
            >
                <FormControl>
                <InputGroup>
                    <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                    />
                    <Input id="email" type="email" required placeholder="Email address" onChange={(e) => setEmail(e.target.value)} />
                </InputGroup>
                </FormControl>
                <FormControl>
                <InputGroup>
                    <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    children={<CFaLock color="gray.300" />}
                    />
                    <Input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                        {showPassword ? "Hide" : "Show"}
                    </Button>
                    </InputRightElement>
                </InputGroup>
                </FormControl>
                <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
                onClick={onLogin}
                >
                Login
                </Button>
            </Stack>
            </form>
        </Box>
        </Stack>
        <Box>
        New to us?{" "}
        <Link color="teal.500" href="/signup">
            Sign Up
        </Link>
        </Box>
        </Flex>
    );
};

export default Login;
