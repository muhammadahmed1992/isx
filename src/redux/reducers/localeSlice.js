import { createSlice } from "@reduxjs/toolkit";
import ApiService from 'path-to-ApiService'; // Update with the correct import
import Endpoints from 'path-to-Endpoints'; // Update with the correct import

const initialState = {
    language: 'en',
    menu: {},
    others: {},
    headers: {},
};
const label = 'stock_report'
export const localeSlice = createSlice({
    name: 'locale',
    initialState,
    reducers: {
        setLocaleData: (state, action) => {
            state.menu = action.payload.menu;
            state.others = action.payload.others;
            state.headers = action.payload.headers;
        },
        setLanguage: (state, action) => {
            state.language = action.payload;
        },
    },
});

export const { setLocaleData, setLanguage } = localeSlice.actions;

export const fetchAndSetLocaleData = (language) => async (dispatch) => {
    try {
        const response = await ApiService.get(`${Endpoints.localization}${language}`);
        dispatch(setLocaleData(response.data));
        dispatch(setLanguage(language));
    } catch (error) {
        console.error('Error fetching localization data:', error);
    }
};

export default localeSlice.reducer;
