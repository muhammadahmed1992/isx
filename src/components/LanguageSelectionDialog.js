import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAndSetLocaleData } from '../redux/reducers/localeSlice';
import Toggle from 'react-native-toggle-element';

const LanguageToggle = () => {
  const dispatch = useDispatch();
  const language = useSelector(state => state.Locale.language); // Get current language from store
  const [toggleValue, setToggleValue] = useState(language === 'id'); // Initialize state from Redux

  useEffect(() => {
    // Update toggle based on the current language
    setToggleValue(language === 'id');
  }, [language]);

  const handleLanguageChange = language => {
    dispatch(fetchAndSetLocaleData(language));
  };

  const handleToggle = newState => {
    console.log(`in toggle: ${newState}`);
    const newLanguage = newState ? 'id' : 'en'; // Determine new language based on toggle state
    setToggleValue(newState);
    handleLanguageChange(newLanguage); // Update Redux with the new language
  };

  return (
    <View>
      <Toggle
        value={toggleValue}
        onPress={newState => handleToggle(newState)}
        leftComponent={<Text style={styles.text}>Id</Text>}
        rightComponent={<Text style={styles.text}>En</Text>}
        trackBar={styles.trackBar}
        thumbButton={styles.thumbButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: 'white',
  },
  trackBar: {
    activeBackgroundColor: '#E03C31',
    inActiveBackgroundColor: '#0033A0',
    borderActiveColor: '#E03C31',
    borderInActiveColor: '#0033A0',
    borderWidth: 2,
    width: 75,
    height: 40,
    radius: 25,
  },
  thumbButton: {
    width: 40,
    height: 40,
    radius: 30,
    activeBackgroundColor: '#0033A0',
    inActiveBackgroundColor: '#E03C31',
  },
});

export default LanguageToggle;
