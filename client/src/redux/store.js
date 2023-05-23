import { configureStore } from '@reduxjs/toolkit';

import authReducer from "./slices/auth.slice";

export default configureStore({
  reducer: {
    auth: authReducer
  }
})