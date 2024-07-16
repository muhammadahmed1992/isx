import {createSlice} from '@reduxjs/toolkit';

let initialState = {
  isLoggedIn: false,
  user: null,
  token: null,
  ipAddress: null,
};

export const authSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    register: (state, payload) => {
      state.isLoggedIn = true;
      state.user = payload.payload;
    },
    login: (state, payload) => {
      state.isLoggedIn = true;
      state.user = payload.payload.user;
    },
    token: (state, payload) => {
      state.token = payload.payload;
    },
    setIpAddress: (state, payload) => {
      state.ipAddress = payload.payload;
    },
    logout: state => {
      state.isLoggedIn = false;
      state.user = null;
      state.token = null;
      state.ipAddress = null;
    },
    setUserData: (state, payload) => {
      state.user = payload.payload;
    },
  },
});
export const {register, login, logout, token, setIpAddress, setUserData} =
  authSlice.actions;
export default authSlice.reducer;
