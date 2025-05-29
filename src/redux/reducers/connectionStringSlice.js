import { HOST_IP, USER_, PASSWORD, PORT, DATABASE, API_SERVER_PORT } from '@env';
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  host: HOST_IP,
  username: USER_,
  password: PASSWORD,
  port: PORT,
  database: DATABASE,
  api_port: API_SERVER_PORT
};

export const connectionStringSlice = createSlice({
  name: 'ConnectionString',
  initialState,
  reducers: {
    setDataBase: (state, payload) => {
      state.database = payload.payload;
    },
    clear: state => {
      state.host = HOST_IP;
      state.username = USER_;
      state.password = PASSWORD;
      state.port = PORT;
      state.database = DATABASE;
      state.api_port = API_SERVER_PORT;
    },
  },
});
export const { clear, setDataBase } = connectionStringSlice.actions;
export default connectionStringSlice.reducer;
