import {View, Text, StyleSheet} from 'react-native';
import Header from '../Header';
import InputForm from './InputForm';
import Wizard from './WizardForm';
import TableForm from './TableForm';
import { useEffect, useState } from 'react';
import moment from 'moment';

const mockFormData = {
  sales: {
    invoice_no: '1234',
    date: moment(new Date()).format('DD-MM-yyyy'),
    warehouse: 'ABCD',
    customer: ['customer A', 'customer B', 'customer C'],
    salesmen: ['salesmen A', 'salesmen B', 'salesmen C'],
    tax: 10 + '%'
  },
  sales_order: {
    invoice_no: '1234',
    date: moment(new Date()).format('DD-MM-yyyy'),
    warehouse: 'ABCD',
    customer: ['customer A', 'customer B', 'customer C'],
    salesmen: ['salesmen A', 'salesmen B', 'salesmen C'],
    tax: 10 + '%'
  },
  pos: {
    invoice_no: '1234',
    date: moment(new Date()).format('DD-MM-yyyy'),
    warehouse: 'ABCD',
    customer: ['customer A', 'customer B', 'customer C'],
    spg: '',
    service_of_charge: 0,
    tax: 10 + '%',
    table: ''
  },
  stock_adjusment: {
    invoice_no: '1234',
    date: Date.now(),
    warehouse: 'ABCD',
  }
}
const mockTableData = [
  { stockId: '001', stockName: 'Item A', price: '100', qty: '2' },
  { stockId: '002', stockName: 'Item B', price: '150', qty: '3' },
  { stockId: '003', stockName: 'Item C', price: '200', qty: '1' },
]
const TransactionModuleComponent = ({
  navigation,
  currentRouteName,
  label,
  invoiceHeaderPrompts
}) => {
  const [invoiceFormData, setInvoiceFormData] = useState(); 
  const [tableData, setTableData] = useState(mockTableData);  
  useEffect(() => {
    console.log(tableData);
    console.log("=-=-=-=-=-=-=-=-=-=-=");
  })
  return (
    <View style={styles.container}>
      <Header label={label} navigation={navigation} />
      <View style={styles.wizardContainer}>
        <Wizard title={['Invoice Data', 'Fill Table', 'Invoice Detail']}>
          <InputForm
            data={mockFormData[currentRouteName]}
            invoiceHeaderPrompts={invoiceHeaderPrompts}
            setInvoiceFormData={setInvoiceFormData}
          />
          <TableForm navigation={navigation} data={tableData} setTableData={setTableData}/>
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
