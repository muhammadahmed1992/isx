import { createSlice } from '@reduxjs/toolkit';
import { routeConfig1 } from '../../helper/routeConfig';

const initialState = {
  ...routeConfig1,
};

export const menuSlice = createSlice({
  name: 'Routes',
  initialState,
  reducers: {
    setRoutePermissions: (state, action) => {
      state.switch_database.condition =
        action.payload.IsSwitchDatabaseAndPurchaseReportAllowed;
      state.stock_report.condition = action.payload.IsStockReportAllowed;
      state.sales_report.condition =
        action.payload.IsSalesReportAndCashReportAllowed;
      state.sales_report_2.condition =
        action.payload.IsSalesReportAndCashReportAllowed;
      state.sales_analyst_report.condition =
        action.payload.IsSalesReportAndCashReportAllowed;
      state.sales_analyst_report_2.condition =
        action.payload.IsSalesReportAndCashReportAllowed;
      state.cash_drawer_report.condition =
        action.payload.IsSalesReportAndCashReportAllowed;
      state.cash_drawer_detail_report.condition =
        action.payload.IsSalesReportAndCashReportAllowed;
      (state.purchase_report.condition =
        action.payload.IsSwitchDatabaseAndPurchaseReportAllowed),
        (state.purchase_report_no_disc.condition =
          action.payload.IsSwitchDatabaseAndPurchaseReportAllowed),
        (state.purchase_analyst_report.condition =
          action.payload.IsSwitchDatabaseAndPurchaseReportAllowed),
        (state.purchase_analyst_report_no_disc.condition =
          action.payload.IsSwitchDatabaseAndPurchaseReportAllowed);
    },
  },
});
export const { setRoutePermissions } = menuSlice.actions;
export default menuSlice.reducer;
