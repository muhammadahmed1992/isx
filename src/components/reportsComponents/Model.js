import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {RFValue} from 'react-native-responsive-fontsize';
import {Colors, Fonts, Images} from '../../utils';
import SearchableDropDown from '../searchableDropdown';
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
              source={Images.close} // Make sure the path is correct
              style={styles.closeIcon}
            />
          </TouchableOpacity>
        </View>

        <SearchableDropDown
          onItemSelect={item => {
            onItemSelect(item);
            onClose();
          }}
          containerStyle={styles.containerStyle}
          textInputStyle={styles.textInputStyle}
          itemStyle={styles.itemStyle}
          itemTextStyle={styles.itemTextStyle}
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
  containerStyle: {padding: 5, margin: 0, flexGrow: 0.6},
  textInputStyle: {
    padding: 12,
    borderWidth: 1,
    borderRadius: RFValue(10),
    color: Colors.black,
    fontFamily: Fonts.family.bold,
    borderColor: '#ccc',
    backgroundColor: Colors.white,
  },
  itemStyle: {
    padding: 10,
    backgroundColor: '#FAF9F8',
    borderBottomColor: Colors.light_grey,
    borderBottomWidth: 1,
  },
  itemTextStyle: {
    color: Colors.black,
    fontFamily: Fonts.family.bold,
  },
  itemsContainerStyle: {
    height: '60%',
    // flex: 0.6,
  },
});

export default ModalComponent;
