import { BluetoothManager } from 'tp-react-native-bluetooth-printer';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import BluetoothSerial from 'react-native-bluetooth-serial-next';
import { Buffer } from 'buffer';

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
      await BluetoothSerial.connect(printer.address);

      const commands = [
        0x1b, 0x40, // init
        ...Buffer.from('Hello from RN\r\n', 'ascii'),
        0x1d, 0x56, 0x42, 0x00, // cut
      ];

      await BluetoothSerial.write(Buffer.from(commands));
      await BluetoothSerial.disconnect();
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
    return isBluetoothEnabled;
  }

  static async enableBluetooth() {
    const enabled = await this.isBluetoothEnabled();
    if (enabled) return true;
  }
}

export default BluetoothService;
