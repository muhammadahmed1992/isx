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
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import ApiService from '../services/ApiService';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import Loader from '../components/loader';
import Toast from 'react-native-easy-toast';
import SearchableDropDown from '../components/searchableDropdown';
import Modal from 'react-native-modal';

const SalesReport = props => {
  let total = useRef({});
  const toastRef = useRef(null);
  const route = useRoute();
  const currentRouteName = route.name;
  const [warehouse, setWarehouse] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const [dateFrom, setDateFrom] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());
  const [dateValFrom, setDateValFrom] = useState(
    moment(new Date().toISOString()).format('DD-MM-yyyy'),
  );
  const [dateValTo, setDateValTo] = useState(
    moment(new Date().toISOString()).format('DD-MM-yyyy'),
  );
  const [modal, setModal] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const currentLabel =
    currentRouteName === 'sales_report_2'
      ? 'Sales Report (No Disc)'
      : 'Sales Report';

  useEffect(() => {
    fetchAllWarehouses();
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setDateFrom(new Date());
        setDateValFrom(moment(new Date().toISOString()).format('DD-MM-yyyy'));
        setDateTo(new Date());
        setDateValTo(moment(new Date().toISOString()).format('DD-MM-yyyy'));
        setWarehouse('');
        setData([]);
      };
    }, []),
  );

  useEffect(() => {
    setData([]);
  }, [currentRouteName]);

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
    if (dateValFrom && dateValFrom.length) {
      query += `?startDate=${encodeURIComponent(
        moment(dateFrom.toISOString()).format('yyyy-MM-DD'),
      )}`;

      if (dateValTo && dateValTo.length) {
        query += `&endDate=${encodeURIComponent(
          moment(dateTo.toISOString()).format('yyyy-MM-DD'),
        )}`;
      }
      if (warehouse && warehouse.length) {
        query += `&warehouse=${encodeURIComponent(
          warehouses.find(s => s.cwhsdesc === warehouse).cwhspk,
        )}`;
      }
    } else if (dateValTo && dateValTo.length) {
      query += `?endDate=${encodeURIComponent(
        moment(dateTo.toISOString()).format('yyyy-MM-DD'),
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
      await ApiService.get(
        currentRouteName === 'sales_report'
          ? `${Endpoints.salesReport}${query}`
          : `${Endpoints.sales2Report}${query}`,
      )
        .then(res => {
          let data = res.data.data;

          const groupedData = data.reduce((acc, item) => {
            acc[item.Curr] = acc[item.Curr] || [];
            acc[item.Curr].push(item);
            return acc;
          }, {});

          const result = [];
          const appendedIndexes = [];
          Object.keys(groupedData).forEach(currency => {
            const items = groupedData[currency];
            items.forEach((item, index) => {
              const {SubTotal, ...newItem} = item;
              result.push(newItem);
              if (index === items.length - 1) {
                const newRow = {
                  Invoice: '',
                  Date: '',
                  Customer: '',
                  Curr: currency,
                  Amount: SubTotal,
                };
                result.push(newRow);
                appendedIndexes.push(result.length - 1);
              }
            });
          });

          total.current = {indexes: appendedIndexes};
          setData(result);
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
          {currentLabel}
        </Text>

        <View>
          <Icon name="menu" size={Commons.size(25)} color={Colors.primary} />
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: RFValue(10),
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          onPress={() => setOpenFrom(true)}
          style={{
            flex: 0.48,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: Colors.primary,
            borderRadius: RFValue(10),
            paddingHorizontal: RFValue(10),
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
            onPress={() => setOpenFrom(true)}
            placeholder="Date From"
            value={dateValFrom}
            onChangeText={setDateValFrom}
            returnKeyType="done"
            placeholderTextColor={Colors.grey}
            editable={false}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setOpenTo(true)}
          style={{
            flex: 0.48,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: Colors.primary,
            borderRadius: RFValue(10),
            paddingHorizontal: RFValue(10),
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
            onPress={() => setOpenTo(true)}
            placeholder="Date To"
            value={dateValTo}
            onChangeText={setDateValTo}
            returnKeyType="done"
            placeholderTextColor={Colors.grey}
            editable={false}
          />
        </TouchableOpacity>
      </View>

      <Pressable
        onPress={() => setModal(true)}
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
          onPress={() => setModal(true)}
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
            setDateValFrom('');
            setDateValTo('');
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
        headers={['Invoice', 'Date', 'Customer', 'Curr', 'Amount']}
        data={data}
        totals={total.current}
      />

      <DatePicker
        modal
        mode={'date'}
        open={openFrom}
        date={dateFrom}
        onConfirm={date => {
          setOpenFrom(false);
          setDateFrom(date);
          setDateValFrom(moment(date.toISOString()).format('DD-MM-yyyy'));
        }}
        onCancel={() => {
          setOpenFrom(false);
        }}
      />

      <DatePicker
        modal
        mode={'date'}
        open={openTo}
        date={dateTo}
        onConfirm={date => {
          setOpenTo(false);
          setDateTo(date);
          setDateValTo(moment(date.toISOString()).format('DD-MM-yyyy'));
        }}
        onCancel={() => {
          setOpenTo(false);
        }}
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
        isVisible={modal}
        onBackButtonPress={() => setModal(false)}
        onBackdropPress={() => setModal(false)}
        onRequestClose={() => setModal(false)}>
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
                setModal(false);
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
              setModal(false);
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

export default SalesReport;
