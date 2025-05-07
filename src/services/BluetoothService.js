import { PermissionsAndroid, Platform, Alert } from 'react-native';
import BluetoothPrinter, { BluetoothManager } from 'tp-react-native-bluetooth-printer';

class BluetoothService {
  static async requestBluetoothPermissions() {
    const sdk = Platform.constants?.Release || '30'; // fallback to string SDK version
    const permissions = [];

    if (Platform.OS === 'android') {
      permissions.push(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);

      if (parseInt(sdk) >= 31) {
        permissions.push(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
        );
      }

      try {
        const granted = await PermissionsAndroid.requestMultiple(permissions);
        const allGranted = Object.values(granted).every(
          value => value === PermissionsAndroid.RESULTS.GRANTED
        );

        if (!allGranted) {
          Alert.alert('Permission Required', 'Please allow all Bluetooth permissions');
        }

        return allGranted;
      } catch (err) {
        console.warn('Permission error:', err);
        Alert.alert('Permission Error', 'Failed to request Bluetooth permissions.');
        return false;
      }
    }

    return true;
  }

  static async getPairedPrinters() {
    try {
      const printers = await BluetoothPrinter.getBluetoothDeviceList();
      return printers; // [{ name, address }]
    } catch (err) {
      console.warn('Error listing printers:', err);
      Alert.alert('Bluetooth Error', 'Failed to list Bluetooth printers.');
      return [];
    }
  }

  static async connectToPrinter(address) {
    try {
      await BluetoothPrinter.connectPrinter(address);
      return true;
    } catch (err) {
      console.warn('Connection failed:', err);
      Alert.alert('Connection Failed', 'Could not connect to printer.');
      return false;
    }
  }

  static async printText(text) {
    try {
      await BluetoothPrinter.printText(text);
      return true;
    } catch (err) {
      console.warn('Print failed:', err);
      Alert.alert('Print Failed', 'Could not print to the selected printer.');
      return false;
    }
  }

  static async scanBluetoothDevices() {
    try {
      const devices = await BluetoothManager.scanDevices(); // Expected to return { paired, found }

      if (!devices) return [];

      let parsedDevices = [];
      if (typeof devices === 'string') {
        parsedDevices = JSON.parse(devices);
      }

      const paired = parsedDevices?.paired || [];
      const found = parsedDevices?.found || [];

      const allDevices = { pair: paired, notPair: found };

      return allDevices;
    } catch (err) {
      console.error('Scan failed:', err);
      Alert.alert('Bluetooth Error', 'Failed to scan for Bluetooth devices.');
      return {};
    }
  }

  static async isBluetoothEnabled() {
    const isBluetoothEnabled = await BluetoothManager.isBluetoothEnabled();
    return isBluetoothEnabled;
  }
}

export default BluetoothService;
