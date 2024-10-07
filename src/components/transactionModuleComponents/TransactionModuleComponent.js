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
  const [invoiceFormData, setInvoiceFormData] = useState();
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
  const [onPost, setOnPost] = useState(false);
  const [total, setTotal] = useState(0);
  const [alertVisible, setAlertVisible] = useState(false); // Custom alert visibility
  const [alertMessage, setAlertMessage] = useState(''); // Custom alert message
  const [alertTitle, setAlertTitle] = useState(''); // Custom alert title
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

  const showToast = msg => {
    toastRef.current.show(msg, 2000);
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
        voucher: paymentData.voucher || 0,
        total: paymentData.total || 0,
        creditCard: paymentData.creditCard || 0,
        cash: paymentData.cash || 0,
        debitCard: paymentData.debitCard || 0,
        online: paymentData.online || 0,
        change: paymentData.change || 0,
      },
    });
  }, [invoiceFormData, selectedCustomer, selectedSalesman, tableForm]);

  const fetchData = async () => {
    setLoading(true);
    const invoiceData = await TransactionService.fetchInvoiceFormData(
      endPoints.invoice,
      loggedInUser,
    );
    const customerResponse = await TransactionService.fetchCustomers();
    const salesmenResponse = await TransactionService.fetchSalesmen();
    setTableFormData([]);
    setCustomers(customerResponse.data);
    setSalesmen(salesmenResponse.data);
    setInvoiceFormData(invoiceData.data);
    setOnPost(false);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [currentRouteName, onPost]);

  return (
    <View style={styles.container}>
      <Header label={localizedLabel[label]} navigation={navigation} />
      <View style={styles.wizardContainer}>
        <Wizard
          onFinish={async () => {
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
                // const res = await TransactionService.postInvoiceFormData(
                //   endPoints.sendInvoice,
                //   postObject,
                // );
                showCustomAlert('Sent', 'Transcation Complete');
                setOnPost(true);
              } else {
                // Display appropriate warning based on missing fields
                let warningMessage = '';

                if (tableForm.length === 0) {
                  warningMessage = 'Please Fill the Order Details';
                } else if (!paymentComplete) {
                  warningMessage = 'Payment is not complete';
                } else if (
                  (currentRouteName === 'sales_transaction' ||
                    currentRouteName === 'sales_order_transaction') &&
                  !selectedCustomer.pk
                ) {
                  warningMessage = 'Please Select A Customer';
                }

                showCustomAlert('Warning', warningMessage);
              }

              setLoading(false);
            } catch (err) {}
          }}
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
