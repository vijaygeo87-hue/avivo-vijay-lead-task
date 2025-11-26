
import React from 'react';
import {
    ChakraProvider,
    Box,
    Heading
} from '@chakra-ui/react';
import UsersList from '../components/UsersList';
function App() {
    return (
         <ChakraProvider>
            <Box maxW="960px" mx="auto"
                mt="8" textAlign="center">
                <Heading as="h1"
                    color="green.500" mb="4">
                    User Portal
                </Heading>
                <UsersList />
                </Box>
 
        </ChakraProvider>
    );
}

export default App;
