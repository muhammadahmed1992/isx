import React, { useState, useRef } from 'react';
import { Text, View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { setRegistrationKey } from '../../redux/reducers/registrationSlice';
import Header from '../Header';
import { Colors } from '../../utils';

const RegistrationComponent = ({ navigation, label = 'Registration Page' }) => {
  const [registrationKey, setRegistrationKeyValue] = useState('');
  const dispatch = useDispatch();
  const registrationKeyInputRef = useRef(null);

  const handleGetIMEI = async () => {
    try {
       const imei = '123456789012345678901';
      Alert.alert('IMEI Number', `Your IMEI Number is: ${imei}`);
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch IMEI number');
      console.error(error);
    }
  };

  const handleSubmit = () => {
    if (registrationKey.length !== 6) {
      Alert.alert('Invalid Key', 'Please enter a valid registration key');
      return;
    }
    dispatch(setRegistrationKey(registrationKey)); // Dispatch the action to set the registration key in Redux
    Alert.alert('Success', 'Registration key has been set');
    setRegistrationKeyValue(''); // Clear the input field
    registrationKeyInputRef.current.blur(); // Dismiss the keyboard
  };

  return (
    <View style={styles.container}>
      <Header label={label} navigation={navigation} />
      <Text style={styles.label}>{label}</Text>
      
      <TextInput
        ref={registrationKeyInputRef}
        style={styles.input}
        placeholder="Enter your registration key"
        value={registrationKey}
        onChangeText={setRegistrationKeyValue}
        returnKeyType="done"
        onSubmitEditing={handleSubmit}
      />

      <Button title="Set Registration Key" onPress={handleSubmit} />
      <Button title="Get IMEI Number" onPress={handleGetIMEI} color="#841584" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'white',
  },
  label: {
    fontSize: 24,
    marginVertical: 20,
  },
  input: {
    color: Colors.black,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});

export default RegistrationComponent;
