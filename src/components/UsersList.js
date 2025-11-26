import { React, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {   Box,Table, Thead, Tbody, Tr, Th, Td, TableContainer, 
          IconButton, Button, ButtonGroup,
          Input, InputGroup, InputLeftElement, InputRightElement, 
           Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,ModalBody,ModalCloseButton,
           FormControl,FormLabel,useDisclosure,FormErrorMessage, useToast 
       } from "@chakra-ui/react";
import { DeleteIcon, SearchIcon, CloseIcon } from '@chakra-ui/icons';
import { RiRefreshLine, RiUserAddFill, RiUserSearchFill } from "react-icons/ri";

import { fetchUsers, deleteUser, searchUser, createUser } from '../services/userMethods';

const UsersList = () => {
  const dispatch = useDispatch();
  const { users, status, error } = useSelector((state) => state.users);

 const toast = useToast();

  const showSuccessUserCreation = (title, msg) => {
    toast({
      title: title,
      description: msg,
      status: 'success',
      duration: 5000,
      isClosable: true,
      position: 'top-right',
    });
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
        inputFirstName: '',
        inputLastName: '',
        inputCompanyName: '',
        inputRole: '',
        inputCountry: ''
      });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
  };

      const validateForm = () => {
        let newErrors = {};
        if (!formData.inputFirstName) {
          newErrors.inputFirstName = 'First Name is required.';
        }
         if (!formData.inputLastName) {
          newErrors.inputLastName = 'Last Name is required.';
        }
        if (!formData.inputCompanyName) {
          newErrors.inputCompanyName = 'Company Name is required.';
        }
         if (!formData.inputRole) {
          newErrors.inputRole = 'Role is required.';
        }
         if (!formData.inputCountry) {
          newErrors.inputCountry = 'Country is required.';
        }
       
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };
       const handleSubmit = () => {
        if (validateForm()) {
          console.log('Form data submitted:', formData);
          const newUserArr = {
            "id":Math.floor(Math.random() * 900) + 100, // Random ID for demo purposes
            "firstName": formData.inputFirstName,
            "lastName": formData.inputLastName,
            "address": {"country": formData.inputCountry},
            "company": {
               "name": formData.inputCompanyName,
              "title": formData.inputRole,
            }
          };
          dispatch(createUser(newUserArr));
          showSuccessUserCreation("New User Created", "The user has been created successfully.");
          onClose(); // Close modal on successful submission
        }
      };

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleClearSearch = () => {
    setSearchTerm('');
    refreshUser();
    
  };

   

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers());
    }
  }, [dispatch, status]);

  const handleDelete = (id) => {
    dispatch(deleteUser({users : users, id: id}));
    showSuccessUserCreation("User Deletion", "The user has been deleted successfully.");
          
  };

   const refreshUser = () => {
    dispatch(fetchUsers());
  };

  const handleSearch = () => {
    const searchUserArg = {users : users, searchTerm: searchTerm};
    dispatch(searchUser(searchUserArg));
  };

  let content;

  if (status === 'loading') {
    content = <div>Loading...</div>;
  } else if (status === 'succeeded') {
    content = (
     <TableContainer w="100%" justify="center" mx="auto"  variant="simple">
                <Table >
                  <Tbody>
                    <Tr>
                      <Td>
                        <ButtonGroup spacing={4}>
                          <Button colorScheme='purple' variant="solid" onClick={onOpen}>
                            <RiUserAddFill />  &nbsp; Add User
                          </Button>
                          
                        <Modal isOpen={isOpen} onClose={onClose}>
                          <ModalOverlay />
                          <ModalContent>
                            <ModalHeader>Add New User</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                              <form>
                                <FormControl id="firstName" mb={4} isInvalid={!!errors.inputFirstName}>
                                  <FormLabel>First Name</FormLabel>
                                  <Input name="inputFirstName" type="text" placeholder="Enter First Name" 
                                  value={formData.inputFirstName}  onChange={handleChange} />
                                  <FormErrorMessage>{errors.inputFirstName}</FormErrorMessage>
                                </FormControl>
                                <FormControl id="lastName" mb={4} isInvalid={!!errors.inputLastName}>
                                  <FormLabel>Last Name</FormLabel>
                                  <Input name="inputLastName"  type="text" placeholder="Enter Last Name" 
                                  value={formData.inputLastName}  onChange={handleChange} />
                                  <FormErrorMessage>{errors.inputLastName}</FormErrorMessage>
                                </FormControl>
                               <FormControl id="companyName" mb={4} isInvalid={!!errors.inputCompanyName}>
                                  <FormLabel>Company Name</FormLabel>
                                  <Input name="inputCompanyName"  type="text" placeholder="Enter Company Name" 
                                  value={formData.inputCompanyName}  onChange={handleChange} />
                                  <FormErrorMessage>{errors.inputCompanyName}</FormErrorMessage>
                                </FormControl>
                                <FormControl id="role" mb={4} isInvalid={!!errors.inputRole}>
                                  <FormLabel>Role</FormLabel>
                                  <Input name="inputRole"  type="text" placeholder="Enter Role" 
                                  value={formData.inputRole}  onChange={handleChange} />
                                  <FormErrorMessage>{errors.inputRole}</FormErrorMessage>
                                </FormControl>
                                <FormControl id="country" mb={4} isInvalid={!!errors.inputCountry}>
                                  <FormLabel>Country</FormLabel>
                                  <Input  name="inputCountry"  type="text" placeholder="Enter Country" 
                                  value={formData.inputCountry}  onChange={handleChange} />
                                  <FormErrorMessage>{errors.inputCountry}</FormErrorMessage>
                                </FormControl>
                                {/* Add more form fields as needed */}
                              </form>
                            </ModalBody>

                            <ModalFooter>
                              <Button variant="ghost" onClick={onClose} mr={3}>
                                Cancel
                              </Button>
                              <Button colorScheme="blue" type="submit" form="itemName"  onClick={handleSubmit}>
                                Submit
                              </Button>
                            </ModalFooter>
                          </ModalContent>
                        </Modal>
                          <Button colorScheme="yellow"   onClick={handleClearSearch}>
                            Refresh &nbsp; <RiRefreshLine />
                          </Button>
                         </ButtonGroup>
                      </Td>
                      <Td>
                        <InputGroup maxW="md">
      <InputLeftElement pointerEvents="none">
        <SearchIcon color="gray.300" />
      </InputLeftElement>
      <Input
        placeholder="Enter Keywords..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    {searchTerm && ( 
        <InputRightElement>
          <IconButton
            aria-label="Clear search"
            icon={<CloseIcon />}
            onClick={handleClearSearch}
            variant="ghost"
            size="sm"
          />
        </InputRightElement>
       )} 
    </InputGroup>
    </Td>
    <Td>
           <Button colorScheme="green"   onClick={handleSearch}>
                            Search &nbsp; <RiUserSearchFill />
                          </Button>
                      </Td>
                    </Tr>
                  </Tbody>
                </Table>
                <Table size='sm'>
                    <Thead>
                        <Tr>
                            <Th>Name</Th>
                            <Th>Company</Th>
                            <Th>Role</Th>
                            <Th>Country</Th>
                            <Th>Action</Th>
                        </Tr>
                    </Thead>
      <Tbody>
        {users.map((user) => (

          <Tr key={user.id}>
            <Td>{user.firstName} {user.lastName}</Td>
            <Td>{user.company.name}</Td>
            <Td>{user.company.title}</Td>
            <Td>{user.address.country}</Td>
            <Td><IconButton
      aria-label="Delete item"
      icon={<DeleteIcon />}
      onClick={() => handleDelete(user.id)}
      colorScheme='red'
    /></Td>
          </Tr>

        ))}
      
      </Tbody>
    </Table>
    </TableContainer>
    );
  } else if (status === 'failed') {
    content = <div>{error}</div>;
  }

  return (
    <Box mt="8">
      {content}
    </Box>
  );
};

export default UsersList;