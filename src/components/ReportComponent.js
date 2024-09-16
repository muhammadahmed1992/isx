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
import { Colors, Fonts } from '../utils';
import { isCashDrawerReport } from '../utils/reports';
import { RFValue } from 'react-native-responsive-fontsize';
import TableComponent from './TableComponent';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import Loader from './loader';
import { useFocusEffect } from '@react-navigation/native';
import Toast from 'react-native-easy-toast';
import Header from './Header';
import ReportService from '../services/ReportService';
import Button from './Button';
import InputField from './InputField';
import SearchableDropDown from './searchableDropdown';
import { Images } from '../utils';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import SearchInputComponent from './SearchInputComponent';
import filterConfig from '../helper/filterConfig';
import PaginationComponent from './Paginator';


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
  const [bool, setBool] = useState(false);
  const {pageSize} = filterConfig;
  const [stocksModal, setStocksModal] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [warehouseModal, setWarehouseModal] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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
  useEffect(() => {
    console.log(searchValue);
  }, [searchValue])
  useEffect(() => {
    fetchAllData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        resetFilters();
      };
    }, []),
  );

  useEffect(() => {
    filter();
    console.log({sortColumn, sortDirection})
  }, [sortDirection])

  useEffect(() => {
    setData([]);
    console.log({currentRouteName})
  }, [currentRouteName]);

  useEffect(() => {
    if(bool) {
      console.log({currentPage});
      filter();
    }
    else {
      setBool(true);
    }
  }, [currentPage])

  const fetchAllData = async () => {
    try {
      const promises = [];
      
      if (warehouseInputField) {
        promises.push(ReportService.fetchAllWarehouses()); // Correct service call
      }
      if (stockInputField) {
        promises.push(ReportService.fetchAllStocks()); // Correct service call
      }
      
      setLoading(true);
  
      // Execute all promises
      const responses = await Promise.all(promises);
      
      // Process results based on the order of promises
      const stocksResult = stockInputField ? responses.pop() : []; // Last result if stockInputField is set
      const warehousesResult = warehouseInputField ? responses.pop() : []; // Last result if warehouseInputField is set
      
      // Update state
      if (stockInputField) {
        setStocks(stocksResult);
      }
      if (warehouseInputField) {
        setWarehouses(warehousesResult);
      }
  
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
    setSearchValue('');
    setCurrentPage(1);
    setTotalPages(1);
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
      setTotalPages(result.totalPages);
      setLoading(false);
    } catch (error) {
      setData([]);
      setLoading(false);
      showToast(typeof error === 'string' ? error : error.message);
    }
  };

  const showToast = msg => {
    toastRef.current.show(msg, 2000);
  };
  const handleSearch = () => {
    filter();
    setCurrentPage(1);
  }
  const handleSort = (column, direction) => {
    setSortColumn(column);
    setSortDirection(direction);
    // Optionally, send the sort configuration to the backend or handle it here
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
      <SearchInputComponent
        placeholder={`${searchPrompt} ${headers[filterConfig.columns[currentRouteName].header]}`}
        onSearch={handleSearch} 
        onChangeText={setSearchValue}
        value={searchValue}
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
          onPress={filter}
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
      <PaginationComponent
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
      <ScrollView>
        <TableComponent data={data} headers={headers} onSort={handleSort}/>
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
      (<Modal
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
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: Fonts.family.bold,
                fontSize: RFValue(20),
                flex: 1,
              }}>
              {stockPlaceholder}
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
            containerStyle={{ padding: 5, margin: 0, flexGrow: 0.6 }}
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
            placeholder={stockPlaceholder + '...'}
            resetValue={false}
            underlineColorAndroid="transparent"
          />
        </View>
      </Modal>) : (<View />) }

      {warehouseInputField ? 
      (
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
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: Fonts.family.bold,
                fontSize: RFValue(20),
                flex: 1,
              }}>
              {wearhousePlaceholder}
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
            containerStyle={{ padding: 5, margin: 0, flexGrow: 0.6 }}
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
            placeholder={wearhousePlaceholder + '...'}
            resetValue={false}
            underlineColorAndroid="transparent"
          />
        </View>
      </Modal> ) :(<View />) } 

      {loading && <Loader />}
    </View>
  );
};

export default ReportComponent;
