import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from '../components/CustomDrawer';
import { Colors, Fonts } from '../utils';
import { Splash, Auth } from '../screens';
import BarcodeScanner from '../screens/BarcodeScanner';
import { useSelector } from 'react-redux';
import { salesReportsConfig, stockReportConfig, purchaseReportsConfig, administrationConfig, transactionModuleConfig, otherConfig } from '../helper/routeConfig';

export default function StackNavigation() {
  const Stack = createStackNavigator();
  const Drawer = createDrawerNavigator();

  const Drawers = () => {
    const otherScreens = Object.values(otherConfig);

    // Sales Screens
    const salesReportsPermissions = useSelector(state => state.Menu.salesReports);
    const filteredSalesReportsScreens = Object.values(salesReportsConfig);
    const salesReportsConditionScreens = Object.values(salesReportsPermissions);
    const salesReportsScreens = filteredSalesReportsScreens.filter(item =>
      salesReportsConditionScreens.find(val => val.id === item.id)?.condition);

    // Purchase Screens
    const purchaseReportsPermissions = useSelector(state => state.Menu.purchaseReports);
    const filteredPurchaseReportsScreens = Object.values(purchaseReportsConfig);
    const purchaseReportsConditionScreens = Object.values(purchaseReportsPermissions);
    const purchaseReportsScreens = filteredPurchaseReportsScreens.filter(item => purchaseReportsConditionScreens.find(val => val.id === item.id)?.condition);

    // Stock Screens
    const stockReportsPermissions = useSelector(state => state.Menu.stockReports);
    const filteredStockReportsScreens = Object.values(stockReportConfig);
    const stockReportsConditionScreens = Object.values(stockReportsPermissions);
    const stockReportsScreens = filteredStockReportsScreens.filter(item => stockReportsConditionScreens.find(val => val.id === item.id)?.condition);

    // Administration Screens
    const administrationPermissions = useSelector(state => state.Menu.administration);
    const filteredAdministrationScreens = Object.values(administrationConfig);
    const administrationConditionScreens = Object.values(administrationPermissions);

    const administrationScreens = filteredAdministrationScreens.filter(item => administrationConditionScreens.find(val => val.id === item.id)?.condition);

    // Transaction Screens
    const transactionModulePermissions = useSelector(state => state.Menu.transactionModule);
    const filteredTransactionModuleScreens = Object.values(transactionModuleConfig);
    const transactionModuleConditionScreens = Object.values(transactionModulePermissions);
    const transactionModuleScreens = filteredTransactionModuleScreens.filter(item => transactionModuleConditionScreens.find(val => val.id === item.id)?.condition);

    const menu = useSelector(state => state.Locale.menu);
    return (
      <Drawer.Navigator
        drawerContent={props => <CustomDrawer {...props} />}
        screenOptions={{
          headerShown: false,
          drawerLabelStyle: { marginLeft: -25, fontFamily: Fonts.family.bold },
        }}
        initialRouteName="search"
      >
        {administrationScreens.map((screen, index) => (
          <Drawer.Screen
            key={index}
            name={screen.name}
            options={{
              unmountOnBlur: screen.unmountOnBlur || false,
              drawerLabel: menu[screen.label],
              drawerLabelStyle: { color: Colors.red, fontFamily: Fonts.family.bold },
              drawerIcon: ({ size }) => screen.icon(Colors.red, size),
            }}
            component={screen.component}
            initialParams={{ ...screen.props }}
          />
        ))}

        {/* Transaction Screens */}
        {transactionModuleScreens.map((screen, index) => (
          <Drawer.Screen
            key={index}
            name={screen.name}
            options={{
              drawerLabel: menu[screen.label],
              drawerLabelStyle: { color: Colors.blue, fontFamily: Fonts.family.bold },
              drawerIcon: ({ size }) => screen.icon(Colors.blue, size),
            }}
            component={screen.component}
            initialParams={{ ...screen.props }}
          />
        ))}

        {stockReportsScreens.map((screen, index) => (
          <Drawer.Screen
            key={index}
            name={screen.name}
            options={{
              unmountOnBlur: true,
              drawerLabel: menu[screen.label],
              drawerLabelStyle: { color: Colors.green, fontFamily: Fonts.family.bold },
              drawerIcon: ({ size }) => screen.icon(Colors.green, size),
              swipeEnabled: false,
            }}
            component={screen.component}
            initialParams={{ ...screen.props }}
          />
        ))}

        {salesReportsScreens.map((screen, index) => (
          <Drawer.Screen
            key={index}
            name={screen.name}
            options={{
              unmountOnBlur: true,
              drawerLabel: menu[screen.label],
              drawerLabelStyle: { color: Colors.green, fontFamily: Fonts.family.bold },
              drawerIcon: ({ size }) => screen.icon(Colors.green, size),
            }}
            component={screen.component}
            initialParams={{ ...screen.props }}
          />
        ))}

        {purchaseReportsScreens.map((screen, index) => (
          <Drawer.Screen
            key={index}
            name={screen.name}
            options={{
              unmountOnBlur: true,
              drawerLabel: menu[screen.label],
              drawerLabelStyle: { color: Colors.green, fontFamily: Fonts.family.bold },
              drawerIcon: ({ size }) => screen.icon(Colors.green, size),
            }}
            component={screen.component}
            initialParams={{ ...screen.props }}
          />
        ))}
        {otherScreens.map((screen, index) => (
          <Drawer.Screen
            key={index}
            name={screen.name}
            options={{
              drawerLabel: menu[screen.label],
              drawerLabelStyle: { color: Colors.green, fontFamily: Fonts.family.bold },
              drawerIcon: ({ size }) => screen.icon(Colors.green, size),
            }}
            component={screen.component}
            initialParams={{ ...screen.props }}
          />
        ))}

      </Drawer.Navigator>
    );
  };

  return (
    <Stack.Navigator initialRouteName="splash" detachInactiveScreens={false}>
      <Stack.Screen
        name="splash"
        component={Splash}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="auth"
        component={Auth}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="dashboard"
        component={Drawers}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="barcode_scanner"
        component={BarcodeScanner}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
