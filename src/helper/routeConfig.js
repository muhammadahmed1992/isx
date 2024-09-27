import { SwitchDatabase, PriceSearchScreen, ReportGenerator, RegistrationScreen, TransactionModuleScreen } from '../screens';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Endpoints } from '../utils';

const administrationConfig = {
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
}

const transactionModuleConfig = {
  sales: {
    id: 1,
    label: 'sales',
    name: 'sales',
    component: TransactionModuleScreen,
    condition: true,
    icon: (color, size) => (
      <MaterialIcon name="app-registration" color={color} size={20} />
    ),
    props: {
      label: 'sales',
      invoice_headers: true,
      table: true,
      invoiceDetail: false,
      invoiceHeadersPrompts: ["Invoice No", "Date", "Warehouse", "Customer", "Salesman", "Tax"],
      endPoints: {sales: Endpoints.salesInvoice, table: Endpoints.salesTable }
    },
  },
  sales_order: {
    id: 2,
    label: 'sales_order',
    name: 'sales_order',
    component: TransactionModuleScreen,
    condition: true,
    icon: (color, size) => (
      <MaterialIcon name="app-registration" color={color} size={20} />
    ),
    props: {
      label: 'sales_order',
      invoice_headers: true,
      table: true,
      invoiceDetail: false,
      invoiceHeadersPrompts: ["Invoice No", "Date", "Warehouse", "Customer", "Salesman", "Tax"]
    },
  },
  pos: {
    id: 3,
    label: 'pos',
    name: 'pos',
    component: TransactionModuleScreen,
    condition: true,
    icon: (color, size) => (
      <MaterialIcon name="point-of-sale" color={color} size={20} />
    ),
    props: {
      label: 'pos',
      invoice_headers: true,
      table: true,
      invoiceDetail: true,
      invoiceHeadersPrompts: ["Invoice No", "Date", "Warehouse", "Customer", "SPG", "Service Of Charge", "Tax", "Table"] // keys to be mapped for localization
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
      invoice_headers: true,
      table: true,
      invoiceDetail: false,
      invoiceHeadersPrompts: ["Invoice No", "Date", "Warehouse"]
    },
  },
};

const reportConfig = {
  scan_barCode: {
    id: 1,
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
  price_report: {
    id: 3,
    name: 'price_report',
    label: 'price_report',
    condition: true,
    icon: (color, size) => (
      <FontAwesome5 name="database" color={color} size={20} />
    ),
    component: ReportGenerator,
    props: {
      label: 'price_report',
      dateRangeSetter: false,
      stockInputField: true,
      warehouseInputField: false,
      endPoint: Endpoints.priceReport,
    },
  },
  stock_report: {
    id: 4,
    name: 'stock_report',
    label: 'stock_report',
    component: ReportGenerator,
    condition: false,
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
  sales_report: {
    id: 14,
    name: 'sales_report',
    label: 'sales_report',
    component: ReportGenerator,
    condition: false,
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
  sales_report_2: {
    id: 5,
    name: 'sales_report_2',
    label: 'sales_report_2',
    condition: false,
    icon: (color, size) => (
      <FontAwesome5 name="clipboard-list" color={color} size={20} />
    ),
    component: ReportGenerator,
    props: {
      label: 'sales_report_2',
      dateRangeSetter: true,
      stockInputField: false,
      warehouseInputField: true,
      endPoint: Endpoints.sales2Report,
    },
  },
  sales_analyst_report: {
    id: 6,
    name: 'sales_analyst_report',
    label: 'sales_analyst_report',
    component: ReportGenerator,
    condition: false,
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
  sales_analyst_report_2: {
    id: 7,
    name: 'sales_analyst_report_2',
    label: 'sales_analyst_report_2',
    component: ReportGenerator,
    condition: false,
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
  cash_drawer_report: {
    id: 8,
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
    id: 9,
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
  purchase_report: {
    id: 10,
    name: 'purchasing_report',
    label: 'purchasing_report',
    component: ReportGenerator,
    condition: false,
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
  purchase_report_no_disc: {
    id: 11,
    name: 'purchasing_report_no_disc',
    label: 'purchasing_report_no_disc',
    condition: false,
    icon: (color, size) => (
      <FontAwesome5 name="clipboard-list" color={color} size={20} />
    ),
    component: ReportGenerator,
    props: {
      label: 'purchasing_report_no_disc',
      dateRangeSetter: true,
      stockInputField: false,
      warehouseInputField: true,
      endPoint: Endpoints.purchaseNoDiscReport,
    },
  },
  purchase_analyst_report: {
    id: 12,
    name: 'purchasing_analyst_report',
    label: 'purchasing_analyst_report',
    component: ReportGenerator,
    condition: false,
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
  purchase_analyst_report_no_disc: {
    id: 13,
    name: 'purchasing_analyst_report_no_disc',
    label: 'purchasing_analyst_report_no_disc',
    component: ReportGenerator,
    condition: false,
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
  }
}

const reportConditionsConfig = {
  scan_barCode: {
    id: 1,
    condition: true,
  },
  price_report: {
    id: 3,
    condition: true,
  },
  stock_report: {
    id: 4,
    condition: false,
  },
  sales_report: {
    id: 14,
    condition: false,
  },
  sales_report_2: {
    id: 5,
    condition: false,
  },
  sales_analyst_report: {
    id: 6,
    condition: false,
  },
  sales_analyst_report_2: {
    id: 7,
    condition: false,
  },
  cash_drawer_report: {
    id: 8,
    condition: false,
  },
  cash_drawer_detail_report: {
    id: 9,
    condition: false,
  },
  purchase_report: {
    id: 10,
    condition: false,
  },
  purchase_report_no_disc: {
    id: 11,
    condition: false,
  },
  purchase_analyst_report: {
    id: 12,
    condition: false,
  },
  purchase_analyst_report_no_disc: {
    id: 13,
    condition: false
  },
};

export { reportConditionsConfig, administrationConditionConfig, transactionModuleConditions }; // conditions
export { reportConfig, administrationConfig, transactionModuleConfig}; // mapping-config