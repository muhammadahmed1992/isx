import {StyleSheet, Dimensions} from 'react-native';
import {RFPercentage, RFValue} from 'react-native-responsive-fontsize';
import Fonts from './Fonts';
import Colors from './Colors';

export default {
  auth_safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  splashImage: {
    height: Dimensions.get('window').height * 0.5475,
    width: Dimensions.get('window').width,
    resizeMode: 'cover',
  },
  splashHeader: {
    fontFamily: Fonts.italic,
    fontSize: RFValue(32),
    marginHorizontal: RFValue(40),
    textAlign: 'center',
    alignSelf: 'center',
    fontWeight: '400',
    color: Colors.white,
  },
  splashDescription: {
    fontFamily: Fonts.regular,
    fontSize: RFValue(15),
    textAlign: 'center',
    alignSelf: 'center',
    width: RFValue(217),
    fontWeight: '400',
    color: Colors.white,
    marginTop: RFValue(24),
  },
  splashTextualView: {alignItems: 'center', marginTop: RFValue(40)},
  button: {
    borderRadius: RFValue(10),
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: Colors.white,
    width: '80%',
    height: RFValue(50),
    marginTop: RFValue(43),
  },
  buttonText: {
    fontSize: RFValue(18),
    fontFamily: Fonts.regular,
    color: Colors.primary,
  },
  startHeader: {
    fontFamily: Fonts.regular,
    fontSize: RFValue(24),
    fontWeight: '500',
    textAlign: 'center',
    alignSelf: 'center',
    color: Colors.white,
    marginTop: RFValue(96),
  },
  startDescription: {
    fontFamily: Fonts.regular,
    fontSize: RFValue(15),
    textAlign: 'center',
    alignSelf: 'center',
    width: RFValue(217),
    fontWeight: '400',
    color: Colors.white,
    marginTop: RFValue(10),
  },
  startImage: {
    width: Dimensions.get('window').width,
    height: RFValue(90),
    resizeMode: 'contain',
    marginVertical: RFValue(80),
  },
  startAlreadyMember: {
    fontSize: RFValue(16),
    color: Colors.white,
    fontWeight: '400',
    fontFamily: Fonts.regular,
    alignSelf: 'center',
    marginTop: RFValue(35),
  },
  startLogin: {
    fontSize: RFValue(20),
    color: Colors.white,
    fontWeight: '400',
    fontFamily: Fonts.regular,
    alignSelf: 'center',
    marginTop: RFValue(5),
  },
  loginImage: {
    width: RFValue(150),
    height: RFValue(50),
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: RFValue(40),
  },
  textFieldView: {
    marginTop: RFValue(10),
    marginHorizontal: RFValue(25),
    borderRadius: RFValue(7),
    borderWidth: RFValue(1),
    borderColor: Colors.white,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: RFValue(15),
  },
  richBox: {
    height: RFValue(100),
  },
  textField: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: RFValue(15),
    color: Colors.white,
  },
  loginSocialView: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: RFValue(10),
  },
  socialButton: {
    height: RFValue(45),
    width: RFValue(45),
    backgroundColor: Colors.white,
    borderRadius: RFValue(4),
    marginHorizontal: RFValue(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    height: RFValue(25),
    width: RFValue(25),
  },
  loader: {
    alignSelf: 'center',
  },
  divider10: {marginVertical: RFValue(5)},
  divider20: {marginVertical: RFValue(10)},
  divider30: {marginVertical: RFValue(15)},
  padder10: {marginHorizontal: RFValue(5)},
  padder20: {marginHorizontal: RFValue(10)},
  padder30: {marginHorizontal: RFValue(15)},
};
