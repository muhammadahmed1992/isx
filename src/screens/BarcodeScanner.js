import React, { useEffect, useRef } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { Commons } from '../utils';

const BarcodeScanner = ({ navigation, route }) => {
  const { height, width } = useWindowDimensions();
  const onBarcodeRead = route?.params?.onBarcodeRead
  const counterRef = useRef(0)

  const handleBarcodeRead = event => {
    if (counterRef.current == 0) {
      onBarcodeRead && onBarcodeRead(event?.data)
      // Call the onBarcodeRead function if it exists
      Commons.navigate(navigation, route.params.returnScreen);
      counterRef.current = 1
    }
  }

  return (
    <View style={{ flex: 1, width: '100%' }}>
      <RNCamera
        style={{ height, width }}
        onBarCodeRead={handleBarcodeRead}
      />
    </View>
  );
};

export default BarcodeScanner;
