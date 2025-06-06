import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import InputComponent from '../InputComponent';
import { Colors, Commons } from '../../utils';
import { useSelector } from 'react-redux';

const fieldsToBeNumeric = ['cash', 'online', 'creditCard', 'debitCard', 'voucher'];

const toCamelCase = (text) => {
  return text.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

const PaymentDetailForm = ({ data = {}, headers = {}, setPaymentFormData, setPaymentComplete }) => {
  const others = useSelector(state => state.Locale.others);
  const [formData, setFormData] = useState({});
  const [paymentValues, setPaymentValues] = useState({});

  // Normalize headers to camelCase
  const normalizedHeaders = Object.keys(headers).reduce((acc, key) => {
    acc[toCamelCase(key)] = headers[key];
    return acc;
  }, {});

  // Calculate change and determine if payment is complete
  const calculateChange = (payments, total) => {
    const totalPayment = Object.values(payments).reduce((sum, amount) => sum + amount, 0);
    const change = totalPayment - total;
    setPaymentComplete?.(change >= 0);
    return change;
  };

  useEffect(() => {
    if (data && Object.keys(data).length > 0) {
      const initialFormData = {};
      const initialPayments = {};

      Object.keys(data).forEach((key) => {
        const camelKey = toCamelCase(key);
        const value = parseInt(data[key]) || 0;
        initialFormData[camelKey] = value;
        if (fieldsToBeNumeric.includes(camelKey)) {
          initialPayments[camelKey] = value;
        }
      });

      const total = initialFormData.total || 0;
      const change = calculateChange(initialPayments, total);

      initialFormData.change = change;

      setFormData(initialFormData);
      setPaymentValues(initialPayments);
      setPaymentFormData?.(initialFormData);
    }
  }, [JSON.stringify(data)]); // Trigger only on deep changes

  const handleInputChange = (field, value) => {
    const parsedValue = parseInt(value) || 0;

    const updatedPayments = {
      ...paymentValues,
      [field]: parsedValue,
    };

    const total = parseInt(formData.total) || 0;
    const change = calculateChange(updatedPayments, total);

    const updatedForm = {
      ...formData,
      [field]: parsedValue,
      change,
    };

    setPaymentValues(updatedPayments);
    setFormData(updatedForm);
    setPaymentFormData?.(updatedForm);
  };

  const handleFillAmount = (field) => {
    const total = parseInt(formData.total) || 0;
    const newPayments = fieldsToBeNumeric.reduce((acc, key) => {
      acc[key] = key === field ? total : 0;
      return acc;
    }, {});
    const change = calculateChange(newPayments, total);

    const updatedForm = {
      ...formData,
      ...newPayments,
      change,
    };

    setPaymentValues(newPayments);
    setFormData(updatedForm);
    setPaymentFormData?.(updatedForm);
  };

  const handleClearAmount = (field) => {
    const newPayments = { ...paymentValues, [field]: 0 };
    const total = parseInt(formData.total) || 0;
    const change = calculateChange(newPayments, total);

    const updatedForm = {
      ...formData,
      [field]: 0,
      change,
    };

    setPaymentValues(newPayments);
    setFormData(updatedForm);
    setPaymentFormData?.(updatedForm);
  };

  const disabledFields = ['total', 'change'];

  return (
    <View style={styles.formContainer}>
      {Object.keys(normalizedHeaders).map((fieldKey, index) => {
        const label = normalizedHeaders[fieldKey];
        const fieldValue = formData[fieldKey] || 0;

        return (
          <View key={index} style={styles.row}>
            <Text style={styles.label}>{label}</Text>

            <InputComponent
              placeholder={label}
              placeholderColor={Colors.grey}
              onTextChange={(text) => {
                handleInputChange(fieldKey, Commons.removeCommas(text));
              }}
              disabled={disabledFields.includes(fieldKey)}
              value={Commons.formatCommaSeparated(
                paymentValues[fieldKey]?.toString() || fieldValue.toString()
              )}
              icon={false}
              debounceEnabled={false}
              keyboardType={fieldsToBeNumeric.includes(fieldKey) ? 'decimal-pad' : 'default'}
              inputMode="decimal"
            />

            {!disabledFields.includes(fieldKey) && (
              <>
                <TouchableOpacity onPress={() => handleFillAmount(fieldKey)} style={styles.fillButton}>
                  <Text style={styles.buttonText}>{others["fill"]}</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleClearAmount(fieldKey)} style={styles.clearButton}>
                  <Text style={styles.buttonText}>{others["clear"]}</Text>
                </TouchableOpacity>
              </>
            )}
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
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    flexWrap: 'wrap',
  },
  label: {
    width: 80,
    fontWeight: 'bold',
    marginRight: 8,
  },
  fillButton: {
    backgroundColor: Colors.blue,
    width: 100,
    height: 35,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    marginLeft: 6,
  },
  clearButton: {
    backgroundColor: Colors.grey,
    width: 100,
    height: 35,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    marginLeft: 4,
  },
  buttonText: {
    color: '#000',
    fontSize: 12,
  },
});

export default PaymentDetailForm;