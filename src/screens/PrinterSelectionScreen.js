import { View, StyleSheet, } from 'react-native';
import React from 'react';
import { useSelector } from 'react-redux';

import Header from '../components/Header';
import PrinterSelectionToggle from '../components/PrinterSelectionToggle';
import BluetoothDevices from '../components/BluetoothDevices';

const PrinterSelectionScreen = ({ navigation, route }) => {
  // State from Redux
  const menu = useSelector(state => state.Locale.menu);

  return (
    <View style={styles.container}>
      <Header label={menu[route.label]} navigation={navigation} />
      <PrinterSelectionToggle />
      <BluetoothDevices />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
});

export default PrinterSelectionScreen;
