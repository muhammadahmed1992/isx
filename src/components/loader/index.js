import {View, Text, ActivityIndicator} from 'react-native';
import React from 'react';
import {Colors} from '../../utils';

export default function Loader() {
  return (
    <View
      style={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          borderRadius: 15,
          padding: 15,
        }}>
        <ActivityIndicator animating color={Colors.primary} size={50} />
      </View>
    </View>
  );
}
