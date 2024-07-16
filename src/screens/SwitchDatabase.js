import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Pressable,
  Image,
  Platform,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {Commons, Colors, Fonts, Endpoints, Images} from '../utils';
import {RFValue} from 'react-native-responsive-fontsize';
import {useDispatch, useSelector} from 'react-redux';
import {init, clear} from '../redux/reducers/connectionStringSlice';
import Toast from 'react-native-easy-toast';
import RNPickerSelect from 'react-native-picker-select';
import ApiService from '../services/ApiService';
import SearchableDropDown from '../components/searchableDropdown';
import Modal from 'react-native-modal';

const SwitchDatabase = props => {
  const dispatch = useDispatch();
  const toastRef = useRef(null);
  const {host, username, password, port, database} = useSelector(
    state => state.ConnectionString,
  );
  const [hostNew, setHost] = useState(host ? host : '');
  const [databaseNew, setDatabase] = useState(database ? database : '');
  const [user, setUser] = useState(username ? username : '');
  const [portNew, setPort] = useState(port ? port : '');
  const [passwordNew, setPassword] = useState(password ? password : '');
  const [hidePassword, setHidePassword] = useState(true);
  const [modal, setModal] = useState(false);
  const [databases, setDatabases] = useState([]);

  useEffect(() => {
    fetchAllDatabases();
  }, []);

  useEffect(() => {
    setHost(host ? host : '');
    setDatabase(database ? database : '');
    setUser(username ? username : '');
    setPort(port ? port : '');
    setPassword(password ? password : '');
  }, [host, username, password, port, database]);

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
      .catch(err => {
        console.log('Fetch All Databases: ', err);
      });
  };

  const validate = () => {
    if (!hostNew.trim().length) {
      showToast('Please enter a valid host');
      return;
    }
    if (!user.trim().length) {
      showToast('Please enter a valid username');
      return;
    }
    if (!databaseNew.trim().length) {
      showToast('Please enter a valid database');
      return;
    }
    if (!portNew.trim().length) {
      showToast('Please enter a valid port');
      return;
    }
    if (!passwordNew.trim().length) {
      showToast('Please enter a valid password');
      return;
    }

    dispatch(
      init({
        host: hostNew,
        username: user,
        password: passwordNew,
        port: portNew,
        database: databaseNew,
      }),
    );
    showToast('Database connected');
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

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
            props.navigation.openDrawer();
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
          Switch Database
        </Text>

        <View>
          <Icon name="menu" size={Commons.size(25)} color={Colors.primary} />
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: Colors.primary,
          borderRadius: RFValue(10),
          paddingHorizontal: RFValue(10),
          marginHorizontal: RFValue(10),
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
          placeholder="Host"
          value={hostNew}
          keyboardType={'default'}
          onChangeText={setHost}
          returnKeyType="next"
          placeholderTextColor={Colors.grey}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: Colors.primary,
          borderRadius: RFValue(10),
          paddingHorizontal: RFValue(10),
          marginHorizontal: RFValue(10),
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
          placeholder="Username"
          value={user}
          keyboardType={'default'}
          onChangeText={setUser}
          returnKeyType="next"
          placeholderTextColor={Colors.grey}
        />
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
          marginHorizontal: RFValue(10),
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

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: Colors.primary,
          borderRadius: RFValue(10),
          paddingHorizontal: RFValue(10),
          marginHorizontal: RFValue(10),
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
          placeholder="Port"
          value={portNew}
          keyboardType={'numeric'}
          onChangeText={setPort}
          maxLength={5}
          returnKeyType="next"
          placeholderTextColor={Colors.grey}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: Colors.primary,
          borderRadius: RFValue(10),
          paddingHorizontal: RFValue(10),
          marginHorizontal: RFValue(10),
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
          placeholder="Password"
          value={passwordNew}
          onChangeText={setPassword}
          returnKeyType="done"
          keyboardType={'default'}
          secureTextEntry={hidePassword}
          maxLength={15}
          placeholderTextColor={Colors.grey}
        />
        <Pressable onPress={() => setHidePassword(!hidePassword)}>
          <Icon
            name={hidePassword ? 'eye' : 'eye-off'}
            size={24}
            color={Colors.primary}
          />
        </Pressable>
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginHorizontal: RFValue(10),
          marginTop: RFValue(10),
        }}>
        <TouchableOpacity
          onPress={() => {
            dispatch(clear());
          }}
          style={{
            flex: 0.3,
            padding: 15,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 4,
            backgroundColor: Colors.grey,
          }}>
          <Text
            style={{
              fontFamily: Fonts.family.bold,
              color: Colors.white,
              textAlign: 'center',
            }}>
            Clear
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={validate}
          style={{
            padding: 15,
            flex: 0.65,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 4,
            backgroundColor: Colors.primary,
          }}>
          <Text
            style={{
              fontFamily: Fonts.family.bold,
              color: Colors.white,
              textAlign: 'center',
            }}>
            Connect
          </Text>
        </TouchableOpacity>
      </View>

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
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
                  height: RFValue(12),
                  width: RFValue(12),
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
            containerStyle={{padding: 5, margin: 0, flexGrow: 0.6}}
            textInputStyle={{
              padding: 12,
              borderWidth: 1,
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
            resetValue={false}
            underlineColorAndroid="transparent"
          />
        </View>
      </Modal>
    </View>
  );
};

export default SwitchDatabase;
