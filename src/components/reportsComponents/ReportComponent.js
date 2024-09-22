import {
  View,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Text,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Colors, Fonts } from '../../utils';
import { isCashDrawerReport } from '../../utils/reports';
import { RFValue } from 'react-native-responsive-fontsize';
import TableComponent from './TableComponent';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import Loader from '../loader';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-easy-toast';
import Header from '../Header';
import ReportService from '../../services/ReportService';
import Button from './Button';
import InputField from './InputField';
import SearchableDropDown from '../searchableDropdown';
import { Images } from '../../utils';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import InputComponent from '../InputComponent';
import filterConfig from '../../helper/filterConfig';
import PaginationComponent from './Paginator';
import ModalComponent from './Model';


const ReportComponent = ({
  navigation,
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
  const [dateValFrom, setDateValFrom] = useState(
    moment(new Date()).format('DD-MM-yyyy'),
  );
  const [dateValTo, setDateValTo] = useState(
    moment(new Date()).format('DD-MM-yyyy'),
  );
  const {pageSize} = filterConfig;
  const [filtered, setFiltered] = useState(false);
  // const [shouldSearch, setShouldSearch] = useState(false);
  const [stocksModal, setStocksModal] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [warehouseModal, setWarehouseModal] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  // const [totalPages, setTotalPages] = useState(1);
  const [sortColumn, setSortColumn] = useState('');
  const [sortDirection, setSortDirection] = useState('');
  const currentLabel = label;
  const menu = useSelector(state => state.Locale.menu);
  const localizeLabel = menu[currentLabel] || currentLabel;
  const stockPlaceholder = menu['select_stock_group'];
  const wearhousePlaceholder = menu['select_warehouse'];
  const dateToPlaceholder = menu['date_to'];
  const dateFromPlaceholder = menu['date_from'];
  const filterPrompt = menu['filter'];
  const clear = menu['clear'];
  const searchPrompt = menu['search'];
  const headerKeys = useSelector(state => state.Locale.headers);
  const headers = headerKeys[currentRouteName];
  let searchPlaceHolder = [];
  filterConfig.columns[currentRouteName].header.forEach(header => {
    searchPlaceHolder.push(headers[header]);
  });

 
  useFocusEffect(
    useCallback(() => {
      return () => {
        resetFilters();
      };
    }, []),
  );

  useEffect(() => {
    fetchAllData();
  }, []);


  useEffect(() => {
    if(filtered && !(isCashDrawerReport(currentRouteName)) && !(data.length === 0)) {
        filter();
      }
  }, [sortDirection, sortColumn])

  useEffect(() => {
    setData([]);
    setCurrentPage(1);
  }, [currentRouteName]);

  const fetchAllData = async () => {
    
    try {
      const promises = [];

      if (warehouseInputField) {
          promises.push(ReportService.fetchAllWarehouses());
        }
        if (stockInputField) {
          promises.push(ReportService.fetchAllStocks());
        }
        setLoading(true);

        const responses = await Promise.all(promises);

        const stocksResult = stockInputField ? responses.pop() : [];
        const warehousesResult = warehouseInputField ? responses.pop() : [];

        if (stockInputField) {
          setStocks(stocksResult);
        }
        if (warehouseInputField) {
          setWarehouses(warehousesResult);
        }

        setLoading(false);

    } catch (error) {
      console.log('fetch');
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
    setSearchValue('');
    setCurrentPage(1);
  };

  const filter = async () => {
    setLoading(true);
    try {
      const result = await ReportService.filterData({
        reportType: currentRouteName,
        endPoints: endPoints,
        dateValFrom: dateValFrom,
        dateValTo: dateValTo,
        stockGroup: stockGroup,
        warehouse: warehouse,
        stocks: stocks,
        warehouses: warehouses,
        searchValue: searchValue,
        pageSize: pageSize,
        currentPage: currentPage,
        columnsToFilter: filterConfig.columns[currentRouteName].columnsToBeFiltered,
        sortColumn: sortColumn,
        sortDirection: sortDirection
      });
      setData(result.data); 
      // setTotalPages(result.totalPages); 
      setLoading(false);
    } catch (error) {
      setData([]);
      setLoading(false);
      //showToast(typeof error === 'string' ? error : error.message);
    }
  };
  useEffect(()=> {
    if(filtered) {
      filter();
    } 
  },[searchValue])
  const showToast = msg => {
    toastRef.current.show(msg, 2000);
  };
  const handleSearch = (text) => {
    setSearchValue(text);
    setCurrentPage(1);
  }
  const handleSort = (column, direction) => {
    setSortColumn(column);
    setSortDirection(direction);
  };
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <Header label={localizeLabel} navigation={navigation} />
      {dateRangeSetter ? (
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
              placeholder={dateFromPlaceholder}
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
              placeholder={dateToPlaceholder}
              value={dateValTo}
              onChangeText={setDateValTo}
              returnKeyType="done"
              placeholderTextColor={Colors.grey}
              editable={false}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View />
      )}

      {stockInputField ? (
        <InputField
          enabled={stockInputField}
          onPress={() => setStocksModal(true)}
          placeholder={stockPlaceholder}
          value={stockGroup}
        />
      ) : (
        <View />
      )}

      {warehouseInputField ? (
        <InputField
          enabled={warehouseInputField}
          onPress={() => {
            setWarehouseModal(true);
          }}
          placeholder={wearhousePlaceholder}
          value={warehouse}
        />
      ) : (
        <View />
      )}
      {isCashDrawerReport(currentRouteName)? <View/> : 
      <InputComponent 
      placeholder={`${searchPrompt} ${searchPlaceHolder.join(', ')}`}
      placeholderColor={Colors.grey}
      onTextChange={handleSearch}
      value={searchValue}
      debounceEnabled={true}
    />
      }
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
          title={clear}
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
          onPress={() => {
            filter();
            setFiltered(true);
          }}
          title={filterPrompt}
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
      {/* <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      /> */}
      <ScrollView>
        <TableComponent data={data} headers={headers} onSort={handleSort} currentPage={currentPage} setCurrentPage={setCurrentPage}/>
      </ScrollView>
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
        theme="light"
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
        theme="light"
      />

      <Toast
        ref={toastRef}
        position="bottom"
        positionValue={200}
        fadeInDuration={750}
        fadeOutDuration={1000}
        opacity={0.8}
      />
      {stockInputField ? 
      (<ModalComponent isVisible={stocksModal}
        onClose={() => setStocksModal(false)} 
        items={stocks.length ? stocks.map(item => item.cgrpdesc) : []}
        onItemSelect={item => {
         setStockGroup(item);
         setStocksModal(false);
       }}
       placeholder={stockPlaceholder + '...'}
       modalTitle={stockPlaceholder}
       />
 ) :(<View />)}
      {warehouseInputField ? 
      ( <ModalComponent isVisible={warehouseModal}
             onClose={() => setWarehouseModal(false)} 
             items={warehouses.length ? warehouses.map(item => item.cwhsdesc) : []}
             onItemSelect={item => {
              setWarehouse(item);
              setWarehouseModal(false);
            }}
            placeholder={wearhousePlaceholder + '...'}
            modalTitle={wearhousePlaceholder}
            />
      ) :(<View />) } 

      {loading && <Loader />}
    </View>
  );
};

export default ReportComponent;
