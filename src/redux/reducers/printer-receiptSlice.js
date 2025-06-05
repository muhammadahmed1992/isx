import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    printers: [],
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
            console.log(`printers:`);
            console.log(action.payload);
            state.printers = action.payload;
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