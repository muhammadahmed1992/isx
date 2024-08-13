import React from 'react';
import { Pressable, TextInput, StyleSheet } from 'react-native';
import { Fonts, Colors } from '../utils';

const InputField = ({
  enabled,
  onPress,
  placeholder,
  value,
  containerStyle,
  inputStyle,
}) => {
  return (
    <Pressable
      disable={!enabled}
      onPress={onPress}
      style={(containerStyle)? containerStyle: styles.container}>
      <TextInput
        autoCapitalize={'none'}
        style={(inputStyle)? inputStyle: styles.input}
        onPress={onPress}
        editable={false}
        placeholder={placeholder}
        value={value}
        returnKeyType="next"
        placeholderTextColor={Colors.grey}
      />
    </Pressable>
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
    fontSize: RFValue(16),
    fontFamily: Fonts.family.bold,
  },
});

export default InputField;