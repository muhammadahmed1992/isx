import React, { useEffect, useState, useRef } from 'react';
import {
  Text,
  StyleSheet,
  View,
  StatusBar,
  ScrollView,
  BackHandler,
  Image,
  TextInput,
  Pressable,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-easy-toast';
import { RFValue } from 'react-native-responsive-fontsize';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import IonIcon from 'react-native-vector-icons/Ionicons';
import ApiService from '../services/ApiService';
import { Endpoints, Images } from '../utils';
import {
  login,
  setIpAddress,
} from '../redux/reducers/authSlice';
import { Fonts, Colors, Commons } from '../utils';
import Modal from 'react-native-modal';
import SearchableDropDown from '../components/searchableDropdown';
import { setDataBase } from '../redux/reducers/connectionStringSlice';
import {
  setReportPermissions,
  setAdministrationPermissions,
  setTransactionModulePermissions,
} from '../redux/reducers/menuSlice';
import { fetchAndSetLocaleData } from '../redux/reducers/localeSlice';

const Auth = props => {
  const dispatch = useDispatch();
  const toastRef = useRef(null);
  const ipAddressRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const { ipAddress } = useSelector(state => state.Auth);
  const [hidePassword, setHidePassword] = useState(true);
  const [ipAddressNew, setIPAddress] = useState(ipAddress ? ipAddress : '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { database } = useSelector(state => state.ConnectionString);
  const [databaseNew, setDatabase] = useState(database ? database : '');
  const [modal, setModal] = useState(false);
  const [databases, setDatabases] = useState([]);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);
    fetchAllDatabases();
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  // useEffect(() => {
  //   performLogin();
  // }, []);

  const backAction = () => {
    BackHandler.exitApp();
    return true;
  };

  const showToast = msg => {
    toastRef.current.show(msg, 2000);
  };

  const fetchAllDatabases = async () => {
    await ApiService.get(Endpoints.fetchDatabases)
      .then(res => {
        let dataToPopulate = [];
        const data = res.data.data;
        for (const obj of data) {
          dataToPopulate.push(obj.SCHEMA_NAME);
        }
        setDatabases(dataToPopulate);
      })
      .catch(err => { });
  };

  const validate = () => {
    const ipPattern =
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    if (!ipAddressNew.length || !ipPattern.test(ipAddressNew)) {
      showToast('Please enter a valid IP Address');
      return;
    }
    dispatch(setIpAddress(ipAddressNew));
    if (!username.length) {
      showToast('Please enter a valid username');
      return;
    }
    if (!password.length) {
      showToast('Password should not be empty');
      return;
    }
    if (!databaseNew.length) {
      showToast('Please select a valid database');
      return;
    }
    dispatch(setDataBase(databaseNew));
    dispatch(fetchAndSetLocaleData('id'));
    performLogin();
  };


  // Login function
  const performLogin = async () => {
    setLoading(true);
    try {
      // Proceed with the login API call
      const body = {
        username,
        password,
      };
      const res = await ApiService.post(Endpoints.login, body);
      if (res.data.success) {
        dispatch(login(username));
        dispatch(setReportPermissions(res.data.data));
        dispatch(setAdministrationPermissions(res.data.data));
        dispatch(setTransactionModulePermissions(res.data.data));
        Commons.reset(props.navigation, 'dashboard');
      } else {
        showToast(res.data.message || 'Login failed');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed';
      showToast(errorMessage);
    } finally {
      setLoading(false);
    }
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
        contentContainerStyle={{ paddingBottom: RFValue(15) }}>
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
              value={ipAddressNew}
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

          <Pressable
            onPress={() => setModal(true)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: Colors.primary,
              borderRadius: RFValue(10),
              paddingHorizontal: RFValue(10),
              marginTop: RFValue(10),
            }}>
            <TextInput
              autoCapitalize={'none'}
              style={{
                flex: 1,
                height: RFValue(50),
                color: Colors.primary,
                fontSize: RFValue(16),
                fontFamily: Fonts.family.bold,
              }}
              onPress={() => setModal(true)}
              editable={false}
              placeholder="Select a database"
              value={databaseNew}
              returnKeyType="next"
              placeholderTextColor={Colors.grey}
            />
          </Pressable>

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

      <Modal
        statusBarTranslucent={true}
        isVisible={modal}
        onBackButtonPress={() => setModal(false)}
        onBackdropPress={() => setModal(false)}
        onRequestClose={() => setModal(false)}>
        <View
          style={{
            padding: RFValue(15),
            backgroundColor: Colors.white,
            borderRadius: RFValue(10),
            marginVertical: RFValue(40),
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: Fonts.family.bold,
                fontSize: RFValue(20),
                flex: 1,
              }}>
              Select Database
            </Text>
            <TouchableOpacity
              onPress={() => {
                setModal(false);
              }}>
              <Image
                source={Images.close}
                style={{
                  height: RFValue(20),
                  width: RFValue(20),
                  resizeMode: 'contain',
                }}
              />
            </TouchableOpacity>
          </View>

          <SearchableDropDown
            onItemSelect={item => {
              setDatabase(item);
              setModal(false);
            }}
            containerStyle={{ padding: 5, margin: 0, flexGrow: 0.6 }}
            textInputStyle={{
              padding: 12,
              borderWidth: 1,
              color: Colors.black,
              borderRadius: RFValue(10),
              fontFamily: Fonts.family.bold,
              borderColor: '#ccc',
              backgroundColor: Colors.white,
            }}
            itemStyle={{
              padding: 10,
              backgroundColor: '#FAF9F8',
              borderBottomColor: Colors.light_grey,
              borderBottomWidth: 1,
            }}
            itemTextStyle={{
              color: Colors.black,
              fontFamily: Fonts.family.bold,
            }}
            itemsContainerStyle={{
              height: '60%',
              // flex: 0.6,
            }}
            items={databases}
            placeholder={'Select a database...'}
            placeholderTextColor={Colors.grey}
            resetValue={false}
            underlineColorAndroid="transparent"
          />
        </View>
      </Modal>
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