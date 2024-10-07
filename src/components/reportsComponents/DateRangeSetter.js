import React from 'react';
import { View, TouchableOpacity, TextInput, Text, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize'; // Adjust according to your setup
import {Colors, Fonts} from '../../utils';

const DateRangeSetter = ({
  dateValFrom,
  dateValTo,
  onDateFromPress,
  onDateToPress,
  setDateValFrom,
  setDateValTo,
  enabled = true,
  containerStyle,
  inputStyle,
}) => {
  return (
    <View style={(containerStyle)? containerStyle: styles.container}>
      <TouchableOpacity
        onPress={() => enabled && onDateFromPress()}
        style={[
          styles.button,
          { borderColor: enabled ? Colors.primary : Colors.disabled },
        ]}
        disabled={!enabled}
      >
        <TextInput
          autoCapitalize={'none'}
          style={[styles.input, inputStyle]}
          onPress={() => enabled && onDateFromPress()}
          placeholder="Date From"
          value={dateValFrom}
          onChangeText={setDateValFrom}
          returnKeyType="done"
          placeholderTextColor={Colors.grey}
          editable={false}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => enabled && onDateToPress()}
        style={[
          styles.button,
          { borderColor: enabled ? Colors.primary : Colors.disabled },
        ]}
        disabled={!enabled}
      >
        <TextInput
          autoCapitalize={'none'}
          style={(inputStyle)? inputStyle: styles.input}
          onPress={() => enabled && onDateToPress()}
          placeholder="Date To"
          value={dateValTo}
          onChangeText={setDateValTo}
          returnKeyType="done"
          placeholderTextColor={Colors.grey}
          editable={false}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: RFValue(10),
    justifyContent: 'space-between',
  },
  button: {
    flex: 0.48,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: RFValue(10),
    paddingHorizontal: RFValue(10),
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

export default DateRangeSetter;
