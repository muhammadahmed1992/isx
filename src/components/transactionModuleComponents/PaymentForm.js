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

  // Function to calculate the total payment and change
  const calculateChange = (payments, total) => {
    const totalPayment = Object.values(payments).reduce((sum, amount) => sum + amount, 0);
    const change = totalPayment - total;
    setPaymentComplete(change >= 0); // Set payment as complete if change is >= 0
    return change; // Return the change, can be negative if totalPayment < total
  };

  useEffect(() => {
    if (data && !isEqual(data, formData)) {
      const initialFormData = Object.keys(data).reduce((acc, key) => {
        acc[key] = data[key];
        return acc;
      }, {});

      setFormData(initialFormData);
      setPaymentFormData(initialFormData);

      // Calculate initial change based on total and initial payment fields
      const total = parseInt(data.total) || 0;
      const change = calculateChange(paymentValues, total);

      setFormData(prev => ({
        ...prev,
        change: change, // Update formData with initial change
      }));
      setPaymentFormData(prev => ({
        ...prev,
        change: change, // Update paymentFormData with initial change
      }));
    }
  }, [data, formData]);

  const handleInputChange = (field, value) => {
    const parsedValue = parseInt(value) || 0;

    // Update the payment values
    setPaymentValues(prev => ({
      ...prev,
      [field]: parsedValue,
    }));

    // Calculate the new change
    const total = parseInt(formData.total) || 0;
    const change = calculateChange({ ...paymentValues, [field]: parsedValue }, total);

    // Update formData and paymentFormData with the new values
    setFormData(prev => ({
      ...prev,
      [field]: parsedValue,
      change: change, // Update the change even if it's negative
    }));
    setPaymentFormData(prev => ({
      ...prev,
      [field]: parsedValue,
      change: change, // Update the change even if it's negative
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
