import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import InputComponent from '../InputComponent';
import { Colors } from '../../utils';

const PaymentDetailForm = ({
  data,
  headers,
  setPaymentFormData,
}) => {
  const [formData, setFormData] = useState({});
  const [paymentValues, setPaymentValues] = useState({
    cash: 0,
    online: 0,
    creditCard: 0,
    debitCard: 0,
    voucher: 0,
  });

  useEffect(() => {
    if (data && Object.keys(formData).length === 0) {
      const initialFormData = Object.keys(data).reduce((acc, key) => {
        acc[key] = data[key];
        return acc;
      }, {});
      console.log({ initialFormData });
      setFormData(initialFormData);
      setPaymentFormData(initialFormData);
    }
  }, [data, formData, setPaymentFormData]);

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
    const change = totalPayment - total;

    // Update formData and paymentFormData with the new values
    setFormData(prev => ({
      ...prev,
      change: change,
    }));
    setPaymentFormData(prev => ({
      ...prev,
      change: change,
    }));
  };

  return (
    <View style={styles.formContainer}>
      {Object.keys(headers).map((prompt, index) => {
        const fieldKey = !data ? '' : Object.keys(data)[index];
        const fieldValue = formData[fieldKey] || 0;
        console.log(fieldKey, fieldValue);
        
        return (
          <View key={index} style={styles.inputContainer}>
            <Text>{headers[prompt]}</Text>
            <InputComponent
              placeholder={headers[prompt]}
              placeholderColor={Colors.grey}
              onTextChange={text => {
                handleInputChange(fieldKey, text);
              }}
              value={fieldKey in paymentValues ? paymentValues[fieldKey].toString() : fieldValue.toString()} // Display payment value
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
