import {HOST_IP, USER_, PASSWORD, PORT, DATABASE} from '@env';
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  host: HOST_IP,
  username: USER_,
  password: PASSWORD,
  port: PORT,
  database: DATABASE,
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
    },
  },
});
export const {clear, setDataBase} = connectionStringSlice.actions;
export default connectionStringSlice.reducer;
