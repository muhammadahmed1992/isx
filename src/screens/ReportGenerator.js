import { useRoute } from '@react-navigation/native';
import ReportComponent from '../components/ReportComponent'

const ReportGenerator = props => {
    const route = useRoute();
    const currentRouteName = route.name;
    return (
        <ReportComponent {...props} currentRouteName={currentRouteName} />
    );
 };

 export default ReportGenerator;