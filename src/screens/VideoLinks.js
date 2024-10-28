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
      title: 'User Guide',
      url: 'https://www.youtube.com/watch?v=5EG4_jpwbNk',
    },
    {
      title: 'Install on PC',
      url: 'https://www.youtube.com/watch?v=I-FO8O7f49Y',
    },
    {
      title: 'Automatic Restart',
      url: 'https://www.youtube.com/watch?v=mwB5Tf3tAAM',
    },
    {
      title: 'Install on Hanphone',
      url: 'https://www.youtube.com/watch?v=pWd5hj3UNRY',
    },
    {
      title: 'Create IP VPN',
      url: 'https://www.youtube.com/watch?v=D9933H3bZNs',
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
