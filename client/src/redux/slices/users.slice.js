import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  users: [],
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    GET_USERS: (state, { payload }) => {
      state.users = payload;
    }
  }
});

export const { GET_USERS } = usersSlice.actions;

export default usersSlice.reducer;

