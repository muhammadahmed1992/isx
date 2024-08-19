import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

const cellWidth = 120;
const rightAlignedColumns = [
  'Opening',
  'DP',
  'Voucher',
  'Cash',
  'Payroll',
  'CreditCard',
  'DebitCard',
  'Online',
  'Withdrawn',
  'Cancel',
  'Balance',
  'Amount',
  'Amount_Tax',
  'Price',
  'Qty',
];

const TableComponent = ({ data }) => {
  const headers = data.length > 0 ? Object.keys(data[0]) : [];

  const isTotalsRow = (item) => {
    return Object.values(item).some(value => value.toLowerCase() === 'total');
  };

  const renderRow = (item, index) => {
    const keys = Object.keys(item);
    const isBold = isTotalsRow(item);

    return (
      <View key={index} style={styles.row}>
        {keys.map((key, keyIndex) => (
          <Text
            key={key}
            style={[
              styles.cell,
              keyIndex < keys.length - 1 && styles.cellBorder,
              rightAlignedColumns.includes(key) ? styles.cellNumber : styles.cellText,
              isBold && styles.boldText
            ]}
          >
            {item[key] ? item[key].toString().trim() : ''}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ flexGrow: 0 }}
      >
        <View>
          <View style={[styles.row, styles.header]}>
            {headers.map((header, index) => (
              <Text
                key={index}
                style={[
                  styles.cell,
                  index < headers.length - 1 && styles.cellBorder,
                  styles.headerText,
                  rightAlignedColumns.includes(header) ? styles.cellNumber : styles.cellText,
                ]}
              >
                {header}
              </Text>
            ))}
          </View>
          <View style={{ borderWidth: 1, borderColor: '#ccc' }}>
            {data.length ? data.map(renderRow) : <Text style={styles.noDataText}>No Data Found</Text>}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default TableComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    width: cellWidth,
    textAlign: 'center',
    fontFamily: 'Regular',
    flexWrap: 'wrap',
    paddingHorizontal: RFValue(6),
    paddingVertical: RFValue(6),
  },
  cellBorder: {
    borderRightWidth: 1,
    borderRightColor: '#ccc',
  },
  header: {
    backgroundColor: '#f2f2f2',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  cellText: {
    textAlign: 'left',
  },
  cellNumber: {
    textAlign: 'right',
  },
  headerText: {
    fontFamily: 'Bold',
    color: '#000',
    textAlign: 'center',
  },
  boldText: {
    fontFamily: 'Bold',
  },
  noDataText: {
    width: '100%',
    flexGrow: 1,
    fontFamily: 'Bold',
    alignSelf: 'center',
    textAlign: 'center',
    marginVertical: RFValue(20),
  },
});
