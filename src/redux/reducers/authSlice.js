import {createSlice} from '@reduxjs/toolkit';

let initialState = {
  isLoggedIn: false,
  ipAddress: null,
  isSwitchDataBaseAccessible: false,
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
    setSwitchDatabase: (state, payload) => {
      state.isSwitchDataBaseAccessible = payload.payload;
    },
    logout: state => {
      state.isLoggedIn = false;
      state.isSwitchDataBaseAccessible = false;
    },
  },
});
export const {login, logout, setIpAddress, setSwitchDatabase} =
  authSlice.actions;
export default authSlice.reducer;
