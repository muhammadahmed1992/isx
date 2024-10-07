import { createSlice } from '@reduxjs/toolkit';
import { reportConditionsConfig, administrationConditionConfig, transactionModuleConditions } from '../../helper/routeConfig';

const initialState = {
  reports: {
    ...reportConditionsConfig,
  },
  administration: {
    ...administrationConditionConfig,
  },
  transactionModule: {
    ...transactionModuleConditions
  }
};

export const menuSlice = createSlice({
  name: 'Routes',
  initialState,
  reducers: {
    setReportPermissions: (state, action) => {
      state.reports.stock_report.condition = action.payload.IsStockReportAllowed;
      state.reports.sales_report.condition =
        action.payload.IsSalesReportAndCashReportAllowed;
      state.reports.sales_report_2.condition =
        action.payload.IsSalesReportAndCashReportAllowed;
      state.reports.sales_analyst_report.condition =
        action.payload.IsSalesReportAndCashReportAllowed;
      state.reports.sales_analyst_report_2.condition =
        action.payload.IsSalesReportAndCashReportAllowed;
      state.reports.cash_drawer_report.condition =
        action.payload.IsSalesReportAndCashReportAllowed;
      state.reports.cash_drawer_detail_report.condition =
        action.payload.IsSalesReportAndCashReportAllowed;
      state.reports.purchase_report.condition =
        action.payload.IsPurchaseReportAllowed,
        state.reports.purchase_report_no_disc.condition =
          action.payload.IsPurchaseReportAllowed,
        state.reports.purchase_analyst_report.condition =
          action.payload.IsPurchaseReportAllowed,
        state.reports.purchase_analyst_report_no_disc.condition =
          action.payload.IsPurchaseReportAllowed;
    },
    setAdministrationPermissions: (state, action) => {
      state.administration.switch_database.condition =
      action.payload.IsSwitchDatabase;
        state.administration.registration.condition = 
        true
    },
    setTransactionModulePermissions: (state, action) => {
      state.transactionModule.sales.condition = action.payload.IsSalesAndSalesOrderAndPosTransactionAllowed;
      state.transactionModule.pos.condition = action.payload.IsSalesAndSalesOrderAndPosTransactionAllowed;
      state.transactionModule.sales_order.condition = action.payload.IsSalesAndSalesOrderAndPosTransactionAllowed;
      state.transactionModule.stock_adjusment = action.payload.IsStockAdjusmentAllowed;
    }
  },
});
export const { setReportPermissions, setAdministrationPermissions, setTransactionModulePermissions } = menuSlice.actions;
export default menuSlice.reducer;
