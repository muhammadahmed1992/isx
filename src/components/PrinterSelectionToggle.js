import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleScreensPrintingFunctionality } from '../redux/reducers/printer-receiptSlice'


export default function PrinterSelectionToggle() {
    const dispatch = useDispatch();
    const screens = useSelector(state => state.ReceiptPrinter.screens);
    const menu = useSelector(state => state.Locale.menu);

    let options = [];
    for (let k in screens) {
        options.push({
            label: menu[k],
            value: screens[k]
        });
    }

    const handleToggle = (key) => {
        dispatch(toggleScreensPrintingFunctionality({ [key]: !screens[key] }));
    };


    return (
        <View style={styles.container}>
            {Object.entries(screens).map(([key, value]) => (
                <View key={key} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                    <Text>{menu[key] ?? key}</Text>
                    <Switch
                        value={value}
                        onValueChange={() => handleToggle(key)}
                    />
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        marginBottom: 12,
        fontWeight: 'bold',
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    optionLabel: {
        fontSize: 16,
    },
});