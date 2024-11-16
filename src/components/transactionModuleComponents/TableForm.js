import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux'; // To get the isRegistered flag
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {Colors, Fonts, Commons} from '../../utils';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import InputComponent from '../InputComponent';
import CustomAlert from '../AlertComponent';
import InputField from '../reportsComponents/InputField';
import ModalComponent from '../reportsComponents/Model';

const TableForm = ({
  navigation,
  data,
  setTableFormData,
  handleBarcodeRead,
  tax,
  headers,
  stockCodes,
  setTotal,
  isNotStock,
  isNotPos
}) => {
  const [tableData, setTableData] = useState(data);
  const [stockCodeModal, setStockCodeModal] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false); // Custom alert visibility
  const [alertMessage, setAlertMessage] = useState(''); // Custom alert message
  const [alertTitle, setAlertTitle] = useState(''); // Custom alert title
  const [stockCode, setStockCode] = useState('');
  const menu = useSelector(state => state.Locale.menu);

  const isRegistered = useSelector(state => state.Auth.isRegistered);

  const showCustomAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const calculateAmount = (price, qty, tax = 0) => {
    return (
      parseInt(price) * parseInt(qty) +
      (tax / 100) * (parseInt(price) * parseInt(qty))
    );
  };

  useEffect(() => {
    console.log(stockCodes.map(stock => Object.values(stock)[0]));
  })

  useEffect(() => {
    setTableData(data);
  }, [tableData, data]);

  const handleQtyChange = (index, qty) => {
    const newData = [...data];
    newData[index].qty = qty ? qty : '0'; // Ensure qty is valid
    setTableData(newData);
    setTableFormData(newData);
  };

  const handleAddItem = item => {
    if (tableData.length >= 5 && !isRegistered) {
      showCustomAlert(menu['limit'], menu['limit_error']);
      return;
    }
    handleBarcodeRead(item);
  };

  const handleDeleteItem = index => {
    const newData = [...tableData];
    newData.splice(index, 1); // Remove the item at the given index
    setTableData(newData);
    setTableFormData(newData);
  };

  const handlePriceChange = (index, price) => {
    const newData = [...data];
    newData[index].price = price ? price : '0'; 
    setTableData(newData);
    setTableFormData(newData);
  };
  
  const renderRow = (item, index) => {
    return (
      <View key={index} style={styles.row}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteItem(index)}
        >
          <FontAwesome5Icon name="trash" size={20} color={Colors.black} />
        </TouchableOpacity>
        <Text style={[styles.cell, styles.cellText]}>
          {item.stock_id_header}
          {'\n'}
          {item.stock_name}
        </Text>
        
        {isNotStock && (
        isNotPos ? (
          <TextInput
            style={[styles.cell, styles.cellNumber, styles.input]}
            keyboardType="numeric"
            value={Commons.formatCommaSeparated(item.price)}
            onChangeText={text => handlePriceChange(index, Commons.removeCommas(text))}
          />
        ) : (
          <Text style={[styles.cell, styles.cellNumber, styles.cellPrice]}>
            {Commons.formatNumber(item.price)}
          </Text>
        )
      )}
  
        <TextInput
          style={[styles.cell, styles.cellNumber, styles.input, styles.cellQty]}
          keyboardType="numeric"
          value={Commons.formatCommaSeparated(item.qty)}
          onChangeText={text => handleQtyChange(index, Commons.removeCommas(text))}
        />
  
        {isNotStock && (
          <Text style={[styles.cell, styles.cellNumber]}>
            {Commons.formatNumber(calculateAmount(item.price, item.qty))}
          </Text>
        )}
      </View>
    );
  };
  

  const totalQuantity = tableData.reduce(
    (total, item) => total + parseInt(item.qty || 0),
    0,
  );
  const totalAmount = tableData.reduce(
    (total, item) =>
      total +
      calculateAmount(item.price, item.qty, item.taxable === 1 ? tax : 0),
    0,
  );
  setTotal(totalAmount);

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          alignContent: 'center',
        }}>
        <TouchableOpacity
          style={{
            width: '90%',
            backgroundColor: Colors.primary,
            paddingHorizontal: 25,
            paddingVertical: 15,
            borderRadius: 4,
            alignItems: 'center',
            marginVertical: 15,
          }}
          onPress={async () => {
            const permissionsGranted = await Commons.checkPermissions();
            if (!permissionsGranted) {
              showToast('Camera permission is required');
            } else {
              const currentScreen =
                navigation.getState().routeNames[navigation.getState().index]; 
              Commons.navigate(navigation, 'barcode_scanner', {
                onBarcodeRead: handleAddItem,
                returnScreen: currentScreen, 
              });
            }
          }}>
          <Text
            style={{
              fontFamily: Fonts.family.bold,
              color: Colors.white,
              textAlign: 'center',
            }}>
            {menu['scan_barcode']}
          </Text>
        </TouchableOpacity>
        <View style={{marginBottom: 10, width: '100%'}}>
          <InputComponent
            value={''}
            placeholder={menu['enter_stock_id']}
            debounceEnabled={false}
            icon={true}
            isUpperCase={true}
            iconComponent={
              <FontAwesome5Icon name="plus" size={20} color={Colors.primary} />
            }
            onIconPress={text => handleAddItem(text)}
          />
          <InputField
          enabled={true}
          iconName={'search'}
          iconColor={Colors.primary}
          iconSize={20}
          onPress={() => {
            setStockCodeModal(true);
          }}
          onIconPress={() => {
            handleAddItem(stockCode);
          }}
          placeholder={`${menu['search']} ${menu['stock_code']}`}
          value={stockCode}
        />
          <ModalComponent
                isVisible={stockCodeModal}
                onClose={() => setStockCodeModal(false)}
                items={stockCodes.map(stock => Object.values(stock)[0])}
                onItemSelect={selectedValue => {
                  const key = stockCodes.find(item => Object.values(item)[0] === selectedValue);
                  const stockCodeKey = key ? Object.keys(key)[0] : null; // Extract the key if it exists
                  console.log(stockCodeKey); // Log the key
                  if (stockCodeKey) {
                    setStockCode(stockCodeKey); // Set the key in stockCode
                  }
                  setStockCodeModal(false);
                }}
              />
        </View>
      </View>
      <View style={{alignSelf: 'center'}}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            <View style={[styles.row, styles.header]}>
              <Text style={[styles.cell, styles.headerText]}>
                {headers['item_header']}
              </Text>
              {isNotStock && (
                <Text
                  style={[
                    styles.cell,
                    styles.headerText,
                    styles.cellText,
                    styles.cellPrice,
                  ]}>
                  {headers['price_header']}
                </Text>
              )}
              <Text
                style={[
                  styles.cell,
                  styles.headerText,
                  styles.cellNumber,
                  styles.cellQty,
                ]}>
                {headers['qty_header']}
              </Text>
              {isNotStock && (
                <Text
                  style={[styles.cell, styles.headerText, styles.cellNumber]}>
                  {headers['amount_header']}
                </Text>
              )}
            </View>

            {tableData.map(renderRow)}

            <View style={[styles.row, styles.totalRow]}>
              <Text
                style={[
                  styles.cell,
                  styles.headerText,
                  styles.cellText,
                  {textAlign: 'center'},
                ]}>
                {tableData.length}
              </Text>
              {isNotStock && (
                <Text
                  style={[
                    styles.cell,
                    styles.headerText,
                    styles.cellNumber,
                    styles.cellPrice,
                  ]}></Text>
              )}
              <Text
                style={[
                  styles.cell,
                  styles.headerText,
                  styles.cellNumber,
                  styles.cellQty,
                ]}>
                {Commons.formatNumber(totalQuantity)}
              </Text>
              {isNotStock && (
                <Text
                  style={[styles.cell, styles.headerText, styles.cellNumber]}>
                  {Commons.formatNumber(totalAmount)}
                </Text>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
      <CustomAlert
        visible={alertVisible}
        onOkPress={() => setAlertVisible(false)}
        title={alertTitle}
        message={alertMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    alignItems: 'center', // Align items in the center vertically
  },
  cellQty: {
    width: 90,
    textAlign: 'center',
  },
  cellID: {
    textAlign: 'left',
  },
  cellPrice: {
    textAlign: 'left',
  },
  cell: {
    width: 120,
    marginHorizontal: 4,
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
    paddingLeft: 32
  },
  headerText: {
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    color: Colors.black,
    borderColor: '#ccc',
    textAlign: 'center',
    padding: 5,
  },
  totalRow: {
    backgroundColor: '#e6e6e6',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingLeft: 32
  },
  deleteButton: {
    paddingHorizontal: RFValue(6),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TableForm;
