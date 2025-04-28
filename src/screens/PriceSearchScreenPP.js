import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { Commons, Colors, Fonts, Endpoints } from '../utils';
import { RFValue } from 'react-native-responsive-fontsize';
import Loader from '../components/loader';
import ApiService from '../services/ApiService';
import Toast from 'react-native-easy-toast';
import Header from '../components/Header';
import { useSelector } from 'react-redux';

/*
  This componenet is for showing purchase price for specific client requirement.
*/
const PriceSearchScreenPP = props => {
  const toastRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const menu = useSelector(state => state.Locale.menu);
  const headerKeys = useSelector(state => state.Locale.headers);
  const headers = headerKeys["scan_barcode_report_purchase_price"];

  const label = props.route.params.label;
  const localizeLabel = menu[label] || label;
  const handleBarcodeRead = async data => {
    if (!data) {
      setData([]);
      return;
    }
    setLoading(true);
    try {
      await ApiService.get(Endpoints.scanBarcodePurchasePrice + encodeURIComponent(data))
        .then(res => {
          setData(res.data.data);
          setLoading(false);
        })
        .catch(err => {
          if (typeof err === 'object' && err.code === 404) {
            showToast(err.message);
          }
          setData([]);
          setLoading(false);
        });
    } catch (error) {
      if (typeof err === 'object' && err.code === 404) {
        showToast(err.message);
      }
      setLoading(false);
      setData([]);
    }
  };

  const showToast = msg => {
    toastRef.current.show(msg, 2000);
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <Header label={localizeLabel} navigation={props.navigation} />
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
          try {
            const permissionsGranted = await Commons.checkPermissions();
            if (!permissionsGranted) {
              showToast('Camera permission is required');
            } else {
              Commons.navigate(props.navigation, 'barcode_scanner', {
                onBarcodeRead: handleBarcodeRead,
                returnScreen: 'search_purchase_price',
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
          {localizeLabel}
        </Text>
      </TouchableOpacity>

      <ScrollView style={{ marginTop: RFValue(10) }}>
        {data.length > 0 &&
          data.map((item, index) => {
            return (
              <View
                key={index}
                style={{
                  marginHorizontal: RFValue(15),
                  marginBottom: RFValue(10),
                  borderRadius: RFValue(15),
                  padding: RFValue(15),
                  borderWidth: 0.8,
                }}>
                <Text
                  key={index}
                  style={{
                    fontFamily: Fonts.family.bold,
                    color: Colors.black,
                    fontSize: RFValue(16),
                  }}>
                  {headers?.item_header}: {index + 1}
                </Text>
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: RFValue(10),
                  }}>
                  <Text
                    key={index}
                    style={{
                      fontFamily: Fonts.family.regular,
                      color: Colors.black,
                      fontSize: RFValue(14),
                    }}>
                    {headers?.stock_id_header}:{' '}
                  </Text>
                  <Text
                    key={index}
                    style={{
                      fontFamily: Fonts.family.bold,
                      color: Colors.black,
                      fontSize: RFValue(16),
                    }}>
                    {item.StockID}
                  </Text>
                </View>

                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: RFValue(10),
                  }}>
                  <Text
                    key={index}
                    style={{
                      fontFamily: Fonts.family.regular,
                      color: Colors.black,
                      fontSize: RFValue(14),
                    }}>
                    {headers?.stock_name_header}:{' '}
                  </Text>
                  <Text
                    key={index}
                    style={{
                      fontFamily: Fonts.family.bold,
                      color: Colors.black,
                      fontSize: RFValue(16),
                    }}>
                    {item.StockName}
                  </Text>
                </View>

                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: RFValue(10),
                  }}>
                  <Text
                    key={index}
                    style={{
                      fontFamily: Fonts.family.regular,
                      color: Colors.black,
                      fontSize: RFValue(14),
                    }}>
                    {headers?.location_header}:{' '}
                  </Text>
                  <Text
                    key={index}
                    style={{
                      fontFamily: Fonts.family.bold,
                      color: Colors.black,
                      fontSize: RFValue(16),
                    }}>
                    {item.Location}
                  </Text>
                </View>

                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: RFValue(10),
                  }}>
                  <Text
                    key={index}
                    style={{
                      fontFamily: Fonts.family.regular,
                      color: Colors.black,
                      fontSize: RFValue(14),
                    }}>
                    {headers?.qty_header}:{' '}
                  </Text>
                  <Text
                    key={index}
                    style={{
                      fontFamily: Fonts.family.bold,
                      color: Colors.black,
                      fontSize: RFValue(16),
                    }}>
                    {item.Qty}
                  </Text>
                </View>

                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: RFValue(10),
                  }}>
                  <Text
                    key={index}
                    style={{
                      fontFamily: Fonts.family.regular,
                      color: Colors.black,
                      fontSize: RFValue(14),
                    }}>
                    {headers?.price_header}:{' '}
                  </Text>
                  <Text
                    key={index}
                    style={{
                      fontFamily: Fonts.family.bold,
                      color: Colors.black,
                      fontSize: RFValue(16),
                    }}>
                    {item.Price}
                  </Text>
                </View>

                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: RFValue(10),
                  }}>
                  <Text
                    key={index}
                    style={{
                      fontFamily: Fonts.family.regular,
                      color: Colors.black,
                      fontSize: RFValue(14),
                    }}>
                    {headers?.balance_header}:{' '}
                  </Text>
                  <Text
                    key={index}
                    style={{
                      fontFamily: Fonts.family.bold,
                      color: Colors.black,
                      fontSize: RFValue(16),
                    }}>
                    {item.Balance}
                  </Text>
                </View>
              </View>
            );
          })}
      </ScrollView>

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

export default PriceSearchScreenPP;
