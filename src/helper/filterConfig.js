const filterConfig = {
  pageSize: 3,
  columns: {
    stock_report: {
      header: ['stock_name_header'],
      columnsToBeFiltered: ['cSTKdesc'],
    },
    price_report: {
      header: ['stock_name_header'],
      columnsToBeFiltered: ['cSTKdesc'],
    },
    purchasing_report: {
      header: ['invoice_header'],
      columnsToBeFiltered: ['cinvrefno'],
    },
    purchasing_report_no_disc: {
      header: ['invoice_header'],
      columnsToBeFiltered: ['cinvrefno'],
    },
    purchasing_analyst_report: {
      header: ['stock_name_header'],
      columnsToBeFiltered: ['cSTKdesc'],
    },
    purchasing_analyst_report_no_disc: {
      header: ['stock_name_header'],
      columnsToBeFiltered: ['cSTKdesc'],
    },
    sales_report: {
      header: ['invoice_header'],
      columnsToBeFiltered: ['cinvrefno'],
    },
    sales_report_2: {
      header: ['invoice_header'],
      columnsToBeFiltered: ['cinvrefno'],
    },
    sales_analyst_report: {
      header: ['stock_name_header'],
      columnsToBeFiltered: ['cSTKdesc'],
    },
    sales_analyst_report_2: {
      header: ['stock_name_header'],
      columnsToBeFiltered: ['cSTKdesc'],
    },
    cash_drawer_report: {
      columnsToBeFiltered: [],
    },
    cash_drawer_report_detail: {
      columnsToBeFiltered: [],
    },
  },
};
export default filterConfig;