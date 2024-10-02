import {View, Text, StyleSheet} from 'react-native';
import Header from '../Header';
import InputForm from './InvoiceForm';
import Wizard from './WizardForm';
import TableForm from './TableForm';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { TransactionService } from '../../services/TransactionService';
import { store } from '../../redux/store';
import { Endpoints } from '../../utils';
import ApiService from '../../services/ApiService';
import { useSelector } from 'react-redux';
import { State } from 'react-native-gesture-handler';
import PaymentDetailForm from './PaymentForm';

const TransactionModuleComponent = ({
  navigation,
  currentRouteName,
  label,
  endPoints,
  paymentDetails
}) => {
  const loggedInUser = store.getState().Auth.user;
  const isStock = currentRouteName === 'stock_adjusment';
  const [invoiceFormData, setInvoiceFormData] = useState(); 
  const [tableForm, setTableFormData] = useState([]);  
  const [customers, setCustomers] = useState([]);
  const [salesmen, setSalesmen] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [selectedSalesman, setSelectedSalesman] = useState({});
  const [postObject, setPostObject] = useState();
  const [onPost, setOnPost] = useState(false);
  const [total, setTotal] = useState(0);
  const [paymentData, setPaymentData] = useState({
    total: 0,
    voucher: 0,
    cash: 0,
    creditCard: 0,
    debitCard: 0,
    online: 0,
    change: 0
  });
  const localizedLabel = useSelector(state => state.Locale.menu);
  const tableHeaders = useSelector(state => state.Locale.headers[currentRouteName].table);
  console.log('headers',{tableHeaders});
  const invoiceHeaders = useSelector(state => state.Locale.headers[currentRouteName].invoice);
  const paymentHeaders = currentRouteName === 'point_of_sale_transaction' ? useSelector(state => state.Locale.headers[currentRouteName].payment) : {};
  const removePkField = (dataArray) => {
    return dataArray.map(({ pk, ...rest }) => rest);
  };
  useEffect(() => {
    console.log(postObject);
  })
  useEffect(() => {
    console.log({total});
    setPaymentData(prev => ({
      ...prev,
      total: total,
    }));
  }, [total]);
  const handleBarcodeRead = async data => {
    if (!data) {
      setTableFormData([]);
      console.log('not here');
      return;
    }
    try {
      console.log('here');
      const res = await ApiService.get(endPoints.table + encodeURIComponent(data));
      console.log(res.data.data);
      if(res)
        setTableFormData([...tableForm, res.data.data[0]]); 
      setLoading(false);
    } catch (error) {
      if (typeof error === 'object' && error.code === 404) {
        showToast(error.message);
      }
    }
  };

  function findObjectByValue(inputString, objects) {
    for (const obj of objects) {
        const key = Object.keys(obj)[0];
        if (obj[key] === inputString) {
            return obj;
        }
    }
    return {}; 
  }

  function convertToDescAndPk(inputObj) {
    const key = Object.keys(inputObj)[0]; 
    const value = inputObj[key]; 

    return {
        pk: key,    
        desc: value 
    };
  }
  const responseArrayObjectsToValues = data => data.map(obj => Object.values(obj)[0]);

  useEffect(() => {
    setSelectedCustomer(convertToDescAndPk(findObjectByValue(invoiceFormData?.Customer, customers)));
    setSelectedSalesman(convertToDescAndPk(findObjectByValue(invoiceFormData?.Salesman, salesmen)));
  }, [invoiceFormData, tableForm]);

  useEffect(() => {
    setPostObject({
      invoice: {
        loginUser: loggedInUser,
        invoiceNo: invoiceFormData?.InvoiceNo,
        date: invoiceFormData?.Date,
        warehouse: invoiceFormData?.Warehouse.primaryKey,
        customer: selectedCustomer,
        salesman: selectedSalesman,
        ...(currentRouteName === 'point_of_sale_transaction' && {
          service: invoiceFormData?.service || '', 
          table: invoiceFormData?.table || '', 
        }),
        tax: invoiceFormData?.Tax,
      },
      tableFormData: tableForm,
      payment: {
        voucher: paymentData?.voucher || 0, 
        total: paymentData?.total || 0, 
        creditCard: paymentData?.creditCard || 0, 
        cash: paymentData?.cash || 0,
        debitCard: paymentData?.debitCard || 0, 
        online: paymentData?.online || 0,
        change: paymentData?.change || 0, 
      }
    });
  }, [invoiceFormData, selectedCustomer, selectedSalesman, tableForm]);

  useEffect(() => {
    const fetchData = async () => {
      const invoiceData = await TransactionService.fetchInvoiceFormData(endPoints.invoice, loggedInUser);
      const customerResponse = await TransactionService.fetchCustomers();
      const salesmenResponse = await TransactionService.fetchSalesmen();
      setTableFormData([]);
      setCustomers(customerResponse.data);
      setSalesmen(salesmenResponse.data);
      setInvoiceFormData(invoiceData.data);
      setOnPost(false);
    }
    fetchData();
  }, [currentRouteName, onPost]);

  return (
    <View style={styles.container}>
      <Header label={localizedLabel[label]} navigation={navigation} />
      <View style={styles.wizardContainer}>
        <Wizard onFinish={async () => {
          const res = await TransactionService.postInvoiceFormData(endPoints.sendInvoice, postObject); 
          setOnPost(true);
          console.log('res', res);
        }} title={['Invoice Data', 'Order Detail', 'Payment Detail']}>
          <InputForm
            data={invoiceFormData}
            invoiceHeaderPrompts={invoiceHeaders}
            setInvoiceFormData={setInvoiceFormData}
            customers={responseArrayObjectsToValues(customers)}
            salesmen={responseArrayObjectsToValues(salesmen)}
          />
          {/* Pass data without 'pk' to TableForm */}
          <TableForm 
          navigation={navigation} 
          data={removePkField(tableForm)} 
          handleBarcodeRead={handleBarcodeRead} 
          tax={!invoiceFormData ? 0 : parseInt(invoiceFormData.Tax)}
          headers={tableHeaders}
          setTableFormData={setTableFormData}
          setTotal={setTotal}
          isNotStock={!isStock}
          />
          {paymentDetails && <PaymentDetailForm data={paymentData} headers={paymentHeaders} setPaymentFormData={setPaymentData} />}
        </Wizard>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wizardContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TransactionModuleComponent;
