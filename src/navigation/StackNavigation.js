import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from '../components/CustomDrawer';
import { Fonts, Commons } from '../utils';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FoundationIcon from 'react-native-vector-icons/Foundation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import BarcodeScanner from '../screens/BarcodeScanner';
import { Splash, Auth, PriceSearchScreen } from '../screens';
// import PriceSearchScreen from '../screens';

import { useSelector } from 'react-redux';
import routeConfig from '../helper/routeConfig';

// import {
//   SwitchDatabase,
//   PriceSearchScreen,
//   PriceReport,
//   StockReport,
//   SalesReport,
//   SalesAnalystReport,
//   CashDrawerReport,
//   BarcodeScanner,

// } from '../screens';

export default function StackNavigation() {
  const Stack = createStackNavigator();

  const Drawers = () => {
    const Drawer = createDrawerNavigator();
    const routePermissions = useSelector(state => state.Menu);

    // Filter the screens based on the condition in routePermissions
    const filteredScreens = Object.values(routeConfig)
    const conditionsScreens = Object.values(routePermissions)

    const mapper = filteredScreens.filter((item) => {
      return conditionsScreens.find((val) => val.id == item.id)?.condition
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
        {mapper.map((screen, index) => (
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
