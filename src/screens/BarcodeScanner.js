import React, {useEffect} from 'react';
import {useWindowDimensions, View} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {Commons} from '../utils';

const BarcodeScanner = ({navigation, route}) => {
  const {height, width} = useWindowDimensions();
  let result = 0;

  useEffect(() => {
    // Set the onBarcodeRead function using navigation.setOptions
    navigation.setOptions({
      onBarcodeRead: route.params.onBarcodeRead,
    });
  }, [navigation, route.params]);

  const handleBarcodeRead = event => {
    if (result > 0) return;

    // Call the onBarcodeRead function if it exists
    if (navigation.getParam('onBarcodeRead')) {
      navigation.getParam('onBarcodeRead')(event.nativeEvent.codeStringValue);
      result += 1;
      Commons.navigate(navigation, route.params.returnScreen);
    }
  };

  return (
    <View style={{flex: 1,width : '100%'}}>
      <RNCamera
        style={{height, width}}
        onGoogleVisionBarcodesDetected={handleBarcodeRead}
      />
    </View>
  );
};

export default BarcodeScanner;
