import {View, StatusBar} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Colors, Fonts} from '../utils';
import {RFValue} from 'react-native-responsive-fontsize';
import TableComponent from './TableComponent';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import Loader from './loader';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import Toast from 'react-native-easy-toast';
import ModalComponent from './Model';
import Header from './Header';
import ReportService from '../services/ReportService';

const ReportComponent = ({
  currentRouteName,
  label,
  dateRangeSetter,
  stockInputField,
  warehouseInputField,
  endPoints,
}) => {
  const toastRef = useRef(null);
  const [stockGroup, setStockGroup] = useState('');
  const [warehouse, setWarehouse] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [openFrom, setOpenFrom] = useState(false);
  const [openTo, setOpenTo] = useState(false);
  const [dateFrom, setDateFrom] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());
  const [dateValFrom, setDateValFrom] = useState(moment().format('DD-MM-yyyy'));
  const [dateValTo, setDateValTo] = useState(moment().format('DD-MM-yyyy'));
  const [stocksModal, setStocksModal] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [warehouseModal, setWarehouseModal] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const currentLabel = label;

  useEffect(() => {
    fetchAllData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        resetFilters();
      };
    }, [])
  );

  useEffect(() => {
    setData([]);
  }, [currentRouteName]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [stocksResult, warehousesResult] = await Promise.all([
        ReportService.fetchAllStocks(),
        ReportService.fetchAllWarehouses(),
      ]);
      setStocks(stocksResult);
      setWarehouses(warehousesResult);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const resetFilters = () => {
    setDateFrom(new Date());
    setDateValFrom(moment().format('DD-MM-yyyy'));
    setDateTo(new Date());
    setDateValTo(moment().format('DD-MM-yyyy'));
    setStockGroup('');
    setWarehouse('');
    setData([]);
  };

  const filter = async () => {
    setLoading(true);
    try {
      const result = await ReportService.filterData({
        reportType: currentRouteName,
        endPoints,
        dateValFrom,
        dateValTo,
        stockGroup,
        warehouse,
      });
      setData(result);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      showToast(typeof error === 'string' ? error : error.message);
    }
  };

  const showToast = msg => {
    toastRef.current.show(msg, 2000);
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <Header label={currentLabel} />
      <DateRangeSetter
        dateValFrom={dateValFrom}
        dateValTo={dateValTo}
        onDateFromPress={() => setOpenFrom(true)}
        onDateToPress={() => setOpenTo(true)}
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
        onPress={() => setWarehouseModal(true)}
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
          onPress={resetFilters}
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

      <TableComponent data={data} />

      <DatePicker
        modal
        mode={'date'}
        open={openFrom}
        date={dateFrom}
        onConfirm={date => {
          setOpenFrom(false);
          setDateFrom(date);
          setDateValFrom(moment(date).format('DD-MM-yyyy'));
        }}
        onCancel={() => setOpenFrom(false)}
      />

      <DatePicker
        modal
        mode={'date'}
        open={openTo}
        date={dateTo}
        onConfirm={date => {
          setOpenTo(false);
          setDateTo(date);
          setDateValTo(moment(date).format('DD-MM-yyyy'));
        }}
        onCancel={() => setOpenTo(false)}
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
        items={stocks.map(item => item.value)}
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
        items={warehouses.map(item => item.value)}
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
