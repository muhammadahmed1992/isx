import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors, Fonts } from '../utils';
import { RFValue } from 'react-native-responsive-fontsize';

const InputComponent = ({ 
  placeholder = 'Enter value...', 
  placeholderColor = Colors.grey, 
  onTextChange, 
  value, 
  debounceEnabled = true, 
}) => {
  const [localValue, setLocalValue] = useState(value);
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  const handleChangeText = (text) => {
    setLocalValue(text);

    if (debounceEnabled) {
      // Debounce logic
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      const newTimeoutId = setTimeout(() => {
        if (onTextChange) {
          onTextChange(text); 
        }
      }, 500); 

      setTimeoutId(newTimeoutId);
    } else {
      // No debounce, call immediately
      if (onTextChange) {
        onTextChange(text);
      }
    }
  };

  const handleSearchButtonPress = () => {
    if (onTextChange) {
      onTextChange(localValue); 
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        value={localValue}
        onChangeText={handleChangeText}
        returnKeyType="search"
      />
      <TouchableOpacity onPress={handleSearchButtonPress} style={styles.button}>
        <Ionicons name="search" size={20} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: RFValue(10),
    paddingHorizontal: RFValue(10),
    marginHorizontal: RFValue(10),
    marginTop: RFValue(10),
  },
  input: {
    flex: 1,
    height: RFValue(40),
    color: Colors.primary,
    fontSize: RFValue(14),
    fontFamily: Fonts.family.bold,
  },
  button: {
    padding: 10,
  },
});

export default InputComponent;
