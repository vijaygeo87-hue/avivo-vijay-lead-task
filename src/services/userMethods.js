import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch users from the API
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await axios.get('https://dummyjson.com/users');
  return response.data;
});

// Create a new user
export const createUser = createAsyncThunk('users/createUser', async (newUser) => {
 return newUser;
});

// Update a user
export const updateUser = createAsyncThunk('users/updateUser', async (updatedUser) => {
  const response = await axios.put(`https://jsonplaceholder.typicode.com/users/${updatedUser.id}`, updatedUser);
  return response.data;
});

// Delete a user
export const deleteUser = createAsyncThunk('users/deleteUser', async (userArg) => {
    const userList = userArg.users;
    const idVal = userArg.id;
    const deletedList = userList.filter(item => 
     item.id !== idVal
    );
  return deletedList;
});

// Delete a user
export const searchUser = createAsyncThunk('users/searchUser', async (userArg) => {
    const userList = userArg.users;
    const searchVal = userArg.searchTerm;
    const filteredList = userList.filter(item => 
      (item.firstName.includes(searchVal) || item.lastName.includes(searchVal)|| item.address.country.includes(searchVal)|| item.company.title.includes(searchVal)) 
    );
    return filteredList;
});

const userMethods = createSlice({
  name: 'users',
  initialState: {
    users: [],
    status: 'idle',  // idle, loading, succeeded, failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload.users;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.users.unshift(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((user) => user.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
      //  state.users = state.users.filter((user) => user.id !== action.payload);
      state.users = action.payload;
      })
      .addCase(searchUser.fulfilled, (state, action) => {
        state.users = action.payload;
      });
  },
});

export const usersReducer = userMethods.reducer;