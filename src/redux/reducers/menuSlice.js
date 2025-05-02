import { createSlice } from '@reduxjs/toolkit';
import { salesReportConditionsConfig, purchaseReportConditionsConfig, stockReportConditionConfig, administrationConditionConfig, transactionModuleConditions } from '../../helper/routeConfig';

const initialState = {
  salesReports: {
    ...salesReportConditionsConfig,
  },
  purchaseReports: {
    ...purchaseReportConditionsConfig,
  },
  stockReports: {
    ...stockReportConditionConfig
  },
  administration: {
    ...administrationConditionConfig,
  },
  transactionModule: {
    ...transactionModuleConditions,
  },
};

export const menuSlice = createSlice({
  name: 'Routes',
  initialState,
  reducers: {
    setReportPermissions: (state, action) => {
      state.stockReports.stock_report.condition = action.payload.IsStockReportAllowed;
      state.salesReports.sales_report.condition =
        action.payload.IsSalesReportAndCashReportAllowed;
      state.salesReports.sales_report_2.condition =
        action.payload.IsSalesReportAndCashReportAllowed;
      state.salesReports.sales_analyst_report.condition =
        action.payload.IsSalesReportAndCashReportAllowed;
      state.salesReports.sales_analyst_report_2.condition =
        action.payload.IsSalesReportAndCashReportAllowed;
      state.salesReports.cash_drawer_report.condition =
        action.payload.IsSalesReportAndCashReportAllowed;
      state.salesReports.cash_drawer_detail_report.condition =
        action.payload.IsSalesReportAndCashReportAllowed;
      state.purchaseReports.purchase_report.condition =
        action.payload.IsPurchaseReportAllowed,
        state.purchaseReports.purchase_report_no_disc.condition =
        action.payload.IsPurchaseReportAllowed,
        state.purchaseReports.purchase_analyst_report.condition =
        action.payload.IsPurchaseReportAllowed,
        state.purchaseReports.purchase_analyst_report_no_disc.condition =
        action.payload.IsPurchaseReportAllowed;
      console.log('permission');
      console.log(action.payload.IsStockReportPurchasePriceAllowed);
      state.stockReports.stock_balance_report_purchase_price.condition = action.payload.IsStockReportPurchasePriceAllowed;
    },
    setAdministrationPermissions: (state, action) => {
      state.administration.switch_database.condition = action.payload.IsSwitchDatabase;
      state.administration.scan_barCode_purchase_price.condition = action.payload.IsBarcodeWithPurchasePriceAllowed;
    },
    setTransactionModulePermissions: (state, action) => {
      state.transactionModule.sales.condition = action.payload.IsSalesAndSalesOrderAndPosTransactionAllowed;
      state.transactionModule.pos.condition = action.payload.IsSalesAndSalesOrderAndPosTransactionAllowed;
      state.transactionModule.sales_order.condition = action.payload.IsSalesAndSalesOrderAndPosTransactionAllowed;
      state.transactionModule.stock_adjusment.condition = action.payload.IsStockAdjusmentAllowed;
    },
  },
});
export const { setReportPermissions, setAdministrationPermissions, setTransactionModulePermissions } = menuSlice.actions;
export default menuSlice.reducer;
