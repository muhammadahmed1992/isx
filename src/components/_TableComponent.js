import React from 'react';
import {ScrollView, StyleSheet, FlatList, Text, View} from 'react-native';
import {Colors, Fonts, Commons} from '../utils';
import {RFValue} from 'react-native-responsive-fontsize';

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
  'Amount Tax',
  'Price',
  'Qty',
];

const _TableComponent = ({headers, data, isPrice, totals}) => {
  const renderItem = ({item, index}) => {
    const keys = Object.keys(item);
    let isBold = false;
    if (totals && 'indexes' in totals) {
      let ind = totals['indexes'].indexOf(
        totals['indexes'].filter(i => i === index)[0],
      );
      if (ind >= 0) {
        isBold = true;
        totals['indexes'] = totals.indexes.filter(i => i !== ind);
      } else {
        isBold = false;
      }
    }

    return (
      <View key={`${index}`} style={styles.row}>
        {keys.map((key, keyIndex) => (
          <Text
            key={key}
            style={[
              styles.cell,
              keyIndex < keys.length - 1 && styles.cellBorder,
              rightAlignedColumns.includes(key)
                ? styles.cellNumber
                : styles.cellText,
              {...(isBold && {fontFamily: Fonts.family.bold})},
            ]}>
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
        style={{flexGrow: 0}}>
        <View>
          <View style={[styles.row, styles.header]}>
            {headers.map((item, index) => (
              <Text
                key={index}
                style={[
                  styles.cell,
                  index < headers.length - 1 && styles.cellBorder, // Add border to all but the last header cell
                  styles.headerText,
                  rightAlignedColumns.includes(item)
                    ? styles.cellNumber
                    : styles.cellText,
                ]}>
                {item}
              </Text>
            ))}
          </View>
          <FlatList
            style={{borderWidth: 1, borderColor: '#ccc'}}
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${index}`}
            ListEmptyComponent={
              <Text style={styles.noDataText}>No Data Found</Text>
            }
          />
          {!isPrice && data.length && totals && !('indexes' in totals) ? (
            <View style={[styles.row, styles.footer]}>
              {headers.map((header, index) => {
                return (
                  <Text
                    key={index}
                    style={[
                      styles.cell,
                      rightAlignedColumns.includes(header)
                        ? styles.cellNumber
                        : styles.cellText,
                      styles.footerText,
                      {fontFamily: Fonts.family.bold},
                    ]}>
                    {index === 0
                      ? 'Total'
                      : totals[header]
                      ? totals[header]
                      : ''}
                  </Text>
                );
              })}
            </View>
          ) : (
            <View />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default _TableComponent;

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
    width: cellWidth, // Set fixed width for cells
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
    width: '100%',
    flexGrow: 1,
    fontFamily: Fonts.family.bold,
    alignSelf: 'center',
    textAlign: 'center',
    marginVertical: RFValue(20),
  },
});
