import React, {useState} from 'react';
import {
    Box,
    Button,
    Checkbox,
    Container,
    Divider,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Input,
    Link,
    Stack,
    Text,
  } from '@chakra-ui/react';
import {  signInWithEmailAndPassword   } from 'firebase/auth';
import { auth } from './firebase';
import { NavLink, useNavigate } from 'react-router-dom'
import { ReactComponent as RobotIcon } from './robot-chef.svg';
import { PasswordField } from './PasswordField'

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
       
    const onLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            navigate.push("/home")
            console.log(user);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage)
        });
       
    }
 
    return(
        <Container
            maxW="lg"
            py={{
            base: '12',
            md: '24',
            }}
            px={{
            base: '0',
            sm: '8',
            }}
        >
            <Stack spacing="8">
            <Stack spacing="6">
                <RobotIcon />
                <Stack
                spacing={{
                    base: '2',
                    md: '3',
                }}
                textAlign="center"
                >
                <Heading
                    size={{
                    base: 'xs',
                    md: 'sm',
                    }}
                >
                    Log in to your account
                </Heading>
                <Text color="fg.muted">
                    Don't have an account? <Link href="/signup">Sign up</Link>
                </Text>
                </Stack>
            </Stack>
            <Box
                py={{
                base: '0',
                sm: '8',
                }}
                px={{
                base: '4',
                sm: '10',
                }}
                bg={{
                base: 'transparent',
                sm: 'bg.surface',
                }}
                boxShadow={{
                base: 'none',
                sm: 'md',
                }}
                borderRadius={{
                base: 'none',
                sm: 'xl',
                }}
            >
                <Stack spacing="6">
                <Stack spacing="5">
                    <FormControl>
                    <FormLabel htmlFor="email">Email</FormLabel>
                    <Input id="email" type="email" required placeholder="Email address" onChange={(e)=>setEmail(e.target.value)} />
                    </FormControl>
                    <PasswordField />
                </Stack>
                <HStack justify="space-between">
                    <Checkbox defaultChecked>Remember me</Checkbox>
                    <Button variant="text" size="sm" onClick={onLogin}>
                    Forgot password?
                    </Button>
                </HStack>
                <Stack spacing="6">
                    <Button>Sign in</Button>
                </Stack>
                </Stack>
            </Box>
            </Stack>
        </Container>
)
}

export default Login;