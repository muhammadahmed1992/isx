import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import InputComponent from '../InputComponent';
import { Colors, Commons } from '../../utils';

const isEqual = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b);
};


const PaymentDetailForm = ({
  data,
  headers,
  setPaymentFormData,
  setPaymentComplete,
}) => {
  const [formData, setFormData] = useState({});
  const [paymentValues, setPaymentValues] = useState({
    cash: data.cash,
    online: data.online,
    creditCard: data.creditCard,
    debitCard: data.debitCard,
    voucher: data.voucher,
  });
  
  useEffect(() => {
    if (data && !isEqual(data, formData)) {
      const initialFormData = Object.keys(data).reduce((acc, key) => {
        acc[key] = data[key];
        return acc;
      }, {});
      setFormData(initialFormData);
      setPaymentFormData(initialFormData);
    }
  }, [data, formData]);

  const handleInputChange = (field, value) => {
    const parsedValue = parseInt(value) || 0; 
    // Update the payment values
    setPaymentValues(prev => ({
      ...prev,
      [field]: parsedValue,
    }));

    // Calculate the total payment
    const totalPayment = Object.values({
      ...paymentValues,
      [field]: parsedValue, // Use the updated value for calculation
    }).reduce((sum, amount) => sum + amount, 0);

    // Calculate change
    const total = parseInt(formData.total) || 0; 
    let change = totalPayment - total;
    if (change < 0) {
      setPaymentComplete(false);
    } else {
      setPaymentComplete(true);
    }
    // Update formData and paymentFormData with the new values
    setFormData(prev => ({
      ...prev,
      [field]: parsedValue,
      change: change,
    }));
    setPaymentFormData(prev => ({
      ...prev,
      [field]: parsedValue,
      change: change,
    }));
  };

  return (
    <View style={styles.formContainer}>
      {Object.keys(headers).map((prompt, index) => {
        const fieldKey = !data ? '' : Object.keys(data)[index];
        const fieldValue = formData[fieldKey] || 0;
        
        return (
          <View key={index} style={styles.inputContainer}>
            <Text>{headers[prompt]}</Text>
            
            <InputComponent
              placeholder={headers[prompt]}
              placeholderColor={Colors.grey}
              onTextChange={text => {
                handleInputChange(fieldKey, Commons.removeCommas(text));
              }}
              disabled={['total', 'change'].includes(prompt)}
              value={Commons.formatCommaSeparated(fieldKey in paymentValues ? paymentValues[fieldKey].toString() : fieldValue.toString())} // Display payment value
              icon={false}
              debounceEnabled={false}
            />
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    width: '100%',
    paddingVertical: 5,
    paddingHorizontal: 10,
    height: 'auto',
  },
  inputContainer: {
    marginVertical: 10,
  },
});

export default PaymentDetailForm;
