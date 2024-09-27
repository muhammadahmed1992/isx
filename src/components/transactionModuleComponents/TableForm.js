import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View, Button, TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors, Fonts } from '../../utils';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {Commons} from '../../utils';
import InputComponent from '../InputComponent';
import {Endpoints} from '../../utils';
import ApiService from '../../services/ApiService';

const TableForm = ({ navigation, data, handleBarcodeRead }) => {
  const [tableData, setTableData] = useState(data);
  const [loading, setLoading] = useState(false);

  const calculateAmount = (price, qty) => {
    return parseInt(price) * parseInt(qty);
  };

  const handleQtyChange = (index, qty) => {
    const newData = [...tableData];
    newData[index].qty = qty;
    setTableData(newData);
  };

  useEffect(() => {
    setTableData(data);
  })

  const renderRow = (item, index) => {
    return (
      <View key={index} style={styles.row}>
        {/* ID Column */}
        <Text style={[styles.cell, styles.cellNumber, {textAlign: 'left'}]}>{index + 1}</Text>
        {/* Stock ID and Stock Name in the same cell */}
        <Text style={[styles.cell, styles.cellText]}>
          {item.stock_id_header}{'\n'}
          {item.stock_name}
        </Text>
        <Text style={[styles.cell, styles.cellNumber]}>{item.price}</Text>

        <TextInput
          style={[styles.cell, styles.cellNumber, styles.input]}
          keyboardType="numeric"
          value={item.qty}
          onChangeText={(text) => handleQtyChange(index, text)}
        />

        <Text style={[styles.cell, styles.cellNumber]}>
          {calculateAmount(item.price, item.qty)}
        </Text>
      </View>
    );
  };

  const addItem = () => {
    const newStockId = (tableData.length + 1).toString().padStart(3, '0');
    const newItem = {
      stockId: newStockId,
      stockName: `Item ${String.fromCharCode(65 + tableData.length)}`,
      price: (100 + tableData.length * 50).toString(),
      qty: '1',
    };

    setTableData([...tableData, newItem]);
  };

  const totalQuantity = tableData.reduce((total, item) => total + parseInt(item.qty), 0);
  const totalAmount = tableData.reduce((total, item) => total + calculateAmount(item.price, item.qty), 0);

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: "space-between", alignItems: "center" }}>
        <TouchableOpacity
          style={{
            width: "90%",
            backgroundColor: Colors.primary,
            paddingHorizontal: 25,
            paddingVertical: 15,
            borderRadius: 4,
            alignItems: 'center',
            marginVertical: 15,
          }}
          onPress={async () => {
            try {
              // const permissionsGranted = await Commons.checkPermissions();
              // if (!permissionsGranted) {
              //   showToast('Camera permission is required');
              // } else {
              //   Commons.navigate(navigation, 'barcode_scanner', {
              //     onBarcodeRead: handleBarcodeRead,
              //     returnScreen: 'search',
              //   });
              //  }
              function getRandomItem() {
                const items = [
                    'HARD-1',
                    'HARD-2',
                    'HARD-3',
                    'MONI-1',
                    'MONI-2',
                    'MONI-3',
                    'KEYB-1',
                    'KEYB-2',
                    'KEYB-3'
                ];
            
                // Generate a random index based on the length of the items array
                const randomIndex = Math.floor(Math.random() * items.length);
            
                // Return the randomly selected item
                return items[randomIndex];
            }
              handleBarcodeRead(getRandomItem());
            } catch (error) {
              console.error(error);
            }
          }}>
          <Text
            style={{
              fontFamily: Fonts.family.bold,
              color: Colors.white,
              textAlign: 'center',
            }}>
            Scan Barcode
          </Text>
        </TouchableOpacity>
        <View style={{ marginBottom: 10, width: "100%" }}>
          <InputComponent debounceEnabled={false} icon={true} iconComponent={<FontAwesome5Icon name="plus" size={20} color={Colors.primary} />} onIconPress={text=>handleBarcodeRead(text)} />
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* Header row */}
          <View style={[styles.row, styles.header]}>
            <Text style={[styles.cell, styles.headerText]}>ID</Text>
            <Text style={[styles.cell, styles.headerText]}>Item</Text>
            <Text style={[styles.cell, styles.headerText, styles.cellNumber]}>Price</Text>
            <Text style={[styles.cell, styles.headerText, styles.cellNumber]}>Qty</Text>
            <Text style={[styles.cell, styles.headerText, styles.cellNumber]}>Amount</Text>
          </View>

          {/* Render each data row */}
          {tableData.map(renderRow)}

          {/* Total row */}
          <View style={[styles.row, styles.totalRow]}>
            <Text style={[styles.cell, styles.cellText]}>Total</Text>
            <Text style={styles.cell}> {tableData.length}</Text>
            <Text style={styles.cell}></Text>
            <Text style={[styles.cell, styles.cellNumber]}>{totalQuantity}</Text>
            <Text style={[styles.cell, styles.cellNumber]}>{totalAmount}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  cell: {
    width: 100,
    paddingHorizontal: RFValue(6),
    paddingVertical: RFValue(6),
  },
  cellText: {
    textAlign: 'left',
  },
  cellNumber: {
    textAlign: 'right',
  },
  header: {
    backgroundColor: '#f2f2f2',
    borderWidth: 1,
    borderColor: '#000',
  },
  headerText: {
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    color: Colors.black,
    borderColor: '#ccc',
    textAlign: 'right',
    padding: RFValue(5),
  },
  totalRow: {
    backgroundColor: '#e6e6e6',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
});

export default TableForm;
