import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
  Pressable,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {Commons, Colors, Fonts, Endpoints, Images} from '../utils';
import {RFValue} from 'react-native-responsive-fontsize';
import TableComponent from '../components/TableComponent';
import ApiService from '../services/ApiService';
import Loader from '../components/loader';
import Toast from 'react-native-easy-toast';
import SearchableDropDown from '../components/searchableDropdown';
import Modal from 'react-native-modal';
import {useFocusEffect} from '@react-navigation/native';

const StockReport = props => {
  let total = useRef({});
  const toastRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [stockGroup, setStockGroup] = useState('');
  const [warehouse, setWarehouse] = useState('');
  const [data, setData] = useState([]);
  const [stocksModal, setStocksModal] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [warehouseModal, setWarehouseModal] = useState(false);
  const [warehouses, setWarehouses] = useState([]);

  useEffect(() => {
    fetchAllStocks();
    fetchAllWarehouses();
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setStockGroup('');
        setWarehouse('');
        setData([]);
      };
    }, []),
  );

  const fetchAllStocks = async () => {
    await ApiService.get(Endpoints.fetchStocks)
      .then(res => {
        const data = res.data.data;
        setStocks(data);
      })
      .catch(err => {
        console.log('Fetch All Stock Groups: ', err);
      });
  };

  const fetchAllWarehouses = async () => {
    await ApiService.get(Endpoints.fetchWarehouses)
      .then(res => {
        const data = res.data.data;
        setWarehouses(data);
      })
      .catch(err => {
        console.log('Fetch All Warehouses: ', err);
      });
  };

  const filter = async () => {
    setLoading(true);

    let query = '';
    if (stockGroup && stockGroup.length) {
      query += `?stockGroup=${encodeURIComponent(
        stocks.find(s => s.cgrpdesc === stockGroup).cgrppk,
      )}`;

      if (warehouse && warehouse.length) {
        query += `&warehouse=${encodeURIComponent(
          warehouses.find(s => s.cwhsdesc === warehouse).cwhspk,
        )}`;
      }
    } else if (warehouse && warehouse.length) {
      query += `?warehouse=${encodeURIComponent(
        warehouses.find(s => s.cwhsdesc === warehouse).cwhspk,
      )}`;
    }

    try {
      await ApiService.get(`${Endpoints.stockReport}${query}`)
        .then(res => {
          let data = res.data.data;
          let lastColumnValue;
          let newData = data.map((obj, index) => {
            let entries = Object.entries(obj);
            if (index === data.length - 1) {
              lastColumnValue = obj['TotalBalance'];
            }
            entries.pop();
            return Object.fromEntries(entries);
          });
          total.current = {Balance: lastColumnValue};
          setData(newData);
          setLoading(false);
        })
        .catch(err => {
          setLoading(false);
          if (err.code && err.code == 404) {
            setData([]);
          } else {
            showToast(typeof err === 'string' ? err : err.message);
          }
        });
    } catch (error) {
      console.error(error);
      showToast(typeof error === 'string' ? error : error.message);
      setLoading(false);
    }
  };

  const showToast = msg => {
    toastRef.current.show(msg, 2000);
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: Colors.primary,
          paddingHorizontal: RFValue(15),
          paddingBottom: RFValue(15),
          paddingTop: Platform.OS === 'android' ? RFValue(15) : RFValue(50),
        }}>
        <TouchableOpacity
          onPress={() => {
            props.navigation.openDrawer();
          }}>
          <Icon name="menu" size={Commons.size(25)} color={Colors.white} />
        </TouchableOpacity>

        <Text
          style={{
            flex: 1,
            fontFamily: Fonts.family.bold,
            color: Colors.white,
            textAlign: 'center',
          }}>
          Stock Report
        </Text>

        <View>
          <Icon name="menu" size={Commons.size(25)} color={Colors.primary} />
        </View>
      </View>

      <Pressable
        onPress={() => setStocksModal(true)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: Colors.primary,
          borderRadius: RFValue(10),
          paddingHorizontal: RFValue(10),
          marginHorizontal: RFValue(10),
          marginTop: RFValue(10),
        }}>
        <TextInput
          autoCapitalize={'none'}
          style={{
            flex: 1,
            height: RFValue(50),
            color: Colors.primary,
            fontSize: RFValue(16),
            fontFamily: Fonts.family.bold,
          }}
          onPress={() => setStocksModal(true)}
          editable={false}
          placeholder="Select a stock group"
          value={stockGroup}
          returnKeyType="next"
          placeholderTextColor={Colors.grey}
        />
      </Pressable>

      <Pressable
        onPress={() => setWarehouseModal(true)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: Colors.primary,
          borderRadius: RFValue(10),
          paddingHorizontal: RFValue(10),
          marginHorizontal: RFValue(10),
          marginTop: RFValue(10),
        }}>
        <TextInput
          autoCapitalize={'none'}
          style={{
            flex: 1,
            height: RFValue(50),
            color: Colors.primary,
            fontSize: RFValue(16),
            fontFamily: Fonts.family.bold,
          }}
          onPress={() => setWarehouseModal(true)}
          editable={false}
          placeholder="Select a warehouse"
          value={warehouse}
          returnKeyType="next"
          placeholderTextColor={Colors.grey}
        />
      </Pressable>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: RFValue(10),
          marginTop: RFValue(10),
        }}>
        <TouchableOpacity
          onPress={() => {
            setStockGroup('');
            setWarehouse('');
          }}
          style={{
            flex: 0.3,
            padding: 15,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 4,
            backgroundColor: Colors.grey,
          }}>
          <Text
            style={{
              fontFamily: Fonts.family.bold,
              color: Colors.white,
              textAlign: 'center',
            }}>
            Clear
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={filter}
          style={{
            padding: 15,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 4,
            flex: 0.65,
            backgroundColor: Colors.primary,
          }}>
          <Text
            style={{
              fontFamily: Fonts.family.bold,
              color: Colors.white,
              textAlign: 'center',
            }}>
            Filter
          </Text>
        </TouchableOpacity>
      </View>

      <TableComponent
        headers={[
          'StockID',
          'StockName',
          'Location',
          'Qty',
          'Price',
          'Balance',
        ]}
        data={data}
        totals={total.current}
      />

      <Toast
        ref={toastRef}
        position="bottom"
        positionValue={200}
        fadeInDuration={750}
        fadeOutDuration={1000}
        opacity={0.8}
      />

      <Modal
        statusBarTranslucent={true}
        isVisible={stocksModal}
        onBackButtonPress={() => setStocksModal(false)}
        onBackdropPress={() => setStocksModal(false)}
        onRequestClose={() => setStocksModal(false)}>
        <View
          style={{
            padding: RFValue(15),
            backgroundColor: Colors.white,
            borderRadius: RFValue(10),
            marginVertical: RFValue(40),
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: Fonts.family.bold,
                fontSize: RFValue(20),
                flex: 1,
              }}>
              Select Stock Group
            </Text>
            <TouchableOpacity
              onPress={() => {
                setStocksModal(false);
              }}>
              <Image
                source={Images.close}
                style={{
                  height: RFValue(20),
                  width: RFValue(20),
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          </View>

          <SearchableDropDown
            onItemSelect={item => {
              setStockGroup(item);
              setStocksModal(false);
            }}
            containerStyle={{padding: 5, margin: 0, flexGrow: 0.6}}
            textInputStyle={{
              padding: 12,
              borderWidth: 1,
              borderRadius: RFValue(10),
              fontFamily: Fonts.family.bold,
              borderColor: '#ccc',
              backgroundColor: Colors.white,
            }}
            itemStyle={{
              padding: 10,
              backgroundColor: '#FAF9F8',
              borderBottomColor: Colors.light_grey,
              borderBottomWidth: 1,
            }}
            itemTextStyle={{
              color: Colors.black,
              fontFamily: Fonts.family.bold,
            }}
            itemsContainerStyle={{
              height: '60%',
              // flex: 0.6,
            }}
            items={stocks.length ? stocks.map(item => item.cgrpdesc) : []}
            placeholder={'Select a stock...'}
            resetValue={false}
            underlineColorAndroid="transparent"
          />
        </View>
      </Modal>

      <Modal
        statusBarTranslucent={true}
        isVisible={warehouseModal}
        onBackButtonPress={() => setWarehouseModal(false)}
        onBackdropPress={() => setWarehouseModal(false)}
        onRequestClose={() => setWarehouseModal(false)}>
        <View
          style={{
            padding: RFValue(15),
            backgroundColor: Colors.white,
            borderRadius: RFValue(10),
            marginVertical: RFValue(40),
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                fontFamily: Fonts.family.bold,
                fontSize: RFValue(20),
                flex: 1,
              }}>
              Select Warehouse
            </Text>
            <TouchableOpacity
              onPress={() => {
                setWarehouseModal(false);
              }}>
              <Image
                source={Images.close}
                style={{
                  height: RFValue(20),
                  width: RFValue(20),
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          </View>

          <SearchableDropDown
            onItemSelect={item => {
              setWarehouse(item);
              setWarehouseModal(false);
            }}
            containerStyle={{padding: 5, margin: 0, flexGrow: 0.6}}
            textInputStyle={{
              padding: 12,
              borderWidth: 1,
              borderRadius: RFValue(10),
              fontFamily: Fonts.family.bold,
              borderColor: '#ccc',
              backgroundColor: Colors.white,
            }}
            itemStyle={{
              padding: 10,
              backgroundColor: '#FAF9F8',
              borderBottomColor: Colors.light_grey,
              borderBottomWidth: 1,
            }}
            itemTextStyle={{
              color: Colors.black,
              fontFamily: Fonts.family.bold,
            }}
            itemsContainerStyle={{
              height: '60%',
              // flex: 0.6,
            }}
            items={
              warehouses.length ? warehouses.map(item => item.cwhsdesc) : []
            }
            placeholder={'Select a warehouse...'}
            resetValue={false}
            underlineColorAndroid="transparent"
          />
        </View>
      </Modal>

      {loading && <Loader />}
    </View>
  );
};

export default StockReport;
