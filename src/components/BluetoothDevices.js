import React, { useEffect, useState } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView, AppState, Linking } from 'react-native';

//Services
import BluetoothService from '../services/BluetoothService';
import { BleManager } from 'react-native-ble-plx';

//Custom components
import Loader from '../components/loader';
import Button from './reportsComponents/Button';
import CustomAlert from '../components/AlertComponent';

//Redux from store
import { useDispatch, useSelector } from 'react-redux';
import { Colors, Fonts } from '../utils';

//Importing methods from Printer Slice..

import { setPrinterNameAndAddress } from '../redux/reducers/printer-receiptSlice';
const manager = new BleManager();
const BluetoothDevices = () => {
    // Component specific state variables
    const [selectedAddress, setSelectedAddress] = useState([]);
    const [loading, setLoading] = useState(false);
    const [printers, setPrinters] = useState(new Map());

    // Customer Alert State variables
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertTitle, setAlertTitle] = useState('');

    // State from Redux
    const dispatch = useDispatch();
    const others = useSelector(state => state.Locale.others);

    useEffect(() => {
        loadPrinters();
    }, []);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', async (nextAppState) => {
            if (nextAppState === 'active') {
                await loadPrinters();
            }
        });

        return () => {
            subscription.remove();
        };
    }, []);

    const loadPrinters = async () => {
        try {
            setLoading(true);
            // Check and request Bluetooth permissions
            const hasPermission = await BluetoothService.requestBluetoothPermissions();
            if (!hasPermission) {
                showCustomAlert(others["bluetooth_is_off"], others["allow_bluetooth_permission"]);
                setLoading(false);
                return;
            }

            // Check if Bluetooth is enabled
            const isBluetoothEnabled = await BluetoothService.isBluetoothEnabled();
            if (!isBluetoothEnabled) {
                showCustomAlert(others["bluetooth_is_off"], others["turn_on_bluetooth"]);
                setLoading(false);
                return;
            }
            setLoading(false);
            await scanDevices();
        } catch (error) {
            console.error('Scan failed:', error);
            showCustomAlert(others["failed_scan"], others["unable_to_scan"]);
        } finally {
            setLoading(false);
        }
    };

    const scanDevices = async () => {
        // Call the service method
        setLoading(true);
        const scannedDevices = await BluetoothService.scanBluetoothDevices();
        if (scannedDevices && scannedDevices.length > 0) {
            setPrinters(scannedDevices);
            enableDisablePairingSwitch(scannedDevices);
        } else {
            showCustomAlert(others["no_device_found"], others["no_device_found_bluetooth"]);
            setPrinters([]);
        }
        setLoading(false);
    }

    const showCustomAlert = (title, message) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertVisible(true);
    };

    const onOkAlert = () => {
        setAlertVisible(false);
    }
    const handleToggle = async (device) => {
        console.log(device);
        openBluetoothSettings();
    };

    const openBluetoothSettings = () => {
        Linking.sendIntent("android.settings.BLUETOOTH_SETTINGS");
    };

    const enableDisablePairingSwitch = (scannedP) => {
        const pairedPrinter = scannedP.filter((p) => p.isPaired) || [];
        if (pairedPrinter?.length > 0) {
            setSelectedAddress(pairedPrinter.map((a) => a.address));
            setPairedPrinterToStore(pairedPrinter);
        } else {
            setSelectedAddress([]);
            setPairedPrinterToStore([]);
        }
    }

    const setPairedPrinterToStore = (printer) => {
        dispatch(setPrinterNameAndAddress(printer));
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>{others["select_bluetooth_devices"]}</Text>
            <Button
                onPress={loadPrinters}
                title={others["refresh"]}
                buttonStyle={{
                    padding: 15,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 4,
                    flex: 0.65,
                    backgroundColor: Colors.primary,
                }}
                textStyle={{
                    fontFamily: Fonts.family.bold,
                    color: Colors.white,
                    textAlign: 'center',
                }}
            />
            {loading ? (
                <Loader />
            ) : (
                <View style={styles.table}>
                    {/* Header */}
                    <View style={[styles.row, styles.headerRow]}>
                        <Text style={[styles.cell, styles.boldText]}>{others["device_name"]}</Text>
                        <Text style={[styles.cell, styles.boldText]}>{others["pairing_status"]}</Text>
                        <Text style={[styles.cell, styles.boldText]}>{others["device_selected"]}</Text>
                    </View>

                    {/* Device rows */}
                    {printers?.length > 0 && printers.map((device) => (
                        <View key={device.address || device.name} style={styles.row}>
                            <Text style={[styles.cell, styles.boldText]}>{device.name || others["unknown_device"]}</Text>
                            <Text style={[styles.cell, styles.boldText]}>{device.isPaired ? others["paired"] : others["un_paired"]}</Text>
                            <View style={styles.cell}>
                                <Switch
                                    value={selectedAddress?.includes(device.address)}
                                    onValueChange={() => handleToggle(device)}
                                />
                            </View>
                        </View>
                    ))}

                    {printers.length === 0 && (
                        <Text style={styles.emptyText}>{others["no_device_found"]}</Text>
                    )}
                </View>
            )}
            <CustomAlert
                visible={alertVisible}
                onOkPress={onOkAlert}
                title={alertTitle}
                message={alertMessage}
            />
        </ScrollView>
    );
};

export default BluetoothDevices;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 10,
    },
    refreshButton: {
        backgroundColor: '#007bff',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
        alignSelf: 'flex-start',
        marginBottom: 12,
    },
    refreshText: {
        color: '#fff',
        fontSize: 14,
    },
    table: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        backgroundColor: '#f9f9f9',
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    headerRow: {
        backgroundColor: '#e6e6e6',
    },
    cell: {
        flex: 1,
        padding: 12,
        justifyContent: 'center',
    },
    boldText: {
        fontWeight: 'bold',
    },
    emptyText: {
        padding: 10,
        textAlign: 'center',
        color: '#888',
    },
});
