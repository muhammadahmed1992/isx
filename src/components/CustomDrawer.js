import {Text, View, TouchableOpacity, Pressable} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import React, {useEffect, useState} from 'react';
import {RFValue} from 'react-native-responsive-fontsize';
import {Fonts, Commons, Images, Colors} from '../utils';
import Avatar from './Avatar';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector, useDispatch} from 'react-redux';
import {logout} from '../redux/reducers/authSlice';
import {clear} from '../redux/reducers/connectionStringSlice';
import { ScrollView } from 'react-native-gesture-handler';

const CustomDrawer = props => {
  const dispatch = useDispatch();
  const {host, username, database} = useSelector(
    state => state.ConnectionString,
  );
  const isRegistered = useSelector(state => state.Auth.isRegistered);
  const {ipAddress} = useSelector(state => state.Auth);

  return (
    <View style={{flex: 1, padding: 0, margin: 0}}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{
          paddingTop: 0,
          flex: 1,
        }}>
        <View
          style={{
            height: RFValue(70),
            backgroundColor: Colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          {/* <Avatar size={RFValue(70)} onPress={null} uri={null} /> */}
          <Text style={{fontFamily: Fonts.family.bold, color: 'white'}}>
            {ipAddress ? `${ipAddress}` : ''}
          </Text>
          <Text style={{fontFamily: Fonts.family.bold, color: 'white'}}>
            {database ? `${database}` : ''}
          </Text>
          <Text style={{fontFamily: Fonts.family.bold, color: 'white'}}>
            {(isRegistered ? 'Registered' : 'Demo') + 'Version'}
          </Text>
        </View>
        <ScrollView>
          <DrawerItemList {...props} />
        </ScrollView>
        <View
            style={{
              marginTop: 'auto',
              padding: RFValue(15),
              marginBottom: RFValue(15),
            }}>
            <TouchableOpacity
              style={{flexDirection: 'row'}}
              onPress={() => {
                dispatch(logout());
                dispatch(clear());
                Commons.reset(props.navigation, 'auth');
              }}>
              <Icon name="logout" size={20} color={'red'} />
              <Text
                style={{
                  fontFamily: Fonts.family.bold,
                  fontSize: RFValue(14),
                  color: 'red',
                  marginLeft: '5%',
                }}>
                Logout
              </Text>
            </TouchableOpacity>
          </View>
      </DrawerContentScrollView>
    </View>
  );
};

export default CustomDrawer;
