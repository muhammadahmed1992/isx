import TransactionModuleComponent from "../components/transactionModuleComponents/TransactionModuleComponent";

const TransactionModuleScreen = ({navigation, route}) => {
    const {
      label,
      endPoints,
      paymentDetails
    } = route.params; 
    const currentRouteName = route.name;
    return (<TransactionModuleComponent navigation={navigation} currentRouteName={currentRouteName} paymentDetails={paymentDetails} label={label} endPoints={endPoints}/>);
}

export default TransactionModuleScreen;
