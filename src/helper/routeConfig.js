import { SwitchDatabase, PriceSearchScreen, ReportGenerator, RegistrationScreen, TransactionModuleScreen } from '../screens';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Endpoints } from '../utils';
import VideoLinks from '../screens/VideoLinks';


const otherConfig = {
  video: {
    id: 1,
    label: 'video',
    name: 'video',
    component: VideoLinks,
    condition: true,
    icon: (color, size) => (
      <EntypoIcons name="video" color={color} size={20} />
    ),
    props: {
      label: 'video',
    },
  },
}

// Administration Config
const administrationConfig = {
  scan_barCode: {
    id: 3,
    label: 'scan_barcode',
    name: 'search',
    component: PriceSearchScreen,
    condition: true,
    icon: (color, size) => (
      <FontAwesome name="dollar" color={color} size={20} />
    ),
    props: {
      label: 'scan_barcode',
    },
  },
  switch_database: {
    id: 1,
    label: 'switch_database',
    name: 'switch_database',
    component: SwitchDatabase,
    condition: true,
    icon: (color, size) => (
      <FontAwesome5 name="database" color={color} size={20} />
    ),
    props: {
      label: 'switch_database',
    },
  },
  registration: {
    id: 2,
    label: 'registration',
    name: 'registration',
    component: RegistrationScreen,
    condition: true,
    icon: (color, size) => (
      <EntypoIcons name="add-user" color={color} size={20} />
    ),
    props: {
      label: 'registration',
    },
  },
};

const transactionModuleConfig = {
  sales_transaction: {
    id: 1,
    label: 'sales_transaction',
    name: 'sales_transaction',
    component: TransactionModuleScreen,
    condition: true,
    icon: (color, size) => (
      <MaterialIcon name="app-registration" color={color} size={20} />
    ),
    props: {
      label: 'sales_transaction',
      paymentDetails: false,
      endPoints: {invoice: Endpoints.salesInvoice, table: Endpoints.salesTable, sendInvoice: Endpoints.sendSalesInvoice }
    },
  },
  sales_order_transaction: {
    id: 2,
    label: 'sales_order_transaction',
    name: 'sales_order_transaction',
    component: TransactionModuleScreen,
    condition: true,
    icon: (color, size) => (
      <MaterialIcon name="app-registration" color={color} size={20} />
    ),
    props: {
      label: 'sales_order_transaction',
      paymentDetails: false,
      endPoints: {invoice: Endpoints.salesOrderInvoice, table: Endpoints.salesOrderTable, sendInvoice: Endpoints.sendSalesOrderInvoice }
    },
  },
  point_of_sale_transaction: {
    id: 3,
    label: 'point_of_sale_transaction',
    name: 'point_of_sale_transaction',
    component: TransactionModuleScreen,
    condition: true,
    icon: (color, size) => (
      <MaterialIcon name="point-of-sale" color={color} size={20} />
    ),
    props: {
      label: 'point_of_sale_transaction',
      paymentDetails: true,
      endPoints: {invoice: Endpoints.pointOfSaleInvoice, table: Endpoints.pointOfSaleTable, sendInvoice: Endpoints.setPointOfSaleInvoice }
    },
  },
  stock_adjusment: {
    id: 4,
    label: 'stock_adjusment',
    name: 'stock_adjusment',
    component: TransactionModuleScreen,
    condition: true,
    icon: (color, size) => (
      <MaterialIcon name="change-circle" color={color} size={20} />
    ),
    props: {
      label: 'stock_adjusment',
      paymentDetails: false,
      endPoints: {invoice: Endpoints.stockInvoice, table: Endpoints.stockTable, sendInvoice: Endpoints.setStockInvoice }
    },
  },
};

// Sales Reports
const salesReportsConfig = {
  sales_report_2: {
    id: 1,
    name: 'sales_report_2',
    label: 'sales_report_2',
    component: ReportGenerator,
    condition: true,
    icon: (color, size) => (
      <FontAwesome5 name="clipboard-list" color={color} size={20} />
    ),
    props: {
      label: 'sales_report_2',
      dateRangeSetter: true,
      stockInputField: false,
      warehouseInputField: true,
      endPoint: Endpoints.sales2Report,
    },
  },
  sales_report: {
    id: 2,
    name: 'sales_report',
    label: 'sales_report',
    component: ReportGenerator,
    condition: true,
    icon: (color, size) => (
      <FontAwesome5 name="clipboard-list" color={color} size={20} />
    ),
    props: {
      label: 'sales_report',
      dateRangeSetter: true,
      stockInputField: false,
      warehouseInputField: true,
      endPoint: Endpoints.salesReport,
    },
  },
  sales_analyst_report_2: {
    id: 3,
    name: 'sales_analyst_report_2',
    label: 'sales_analyst_report_2',
    component: ReportGenerator,
    condition: true,
    icon: (color, size) => (
      <Ionicons name="analytics" color={color} size={20} />
    ),
    props: {
      label: 'sales_analyst_report_2',
      dateRangeSetter: true,
      stockInputField: true,
      warehouseInputField: true,
      endPoint: Endpoints.salesAnalyst2Report,
    },
  },
  sales_analyst_report: {
    id: 4,
    name: 'sales_analyst_report',
    label: 'sales_analyst_report',
    component: ReportGenerator,
    condition: true,
    icon: (color, size) => (
      <Ionicons name="analytics" color={color} size={20} />
    ),
    props: {
      label: 'sales_analyst_report',
      dateRangeSetter: true,
      stockInputField: true,
      warehouseInputField: true,
      endPoint: Endpoints.salesAnalystReport,
    },
  },
  cash_drawer_report: {
    id: 5,
    name: 'cash_drawer_report',
    label: 'cash_drawer_report',
    component: ReportGenerator,
    condition: false,
    icon: (color, size) => (
      <MaterialCommunityIcon name="cash-multiple" color={color} size={20} />
    ),
    props: {
      label: 'cash_drawer_report',
      dateRangeSetter: true,
      stockInputField: false,
      warehouseInputField: false,
      endPoint: Endpoints.cashDrawerReport,
    },
  },
  cash_drawer_detail_report: {
    id: 6,
    name: 'cash_drawer_report_detail',
    label: 'cash_drawer_report_detail',
    component: ReportGenerator,
    condition: false,
    icon: (color, size) => (
      <MaterialCommunityIcon name="cash-multiple" color={color} size={20} />
    ),
    props: {
      label: 'cash_drawer_report_detail',
      dateRangeSetter: true,
      stockInputField: false,
      warehouseInputField: false,
      endPoint: Endpoints.cashDrawerDetailReport,
    },
  },
};

// Purchase Reports
const purchaseReportsConfig = {
  purchase_report_no_disc: {
    id: 1,
    name: 'purchasing_report_no_disc',
    label: 'purchasing_report_no_disc',
    component: ReportGenerator,
    condition: true,
    icon: (color, size) => (
      <FontAwesome5 name="clipboard-list" color={color} size={20} />
    ),
    props: {
      label: 'purchasing_report_no_disc',
      dateRangeSetter: true,
      stockInputField: false,
      warehouseInputField: true,
      endPoint: Endpoints.purchaseNoDiscReport,
    },
  },
  purchase_report: {
    id: 2,
    name: 'purchasing_report',
    label: 'purchasing_report',
    component: ReportGenerator,
    condition: true,
    icon: (color, size) => (
      <FontAwesome5 name="clipboard-list" color={color} size={20} />
    ),
    props: {
      label: 'purchasing_report',
      dateRangeSetter: true,
      stockInputField: false,
      warehouseInputField: true,
      endPoint: Endpoints.purchaseReport,
    },
  },
  purchase_analyst_report_no_disc: {
    id: 3,
    name: 'purchasing_analyst_report_no_disc',
    label: 'purchasing_analyst_report_no_disc',
    component: ReportGenerator,
    condition: true,
    icon: (color, size) => (
      <Ionicons name="analytics" color={color} size={20} />
    ),
    props: {
      label: 'purchasing_analyst_report_no_disc',
      dateRangeSetter: true,
      stockInputField: true,
      warehouseInputField: true,
      endPoint: Endpoints.purchaseAnalystNoDiscReport,
    },
  },
  purchase_analyst_report: {
    id: 4,
    name: 'purchasing_analyst_report',
    label: 'purchasing_analyst_report',
    component: ReportGenerator,
    condition: true,
    icon: (color, size) => (
      <Ionicons name="analytics" color={color} size={20} />
    ),
    props: {
      label: 'purchasing_analyst_report',
      dateRangeSetter: true,
      stockInputField: true,
      warehouseInputField: true,
      endPoint: Endpoints.purchaseAnalystReport,
    },
  },
  };

// Price and Stock Reports
const stockReportConfig = {
  price_report: {
    id: 4,
    name: 'price_report',
    label: 'price_report',
    component: ReportGenerator,
    condition: true,
    icon: (color, size) => (
      <FontAwesome5 name="database" color={color} size={20} />
    ),
    props: {
      label: 'price_report',
      dateRangeSetter: false,
      stockInputField: true,
      warehouseInputField: false,
      endPoint: Endpoints.priceReport,
    },
  },
  stock_report: {
    id: 3,
    name: 'stock_report',
    label: 'stock_report',
    component: ReportGenerator,
    condition: true,
    icon: (color, size) => (
      <FoundationIcon name="graph-trend" color={color} size={20} />
    ),
    props: {
      label: 'stock_report',
      dateRangeSetter: false,
      stockInputField: true,
      warehouseInputField: true,
      endPoint: Endpoints.stockReport,
    },
  },
};


const transactionModuleConditions = {
  sales: {
    id: 1,
    condition: true
  },
  sales_order: {
    id: 2,
    condition: true
  },
  pos: {
    id: 3,
    condition: true
  },
  stock_adjusment: {
    id: 4,
    condition: true
  }
}

const administrationConditionConfig = {
  switch_database: {
    id: 1,
    condition: true,
  },
  registration: {
    id: 2,
    condition: true
  },
  scan_barCode: {
    id: 3,
    condition: true,
  },
}

const salesReportConditionsConfig = {
  sales_report: {
    id: 1,
    condition: false,
  },
  sales_report_2: {
    id: 2,
    condition: false,
  },
  sales_analyst_report: {
    id: 3,
    condition: false,
  },
  sales_analyst_report_2: {
    id: 4,
    condition: false,
  },
  cash_drawer_report: {
    id: 5,
    condition: false,
  },
  cash_drawer_detail_report: {
    id: 6,
    condition: false,
  },
};

const purchaseReportConditionsConfig = {
  purchase_report: {
    id: 1,
    condition: false,
  },
  purchase_report_no_disc: {
    id: 2,
    condition: false,
  },
  purchase_analyst_report: {
    id: 3,
    condition: false,
  },
  purchase_analyst_report_no_disc: {
    id: 4,
    condition: false,
  },
};

const stockReportConditionConfig = {
  price_report: {
    id: 3,
    condition: true,
  },
  stock_report: {
    id: 4,
    condition: false,
  },
};

export {
  salesReportConditionsConfig,
  purchaseReportConditionsConfig,
  stockReportConditionConfig,
  administrationConditionConfig,
  transactionModuleConditions
}; 

export { administrationConfig, salesReportsConfig, purchaseReportsConfig, stockReportConfig, transactionModuleConfig, otherConfig }; 
