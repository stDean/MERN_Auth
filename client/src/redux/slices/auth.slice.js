import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: [],
  isLogged: false,
  isAdmin: false
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: state => {
      state.isLogged = true;
    },
    getUser: (state, { payload }) => {
      state.user.push(payload.user);
      state.isAdmin = payload.isAdmin
    }
  }
});

export const { login, getUser } = authSlice.actions;

export default authSlice.reducer;

