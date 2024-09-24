import TransactionModuleComponent from "../components/transactionModuleComponents/TransactionModuleComponent";

const TransactionModuleScreen = ({navigation, route}) => {
    const {
      label,
      invoiceHeadersPrompts,
    } = route.params; 
    console.log(route.params)
    const currentRouteName = route.name;
    return (<TransactionModuleComponent navigation={navigation} currentRouteName={currentRouteName} label={label} invoiceHeaderPrompts={invoiceHeadersPrompts}/>);
}

export default TransactionModuleScreen;
