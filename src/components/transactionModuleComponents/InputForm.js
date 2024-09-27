import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ModalComponent from '../reportsComponents/Model';
import InputComponent from '../InputComponent';
import InputField from '../reportsComponents/InputField';
import { Colors } from '../../utils';

const InputForm = (
  { 
    data, 
    invoiceHeaderPrompts, 
    setInvoiceFormData,
    customers,
    salesmen, 
  }) => {
  const [formData, setFormData] = useState({});
  const [customerModal, setCustomerModal] = useState(false);
  const [salesmanModal, setSalesmanModal] = useState(false);

  useEffect(() => {
    if (data && Object.keys(formData).length === 0) {
      const initialFormData = Object.keys(data).reduce((acc, key) => {
        acc[key] = data[key];
        return acc;
      }, {});
      setFormData(initialFormData);
      setInvoiceFormData(initialFormData);
    }
  }, [data, formData, setInvoiceFormData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    setInvoiceFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <View style={styles.formContainer}>
      {invoiceHeaderPrompts?.map((prompt, index) => {
        const fieldKey = !data ? '' : Object.keys(data)[index];
        const fieldValue = formData[fieldKey] || '';
        const disabledFields = ["Invoice No", "Warehouse", "Date", "Tax"];
        const isDisabled = disabledFields.includes(prompt); 

        if (prompt === "Warehouse") {
          const warehouseData = data?.Warehouse || {};
          const warehouseDescription = warehouseData?.description || '';

          return (
            <View key={index} style={styles.inputContainer}>
              <Text>{prompt}</Text>
              <InputComponent
                placeholder={prompt}
                value={warehouseDescription}
                onTextChange={text => {
                  
                }}
                disabled={true} 
              />
            </View>
          );
        }

        if (prompt === "Customer" || prompt === "Salesman") {
          const isCustomerField = prompt === "Customer";
          const modalVisible = isCustomerField ? customerModal : salesmanModal;
          const setModalVisible = isCustomerField ? setCustomerModal : setSalesmanModal;
          const items = isCustomerField ? customers : salesmen;
          const value = isCustomerField ? data?.Customer || '' : data?.Salesman || '';

          return (
            <View key={index} style={styles.inputContainer}>
              <Text>{prompt}</Text>
              <InputField
                enabled={true}
                onPress={() => setModalVisible(true)}
                placeholder={prompt}
                value={value}
              />
              <ModalComponent
                isVisible={modalVisible}
                onClose={() => setModalVisible(false)}
                items={items}
                onItemSelect={item => {
                  handleInputChange(fieldKey, item);
                  setModalVisible(false);
                }}
              />
            </View>
          );
        }

        return (
          <View key={index} style={styles.inputContainer}>
            <Text>{prompt}</Text>
            <InputComponent
              placeholder={prompt}
              placeholderColor={Colors.grey}
              onTextChange={text => handleInputChange(fieldKey, text)}
              value={prompt === 'Tax' ? `${fieldValue}%` : fieldValue}
              icon={false}
              debounceEnabled={false}
              disabled={isDisabled}
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

export default InputForm;
