import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Fonts, Colors } from '../utils';
import { useSelector } from 'react-redux';

const Paginator = ({
  currentPage = 1,
  setCurrentPage,
  totalPages = 1
}) => {
  const menu = useSelector(state => state.Locale.menu);
  const next = menu['next'];
  const previous = menu['previous'];
  const page = menu['page'];
  const of = menu['of'];
  return (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        style={[
          styles.paginationButton,
          currentPage === 1 && styles.disabledButton,
        ]}
        onPress={() => {
            if(currentPage > 1)
                setCurrentPage(currentPage - 1);
        }}
        disabled={currentPage === 1}
      >
        <Text style={styles.paginationText}>{previous}</Text>
      </TouchableOpacity>
      <Text style={styles.paginationText}>
        {page} {currentPage} {of} {totalPages}
      </Text>
      <TouchableOpacity
        style={[
          styles.paginationButton,
          currentPage === totalPages && styles.disabledButton,
        ]}
        onPress={() => {
            if(currentPage < totalPages)
            setCurrentPage(currentPage + 1);
        }}
        disabled={currentPage === totalPages}
      >
        <Text style={styles.paginationText}>{next}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: RFValue(10),
  },
  paginationButton: {
    backgroundColor: Colors.primary,
    paddingVertical: RFValue(8),
    paddingHorizontal: RFValue(16),
    borderRadius: RFValue(4),
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  paginationText: {
    color: Colors.black,
    fontFamily: Fonts.family.regular,
  },
});

export default Paginator;
