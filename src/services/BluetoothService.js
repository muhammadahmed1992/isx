import { BluetoothManager, BluetoothEscposPrinter } from 'tp-react-native-bluetooth-printer';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { PermissionsAndroid, Platform } from 'react-native';

class BluetoothService {
  static async requestBluetoothPermissions() {
    try {
      if (Platform.OS === 'android') {
        const sdk = Platform.constants?.Release ? parseInt(Platform.constants.Release, 10) : 0;
        const version = Platform.Version;

        // Android 12+ (API 31+)
        if (version >= 31) {
          const scanStatus = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            {
              title: 'Bluetooth Scan Permission',
              message: 'App needs permission to scan for Bluetooth devices.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );

          const connectStatus = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            {
              title: 'Bluetooth Connect Permission',
              message: 'App needs permission to connect to Bluetooth devices.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            }
          );

          const locationStatus = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );
          const p = [];
          p.push(scanStatus);
          p.push(connectStatus);
          p.push(locationStatus);
          const status = p.find((per) => per === 'denied' || per === 'never_ask_again');
          console.log(`status: ${status}`);
          if (status) {
            await BluetoothStateManager.openSettings();
            return true;
          }
          // return (
          //   scanStatus === PermissionsAndroid.RESULTS.GRANTED &&
          //   connectStatus === PermissionsAndroid.RESULTS.GRANTED &&
          //   locationStatus === PermissionsAndroid.RESULTS.GRANTED
          // );
        }

        // Android < 12 (API 28–30)
        else {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          );

          return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
      }

      // iOS or other platforms
      return true;
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
