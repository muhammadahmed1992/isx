import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {Commons, Colors, Fonts, Endpoints} from '../utils';
import {RFValue} from 'react-native-responsive-fontsize';
import TableComponent from '../components/TableComponent';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import ApiService from '../services/ApiService';
import Loader from '../components/loader';
import Toast from 'react-native-easy-toast';
import {useFocusEffect} from '@react-navigation/native';

const CashDrawerReport = props => {
  let total = useRef({});
  const toastRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
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

  useFocusEffect(
    useCallback(() => {
      return () => {
        setDateFrom(new Date());
        setDateValFrom(moment(new Date().toISOString()).format('DD-MM-yyyy'));
        setDateTo(new Date());
        setDateValTo(moment(new Date().toISOString()).format('DD-MM-yyyy'));
        setData([]);
      };
    }, []),
  );

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
    } else if (dateValTo && dateValTo.length) {
      query += `?endDate=${encodeURIComponent(
        moment(dateTo.toISOString()).format('yyyy-MM-DD'),
      )}`;
    }

    try {
      await ApiService.get(`${Endpoints.cashDrawerReport}${query}`)
        .then(res => {
          let data = res.data.data;
          const {
            RunningOpening,
            RunningDP,
            RunningVoucher,
            RunningCash,
            RunningPayroll,
            RunningCreditCard,
            RunningDebitCard,
            RunningOnline,
            RunningWithdrawn,
            RunningCancel,
            RunningBalance,
          } = data[data.length - 1];
          total.current = {
            Opening: RunningOpening,
            DP: RunningDP,
            Voucher: RunningVoucher,
            Cash: RunningCash,
            Payroll: RunningPayroll,
            CreditCard: RunningCreditCard,
            DebitCard: RunningDebitCard,
            Online: RunningOnline,
            Withdrawn: RunningWithdrawn,
            Cancel: RunningCancel,
            Balance: RunningBalance,
          };
          data = data.map(removeRunningKeys);
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
      console.error(error);
      showToast(typeof error === 'string' ? error : error.message);
      setLoading(false);
    }
  };

  const showToast = msg => {
    toastRef.current.show(msg, 2000);
  };

  function removeRunningKeys(obj) {
    return Object.keys(obj)
      .filter(key => !key.startsWith('Running'))
      .reduce((acc, key) => {
        acc[key] = obj[key];
        return acc;
      }, {});
  }

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
          Cash Drawer Report
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
          'Date',
          'Opening',
          'DP',
          'Voucher',
          'Cash',
          'Payroll',
          'CreditCard',
          'DebitCard',
          'Online',
          'Withdrawn',
          'Cancel',
          'Balance',
        ]}
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

      {loading && <Loader />}
    </View>
  );
};

export default CashDrawerReport;
