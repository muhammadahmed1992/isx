import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'; // To get the isRegistered flag
import { ScrollView, StyleSheet, Text, TextInput, View, TouchableOpacity, Alert } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors, Fonts, Commons } from '../../utils';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import InputComponent from '../InputComponent';

const TableForm = ({ navigation, data, setTableFormData, handleBarcodeRead, tax, headers, setTotal, isNotStock }) => {
  const [tableData, setTableData] = useState(data);
  const [loading, setLoading] = useState(false);

  // Get the isRegistered flag from Redux
  const isRegistered = useSelector(state => state.Auth.isRegistered);

  const calculateAmount = (price, qty, tax = 0) => {
    return (parseInt(price) * parseInt(qty)) + ((tax / 100) * ((parseInt(price) * parseInt(qty))));
  };

  useEffect(() => {
    setTableData(data);
  }, [tableData, data]);

  const handleQtyChange = (index, qty) => {
    const newData = [...tableData];
    newData[index].qty = qty ? qty : '0';  // Ensure qty is valid
    setTableData(newData);
    setTableFormData(newData);
  };

  const formatNumber = (number) => {
    return parseInt(number).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleAddItem = (item) => {
    if (tableData.length >= 3 && !isRegistered) {
      Alert.alert('Limit reached', 'You cannot add more than 3 items.');
      return;
    }
    handleBarcodeRead(item);
  };

  const renderRow = (item, index) => {
    return (
      <View key={index} style={styles.row}>
        <Text style={[styles.cell, styles.cellNumber, styles.cellID]}>{index + 1}</Text>
        <Text style={[styles.cell, styles.cellText]}>
          {item.stock_id_header}{'\n'}
          {item.stock_name}
        </Text>
        {isNotStock && <Text style={[styles.cell, styles.cellNumber, styles.cellPrice]}>{formatNumber(item.price)}</Text> }

        <TextInput
          style={[styles.cell, styles.cellNumber, styles.input, styles.cellQty]}
          keyboardType="numeric"
          value={item.qty}
          onChangeText={(text) => handleQtyChange(index, text)}  // Update qty
        />

        {isNotStock && <Text style={[styles.cell, styles.cellNumber]}>
          {formatNumber(calculateAmount(item.price, item.qty))}
        </Text>}
      </View>
    );
  };

  const totalQuantity = tableData.reduce((total, item) => total + parseInt(item.qty || 0), 0);
  const totalAmount = tableData.reduce((total, item) => total + calculateAmount(item.price, item.qty, item.taxable === 1 ? tax : 0), 0);
  setTotal(totalAmount);

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, flexDirection: 'column', justifyContent: "space-between", alignItems: "center", alignContent: 'center' }}>
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
                        //   const permissionsGranted = await Commons.checkPermissions();
            // if (!permissionsGranted) {
            //   showToast('Camera permission is required');
            // } else {
            //   Commons.navigate(navigation, 'barcode_scanner', {
            //     onBarcodeRead: handleBarcodeRead,
            //     returnScreen: 'search',
            //   });
            // }
              function getRandomItem() {
                const items = [
                  'HARD-1', 'HARD-2', 'HARD-3',
                  'MONI-1', 'MONI-2', 'MONI-3',
                  'KEYB-1', 'KEYB-2', 'KEYB-3'
                ];
                const randomIndex = Math.floor(Math.random() * items.length);
                return items[randomIndex];
              }
              handleAddItem(getRandomItem());
          }}>
          <Text style={{
            fontFamily: Fonts.family.bold,
            color: Colors.white,
            textAlign: 'center',
          }}>
            Scan Barcode
          </Text>
        </TouchableOpacity>
        <View style={{ marginBottom: 10, width: "100%" }}>
          <InputComponent placeholder={'Enter Stock ID'} debounceEnabled={false} icon={true} iconComponent={<FontAwesome5Icon name="plus" size={20} color={Colors.primary} />} onIconPress={text => handleBarcodeRead(text)} />
        </View>
      </View>
      <View style={{alignSelf: 'center'}}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <View style={[styles.row, styles.header]}>
            <Text style={[styles.cell, styles.headerText, styles.cellID]}>{headers['id']}</Text>
            <Text style={[styles.cell, styles.headerText]}>{headers['item_header']}</Text>
           {isNotStock && <Text style={[styles.cell, styles.headerText, styles.cellText, styles.cellPrice]}>{headers['price_header']}</Text>}
            <Text style={[styles.cell, styles.headerText, styles.cellNumber, styles.cellQty]}>{headers['qty_header']}</Text>
            {isNotStock && <Text style={[styles.cell, styles.headerText, styles.cellNumber]}>{headers['amount_header']}</Text> }
          </View>

          {tableData.map(renderRow)}

          <View style={[styles.row, styles.totalRow]}>
            <Text style={[styles.cell, styles.headerText, styles.cellText, styles.cellID]}>Total</Text>
            <Text style={[styles.cell, styles.headerText, styles.cellText, {textAlign: 'center'}]}>{tableData.length}</Text>
          {isNotStock && <Text style={[styles.cell, styles.headerText, styles.cellNumber, styles.cellPrice]}></Text>}
            <Text style={[styles.cell, styles.headerText, styles.cellNumber, styles.cellQty]}>{formatNumber(totalQuantity)}</Text>
          {isNotStock && <Text style={[styles.cell, styles.headerText, styles.cellNumber]}>{formatNumber(totalAmount)}</Text>}
          </View>
        </View>
      </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    width: '100%'
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  cellQty: {
    width: 50,
    textAlign: 'center'
  },
  cellID: {
    width: 75,
    textAlign: 'left'
  },
  cellPrice: {
    width: 75,
    textAlign: 'left'
  },
  cell: {
    width: 90,
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
