import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {Commons, Colors, Fonts, Endpoints} from '../utils';
import {RFValue} from 'react-native-responsive-fontsize';
import Loader from '../components/loader';
import ApiService from '../services/ApiService';
import Toast from 'react-native-easy-toast';

const PriceSearchScreen = props => {
  const toastRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [stockID, setStockID] = useState('');
  const [stockName, setStockName] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [balance, setBalance] = useState('');

  const handleBarcodeRead = async data => {
    if (!data) return;
    setLoading(true);
    try {
      await ApiService.get(Endpoints.scanBarcode + data)
        .then(res => {
          setStockID(res.data.data.StockID);
          setStockName(res.data.data.StockName);
          setLocation(res.data.data.StockID);
          setPrice(res.data.data.Price);
          setBalance(res.data.data.Balance);
          setLoading(false);
        })
        .catch(err => {
          setLoading(false);
        });
    } catch (error) {
      console.error(error);
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
          Search Price
        </Text>

        <View>
          <Icon name="menu" size={Commons.size(25)} color={Colors.primary} />
        </View>
      </View>

      <TouchableOpacity
        style={{
          width: '90%',
          backgroundColor: Colors.primary,
          padding: 15,
          borderRadius: 4,
          alignItems: 'center',
          justifyContent: 'center',
          alignSelf: 'center',
          marginTop: 30,
        }}
        onPress={async () => {
          const permissionsGranted = await Commons.checkPermissions();
          if (!permissionsGranted) {
            showToast('Camera permission is required');
          } else {
            Commons.navigate(props.navigation, 'barcode_scanner', {
              onBarcodeRead: handleBarcodeRead,
              returnScreen: 'search',
            });
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

      {stockID !== '' && (
        <View style={{marginHorizontal: RFValue(15)}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: RFValue(10),
            }}>
            <Text
              style={{
                fontFamily: Fonts.family.regular,
                color: Colors.black,
                fontSize: RFValue(14),
              }}>
              Stock ID:{' '}
            </Text>
            <Text
              style={{
                fontFamily: Fonts.family.bold,
                color: Colors.black,
                fontSize: RFValue(16),
              }}>
              {stockID}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: RFValue(10),
            }}>
            <Text
              style={{
                fontFamily: Fonts.family.regular,
                color: Colors.black,
                fontSize: RFValue(14),
              }}>
              Stock Name:{' '}
            </Text>
            <Text
              style={{
                fontFamily: Fonts.family.bold,
                color: Colors.black,
                fontSize: RFValue(16),
              }}>
              {stockName}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: RFValue(10),
            }}>
            <Text
              style={{
                fontFamily: Fonts.family.regular,
                color: Colors.black,
                fontSize: RFValue(14),
              }}>
              Location:{' '}
            </Text>
            <Text
              style={{
                fontFamily: Fonts.family.bold,
                color: Colors.black,
                fontSize: RFValue(16),
              }}>
              {location}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: RFValue(10),
            }}>
            <Text
              style={{
                fontFamily: Fonts.family.regular,
                color: Colors.black,
                fontSize: RFValue(14),
              }}>
              Price:{' '}
            </Text>
            <Text
              style={{
                fontFamily: Fonts.family.bold,
                color: Colors.black,
                fontSize: RFValue(16),
              }}>
              {price}
            </Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: RFValue(10),
            }}>
            <Text
              style={{
                fontFamily: Fonts.family.regular,
                color: Colors.black,
                fontSize: RFValue(14),
              }}>
              Balance:{' '}
            </Text>
            <Text
              style={{
                fontFamily: Fonts.family.bold,
                color: Colors.black,
                fontSize: RFValue(16),
              }}>
              {balance}
            </Text>
          </View>
        </View>
      )}

      <Toast
        ref={toastRef}
        position="bottom"
        positionValue={200}
        fadeInDuration={750}
        fadeOutDuration={1000}
        opacity={0.8}
      />

      {loading && <Loader />}
    </View>
  );
};

export default PriceSearchScreen;
