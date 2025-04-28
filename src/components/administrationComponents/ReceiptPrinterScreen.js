import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert, ActivityIndicator,  } from 'react-native';
import { scanAndConnect, printReceipt } from '../../services/BluetoothService';
import ApiService from '../../services/ApiService';
import { Endpoints } from '../../utils';

const ReceiptPrinterScreen = () => {
  const [printer, setPrinter] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    requestBluetoothPermissions();
  }, [])
  async function requestBluetoothPermissions() {
    if (Platform.OS === 'android' && Platform.Version >= 23) {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
  
      const allGranted = Object.values(granted).every(status => status === PermissionsAndroid.RESULTS.GRANTED);
      if (!allGranted) {
        console.warn('Some Bluetooth permissions not granted');
      }
    }
  }
  const connectToPrinter = async () => {
    setLoading(true);
    try {
      const device = await scanAndConnect();
      setPrinter(device);
      Alert.alert('Printer Connected', device.name || 'Unnamed device');
    } catch (error) {
      console.log(error.toString());
      Alert.alert('Error', error.toString());
    }
    setLoading(false);
  };

  const onPrint = async () => {
    if (!printer) {
      Alert.alert('No printer', 'Please connect to a printer first.');
      return;
    }

    try {
      const receiptText = await ApiService.get(Endpoints.getReceipt);
      await printReceipt(printer, receiptText);
      Alert.alert('Success', 'Receipt printed!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        {printer ? `Connected to ${printer.name}` : 'No printer connected'}
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ) : (
        <>
          <Button title="Connect Printer" onPress={connectToPrinter} />
          <View style={{ height: 20 }} />
          <Button title="Print Receipt" onPress={onPrint} disabled={!printer} />
        </>
      )}
    </View>
  );
};

export default ReceiptPrinterScreen;
