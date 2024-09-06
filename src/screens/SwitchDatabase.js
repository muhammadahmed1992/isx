/* eslint-disable prettier/prettier */
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
import {clear, setDataBase} from '../redux/reducers/connectionStringSlice';
import Toast from 'react-native-easy-toast';
import ApiService from '../services/ApiService';
import SearchableDropDown from '../components/searchableDropdown';
import Modal from 'react-native-modal';
import Loader from '../components/loader';
import Header from '../components/Header';

const SwitchDatabase = props => {
  const dispatch = useDispatch();
  const toastRef = useRef(null);
  const {host, username, password, port, database} = useSelector(
    state => state.ConnectionString,
  );
  const [databaseNew, setDatabase] = useState(database ? database : '');
  const [modal, setModal] = useState(false);
  const [databases, setDatabases] = useState([]);
  const [loading, setLoading] = useState(false);
   const menu = useSelector(state => state.Locale.menu);
  const label = props.route.params.label;
  const localizeLabel = menu[label] || label;
  const databasePrompt = menu['select_database'] || 'Select Database';
  const connect = menu['connect'] || 'Connect';
  const clear = menu['clear'] || 'Clear';
  useEffect(() => {
    fetchAllDatabases();
  },[]);

  useEffect(() => {
    setDatabase(database ? database : '');
  }, [database]);

  const showToast = msg => {
    toastRef.current.show(msg, 2000);
  };

  const fetchAllDatabases = async () => {
    setLoading(true);
    await ApiService.get(Endpoints.fetchDatabases)
      .then(res => {
        let dataToPopulate = [];
        const data = res.data.data;
        for (const obj of data) {
          dataToPopulate.push(obj.SCHEMA_NAME);
        }
        setDatabases(dataToPopulate);
        setLoading(false);
      })
      .catch(err => {
        console.log('Fetch All Databases: ', err);
        setLoading(false);
      });
  };

  const validate = () => {
    if (!databaseNew.trim().length) {
      showToast('Please select a valid database');
      return;
    }
    dispatch(setDataBase(databaseNew));
    showToast('Database connected');
  };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* <View
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
      </View> */}
      <Header label={localizeLabel} navigation={props.navigation} />
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
          placeholder={databasePrompt}
          value={databaseNew}
          returnKeyType="next"
          placeholderTextColor={Colors.grey}
        />
      </Pressable>

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
            {clear}
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
            {connect}
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
              {databasePrompt}
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
            placeholder={databasePrompt + '...'}
            resetValue={false}
            underlineColorAndroid="transparent"
          />
        </View>
      </Modal>

      {loading && <Loader />}
    </View>
  );
};

export default SwitchDatabase;
