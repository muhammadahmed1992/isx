import React, { useState, useCallback } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Fonts, Colors } from '../utils';

const cellWidth = 120;

const rightAlignedColumns = [
  'opening_header',
  'dp_header',
  'voucher_header',
  'cash_header',
  'payroll_header',
  'credit_card_header',
  'debit_card_header',
  'online_header',
  'withdrawn_header',
  'cancel_header',
  'balance_header',
  'amount_header',
  'amount_tax_header',
  'price_header',
  'qty_header',
];

const TableComponent = ({ data, headers, onSort }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleHeaderClick = useCallback((key) => {
    setSortConfig(prevConfig => {
      const newDirection = prevConfig.key === key ? (prevConfig.direction === 'asc' ? 'desc' : 'asc') : 'asc';
      const newConfig = { key, direction: newDirection };
      onSort(newConfig.key, newConfig.direction); // Call the callback with the new sort values
      return newConfig;
    });
  }, [onSort]);

  const isTotalsRow = (item) => {
    return Object.values(item).some((value) => value.toLowerCase() === 'total');
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
              keyIndex < keys.length && styles.cellBorder,
              rightAlignedColumns.includes(key) ? styles.cellNumber : styles.cellText,
              isBold && styles.boldText,
            ]}
          >
            {item[key] ? item[key].toString().trim() : ''}
          </Text>
        ))}
      </View>
    );
  };
  const renderNoDataRow = () => {
    return (
      <View style={{ borderWidth: 1, borderColor: '#ccc' }}>
            <Text style={styles.cellText}>No Data Found</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }}>
        <View>
          <View style={[styles.row, styles.header]}>
            {Object.keys(headers).map((key, index) => (
              <TouchableOpacity key={index} onPress={() => handleHeaderClick(key)}>
                <Text
                  style={[
                    styles.cell,
                    index < Object.keys(headers).length - 1 && styles.cellBorder,
                    styles.headerText,
                    rightAlignedColumns.includes(key) ? styles.cellNumber : styles.cellText,
                  ]}
                >
                  {headers[key]} {sortConfig.key === key ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={{ borderWidth: 1, borderColor: '#ccc' }}>
            {!data || data.length === 0 ? (
              <Text style={styles.noDataText}>No Data Found</Text>
            ) : (
              data.map(renderRow)
            )}
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
    fontFamily: Fonts.family.regular,
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
  boldText: {
    fontFamily: Fonts.family.bold,
    color: Colors.black,
  },
  cellText: {
    textAlign: 'left',
  },
  cellNumber: {
    textAlign: 'right',
  },
  headerText: {
    fontFamily: Fonts.family.bold,
    color: Colors.black,
    textAlign: 'center',
  },
  noDataText: {
    flexGrow: 1,
    fontFamily: Fonts.family.bold,
    alignSelf: 'center',
    textAlign: 'center',
    marginVertical: RFValue(6),
  },
});
