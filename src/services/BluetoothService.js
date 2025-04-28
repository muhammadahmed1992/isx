import { BleManager } from 'react-native-ble-plx';
import base64 from 'base-64';

const manager = new BleManager();

export const scanAndConnect = async () => {
  return new Promise((resolve, reject) => {
    manager.startDeviceScan(null, null, async (error, device) => {
      if (error) {
        reject(error);
        return;
      }

      if (device?.name?.includes('Printer')) {
        manager.stopDeviceScan();

        try {
          const connectedDevice = await device.connect();
          await connectedDevice.discoverAllServicesAndCharacteristics();

          resolve(connectedDevice);
        } catch (connectError) {
          reject(connectError);
        }
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      reject('No Bluetooth printer found');
    }, 10000);
  });
};

export const printReceipt = async (device, receiptText) => {
  const services = await device.services();
  const service = services[0];

  const characteristics = await service.characteristics();
  const writable = characteristics.find((c) => c.isWritableWithoutResponse);

  if (!writable) throw new Error('No writable characteristic found');

  const encoded = base64.encode(receiptText);

  await device.writeCharacteristicWithoutResponseForService(
    service.uuid,
    writable.uuid,
    encoded
  );
};
