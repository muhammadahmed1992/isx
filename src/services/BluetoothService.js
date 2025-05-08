import BluetoothPrinter, { BluetoothManager } from 'tp-react-native-bluetooth-printer';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';

class BluetoothService {
  static async requestBluetoothPermissions() {
    try {
      const state = await BluetoothStateManager.getState();
      if (state !== 'PoweredOn') {
        const bleStatus = await BluetoothStateManager.requestToEnable();
        return bleStatus;
      }
      return state === 'PoweredOn' ? true : false;
    } catch (e) {
      console.err(e);
    }
  }

  static async getPairedPrinters() {
    try {
      const printers = await BluetoothPrinter.getBluetoothDeviceList();
      return printers;
    } catch (err) {
      console.error('Error listing printers:', err);
      return [];
    }
  }

  static async connectToPrinter(address) {
    try {
      await BluetoothPrinter.BluetoothManager.connect(address);
      return true;
    } catch (err) {
      console.error('Connection failed:', err);
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
      const devices = await BluetoothManager.scanDevices();
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
      console.error('Scan failed:', err);
      return [];
    }
  }

  static async isBluetoothEnabled() {
    const isBluetoothEnabled = await BluetoothManager.isBluetoothEnabled();
    console.log(`Bluetooth on : ${isBluetoothEnabled}`);
    return isBluetoothEnabled;
  }

  static async enableBluetooth() {
    const enabled = await this.isBluetoothEnabled();
    if (enabled)
      return true;
    const res = await BluetoothManager.enableBluetooth();
    console.log('enabled bluetooth: ' + res);
  }
}

export default BluetoothService;
