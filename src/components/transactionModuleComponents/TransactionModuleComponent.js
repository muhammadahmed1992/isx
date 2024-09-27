import {View, Text, StyleSheet} from 'react-native';
import Header from '../Header';
import InputForm from './InputForm';
import Wizard from './WizardForm';
import TableForm from './TableForm';
import { useEffect, useState } from 'react';
import moment from 'moment';
import { TransactionService } from '../../services/TransactionService';
import { store } from '../../redux/store';
import { Endpoints } from '../../utils';
import ApiService from '../../services/ApiService';

const mockFormData = {
  sales: {
    invoice_no: '1234',
    date: moment(new Date()).format('DD-MM-yyyy'),
    warehouse: 'ABCD',
    customer: '',
    salesman: '',
    tax: 10 + '%'
  },
  sales_order: {
    invoice_no: '1234',
    date: moment(new Date()).format('DD-MM-yyyy'),
    warehouse: 'ABCD',
    customer: '',
    salesman: '',
    tax: 10 + '%'
  },
  pos: {
    invoice_no: '1234',
    date: moment(new Date()).format('DD-MM-yyyy'),
    warehouse: 'ABCD',
    customer: '',
    spg: '',
    service_of_charge: '',
    tax: 10 + '%',
    table: ''
  },
  stock_adjusment: {
    invoice_no: '1234',
    date: Date.now(),
    warehouse: 'ABCD',
  }
}

const TransactionModuleComponent = ({
  navigation,
  currentRouteName,
  label,
  invoiceHeaderPrompts,
  endPoints
}) => {
  const loggedInUser = store.getState().Auth.user;
  const [invoiceFormData, setInvoiceFormData] = useState(); 
  const [tableForm, setTableFormData] = useState([]);  
  const [customers, setCustomers] = useState([]);
  const [salesmen, setSalesmen] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState({});
  const [selectedSalesman, setSelectedSalesman] = useState({});
  const [postObject, setPostObject] = useState();
  const [onPost, setOnPost] = useState(false);

  const removePkField = (dataArray) => {
    return dataArray.map(({ pk, ...rest }) => rest);
  };

  const handleBarcodeRead = async data => {
    if (!data) {
      setTableFormData([]);
      console.log('not here');
      return;
    }
    try {
      console.log('here');
      const res = await ApiService.get(Endpoints.salesTable + encodeURIComponent(data));
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
    console.log(postObject);
  })

  useEffect(() => {
    setSelectedCustomer(convertToDescAndPk(findObjectByValue(invoiceFormData?.Customer, customers)));
    setSelectedSalesman(convertToDescAndPk(findObjectByValue(invoiceFormData?.Salesman, salesmen)));
  }, [invoiceFormData, tableForm]);

  useEffect(() => {
    setPostObject({
      loginUser: loggedInUser,
      invoiceNo: invoiceFormData?.InvoiceNo,
      date: invoiceFormData?.Date,
      warehouse: invoiceFormData?.Warehouse.primaryKey,
      customer: selectedCustomer,
      salesman: selectedSalesman,
      tax: invoiceFormData?.Tax,
      tableFormData: tableForm  
    });
  }, [invoiceFormData, selectedCustomer, selectedSalesman, tableForm]);

  useEffect(() => {
    const fetchData = async () => {
      const invoiceData = await TransactionService.fetchInvoiceFormData(endPoints.sales, loggedInUser);
      const customerResponse = await TransactionService.fetchCustomers();
      const salesmenResponse = await TransactionService.fetchSalesmen();
      setCustomers(customerResponse.data);
      setSalesmen(salesmenResponse.data);
      setInvoiceFormData(invoiceData.data[0]);
      setOnPost(false);
    }
    fetchData();
  }, [currentRouteName, onPost]);

  return (
    <View style={styles.container}>
      <Header label={label} navigation={navigation} />
      <View style={styles.wizardContainer}>
        <Wizard onFinish={async () => {
          const res = await TransactionService.postInvoiceFormData(endPoints.sales, postObject); // Post with original data including 'pk'
          setOnPost(true);
          console.log('res', res);
        }} title={['Invoice Data', 'Fill Table', 'Invoice Detail']}>
          <InputForm
            data={invoiceFormData}
            invoiceHeaderPrompts={invoiceHeaderPrompts}
            setInvoiceFormData={setInvoiceFormData}
            customers={responseArrayObjectsToValues(customers)}
            salesmen={responseArrayObjectsToValues(salesmen)}
          />
          {/* Pass data without 'pk' to TableForm */}
          <TableForm navigation={navigation} data={removePkField(tableForm)} handleBarcodeRead={handleBarcodeRead}/>
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
