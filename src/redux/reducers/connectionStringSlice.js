import {HOST_IP, USER, PASSWORD, PORT, DATABASE} from '@env';
import {createSlice} from '@reduxjs/toolkit';

let initialState = {
  host: HOST_IP,
  username: USER,
  password: PASSWORD,
  port: PORT,
  database: DATABASE,
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
    setDataBase: (state, payload) => {
      state.database = payload.payload;
    },
    clear: state => {
      state.host = HOST_IP;
      state.username = USER;
      state.password = PASSWORD;
      state.port = PORT;
      state.database = DATABASE;
    },
  },
});
export const {init, clear, setDataBase} = connectionStringSlice.actions;
export default connectionStringSlice.reducer;
