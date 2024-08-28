const ReportTypes = {
    CASH_DRAWER: 'cash_drawer_report',
    CASH_DRAWER_DETAIL: 'cash_drawer_report_detail',
    PRICE: 'price_report',
    STOCKS: 'stock_report',
    SALES_REPORT: 'sales_report',
    SALES_REPORT_2: 'sales_report_2',
    SALES_ANALYST_REPORT: 'sales_analyst_report',
    SALES_ANALYST_REPORT_2: 'sales_analyst_report_2',
    PURCHASE_REPORT: 'purchasing_report',
    PURCHASE_REPORT_NO_DISC: 'purchasing_report_no_disc',
    PURCHASE_ANALYST_REPORT: 'purchasing_analyst_report',
    PURCHASE_ANALYST_REPORT_NO_DISC: 'purchasing_analyst_report_no_disc'
};

export default ReportTypes;

export function isSalesReport(reportType) {
    return reportType === ReportTypes.SALES_ANALYST_REPORT || 
    reportType === ReportTypes.SALES_ANALYST_REPORT_2 || 
    reportType === ReportTypes.SALES_REPORT || 
    reportType === ReportTypes.SALES_REPORT_2; 
}

export function isCashDrawerReport(reportType) {
    return reportType === ReportTypes.CASH_DRAWER || reportType === ReportTypes.CASH_DRAWER_DETAIL;
}

export function isStockReport(reportType) {
    return reportType === ReportTypes.STOCKS;
}

export function isPriceReport(reportType) {
    return reportType === ReportTypes.PRICE;
}

export function isPurchaseReport(reportType) {
    return reportType === ReportTypes.PURCHASE_REPORT ||
           reportType === ReportTypes.PURCHASE_REPORT_NO_DISC ||
           reportType === ReportTypes.PURCHASE_ANALYST_REPORT ||
           reportType === ReportTypes.PURCHASE_ANALYST_REPORT_NO_DISC;
}