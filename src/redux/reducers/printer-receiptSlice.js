import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    name: '',
    address: '',
    screens: {
        sales_transaction: false,
        sales_order_transaction: true,
        point_of_sale_transaction: false,
        stock_adjusment: false
    }
};

export const printerReceiptSlice = createSlice({
    name: 'ReceiptPrinter',
    initialState,
    reducers: {
        setPrinterNameAndAddress: (state, action) => {
            console.log(`setting in store ${JSON.stringify(action.payload)}`);
            state.name = action.payload.name;
            state.address = action.payload.address;
        },
        toggleScreensPrintingFunctionality: (state, action) => {
            state.screens = {
                ...state.screens,
                ...action.payload
            };
        }
    },
});
export const { setPrinterNameAndAddress, toggleScreensPrintingFunctionality } = printerReceiptSlice.actions;
export default printerReceiptSlice.reducer;