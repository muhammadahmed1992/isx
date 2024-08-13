import {
  View,
  StatusBar,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Colors, Fonts, Endpoints} from '../utils';
import {RFValue} from 'react-native-responsive-fontsize';
import TableComponent from './TableComponent';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import ApiService from '../services/ApiService';
import Loader from './loader';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import Toast from 'react-native-easy-toast';
import ModalComponent from './Model';
import Header from './Header';
import routeOptions from './ReportComponentData.json'


const ReportComponent = () => {
  let total = useRef({});
  const toastRef = useRef(null);
  const route = useRoute();
  const currentRouteName = route.name;
  const config = routeOptions[currentRouteName] || {};
  const { label, dateRangeSetter, stockInputField, warehouseInputField, endPoints } = config;
  const [stockGroup, setStockGroup] = useState('');
  const [warehouse, setWarehouse] = useState('');
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
  const [stocksModal, setStocksModal] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [warehouseModal, setWarehouseModal] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const currentLabel = label;

  useEffect(() => {
    fetchAllStocks();
    fetchAllWarehouses();
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setDateFrom(new Date());
        setDateValFrom(moment(new Date().toISOString()).format('DD-MM-yyyy'));
        setDateTo(new Date());
        setDateValTo(moment(new Date().toISOString()).format('DD-MM-yyyy'));
        setStockGroup('');
        setWarehouse('');
        setData([]);
      };
    }, []),
  );

  useEffect(() => {
    setData([]);
  }, [currentRouteName]);

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
    if (dateValFrom && dateValFrom.length) {
      query += `?startDate=${encodeURIComponent(
        moment(dateFrom.toISOString()).format('yyyy-MM-DD'),
      )}`;
    }
    if (dateValTo && dateValTo.length) {
      query += `&endDate=${encodeURIComponent(
        moment(dateTo.toISOString()).format('yyyy-MM-DD'),
      )}`;
    }

    if (stockGroup && stockGroup.length) {
      query += `&stockGroup=${encodeURIComponent(
        stocks.find(s => s.cgrpdesc === stockGroup).cgrppk,
      )}`;
    }

    if (warehouse && warehouse.length) {
      query += `&warehouse=${encodeURIComponent(
        warehouses.find(s => s.cwhsdesc === warehouse).cwhspk,
      )}`;
    }

    try {
      await ApiService.get(
        `${endPoints}${query}`,
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
              const {SubTotal, AmountTaxTotal, ...newItem} = item;
              result.push(newItem);
              if (index === items.length - 1) {
                const newRow = {
                  StockID: '',
                  StockName: '',
                  Qty: '',
                  Curr: currency,
                  Amount: SubTotal,
                  'Amount Tax': AmountTaxTotal ? AmountTaxTotal : '',
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

      <Header label={currentLabel}/>

      <DateRangeSetter
        dateValFrom={dateValFrom}
        dateValTo={dateValTo}
        onDateFromPress={() => setOpenFrom(true)}
        onDateToPress={() => setOpenFrom(true)}
        setDateValFrom={setDateValFrom}
        setDateValTo={setDateValTo}
        enabled={dateRangeSetter}
      />

      <InputField
        enabled={stockInputField}
        onPress={() => setStocksModal(true)}
        placeholder={'Select a stock group'}
        value={stockGroup}
      />
      <InputField
        enabled={warehouseInputField}
        onPress={() => setModal(true)}
        placeholder={'Select a warehouse'}
        value={warehouse}
      />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: RFValue(10),
          marginTop: RFValue(10),
        }}>
        <Button
          onPress={() => {
            setDateValFrom('');
            setDateValTo('');
            setWarehouse('');
          }}
          title={'Clear'}
          buttonStyle={{
            flex: 0.3,
            padding: 15,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 4,
            backgroundColor: Colors.grey,
          }}
          textStyle={{
            fontFamily: Fonts.family.bold,
            color: Colors.white,
            textAlign: 'center',
          }}
        />
        <Button
          onPress={filter}
          title={'Filter'}
          buttonStyle={{
            padding: 15,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 4,
            flex: 0.65,
            backgroundColor: Colors.primary,
          }}
          textStyle={{
            fontFamily: Fonts.family.bold,
            color: Colors.white,
            textAlign: 'center',
          }}
        />
      </View>

      <TableComponent
        headers={[
          'StockID',
          'StockName',
          'Qty',
          'Curr',
          'Amount',
          'Amount Tax',
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

      <ModalComponent
        isVisible={stocksModal}
        onClose={() => setStocksModal(false)}
        items={stocks.length ? stocks.map(item => item.cgrpdesc) : []}
        onItemSelect={item => {
          setStockGroup(item);
          setStocksModal(false);
        }}
        placeholder="Select a stock..."
        modalTitle="Select Stock Group"
      />

      <ModalComponent
        isVisible={warehouseModal}
        onClose={() => setWarehouseModal(false)}
        items={warehouses.length ? warehouses.map(item => item.cwhsdesc) : []}
        onItemSelect={item => {
          setWarehouse(item);
          setWarehouseModal(false);
        }}
        placeholder="Select a warehouse..."
        modalTitle="Select Warehouse"
      />

      {loading && <Loader />}
    </View>
  );
};

export default ReportComponent;
