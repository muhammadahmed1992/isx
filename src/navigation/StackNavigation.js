import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import CustomDrawer from '../components/CustomDrawer';
import {Fonts, Commons} from '../utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import {Splash, Auth} from '../screens';
import {
  SwitchDatabase,
  PriceSearchScreen,
  PriceReport,
  StockReport,
  SalesReport,
  SalesAnalystReport,
  CashDrawerReport,
  BarcodeScanner,
} from '../screens';

export default function StackNavigation() {
  const Stack = createStackNavigator();

  const Drawers = () => {
    const Drawer = createDrawerNavigator();
    return (
      <Drawer.Navigator
        detachInactiveScreens={false}
        drawerContent={props => <CustomDrawer {...props} />}
        screenOptions={{
          headerShown: false,
          drawerLabelStyle: {marginLeft: -25, fontFamily: Fonts.family.bold},
        }}
        initialRouteName="search">
        <Drawer.Screen
          name="search"
          component={PriceSearchScreen}
          options={{
            headerShown: false,
            drawerLabel: 'Search Price',
            drawerIcon: ({color, size}) => {
              return <FontAwesome name="dollar" color={color} size={20} />;
            },
          }}
        />
        <Drawer.Screen
          name="switch_database"
          component={SwitchDatabase}
          options={{
            headerShown: false,
            drawerLabel: 'Switch Database',
            drawerIcon: ({color, size}) => {
              return <FontAwesome5 name="database" color={color} size={20} />;
            },
          }}
        />
        <Drawer.Screen
          name="price_report"
          component={PriceReport}
          options={{
            headerShown: false,
            drawerLabel: 'Price Report',
            drawerIcon: ({color, size}) => {
              return <FontAwesome name="list-alt" color={color} size={20} />;
            },
          }}
        />
        <Drawer.Screen
          name="stock_report"
          component={StockReport}
          options={{
            headerShown: false,
            drawerLabel: 'Stock Report',
            drawerIcon: ({color, size}) => {
              return (
                <FoundationIcon name="graph-trend" color={color} size={20} />
              );
            },
          }}
        />
        <Drawer.Screen
          name="sales_report"
          component={SalesReport}
          options={{
            headerShown: false,
            drawerLabel: 'Sales Report',
            drawerIcon: ({color, size}) => {
              return (
                <FontAwesome5 name="clipboard-list" color={color} size={20} />
              );
            },
          }}
        />
        <Drawer.Screen
          name="sales_report_2"
          component={SalesReport}
          options={{
            headerShown: false,
            drawerLabel: 'Sales Report (No Disc)',
            drawerIcon: ({color, size}) => {
              return (
                <FontAwesome5 name="clipboard-list" color={color} size={20} />
              );
            },
          }}
        />
        <Drawer.Screen
          name="sales_analyst_report"
          component={SalesAnalystReport}
          options={{
            headerShown: false,
            drawerLabel: 'Sales Analyst Report',
            drawerIcon: ({color, size}) => {
              return <Ionicons name="analytics" color={color} size={20} />;
            },
          }}
        />
        <Drawer.Screen
          name="sales_analyst_report_2"
          component={SalesAnalystReport}
          options={{
            headerShown: false,
            drawerLabel: 'Sales Analyst Report (No Disc)',
            drawerIcon: ({color, size}) => {
              return <Ionicons name="analytics" color={color} size={20} />;
            },
          }}
        />
        <Drawer.Screen
          name="cash_drawer_report"
          component={CashDrawerReport}
          options={{
            headerShown: false,
            drawerLabel: 'Cash Drawer Report',
            drawerIcon: ({color, size}) => {
              return (
                <MaterialCommunityIcon
                  name="cash-multiple"
                  color={color}
                  size={20}
                />
              );
            },
          }}
        />
      </Drawer.Navigator>
    );
  };

  return (
    <Stack.Navigator
      initialRouteName={'splash'}
      detachInactiveScreens={false}>
      <Stack.Screen
        name="splash"
        component={Splash}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="auth"
        component={Auth}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="dashboard"
        component={Drawers}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="barcode_scanner"
        component={BarcodeScanner}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
