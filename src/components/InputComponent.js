import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors, Fonts } from '../utils';
import { RFValue } from 'react-native-responsive-fontsize';

const InputComponent = ({ 
  placeholder = 'Enter value...', 
  placeholderColor = Colors.grey, 
  onTextChange, 
  onIconPress,
  value, 
  icon = true,
  iconComponent,
  debounceEnabled = true, 
  disabled = false,
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
      if (onTextChange) {
        onTextChange(text);
      }
    }
  };

  const handleSearchButtonPress = () => {

    if (onIconPress) {
      onIconPress(localValue); 
    }
  };

  return (
    <View style={[styles.container, disabled && styles.disabledContainer]}>
      <TextInput
        style={[styles.input, disabled && styles.disabledInput]}
        placeholder={placeholder}
        placeholderTextColor={disabled ? Colors.disabledText : placeholderColor}
        value={localValue}
        onChangeText={handleChangeText}
        returnKeyType="search"
        editable={!disabled}  
      />
      <TouchableOpacity 
        onPress={handleSearchButtonPress} 
        style={styles.button}
        disabled={disabled}  
      >
        {!iconComponent? (icon && <Ionicons name="search" size={20} color={disabled ? Colors.disabledIcon : Colors.primary}/>) : (iconComponent)}
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
  disabledContainer: {
    borderColor: Colors.primary,  
  },
  input: {
    flex: 1,
    height: RFValue(40),
    color: Colors.primary,
    fontSize: RFValue(14),
    fontFamily: Fonts.family.bold,
  },
  disabledInput: {
    color: Colors.black,  
  },
  button: {
    padding: 10,
  },
  disabledIcon: {
    color: Colors.primary,  
  },
});

export default InputComponent;
