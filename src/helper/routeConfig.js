import {SwitchDatabase, PriceSearchScreen} from '../screens';
import ReportGenerator from '../screens/ReportGenerator';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Endpoints} from '../utils';

const routeConfig = {
  scan_barCode: {
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
  price_report: {
    name: 'price_report',
    label: 'price_report',
    condition: true,
    icon: (color, size) => (
      <FontAwesome name="list-alt" color={color} size={20} />
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

export default routeConfig;
