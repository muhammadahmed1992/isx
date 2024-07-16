import {createSlice} from '@reduxjs/toolkit';

let initialState = {
  host: 'localhost',
  username: 'root',
  password: 'crmsrv@12A',
  port: '3306',
  database: 'eisdata',
};

export const connectionStringSlice = createSlice({
  name: 'ConnectionString',
  initialState,
  reducers: {
    init: (state, payload) => {
      state.host = payload.payload.host;
      state.username = payload.payload.username;
      state.password = payload.payload.password;
      state.port = payload.payload.port;
      state.database = payload.payload.database;
    },
    clear: state => {
      state.host = null;
      state.username = null;
      state.password = null;
      state.port = null;
      state.database = null;
    },
  },
});
export const {init, clear} = connectionStringSlice.actions;
export default connectionStringSlice.reducer;
