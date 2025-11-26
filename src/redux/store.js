import { configureStore } from '@reduxjs/toolkit';
import { usersReducer } from '../services/userMethods';

const store = configureStore({
  reducer: {
    users: usersReducer,
  },
});

export default store;