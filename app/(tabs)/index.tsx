import { Image, StyleSheet, Platform, View, Text, Button, Alert } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';
import { Asset } from 'expo-media-library';
import {  deleteAssets, getMediaList } from '../media';

export default function HomeScreen() {

  const [mediaItems, setMediaItems] = useState<Asset[]>([]);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const result = await getMediaList();
        setMediaItems(result.assets);
      } catch (error) {
        console.error('Error fetching media:', error);
      }
    };

    fetchMedia();
  }, []);

  const [isDeleting, setIsDeleting] = useState(false);

  console.log({
    mediaItems: mediaItems[0]
  });
  

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteAssets([mediaItems[0]]);
      if (result) {
        Alert.alert('Success', 'Assets deleted successfully');
      } else {
        Alert.alert('Error', 'Failed to delete assets');
      }
    } catch (error) {
      console.error('Error deleting assets:', error);
      Alert.alert('Error', 'An error occurred while deleting assets');
    } finally {
      setIsDeleting(false);
    }
  };

  
  return (
   <View style={{ padding: 70}}>
    <Text style={{color: 'white'}}>
    temp
      </Text>
      <Button
        title='click'
        onPress={handleDelete}
      />
   </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
