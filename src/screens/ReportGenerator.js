import {useRoute} from '@react-navigation/native';
import ReportComponent from '../components/ReportComponent';
import {View} from 'react-native';

const ReportGenerator = props => {
  const route = useRoute();
  console.log(route.params);
  const currentRouteName = route.name;
  return <ReportComponent {...props} currentRouteName={currentRouteName} />;
};

export default ReportGenerator;
