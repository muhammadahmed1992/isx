import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Header from '../components/Header';
import { useSelector } from 'react-redux';

const VideoLinks = ({navigation, route}) => {
    const {
      label,
    } = route.params; 
    const menu = useSelector(state => state.Locale.menu);
  const videos = [
    {
      title: 'Scan Barcode',
      url: 'https://www.youtube.com/watch?v=cu0FsyDFyoU',
    },
    {
      title: 'Ganti Database',
      url: 'https://www.youtube.com/shorts/WNcKSv571Kc',
    },
    {
      title: 'Penjualan',
      url: 'https://www.youtube.com/shorts/b11JAhdAcy8',
    },
    {
      title: 'Sales Order',
      url: 'https://www.youtube.com/shorts/DhVB-NnjizU',
    },
    {
      title: 'POS',
      url: 'https://www.youtube.com/shorts/D75MUt4VBz4',
    },
    {
      title: 'Opname Stock',
      url: 'https://www.youtube.com/shorts/KL8uoQ28eEM',
    },
    {
      title: 'Laporan',
      url: 'https://www.youtube.com/shorts/sOdhUmAtEC0',
    },
    {
      title: 'Registrasi',
      url: 'https://www.youtube.com/shorts/_6BA35ltOw4',
    },
    {
      title: 'Install di PC',
      url: 'https://www.youtube.com/watch?v=guZEeHJkv08',
    },    
    {
      title: 'Install di HP',
      url: 'https://www.youtube.com/watch?v=AMc3B8IgTXc',
    },
    {
      title: 'Autostart',
      url: 'https://www.youtube.com/watch?v=ii69R0FYKK4',
    },
    {
      title: 'Create IP',
      url: 'https://www.youtube.com/watch?v=YBWoryjKnu8',
    },        
    {
      title: 'Transaksi',
      url: 'https://www.youtube.com/watch?v=WTUuHXaFtEI',
    },            
  ];

  const openLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <View>
      <Header label={menu[label]} navigation={navigation}/>
      {videos.map((video, index) => (
        <TouchableOpacity
          key={index}
          style={styles.link}
          onPress={() => openLink(video.url)}
        >
          <Text style={styles.linkText}>{`${menu[label]}: ${video.title}`}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  link: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  linkText: {
    color: '#007BFF',
    fontSize: 18,
  },
});

export default VideoLinks;
