import {Pressable, View, Text, Image} from 'react-native';
import React from 'react';
import {Images} from '../utils';

const Avatar = props => {
  return (
    <Pressable
      onPress={props.onPress}
      style={{
        height: props.size,
        width: props.size,
        borderRadius: props.size / 2,
        overflow: 'hidden',
      }}>
      <Image
        style={{height: props.size, width: props.size, resizeMode: 'cover'}}
        source={
          props.uri !== null
            ? props.uri.includes('http')
              ? {uri: props.uri}
              : props.uri
            : Images.avatar
        }
      />
    </Pressable>
  );
};

export default Avatar;
