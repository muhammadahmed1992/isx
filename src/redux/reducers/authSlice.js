import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  user: '',
  isLoggedIn: false,
  ipAddress: null,
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
    logout: state => {
      state.isLoggedIn = false;
    },
  },
});
export const {login, logout, setIpAddress} = authSlice.actions;
export default authSlice.reducer;
