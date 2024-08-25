import React, {useState} from 'react';
import {RFValue} from 'react-native-responsive-fontsize';
import {Commons, Colors, Fonts} from '../utils';
import {Platform, View, TouchableOpacity, Text} from 'react-native';
import LanguagePopup from './LanguageSelectionDialog';

import Icon from 'react-native-vector-icons/Ionicons';

const Header = ({label, navigation}) => {
  const [isPopupVisible, setPopupVisible] = useState(false);

  const togglePopup = () => {
    setPopupVisible(!isPopupVisible);
  };
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: Colors.primary,
          paddingHorizontal: RFValue(15),
          paddingBottom: RFValue(15),
          paddingTop: Platform.OS === 'android' ? RFValue(15) : RFValue(50),
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.openDrawer();
          }}>
          <Icon name="menu" size={Commons.size(25)} color={Colors.white} />
        </TouchableOpacity>

        <Text
          style={{
            flex: 1,
            fontFamily: Fonts.family.bold,
            color: Colors.white,
            textAlign: 'center',
          }}>
          {label}
        </Text>
        <LanguagePopup onClose={togglePopup} />
      </View>
    </>
  );
};

export default Header;
