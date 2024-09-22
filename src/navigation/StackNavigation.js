import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from '../components/CustomDrawer';
import { Fonts } from '../utils';
import BarcodeScanner from '../screens/BarcodeScanner';
import { Splash, Auth } from '../screens';


import { useSelector } from 'react-redux';
import {reportConfig, administrationConfig, transactionModuleConfig} from '../helper/routeConfig';

export default function StackNavigation() {
  const Stack = createStackNavigator();

  const Drawers = () => {
    const Drawer = createDrawerNavigator();
    const reportPermissions = useSelector(state => state.Menu.reports);
    const administrationPermissions = useSelector(state => state.Menu.administration);
    const transactionModulePermissions = useSelector(state => state.Menu.transactionModule);

    const filteredReportScreens = Object.values(reportConfig);
    const reportConditionScreens = Object.values(reportPermissions);

    const filteredAdministrationScreens = Object.values(administrationConfig);
    const administrationConditionScreens = Object.values(administrationPermissions);

    const filtereredTransactionModuleScreens = Object.values(transactionModuleConfig);
    const transactionModuleConditionScreens = Object.values(transactionModulePermissions);

    const reportScreens = filteredReportScreens.filter((item) => {
      return reportConditionScreens.find((val) => val.id == item.id)?.condition
    });
    const administrationScreens = filteredAdministrationScreens.filter((item) => {
      return administrationConditionScreens.find((val) => val.id == item.id)?.condition
    });
    const transactionModuleScreens = filtereredTransactionModuleScreens.filter((item) => {
      return transactionModuleConditionScreens.find((val) => val.id == item.id)?.condition
    })

    const menu = useSelector(state => state.Locale.menu);


    return (
      <Drawer.Navigator
        detachInactiveScreens={false}
        drawerContent={props => <CustomDrawer {...props} />}
        screenOptions={{
          headerShown: false,
          drawerLabelStyle: { marginLeft: -25, fontFamily: Fonts.family.bold },
        }}
        initialRouteName="search">
        {administrationScreens.map((screen, index) => (
          <Drawer.Screen
            key={index}
            name={screen.name}
            options={{
              headerShown: false,
              drawerLabel: screen.label,
              drawerIcon: ({ color, size }) => screen.icon(color, size),
              lazy: true,
            }}
            component={screen.component}
            initialParams={{ ...screen.props }}
          />
        ))}
        {transactionModuleScreens.map((screen, index) => (
          <Drawer.Screen
            key={index}
            name={screen.name}
            options={{
              headerShown: false,
              drawerLabel: screen.label,
              drawerIcon: ({ color, size }) => screen.icon(color, size),
              lazy: true,
            }}
            component={screen.component}
            initialParams={{ ...screen.props }}
          />
        ))}
        {reportScreens.map((screen, index) => (
          <Drawer.Screen
            key={index}
            name={screen.name}
            options={{
              headerShown: false,
              drawerLabel: menu[screen.label],
              drawerIcon: ({ color, size }) => screen.icon(color, size),
              lazy: true,
            }}
            component={screen.component}
            initialParams={{ ...screen.props }}
          />
        ))}
      </Drawer.Navigator>
    );
  };

  return (
    <Stack.Navigator initialRouteName={'splash'} detachInactiveScreens={false}>
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
