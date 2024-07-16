import { Platform } from "react-native";

export default {
  family: {
    light: Platform.OS === "android"? 'light':'Gilroy-Light',
    regular: Platform.OS === "android"? 'regular' : 'Gilroy-Regular',
    bold: Platform.OS === "android"? 'bold':'Gilroy-ExtraBold',
  },
};