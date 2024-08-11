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
import React, {useRef, useState, useEffect, useCallback} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {Commons, Colors, Fonts, Endpoints, Images} from '../utils';
import {RFValue} from 'react-native-responsive-fontsize';
import TableComponent from '../components/TableComponent';
import Loader from '../components/loader';
import ApiService from '../services/ApiService';
import Toast from 'react-native-easy-toast';
import SearchableDropDown from '../components/searchableDropdown';
import Modal from 'react-native-modal';
import {useFocusEffect} from '@react-navigation/native';

const PriceReport = props => {
  const toastRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [stockGroup, setStockGroup] = useState('');
  const [data, setData] = useState([]);
  const [modal, setModal] = useState(false);
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    fetchAllStocks();
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setStockGroup('');
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

  const filter = async () => {
    setLoading(true);

    let query = '';
    if (stockGroup && stockGroup.length) {
      query += `?stockGroup=${encodeURIComponent(
        stocks.find(s => s.cgrpdesc === stockGroup).cgrppk,
      )}`;
    }

    try {
      await ApiService.get(`${Endpoints.priceReport}${query}`)
        .then(res => {
          let data = res.data.data;
          setData(data);
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
      // console.error('Error: ', error);
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
          Price List
        </Text>

        <View>
          <Icon name="menu" size={Commons.size(25)} color={Colors.primary} />
        </View>
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
          placeholder="Select a stock group"
          value={stockGroup}
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
        headers={['StockID', 'StockName', 'Price', 'Unit']}
        data={data}
        isPrice
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
              Select Stock Group
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
              setStockGroup(item);
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
            items={stocks.length ? stocks.map(item => item.cgrpdesc) : []}
            placeholder={'Select a stock...'}
            resetValue={false}
            underlineColorAndroid="transparent"
          />
        </View>
      </Modal>

      {loading && <Loader />}
    </View>
  );
};

export default PriceReport;
