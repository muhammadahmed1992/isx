import {createSlice} from '@reduxjs/toolkit';
import ApiService from '../../services/ApiService'; 
import Endpoints from '../../utils/Endpoints'; 

const initialState = {
  language: 'id',
  menu: {},
  headers: {},
};

export const localeSlice = createSlice({
  name: 'locale',
  initialState,
  reducers: {
    setLocaleData: (state, action) => {
      state.menu = action.payload.menu;
      state.headers = action.payload.headers;
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
  },
});

export const {setLocaleData, setLanguage} = localeSlice.actions;

export const fetchAndSetLocaleData = language => async dispatch => {
  try {
    const response = await ApiService.get(
      `${Endpoints.localization}${language}`,
    );
    dispatch(setLocaleData(response.data.data));
    dispatch(setLanguage(language));
  } catch (error) {
    console.error('Error fetching localization data:', error);
  }
};

export default localeSlice.reducer;
