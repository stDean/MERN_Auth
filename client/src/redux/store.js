import { configureStore } from '@reduxjs/toolkit';

import authReducer from "./slices/auth.slice";
import tokenReducer from "./slices/token.slice";

export default configureStore({
  reducer: {
    auth: authReducer,
    token: tokenReducer
  }
})