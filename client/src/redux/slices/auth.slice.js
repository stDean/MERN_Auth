import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  isLogged: false,
  isAdmin: false
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    LOGIN: state => {
      state.isLogged = true;
    },
    GET_USER: (state, { payload }) => {
      state.user = payload.user;
      state.isAdmin = payload.isAdmin
    }
  }
});

export const { LOGIN, GET_USER } = authSlice.actions;

export default authSlice.reducer;

