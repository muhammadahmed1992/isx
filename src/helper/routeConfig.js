// routeConfig.js
import {
  SwitchDatabase,
  PriceSearchScreen,
  ReportGenerator
} from '../screens';

import Ionicons from 'react-native-vector-icons/Ionicons';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import {useSelector} from 'react-redux';

const {isSwitchDataBaseAccessible} = useSelector(state => state.Auth);

const routeConfig = {
    scan_barCode: {
      label: "Scan BarCode",
      name: "search",
      component: PriceSearchScreen,
      condition: true,
      icon: (color, size) => <FontAwesome name="dollar" color={color} size={20} />,
    },
    switch_database: {
      label: "Switch Database",
      name: "switch_database",
      component: SwitchDatabase,
      condition: isSwitchDataBaseAccessible,
      icon: (color, size) => <FontAwesome5 name="database" color={color} size={20} />,
    },
    price_report: {
      name: "price_report",
      label: "Price List",
      condition: true,
      icon: (color, size) => <FontAwesome name="list-alt" color={color} size={20} />,
      component: ReportGenerator,
      props: {
        dateRangeSetter: false,
        stockInputField: true,
        warehouseInputField: false,
        endPoint: "reports/price-list",
      }
    },
    stock_report: {
      name: "stock_report",
      label: "Stock Report",
      component: ReportGenerator,
      condition: false,
      icon: (color, size) => <FoundationIcon name="graph-trend" color={color} size={20} />,
      props: {
        dateRangeSetter: false,
        stockInputField: true,
        warehouseInputField: true,
        endPoint: "reports/stock-balance",
      }
    },
    sales_report: {
      name: "sales_report",
      label: "Sales Report",
      component: ReportGenerator,
      condition: false,
      icon: (color, size) => <FontAwesome5 name="clipboard-list" color={color} size={20} />,
      props: {
        dateRangeSetter: true,
        stockInputField: false,
        warehouseInputField: true,
        endPoint: "reports/sales",
      }
    },
    sales_report_2: {
      name: "sales_report_2",
      label: "Sales Report (No Disc)",
      condition: false,
      icon: (color, size) => <FontAwesome5 name="clipboard-list" color={color} size={20} />,
      component: ReportGenerator,
      props: {
        dateRangeSetter: true,
        stockInputField: false,
        warehouseInputField: true,
        endPoint: "reports/sales-2",
      }
    },
    sales_analyst_report: {
      name: "sales_analyst_report",
      label: "Sales Analyst Report",
      component: ReportGenerator,
      condition: false,
      icon: (color, size) => <Ionicons name="analytics" color={color} size={20} />,
      props: {
        dateRangeSetter: true,
        stockInputField: true,
        warehouseInputField: true,
        endPoint: "reports/sales-analyst"
      }
    },
    sales_analyst_report_2: {
      name: "sales_analyst_report_2",
      label: "Sales Analyst Report (No Disc)",
      component: ReportGenerator,
      condition: false,
      icon: (color, size) => <Ionicons name="analytics" color={color} size={20} />,
      props: {
        dateRangeSetter: true,
        stockInputField: true,
        warehouseInputField: true,
        endPoint: "reports/sales-analyst-2"
      }
    },
    cash_drawer_report: {
      name: "cash_drawer_report",
      label: "Cash Drawer Report",
      component: ReportGenerator,
      condition: false,
      icon: (color, size) => <MaterialCommunityIcon name="cash-multiple" color={color} size={20} />,
      props: {
        dateRangeSetter: true,
        stockInputField: false,
        warehouseInputField: false,
        endPoint: "reports/cash-drawer"
      }
    },
    cash_drawer_detail_report: {
      name: "cash_drawer_detail_report",
      label: "Cash Drawer Report",
      component: ReportGenerator,
      condition: false,
      icon: (color, size) => <MaterialCommunityIcon name="cash-multiple" color={color} size={20} />,
      props: {
        dateRangeSetter: true,
        stockInputField: false,
        warehouseInputField: false,
        endPoint: "reports/cash-drawer-detail"
      }
    }
  };
  
  export default routeConfig;
  