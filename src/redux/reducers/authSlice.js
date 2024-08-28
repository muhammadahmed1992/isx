import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  ipAddress: null,
};

export const authSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    login: state => {
      state.isLoggedIn = true;
    },
    setIpAddress: (state, payload) => {
      state.ipAddress = payload.payload;
    },
    logout: state => {
      state.isLoggedIn = false;
    },
  },
});
export const {login, logout, setIpAddress} = authSlice.actions;
export default authSlice.reducer;
