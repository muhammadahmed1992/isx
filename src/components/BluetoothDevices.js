import React, { useEffect, useState } from 'react';
import { View, Text, Switch, StyleSheet, ScrollView, Platform, Linking } from 'react-native';
import { NativeModules, Platform } from 'react-native';

const { BluetoothSettings } = NativeModules;

//Services
import BluetoothService from '../services/BluetoothService';

//Custom components
import Loader from '../components/loader';
import Button from './reportsComponents/Button';
import CustomAlert from '../components/AlertComponent';

//Redux from store
import { useDispatch, useSelector } from 'react-redux';
import { Colors, Fonts } from '../utils';

const BluetoothDevices = () => {
    // Component specific state variables
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [loading, setLoading] = useState(false);
    const [printers, setPrinters] = useState([]);

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

    const loadPrinters = async () => {
        try {
            setLoading(true);
            // Check and request Bluetooth permissions
            const hasPermission = await BluetoothService.requestBluetoothPermissions();
            console.log(`permissiosn: ${hasPermission}`);
            if (!hasPermission) {
                showCustomAlert(others["bluetooth_is_off"], others["allow_bluetooth_permission"]);
                return;
            }

            // Check if Bluetooth is enabled
            const isBluetoothEnabled = await BluetoothService.isBluetoothEnabled();
            if (!isBluetoothEnabled) {
                showCustomAlert(others["bluetooth_is_off"], others["turn_on_bluetooth"]);
                return;
            } else {
                showCustomAlert(others["bluetooth_on"], others["bluetooth_connected_success"]);
            }

            // Call the service method
            const scannedDevices = await BluetoothService.scanBluetoothDevices();
            console.log(scannedDevices);
            if (scannedDevices && scannedDevices.length > 0) {
                setPrinters(scannedDevices);
            } else {
                showCustomAlert(others["no_device_found"], others["no_device_found_bluetooth"]);
            }
        } catch (error) {
            console.error('Scan failed:', error);
            showCustomAlert(others["failed_scan"], others["unable_to_scan"]);
        } finally {
            setLoading(false);
        }
    };

    const showCustomAlert = (title, message) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertVisible(true);
    };

    const onOkAlert = () => {
        setLoading(false);
        setAlertVisible(false);
    }
    const handleToggle = (device) => {
        console.log(device);

        // If it is already paired then switch it. Otherwise open up the pairing settings...
        if (enableDisablePairingSwitch()) {
            return;
        }

        if (device.address === selectedAddress) {
            setSelectedAddress(null);
            return;
        }
        console.log(`before platform:  ${device.isPaired}`);
        if (!device.isPaired) {
            openBluetoothSettings();
        }
        // try {
        //     await BluetoothService.connectToPrinter(device.address);
        //     setSelectedAddress(device.address);
        //     showCustomAlert(others["connected"], "");
        //     //others["connected_device"].replace("{printerName}", device.name));
        // } catch (err) {
        //     showCustomAlert(others["connection_error"], others["connection_error_detail"]);
        //     setSelectedAddress(null);
        //     console.error(err);
        // }
    };

    const openBluetoothSettings = () => {
        if (Platform.OS === 'android') {
            BluetoothSettings.openBluetoothSettings();
        }
    };

    const enableDisablePairingSwitch = () => {

        const pairedPrinter = printers.find((p) => p.isPaired) || {};

        if (pairedPrinter?.address === selectedAddress) {
            setSelectedAddress(device.address);
            return true;
        }
        return false;
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
                    {printers.map((device) => (
                        <View key={device.address} style={styles.row}>
                            <Text style={[styles.cell, styles.boldText]}>{device.name}</Text>
                            <Text style={[styles.cell, styles.boldText]}>{device.isPaired ? others["paired"] : others["un_paired"]}</Text>
                            <View style={styles.cell}>
                                <Switch
                                    value={device.address === selectedAddress}
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
