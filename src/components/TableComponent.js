// import React from 'react';
// import {ScrollView, StyleSheet, FlatList, Text, View} from 'react-native';
// import {Colors, Fonts} from '../utils';
// import {RFValue} from 'react-native-responsive-fontsize';

// const TableComponent = props => {
//   const renderItem = ({item, index}) => {
//     const keys = Object.keys(item);

//     return (
//       <View key={`${index}`} style={styles.row}>
//         {keys.map(key => (
//           <Text key={key} style={styles.cell}>
//             {item[key]}
//           </Text>
//         ))}
//       </View>
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <ScrollView horizontal showsHorizontalScrollIndicator style={{flex: 1}}>
//         <View>
//           <View style={[styles.row, styles.header]}>
//             {props.headers.map((item, index) => (
//               <Text key={index} style={[styles.cell, styles.headerText]}>
//                 {item}
//               </Text>
//             ))}
//           </View>
//           <FlatList
//             data={props.data}
//             renderItem={renderItem}
//             keyExtractor={(item, index) => `${index}`}
//             ListEmptyComponent={
//               <Text
//                 style={{
//                   width: '100%',
//                   flexGrow: 1,
//                   fontFamily: Fonts.family.bold,
//                   alignSelf: 'center',
//                   textAlign: 'center',
//                   marginTop: RFValue(20),
//                 }}>
//                 No Data Found
//               </Text>
//             }
//           />
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// export default TableComponent;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     padding: 16,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//     paddingVertical: 10,
//   },
//   cell: {
//     flex: 1,
//     width: 100,
//     textAlign: 'center',
//     fontFamily: Fonts.family.regular,
//   },
//   header: {
//     backgroundColor: '#f2f2f2',
//     borderTopWidth: 1,
//     borderTopColor: '#ccc',
//     paddingVertical: 10,
//   },
//   headerText: {
//     fontFamily: Fonts.family.bold,
//     color: Colors.black,
//   },
// });

import React from 'react';
import {ScrollView, StyleSheet, FlatList, Text, View} from 'react-native';
import {Colors, Fonts} from '../utils';
import {RFValue} from 'react-native-responsive-fontsize';

const TableComponent = ({headers, data}) => {
  const renderItem = ({item, index}) => {
    const keys = Object.keys(item);

    return (
      <View key={`${index}`} style={styles.row}>
        {keys.map(key => (
          <Text key={key} style={styles.cell}>
            {item[key].toString().trim()}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator style={{flex: 1}}>
        <View>
          <View style={[styles.row, styles.header]}>
            {headers.map((item, index) => (
              <Text key={index} style={[styles.cell, styles.headerText]}>
                {item}
              </Text>
            ))}
          </View>
          <FlatList
            data={data}
            renderItem={renderItem}
            keyExtractor={(item, index) => `${index}`}
            ListEmptyComponent={
              <Text style={styles.noDataText}>No Data Found</Text>
            }
          />
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
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },
  cell: {
    flex: 1,
    minWidth: 100,
    textAlign: 'center',
    fontFamily: Fonts.family.regular,
    flexWrap: 'wrap',
  },
  header: {
    backgroundColor: '#f2f2f2',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingVertical: 10,
  },
  headerText: {
    fontFamily: Fonts.family.bold,
    color: Colors.black,
  },
  noDataText: {
    width: '100%',
    flexGrow: 1,
    fontFamily: Fonts.family.bold,
    alignSelf: 'center',
    textAlign: 'center',
    marginTop: RFValue(20),
  },
});
