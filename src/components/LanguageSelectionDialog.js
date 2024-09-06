import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAndSetLocaleData } from '../redux/reducers/localeSlice';
import Toggle from 'react-native-toggle-element';
import { Image, Svg } from 'react-native-svg';

const LanguagePopup = ({ onClose }) => {
  const dispatch = useDispatch();
  const language = useSelector(state => state.Locale.language);
  const [toggleValue, setToggleValue] = useState(language == "id" ? true : false);

  const handleLanguageChange = language => {
    dispatch(fetchAndSetLocaleData(language));
    onClose();
  };

  const handleToggle = newState => {
    setToggleValue(newState);
    if (newState) {
      handleLanguageChange('id'); // Indonesian
    } else {
      handleLanguageChange('en'); // English
    }
  };
  console.log("toggleValue", toggleValue, language)
  return (
    <View>
      <Toggle
        value={toggleValue}
        onPress={newState => handleToggle(newState)}
        leftComponent={<Text style={{ color: 'white' }}>En</Text>}
        rightComponent={<Text style={{ color: 'white' }}>Id</Text>}
        trackBar={{
          activeBackgroundColor: '#E03C31',
          inActiveBackgroundColor: '#0033A0',
          borderActiveColor: '#E03C31',
          borderInActiveColor: '#0033A0',
          borderWidth: 2,
          width: 75,
          height: 40,
          radius: 25,
        }}
        disabledTitleStyle={{ color: 'white' }}
        thumbButton={{
          width: 40,
          height: 40,
          radius: 30,
          activeBackgroundColor: '#0033A0',
          inActiveBackgroundColor: '#E03C31',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f8f8f8',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  menuTrigger: {
    fontSize: 24,
    color: 'black',
  },
});

export default LanguagePopup;
