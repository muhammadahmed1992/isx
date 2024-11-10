import {View, Text, StyleSheet, Alert} from 'react-native';
import Header from '../Header';
import InputForm from './InvoiceForm';
import Wizard from './WizardForm';
import TableForm from './TableForm';
import {useEffect, useRef, useState} from 'react';
import Toast from 'react-native-easy-toast';
import {TransactionService} from '../../services/TransactionService';
import {store} from '../../redux/store';
import Loader from '../loader';
import ApiService from '../../services/ApiService';
import {useSelector} from 'react-redux';
import PaymentDetailForm from './PaymentForm';
import CustomAlert from '../AlertComponent';
import eventEmitter from '../../utils/EventEmitter';

const TransactionModuleComponent = ({
  navigation,
  currentRouteName,
  label,
  endPoints,
  paymentDetails,
}) => {
  const toastRef = useRef(null);
  const menu = useSelector(state => state.Locale.menu);
  const loggedInUser = store.getState().Auth.user;
  const isStock = currentRouteName === 'stock_adjusment';
  const isPos = currentRouteName === 'point_of_sale_transaction';
  const [invoiceFormData, setInvoiceFormData] = useState(null);
  const [paymentComplete, setPaymentComplete] = useState(
    !(currentRouteName === 'point_of_sale_transaction'),
  );
  const [loading, setLoading] = useState(false);
  const [tableForm, setTableFormData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [salesmen, setSalesmen] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedSalesman, setSelectedSalesman] = useState({});
  const [postObject, setPostObject] = useState();
  const [total, setTotal] = useState(0);
  const [alertVisible, setAlertVisible] = useState(false); // Custom alert visibility
  const [finishAlertVisible, setFinishAlertVisible] = useState(false); // State to handle the finish alert
  const [alertMessage, setAlertMessage] = useState(''); // Custom alert message
  const [alertTitle, setAlertTitle] = useState(''); // Custom alert title
  const [newButtonDisabled, setNewButtonDisabled] = useState(false);
  const [paymentData, setPaymentData] = useState({
    total: 0,
    voucher: 0,
    cash: 0,
    creditCard: 0,
    debitCard: 0,
    online: 0,
    change: 0,
  });

  const localizedLabel = useSelector(state => state.Locale.menu);
  const tableHeaders = useSelector(
    state => state.Locale.headers[currentRouteName].table,
  );
  const invoiceHeaders = useSelector(
    state => state.Locale.headers[currentRouteName].invoice,
  );
  const paymentHeaders =
    currentRouteName === 'point_of_sale_transaction'
      ? useSelector(state => state.Locale.headers[currentRouteName].payment)
      : {};

  const showCustomAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const showFinishAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setFinishAlertVisible(true);
  };

  useEffect(() => {
    setPaymentData(prev => ({
      ...prev,
      total: total,
    }));
  }, [total]);

  const handleBarcodeRead = async data => {
    if (!data) {
      setTableFormData([]);
      return;
    }
    try {
      const res = await ApiService.get(
        endPoints.table + encodeURIComponent(data),
      );
      if (res) setTableFormData([...tableForm, res.data.data[0]]);
    } catch (error) {}
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
      desc: value,
    };
  }

  const responseArrayObjectsToValues = data =>
    data.map(obj => Object.values(obj)[0]);

  useEffect(() => {
    setSelectedCustomer(
      convertToDescAndPk(
        findObjectByValue(invoiceFormData?.Customer, customers),
      ),
    );
    setSelectedSalesman(
      convertToDescAndPk(
        findObjectByValue(invoiceFormData?.Salesman, salesmen),
      ),
    );
  }, [invoiceFormData, tableForm]);

  useEffect(() => {
    setPostObject({
      invoice: {
        loginUser: loggedInUser,
        invoiceNo: invoiceFormData?.InvoiceNo,
        date: invoiceFormData?.Date,
        warehouse: invoiceFormData?.Warehouse?.primaryKey,
        customer: selectedCustomer,
        salesman: selectedSalesman,
        ...(currentRouteName === 'point_of_sale_transaction' && {
          service: invoiceFormData?.service || 0,
          table: invoiceFormData?.table || '',
        }),
        tax: invoiceFormData?.Tax,
      },
      tableFormData: tableForm,
      payment: {
        voucher: paymentData.voucher,
        total: paymentData.total,
        creditCard: paymentData.creditCard,
        cash: paymentData.cash,
        debitCard: paymentData.debitCard,
        online: paymentData.online,
        change: paymentData.change,
      },
    });
  }, [invoiceFormData, selectedCustomer, selectedSalesman, tableForm, paymentData]);
  useEffect(() => {
    
  })
  const resetData = () => {
    setInvoiceFormData();
    setTableFormData([]);
    setPaymentData({
      total: 0,
      voucher: 0,
      cash: 0,
      creditCard: 0,
      debitCard: 0,
      online: 0,
      change: 0,
    });
  }

  const fetchData = async () => {
    try {
      setLoading(true);
      const invoiceData = await TransactionService.fetchInvoiceFormData(
        endPoints.invoice,
        loggedInUser,
      );
      
      setTableFormData([]);
      setPaymentData({
        total: 0,
        voucher: 0,
        cash: 0,
        creditCard: 0,
        debitCard: 0,
        online: 0,
        change: 0,
      });
      
      setInvoiceFormData(invoiceData.data);
      setNewButtonDisabled(true);
      setLoading(false);
    } catch (e) {
      setAlertMessage(menu['error'], e.message);
      setNewButtonDisabled(false);
      setLoading(false);
    }
  };

  const handleFinish = async () => {
    try {
      if (
        tableForm.length !== 0 && // Table form check for all routes
        paymentComplete &&
        (currentRouteName === 'sales_transaction' ||
        currentRouteName === 'sales_order_transaction'
          ? selectedCustomer.pk
          : true) // Customer selection mandatory only for sales_transaction and sales_order_transaction
      ) {
        setLoading(true);
        const res = await TransactionService.postInvoiceFormData(
          endPoints.sendInvoice,
          postObject,
        );
        resetData();
        setNewButtonDisabled(false);
        showCustomAlert(menu['sent'], menu['complete']);
        eventEmitter.emit('transactionCompleted');
      } else {
        // Display appropriate warning based on missing fields
        let warningMessage = '';

        if (tableForm.length === 0) {
          warningMessage = menu['fill_order'];
        } else if (!paymentComplete) {
          warningMessage = menu['fill_payment'];
        } else if (
          (currentRouteName === 'sales_transaction' ||
            currentRouteName === 'sales_order_transaction') &&
          !selectedCustomer.pk
        ) {
          warningMessage = menu['fill_customer'];
        }

        showCustomAlert(menu['warning'], warningMessage);
      }

      setLoading(false);
    } catch (err) {
      throw new Error(err.message);
    } finally {
      setLoading(false);
    }
  }

  const onFinish = async () => {
    showFinishAlert(menu['confirmation'], menu['proceed']);
  }

  useEffect(() => {
    const fetchCustomersSalesmen = async () => {
      const customerResponse = await TransactionService.fetchCustomers();
      const salesmenResponse = await TransactionService.fetchSalesmen();
      setCustomers(customerResponse.data);
      setSalesmen(salesmenResponse.data);
    }
    fetchCustomersSalesmen();
  }, [currentRouteName])

  return (
    <View style={styles.container}>
      <Header label={localizedLabel[label]} navigation={navigation} />
      <View style={styles.wizardContainer}>
        <Wizard
          onNew={fetchData}
          onNewButtonDisabled={newButtonDisabled}
          onFinish={onFinish}
          title={[
            menu['transaction_1'],
            menu['transaction_2'],
            menu['transaction_3'],
          ]}
          icons={['pencil-alt', 'clipboard-list', 'money-bill']}>
          <InputForm
            data={invoiceFormData}
            invoiceHeaderPrompts={invoiceHeaders}
            setInvoiceFormData={setInvoiceFormData}
            customers={responseArrayObjectsToValues(customers)}
            salesmen={responseArrayObjectsToValues(salesmen)}
          />
          <TableForm
            navigation={navigation}
            data={tableForm}
            handleBarcodeRead={handleBarcodeRead}
            tax={!invoiceFormData ? 0 : parseInt(invoiceFormData.Tax)}
            headers={tableHeaders}
            setTableFormData={setTableFormData}
            setTotal={setTotal}
            isNotStock={!isStock}
            isNotPos={!isPos}
          />
          {paymentDetails && (
            <PaymentDetailForm
              data={paymentData}
              headers={paymentHeaders}
              setPaymentFormData={setPaymentData}
              setPaymentComplete={setPaymentComplete}
            />
          )}
        </Wizard>
      </View>
      <Toast
        ref={toastRef}
        position="bottom"
        positionValue={200}
        fadeInDuration={750}
        fadeOutDuration={1000}
        opacity={0.8}
      />
      {loading && <Loader />}
      <CustomAlert
        visible={alertVisible}
        onOkPress={() => setAlertVisible(false)}
        title={alertTitle}
        message={alertMessage}
      />
        <CustomAlert
          visible={finishAlertVisible}
          title={alertTitle}
          message={alertMessage}
          onOkPress={async () => {
            try {
              setFinishAlertVisible(false);
              await handleFinish();
            } catch (err) {
              showCustomAlert(menu['error'], err.message);
            }
          }}
          onCancelPress={() => {
            setFinishAlertVisible(false);
          }}
        />
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
