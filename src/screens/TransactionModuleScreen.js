import TransactionModuleComponent from "../components/transactionModuleComponents/TransactionModuleComponent";

const TransactionModuleScreen = ({navigation, route}) => {
    const {
      label,
      invoiceHeadersPrompts,
      endPoints
    } = route.params; 
    console.log(route.params)
    const currentRouteName = route.name;
    return (<TransactionModuleComponent navigation={navigation} currentRouteName={currentRouteName} label={label} invoiceHeaderPrompts={invoiceHeadersPrompts} endPoints={endPoints}/>);
}

export default TransactionModuleScreen;
