import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  registrationKey: '',
};

export const registrationSlice = createSlice({
  name: 'Registration',
  initialState,
  reducers: {
    setRegistrationKey: (state, action) => {
        state.registrationKey = action.payload;
    },
  },
});
export const {setRegistrationKey} = registrationSlice.actions;
export default registrationSlice.reducer;
