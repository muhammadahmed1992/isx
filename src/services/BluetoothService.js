import { BluetoothManager, BluetoothEscposPrinter } from 'tp-react-native-bluetooth-printer';
import { Platform } from 'react-native';
import { requestMultiple, PERMISSIONS, RESULTS } from 'react-native-permissions';

class BluetoothService {
  static async requestBluetoothPermissions() {
    try {
      const sdkVersion = Platform.constants?.Release || '0';
      const sdk = parseInt(sdkVersion, 10);

      const permissions = Platform.select({
        android:
          sdk >= 31
            ? [
              PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
              PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
              PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            ]
            : [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION],
      });

      const statuses = await requestMultiple(permissions || []);
      const allGranted = Object.values(statuses).every(
        status => status === RESULTS.GRANTED
      );

      return allGranted;
    } catch (error) {
      console.error('Permission error:', error);
      return false;
    }
  };
  // static async requestBluetoothPermissions() {
  //   try {
  //     const state = await BluetoothStateManager.getState();
  //     if (state !== 'PoweredOn') {
  //       if (Platform.OS === 'android') {
  //         const granted = await PermissionsAndroid.requestMultiple([
  //           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //           PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
  //           PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
  //           PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
  //         ]);
  //         console.log(`granted: ${JSON.stringify(granted)}`);
  //         if (granted["android.permission.BLUETOOTH_CONNECT"] === "never_ask_again" ||
  //           granted["android.permission.BLUETOOTH_SCAN"] === "never_ask_again"
  //         ) {
  //           // Show alert directing user to settings
  //         }
  //         if (
  //           granted["android.permission.ACCESS_FINE_LOCATION"] !== PermissionsAndroid.RESULTS.GRANTED ||
  //           granted["android.permission.BLUETOOTH_CONNECT"] !== PermissionsAndroid.RESULTS.GRANTED ||
  //           granted["android.permission.BLUETOOTH_SCAN"] !== PermissionsAndroid.RESULTS.GRANTED ||
  //           granted["android.permission.BLUETOOTH_ADVERTISE"] !== PermissionsAndroid.RESULTS.GRANTED
  //         ) {
  //           throw new Error("Required permissions not granted");
  //         }
  //         const bleStatus = await BluetoothStateManager.requestToEnable();
  //         return bleStatus;
  //       }
  //     }
  //     return state === 'PoweredOn' ? true : false;
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }

  static async getPairedPrinters() {
    try {
      const printers = await BluetoothManager.getConnectedDevice();
      return printers;
    } catch (err) {
      console.error('Error listing printers:', err);
      return [];
    }
  }

  static async connectToPrinter(address) {
    try {
      await BluetoothManager.connect(address);
      return true;
    } catch (err) {
      console.error('Connection failed:', err);
      return false;
    }
  }

  static async printText(printer, text) {
    try {
      console.log(`connected: Printer : ${printer.address}`);
      await this.connectToPrinter(printer.address);
      await BluetoothEscposPrinter.printText(text, {});
      //await BluetoothEscposPrinter.printText("\x1D\x56\x00", {});
      console.log(`print success`);
      return true;
    } catch (err) {
      console.error('Print failed:', err);
      return false;
    }
  }

  static async scanBluetoothDevices() {
    try {
      const devices = await BluetoothManager.scanDevices();
      console.log('devices');
      console.log(devices);
      if (!devices) return [];

      let parsedDevices = [];
      if (typeof devices === 'string') {
        parsedDevices = JSON.parse(devices);
      }

      const paired = parsedDevices?.paired || [];
      const found = parsedDevices?.found || [];

      const allDevices = { pair: paired, notPair: found };

      const printers = [];
      for (let sPrinter of allDevices?.pair) {
        printers.push({ name: sPrinter.name, address: sPrinter.address, isPaired: true });
      }
      for (let sPrinter of allDevices?.notPair) {
        printers.push({ name: sPrinter.name, address: sPrinter.address, isPaired: false });
      }
      return printers;
    } catch (err) {
      console.error('Inside BluetoothService.js Scan failed:', err);
      return [];
    }
  }

  static async isBluetoothEnabled() {
    const isBluetoothEnabled = await BluetoothManager.isBluetoothEnabled();
    return isBluetoothEnabled;
  }

  static async enableBluetooth() {
    const enabled = await this.isBluetoothEnabled();
    if (enabled) return true;
  }
}

export default BluetoothService;
