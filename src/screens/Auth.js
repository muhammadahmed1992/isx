import React, {useEffect, useState, useRef} from 'react';
import {
  Text,
  StyleSheet,
  View,
  StatusBar,
  ScrollView,
  BackHandler,
  TextInput,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {useDispatch} from 'react-redux';
import Toast from 'react-native-easy-toast';
import {RFValue} from 'react-native-responsive-fontsize';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import IonIcon from 'react-native-vector-icons/Ionicons';
import ApiService from '../services/ApiService';
import Endpoints from '../utils/Endpoints';
import {login, setIpAddress} from '../redux/reducers/authSlice';
import {Fonts, Colors, Commons} from '../utils';

const Auth = props => {
  const dispatch = useDispatch();
  const toastRef = useRef(null);
  const ipAddressRef = useRef(null);
  const emailRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const [hidePassword, setHidePassword] = useState(true);
  const [ipAddress, setIPAddress] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  useEffect(() => {
    if (loading) {
      login();
    }
  }, [loading]);

  const backAction = () => {
    BackHandler.exitApp();
    return true;
  };

  const showToast = msg => {
    toastRef.current.show(msg, 2000);
  };

  const validate = () => {
    const ipPattern =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipAddress.length || !ipPattern.test(ipAddress)) {
      showToast('Please enter a valid IP Address');
      return;
    }
    dispatch(setIpAddress(ipAddress));
    if (username.length < 3) {
      showToast('Please enter a valid username');
      return;
    }
    if (!password.length) {
      showToast('Password should not be empty');
      return;
    }
    setLoading(true);
  };

  const login = async () => {
    let body = {
      username,
      password,
    };

    await ApiService.post(Endpoints.login, body)
      .then(res => {
        if (res.data.success) {
          dispatch(login({}));
          Commons.reset(props.navigation, 'dashboard');
        }
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        showToast(typeof err === 'string' ? err : err.message);
      });
  };

  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: RFValue(15),
        backgroundColor: 'white',
      }}>
      <StatusBar
        translucent={false}
        barStyle="light-content"
        backgroundColor={Colors.primary}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: RFValue(15)}}>
        <View>
          <Text
            style={{
              marginTop: RFValue(50),
              color: Colors.black,
              fontSize: RFValue(24),
              fontFamily: Fonts.family.bold,
            }}>
            Login
          </Text>
          <Text
            style={{
              marginBottom: RFValue(20),
              color: Colors.black,
              fontSize: RFValue(16),
              fontFamily: Fonts.family.regular,
            }}>
            Please login yourself
          </Text>

          <View style={styles.inputContainer}>
            <FontAwesome5 name="server" size={24} color={Colors.primary} />
            <TextInput
              autoCapitalize={'none'}
              style={styles.input}
              placeholder="192.168.111.232"
              value={ipAddress}
              onChangeText={setIPAddress}
              returnKeyType="next"
              maxLength={15}
              keyboardType={'numeric'}
              onSubmitEditing={() => {
                usernameRef.current.focus();
              }}
              ref={ipAddressRef}
              placeholderTextColor={Colors.grey}
            />
          </View>

          <View style={styles.inputContainer}>
            <IonIcon name="person" size={24} color={Colors.primary} />
            <TextInput
              autoCapitalize={'none'}
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              returnKeyType="next"
              onSubmitEditing={() => {
                passwordRef.current.focus();
              }}
              ref={usernameRef}
              placeholderTextColor={Colors.grey}
            />
          </View>

          <View style={styles.inputContainer}>
            <IonIcon name="lock-closed" size={24} color={Colors.primary} />
            <TextInput
              autoCapitalize={'none'}
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={hidePassword}
              maxLength={15}
              returnKeyType="done"
              ref={passwordRef}
              onSubmitEditing={validate}
              placeholderTextColor={Colors.grey}
            />
            <Pressable onPress={() => setHidePassword(!hidePassword)}>
              <IonIcon
                name={hidePassword ? 'eye' : 'eye-off'}
                size={24}
                color={Colors.primary}
              />
            </Pressable>
          </View>

          <TouchableOpacity
            onPress={validate}
            disabled={loading}
            style={styles.button}>
            {!loading && <Text style={styles.buttonText}>Login</Text>}
            {loading && <ActivityIndicator size={20} color="white" />}
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Toast
        ref={toastRef}
        position="bottom"
        positionValue={200}
        fadeInDuration={750}
        fadeOutDuration={1000}
        opacity={0.8}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: RFValue(10),
    marginTop: RFValue(10),
    paddingHorizontal: RFValue(10),
  },
  input: {
    flex: 1,
    height: RFValue(50),
    color: Colors.primary,
    fontSize: RFValue(16),
    marginHorizontal: RFValue(10),
    fontFamily: Fonts.family.bold,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: RFValue(10),
    alignSelf: 'center',
  },
  footerText: {
    color: Colors.black,
    fontSize: RFValue(14),
    fontFamily: Fonts.family.regular,
  },
  footerAction: {
    color: Colors.primary,
    fontSize: RFValue(16),
    fontFamily: Fonts.family.bold,
  },
  button: {
    backgroundColor: Colors.primary,
    marginTop: RFValue(20),
    padding: RFValue(15),
    borderRadius: RFValue(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: Colors.white,
    fontSize: RFValue(16),
    fontFamily: Fonts.family.bold,
  },
});

export default Auth;
