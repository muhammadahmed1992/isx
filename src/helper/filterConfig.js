const filterConfig = {
  pageSize: 50,
  columns: {
    stock_report: {
      header: ['stock_id_header', 'stock_name_header'],
      columnsToBeFiltered: ['cSTKdesc', 'cstdcode'],
    },
    stock_balance_report_purchase_price: {
      header: ['stock_id_header', 'stock_name_header'],
      columnsToBeFiltered: ['cSTKdesc', 'cstdcode'],
    },
    price_report: {
      header: ['stock_id_header', 'stock_name_header'],
      columnsToBeFiltered: ['cSTKdesc', 'cstdcode'],
    },
    purchasing_report: {
      header: ['invoice_header'],
      columnsToBeFiltered: ['cinvrefno'],
    },
    purchasing_report_no_disc: {
      header: ['invoice_header'],
      columnsToBeFiltered: ['cinvrefno']
    },
    purchasing_analyst_report: {
      header: ['stock_id_header', 'stock_name_header'],
      columnsToBeFiltered: ['cSTKdesc', 'cstdcode'],
    },
    purchasing_analyst_report_no_disc: {
      header: ['stock_id_header', 'stock_name_header'],
      columnsToBeFiltered: ['cSTKdesc', 'cstdcode'],
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
      header: ['stock_id_header', 'stock_name_header'],
      columnsToBeFiltered: ['cSTKdesc', 'cstdcode'],
    },
    sales_analyst_report_2: {
      header: ['stock_id_header', 'stock_name_header'],
      columnsToBeFiltered: ['cSTKdesc', 'cstdcode'],
    },
    cash_drawer_report: {
      header: [],
      columnsToBeFiltered: [],
    },
    cash_drawer_report_detail: {
      header: [],
      columnsToBeFiltered: [],
    },
  },
};
export default filterConfig;