import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  token: ''
};

export const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    GET_TOKEN: (state, { payload }) => {
      state.token = payload
    }
  }
});

export const { GET_TOKEN } = tokenSlice.actions;

export default tokenSlice.reducer;

