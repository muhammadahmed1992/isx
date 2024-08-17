import {createSlice} from '@reduxjs/toolkit';
import routeConfig from '../../helper/routeConfig'

export const menuSlice = createSlice({
  name: 'Routes',
  routeConfig,
  reducers: {
    setRoutePermissions: (state, payload) => {
      state.switch_database.condition = payload.payload.IsSwitchDatabase;
      state.price_report.condition = payload.payload.IsPriceReportEnabled;
      state.stock_report.condition = payload.payload.IsStockReportEnabled;
      state.sales_report.condition = payload.payload.IsSalesReportEnabled;
      state.sales_report_2.condition = payload.payload.IsSalesReportNoDiscEnabled;
      state.sales_analyst_report.condition = payload.payload.IsSalesAnalystReportEnabled;
      state.sales_analyst_report_2.condition = payload.payload.IsSalesAnalystNoDiscReportEnabled;
      state.cash_drawer_report.condition = payload.payload.IsCashDrawerReportEnabled;
    }
  },
});
export const {setRoutePermissions} =
menuSlice.actions;
export default menuSlice.reducer;
