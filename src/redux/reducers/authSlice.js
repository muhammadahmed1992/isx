import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  user: '',
  isLoggedIn: false,
  ipAddress: null,
  isRegistered: false,
};

export const authSlice = createSlice({
  name: 'Auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload;
    },
    setIpAddress: (state, payload) => {
      state.ipAddress = payload.payload;
    },
    setIsRegistered: (state, payload) => {
      state.isRegistered = payload.payload;
    },
    logout: state => {
      state.isLoggedIn = false;
      state.user = '';
    },
  },
});
export const {login, logout, setIpAddress, setIsRegistered} = authSlice.actions;
export default authSlice.reducer;
