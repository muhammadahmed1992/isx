import {Text, View} from 'react-native';
import Header from '../Header';

const RegistrationComponent = ({navigation, label = 'Registraion Page'}) => {
  return (
    <View>
      <Header label={label} navigation={navigation} />
      <Text>{label}</Text>
    </View>
  );
};

export default RegistrationComponent;
