import { RFValue } from "react-native-responsive-fontsize";
import { Commons, Colors, Fonts } from "../utils";
import { Platform, View, TouchableOpacity, Text } from "react-native";
import { Icon } from "react-native-vector-icons/Icon";

const Header = ({label}) => {
  return (
    <View
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
        {label}
      </Text>

      <View>
        <Icon name="menu" size={Commons.size(25)} color={Colors.primary} />
      </View>
    </View>
  );
}

export default Header;
