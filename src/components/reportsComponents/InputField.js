import React from 'react';
import {Pressable, TextInput, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icon library
import {Fonts, Colors} from '../../utils';
import {RFValue} from 'react-native-responsive-fontsize';

const InputField = ({
  enabled,
  onPress,
  placeholder,
  value,
  containerStyle,
  inputStyle,
  onIconPress,
  iconName, 
  iconSize = RFValue(20), 
  iconColor = Colors.primary, 
}) => {
  return (
    <Pressable
      disabled={!enabled}
      onPress={onPress}
      style={containerStyle ? containerStyle : styles.container}>
      <TextInput
        autoCapitalize="none"
        style={inputStyle ? inputStyle : styles.input}
        onPress={onPress}
        editable={false}
        placeholder={placeholder}
        value={value}
        returnKeyType="next"
        placeholderTextColor={Colors.grey}
        />
        {iconName && ( 
          <Icon
            name={iconName}
            size={iconSize}
            color={iconColor}
            style={styles.icon}
            onPress={onIconPress}
          />
        )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center', // Adjust alignment for the icon and input
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
  icon: {
    marginRight: RFValue(10), // Add space between icon and input
  },
});

export default InputField;
