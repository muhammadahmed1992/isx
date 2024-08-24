import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useDispatch} from 'react-redux';
import {fetchAndSetLocaleData} from '../redux/reducers/localeSlice';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
const LanguagePopup = ({onClose}) => {
  const dispatch = useDispatch();

  const handleLanguageChange = language => {
    dispatch(fetchAndSetLocaleData(language));
    onClose();
  };

  return (
    <View>
      <Menu>
        <MenuTrigger text="Select Language" />
        <MenuOptions>
          <MenuOption
            onSelect={() => handleLanguageChange('en')}
            text="English"
          />
          <MenuOption
            onSelect={() => handleLanguageChange('id')}
            text="Indonesian"
          />
        </MenuOptions>
      </Menu>
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
