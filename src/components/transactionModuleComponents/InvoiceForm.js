import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ModalComponent from '../reportsComponents/Model';
import InputComponent from '../InputComponent';
import InputField from '../reportsComponents/InputField';
import {Colors, Commons} from '../../utils';

const isEqual = (a, b) => {
  return JSON.stringify(a) === JSON.stringify(b);
};

const InvoiceForm = ({
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
    if (data && !isEqual(data, formData)) {
      const initialFormData = Object.keys(data).reduce((acc, key) => {
        acc[key] = data[key];
        return acc;
      }, {});
      setFormData(initialFormData);
      setInvoiceFormData(initialFormData);
    }
  }, [data]);

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
      {Object.keys(invoiceHeaderPrompts).map((prompt, index) => {
        const fieldKey = !data ? '' : Object.keys(data)[index];
        const fieldValue = formData[fieldKey] || '';
        const disabledFields = ['invoice_no', 'warehouse', 'date'];
        const isDisabled = disabledFields.includes(prompt);

        if (prompt === 'warehouse') {
          const warehouseData = data?.Warehouse || {};
          const warehouseDescription = warehouseData?.description || '';

          return (
            <View key={index} style={styles.inputContainer}>
              <Text>{invoiceHeaderPrompts[prompt]}</Text>
              <InputComponent
                placeholder={invoiceHeaderPrompts[prompt]}
                placeholderColor={Colors.grey}
                value={!warehouseDescription? invoiceHeaderPrompts[prompt] : warehouseDescription}
                onTextChange={text => {}}
                disabled={true}
                icon={false}
              />
            </View>
          );
        }

        if (prompt === 'customer' || prompt === 'salesman') {
          const isCustomerField = prompt === 'customer';
          const modalVisible = isCustomerField ? customerModal : salesmanModal;
          const setModalVisible = isCustomerField
            ? setCustomerModal
            : setSalesmanModal;
          const items = isCustomerField ? customers : salesmen;
          const value = isCustomerField
            ? data?.Customer || ''
            : data?.Salesman || '';

          return (
            <View key={index} style={styles.inputContainer}>
              <Text>{invoiceHeaderPrompts[prompt]}</Text>
              <InputField
                enabled={true}
                onPress={() => setModalVisible(true)}
                placeholder={invoiceHeaderPrompts[prompt]}
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

        let value;
        if (prompt === 'tax') {
          value = `${fieldValue}${fieldValue.includes('%') ? '' : '%'}`;
        } else if (prompt === 'service_charge') {
          value = Commons.formatCommaSeparated(fieldValue);
        } else {
          value = fieldValue;
        }
        return (
          <View key={index} style={styles.inputContainer}>
            <Text>{invoiceHeaderPrompts[prompt]}</Text>
            <InputComponent
              placeholder={invoiceHeaderPrompts[prompt]}
              placeholderColor={Colors.grey}
              onTextChange={text => {
                const updatedText =
                  prompt === 'tax' ? text.replace('%', '') : text;
                handleInputChange(
                  fieldKey,
                  prompt === 'service_charge'
                    ? Commons.removeCommas(updatedText)
                    : updatedText
                );
              }}
              value={!value && isDisabled? invoiceHeaderPrompts[prompt] : value}
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
  placeholderColor: {
    color: Colors.grey,
  }
});

export default InvoiceForm;
