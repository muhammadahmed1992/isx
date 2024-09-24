import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View, Button, TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors, Fonts } from '../../utils';
import Commons from '../../utils';
import InputComponent from '../InputComponent';

const TableForm = ({navigation, data, setTableData}) => {

  const calculateAmount = (price, qty) => {
    return (parseInt(price) * parseInt(qty));
  };

  const handleQtyChange = (index, qty) => {
    const newData = [...data];
    newData[index].qty = qty;
    setTableData(newData);
  };

  const renderRow = (item, index) => {
    return (
      <View key={index} style={styles.row}>
        <Text style={[styles.cell, styles.cellText]}>{item.stockId}</Text>
        <Text style={[styles.cell, styles.cellText]}>{item.stockName}</Text>
        <Text style={[styles.cell, styles.cellNumber]}>{item.price}</Text>

        <TextInput
          style={[styles.cell, styles.cellNumber, styles.input]}
          keyboardType="numeric"
          value={item.qty.toString()}
          onChangeText={(text) => handleQtyChange(index, text)}
        />

        <Text style={[styles.cell, styles.cellNumber]}>
          {calculateAmount(item.price, item.qty)}
        </Text>
      </View>
    );
  };
  // const handleBarcodeRead = async data => {
  //   if (!data) {
  //     setData([]);
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     await ApiService.get(Endpoints.scanBarcode + encodeURIComponent(data))
  //       .then(res => {
  //         setData(res.data.data);
  //         setLoading(false);
  //       })
  //       .catch(err => {
  //         if (typeof err === 'object' && err.code === 404) {
  //           showToast(err.message);
  //         }
  //         setData([]);
  //         setLoading(false);
  //       });
  //   } catch (error) {
  //     if (typeof err === 'object' && err.code === 404) {
  //       showToast(err.message);
  //     }
  //     setLoading(false);
  //     setData([]);
  //   }
  // };
  // Function to add a new item dynamically
  const addItem = () => {
    const newStockId = (data.length + 1).toString().padStart(3, '0'); 
    const newItem = {
      stockId: newStockId,
      stockName: `Item ${String.fromCharCode(65 + data.length)}`, 
      price: (100 + data.length * 50).toString(), 
      qty: '1', 
    };

    setTableData([...data, newItem]);
  };

  const totalQuantity = data.reduce((total, item) => total + parseInt(item.qty), 0);
  const totalAmount = data.reduce((total, item) => total + parseInt(calculateAmount(item.price, item.qty)), 0);

  return (
    <View style={styles.container}>
      <View style={{marginVertical: 10}}><Button title="Add Item" onPress={addItem} /></View>
      <View style={{flex:1, flexDirection:'column', justifyContent:"space-between", alignItems:"center"}}>
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
                const permissionsGranted = await Commons.checkPermissions();
                if (!permissionsGranted) {
                  showToast('Camera permission is required');
                } else {
                  Commons.navigate(navigation, 'barcode_scanner', {
                    onBarcodeRead: handleBarcodeRead,
                    returnScreen: 'search',
                  });
                }
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
          <View style={{marginBottom: 10, width:"100%"}}>
              <InputComponent />
          </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* Header row */}
          <View style={[styles.row, styles.header]}>
            <Text style={[styles.cell, styles.headerText]}>ItemID</Text>
            <Text style={[styles.cell, styles.headerText]}>ItemName</Text>
            <Text style={[styles.cell, styles.headerText]}>Price</Text>
            <Text style={[styles.cell, styles.headerText]}>Qty</Text>
            <Text style={[styles.cell, styles.headerText]}>Amount</Text>
          </View>

          {/* Render each data row */}
          {data.map(renderRow)}

          {/* Total row */}
          <View style={[styles.row, styles.totalRow]}>
            <Text style={[styles.cell, styles.cellText]}>Total</Text>
            <Text style={styles.cell}> {data.length}</Text>
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
    textAlign: 'center',
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
    textAlign: 'center',
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
