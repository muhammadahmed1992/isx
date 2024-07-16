import {View, StatusBar, Text} from 'react-native';
import React, {useEffect} from 'react';
import {Colors, Commons, Fonts} from '../utils';
import {RFValue} from 'react-native-responsive-fontsize';
import {useSelector} from 'react-redux';

const Splash = props => {
  const isLoggedIn = useSelector(state => state.Auth.isLoggedIn);

  useEffect(() => {
    setTimeout(
      () => {
        if (isLoggedIn) {
          Commons.reset(props.navigation, 'dashboard');
        } else {
          Commons.navigate(props.navigation, 'auth');
        }
      },
      isLoggedIn ? 2000 : 3000,
    );
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <Text
        style={{
          fontFamily: Fonts.family.bold,
          fontSize: RFValue(40),
          color: Colors.white,
        }}>
        DATA{'\n'}VISUALIZER
      </Text>
    </View>
  );
};

export default Splash;
