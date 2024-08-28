import {
  ToastAndroid,
  Platform,
  PermissionsAndroid,
  Dimensions,
} from 'react-native';
import {CommonActions} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';

const size = value => {
  return RFValue(value, Dimensions.get('window').height);
};

const height = (value = 1) => {
  return Dimensions.get('window').height * value;
};

const width = (value = 1) => {
  return Dimensions.get('window').width * value;
};

const calculateDateFromObj = date => {
  let strDate =
    (date.getDate() > 9 ? date.getDate() : '0' + date.getDate()) +
    '-' +
    (date.getMonth() > 8 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)) +
    '-' +
    date.getFullYear();
  return strDate || date;
};

const timeDiff = (start, end) => {
  var diff = end - start;
  var units = [1000 * 60 * 60 * 24, 1000 * 60 * 60, 1000 * 60, 1000];

  var rv = [];
  for (var i = 0; i < units.length; ++i) {
    rv.push(Math.floor(diff / units[i]));
    diff = diff % units[i];
  }
  var thisFullYear = end.getFullYear();
  var daysInLastMonth = new Date(thisFullYear, end.getMonth(), 0).getDate();
  var thisMonth = end.getMonth();
  thisFullYear = thisFullYear - start.getFullYear();
  thisMonth = thisMonth - start.getMonth();
  var subAddDays = daysInLastMonth - start.getDate();
  var thisDay = end.getDate();
  thisMonth = thisMonth - 1;
  if (thisMonth < 0) {
    thisFullYear = thisFullYear - 1;
    thisMonth = 12 + thisMonth;
  }
  subAddDays = daysInLastMonth - start.getDate();
  subAddDays = thisDay + subAddDays;

  if (subAddDays >= daysInLastMonth) {
    subAddDays = subAddDays - daysInLastMonth;
    thisMonth++;
    if (thisMonth > 11) {
      thisFullYear++;
      thisMonth = 0;
    }
  }
  return {
    years: thisFullYear,
    months: thisMonth,
    days: subAddDays,
    hours: rv[1],
    minutes: rv[2],
    seconds: rv[3],
  };
};

const reset = (navigation, screen) => {
  const resetAction = CommonActions.reset({
    index: 0,
    routes: [{name: screen}],
  });

  navigation.dispatch(resetAction);
};

const navigate = (navigation, screen, params = null) => {
  navigation.navigate(screen, params);
};

const replace = (navigation, screen, params = null) => {
  navigation.replace(screen, params);
};

const goBack = navigation => {
  navigation.goBack(null);
  return true;
};

const toast = message => {
  if (Platform.OS === 'android') {
    ToastAndroid.showWithGravityAndOffset(
      message,
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
      25,
      50,
    );
  }
};

const checkPermissions = async () => {
  const granted = await PermissionsAndroid.requestMultiple([
    PermissionsAndroid.PERMISSIONS.CAMERA,
  ]);
  if (
    !JSON.stringify(granted).includes('denied') &&
    !JSON.stringify(granted).includes('never_ask_again')
  ) {
    return true;
  } else {
    toast('Kindly allow all permissions to continue');
    return false;
  }
};

const formatBalance = balance => {
  const num = Number(balance);
  if (isNaN(num)) {
    return '';
  }
  
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

export default {
  size,
  height,
  width,
  calculateDateFromObj,
  timeDiff,
  reset,
  navigate,
  replace,
  goBack,
  toast,
  checkPermissions,
  formatBalance,
};
