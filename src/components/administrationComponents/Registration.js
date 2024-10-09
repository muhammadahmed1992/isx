import React, { useState, useRef } from 'react';
import { Text, View, TextInput, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import Button from '../reportsComponents/Button';
import { useDispatch, useSelector } from 'react-redux';
import { setRegistrationKey } from '../../redux/reducers/registrationSlice';
import { setIsRegistered } from '../../redux/reducers/authSlice';
import Header from '../Header';
import { Colors } from '../../utils';
import DeviceInfo from 'react-native-device-info';
import Clipboard from '@react-native-clipboard/clipboard'; // Clipboard import
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the Icon
import ApiService from '../../services/ApiService';
import { Endpoints } from '../../utils';
import CustomAlert from '../AlertComponent'; // Use the CustomAlert Component

const RegistrationComponent = ({ navigation, label = 'Registration Page' }) => {
  const [registrationKey, setRegistrationKeyValue] = useState('');
  const [modalVisible, setModalVisible] = useState(false); // Modal visibility state
  const [imei, setImei] = useState(''); // IMEI state
  const [alertVisible, setAlertVisible] = useState(false); // Custom alert visibility
  const [alertMessage, setAlertMessage] = useState(''); // Custom alert message
  const [alertTitle, setAlertTitle] = useState(''); // Custom alert title
  const dispatch = useDispatch();
  const menu = useSelector(state => state.Locale.menu);
  const registrationKeyInputRef = useRef(null);

  const handleGetIMEI = async () => {
    try {
      const imeiNumber = await DeviceInfo.getUniqueId();
      setImei(imeiNumber);
      setModalVisible(true); // Show modal after fetching IMEI
    } catch (error) {
      setImei('Error fetching IMEI');
    }
  };

  async function fetchImei() {
    try {
      const imei = await DeviceInfo.getUniqueId();
      return imei;
    } catch (error) {
      showCustomAlert('Error', 'Failed to retrieve device identifier');
    }
  }

  const handleSubmit = async () => {
    if (registrationKey.length !== 5) {
      showCustomAlert('Invalid Key', 'Please enter a valid registration key');
      return;
    }
    const deviceIdentifier = await fetchImei();
    if (!deviceIdentifier) return;

    const licenseValidationResponse = await ApiService.get(
      Endpoints.licenseValidation + deviceIdentifier,
    );
    const hashedDeviceId = licenseValidationResponse.data.data; 
    
    // Compare the hashed device identifier with the registration key
    if (hashedDeviceId === registrationKey) {
      dispatch(setRegistrationKey(registrationKey));
      dispatch(setIsRegistered(true));
      showCustomAlert('Success', 'Registration key has been set');
    } else {
      dispatch(setIsRegistered(false));
      showCustomAlert('Invalid Key', 'Please enter a valid registration key');
    }

    setRegistrationKeyValue(''); // Clear the input field
    registrationKeyInputRef.current.blur(); // Dismiss the keyboard
  };

  const showCustomAlert = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setAlertVisible(true);
  };

  const copyToClipboard = () => {
    Clipboard.setString(imei);
    setModalVisible(false); // Close the modal after copying
  };

  return (
    <View style={styles.container}>
      <Header label={menu[label]} navigation={navigation} />
      
      <TextInput
        ref={registrationKeyInputRef}
        style={styles.input}
        placeholderTextColor={Colors.grey}
        placeholder={menu['registration_placeholder']}
        value={registrationKey}
        onChangeText={setRegistrationKeyValue}
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <Button title={menu['get_dev_num']} onPress={handleGetIMEI} color="#841584" />
        <Button title={menu['set_key']} onPress={handleSubmit} />
      </View>

      {/* Custom Modal for displaying IMEI with Copy icon */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{menu['dev_num']}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              <Text style={styles.imeiText}>{imei}</Text>
              <TouchableOpacity style={styles.iconContainer} onPress={copyToClipboard}>
                <Icon name="content-copy" size={24} color={Colors.black} />
              </TouchableOpacity>
            </View>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      {/* Custom Alert Component */}
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
    backgroundColor: 'white',
  },
  input: {
    borderRadius: 10,
    alignSelf: 'center',
    color: Colors.black,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 40,
    width: '85%',
    paddingHorizontal: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imeiText: {
    fontSize: 16,
    marginBottom: 20,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconText: {
    fontSize: 16,
    marginLeft: 10,
  },
});

export default RegistrationComponent;
