import {createSlice} from '@reduxjs/toolkit';
import ApiService from '../../services/ApiService'; // Update with the correct import
import Endpoints from '../../utils/Endpoints'; // Update with the correct import

const initialState = {
  language: 'en',
  menu: {},
};
const label = 'stock_report';
export const localeSlice = createSlice({
  name: 'locale',
  initialState,
  reducers: {
    setLocaleData: (state, action) => {
      state.menu = action.payload.menu;
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
    console.log("locale response",response.data.data);
    dispatch(setLocaleData(response.data.data));
    dispatch(setLanguage(language));
  } catch (error) {
    console.error('Error fetching localization data:', error);
  }
};

export default localeSlice.reducer;
