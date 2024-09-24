import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ModalComponent from '../reportsComponents/Model';
import InputComponent from '../InputComponent';
import InputField from '../reportsComponents/InputField';
import { Colors } from '../../utils';

const InputForm = ({ data, invoiceHeaderPrompts, setInvoiceFormData }) => {
  console.log({invoiceHeaderPrompts})
  const [formData, setFormData] = useState({});
  const [customerModal, setCustomerModal] = useState(false);
  const [salesmanModal, setSalesmanModal] = useState(false);
  const [customer, setCustomer] = useState('');
  const [salesman, setSalesman] = useState('');
  const [customers, setCustomers] = useState(data.customer);
  const [salesmen, setSalesmen] = useState(data.salesmen);

  // useEffect(() => {
  //   const fetchCustomers = async () => {
  //     try {
  //       const response = await ApiService.get(Endpoints.getCustomers);
  //       setCustomers(response.data);
  //     } catch (error) {
  //       console.error('Error fetching customers:', error);
  //     }
  //   };

  //   const fetchSalesmen = async () => {
  //     try {
  //       const response = await ApiService.get(Endpoints.getSalesmen);
  //       setSalesmen(response.data);
  //     } catch (error) {
  //       console.error('Error fetching salesmen:', error);
  //     }
  //   };

  //   fetchCustomers();
  //   fetchSalesmen();
  // }, []);

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
    setInvoiceFormData({
      ...formData,
      [field]: value,
    });
  };

  return (
    <View style={styles.formContainer}>
      {invoiceHeaderPrompts?.map((prompt, index) => {
        const fieldKey = Object.keys(data)[index];
        const fieldValue = data[fieldKey];

        if (prompt === "Customer" || prompt === "Salesman") {
          const isCustomerField = prompt === "Customer";
          const modalVisible = isCustomerField ? customerModal : salesmanModal;
          const setModalVisible = isCustomerField ? setCustomerModal : setSalesmanModal;
          const value = isCustomerField ? customer : salesman;
          const setValue = isCustomerField ? setCustomer : setSalesman;
          const items = isCustomerField ? customers : salesmen;

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
                  setValue(item);
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
              value={fieldValue}
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
  input: {
    color: Colors.black,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
  },
});

export default InputForm;
