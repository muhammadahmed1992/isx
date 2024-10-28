import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import Header from '../components/Header';
import { useSelector } from 'react-redux';
import videos from '../helper/videoConfig';

const VideoLinks = ({navigation, route}) => {
    const {
      label,
    } = route.params; 
    const menu = useSelector(state => state.Locale.menu);
    const title = useSelector(state => state.Locale.videos);
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
          <Text style={styles.linkText}>{`${menu[label]}: ${title[video.title]}`}</Text>
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
