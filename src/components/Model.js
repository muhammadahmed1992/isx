import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {RFValue} from 'react-native-responsive-fontsize';
import {Colors, Fonts, Images} from '../utils';
import SearchableDropDown from '../components/searchableDropdown';
const ModalComponent = ({
  isVisible,
  onClose,
  items,
  onItemSelect,
  placeholder = 'Select an item...',
  modalTitle = 'Select Option',
  containerStyle,
  textInputStyle,
  itemStyle,
  itemTextStyle,
  itemsContainerStyle,
}) => {
  return (
    <Modal
      statusBarTranslucent={true}
      isVisible={isVisible}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      onRequestClose={onClose}>
      <View style={[styles.modalContainer, containerStyle]}>
        <View style={styles.header}>
          <Text style={styles.title}>{modalTitle}</Text>
          <TouchableOpacity onPress={onClose}>
            <Image
              source={Images.close} 
              style={styles.closeIcon}
            />
          </TouchableOpacity>
        </View>

        <SearchableDropDown
          onItemSelect={key => {
            onItemSelect(key); 
            onClose();
          }}
          containerStyle={styles.searchableContainer}
          textInputStyle={[styles.textInput, textInputStyle]}
          itemStyle={[styles.item, itemStyle]}
          itemTextStyle={[styles.itemText, itemTextStyle]}
          itemsContainerStyle={itemsContainerStyle}
          items={items}
          placeholder={placeholder}
          resetValue={false}
          underlineColorAndroid="transparent"
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    padding: RFValue(15),
    backgroundColor: Colors.white,
    borderRadius: RFValue(10),
    marginVertical: RFValue(40),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: Fonts.family.bold,
    fontSize: RFValue(20),
    flex: 1,
  },
  closeIcon: {
    height: RFValue(20),
    width: RFValue(20),
    resizeMode: 'contain',
  },
  searchableContainer: {
    padding: 5,
    margin: 0,
    flexGrow: 0.6,
  },
  textInput: {
    padding: 12,
    borderWidth: 1,
    borderRadius: RFValue(10),
    fontFamily: Fonts.family.bold,
    borderColor: '#ccc',
    backgroundColor: Colors.white,
  },
  item: {
    padding: 10,
    backgroundColor: '#FAF9F8',
    borderBottomColor: Colors.light_grey,
    borderBottomWidth: 1,
  },
  itemText: {
    color: Colors.black,
    fontFamily: Fonts.family.bold,
  },
});

export default ModalComponent;
