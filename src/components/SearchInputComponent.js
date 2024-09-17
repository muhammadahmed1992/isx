import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors, Fonts } from '../utils';
import { RFValue } from 'react-native-responsive-fontsize';

const SearchInputComponent = ({
  placeholder = 'Search...',
  placeholderColor = Colors.grey,
  onSearch,
  onChangeText,
  value
}) => {
  const [timeoutId, setTimeoutId] = useState(null);

  const handleChangeText = (text) => {
    if (onChangeText) {
      onChangeText(text);
    }
    
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(() => {
      if (onSearch) {
        onSearch();
      }
    }, 500); 

    setTimeoutId(newTimeoutId);
  };

  const handleSearchButtonPress = () => {
    if (onSearch) {
      onSearch();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={placeholderColor}
        value={value}
        onChangeText={handleChangeText}
        returnKeyType="search"
      />
      <TouchableOpacity onPress={handleSearchButtonPress} style={styles.button}>
        <Ionicons name="search" size={24} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: RFValue(10),
    paddingHorizontal: RFValue(10),
    marginHorizontal: RFValue(10),
    marginTop: RFValue(10),
  },
  input: {
    flex: 1,
    height: RFValue(50),
    color: Colors.primary,
    fontSize: RFValue(14),
    fontFamily: Fonts.family.bold,
  },
  button: {
    padding: 10,
  },
});

export default SearchInputComponent;
