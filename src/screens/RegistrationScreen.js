import RegistrationComponent from "../components/administrationComponents/Registration";

const RegistrationScreen = ({navigation, route}) => {
    const {
      label,
    } = route.params; 
    return (<RegistrationComponent navigation={navigation} label={label}/>);
}

export default RegistrationScreen;