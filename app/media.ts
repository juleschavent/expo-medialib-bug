
import * as MediaLibrary from 'expo-media-library';

export const getMediaList = async (date?: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = date ? new Date(date) : new Date();
  startDate.setHours(0, 0, 0, 0);

  const endDate = date ? new Date(date) : new Date();
  endDate.setHours(23, 59, 59, 999);

  return MediaLibrary.getAssetsAsync({
    mediaType: ['video'],
    first: 1000,
    sortBy: ['creationTime'],
    createdAfter: startDate,
    createdBefore: endDate,
  });
};


export const deleteAssets = async (assetsToDelete: MediaLibrary.Asset[]) => {
  console.log('Assets to delete:', assetsToDelete);

  try {
    // Request permissions first
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      console.error('Media library permission not granted');
      return false;
    }

    // Separate videos and images
    const videoAssets = assetsToDelete.filter((asset) => asset.mediaType === 'video');
    const imageAssets = assetsToDelete.filter((asset) => asset.mediaType === 'photo');

    console.log('Video assets:', videoAssets);
    console.log('Image assets:', imageAssets);

    // Create temp album
    let tempAlbum;
    try {
      tempAlbum = await MediaLibrary.createAlbumAsync('tempDelete', assetsToDelete[0], true);
      console.log('Temp album created:', tempAlbum);
    } catch (error) {
      console.error('Error creating temp album:', error);
      return false;
    }

    // Move image assets to temp album
    if (imageAssets.length > 0) {
      try {
        await MediaLibrary.addAssetsToAlbumAsync(imageAssets, tempAlbum.id, false);
        console.log('Image assets moved to temp album');
      } catch (error) {
        console.error('Error moving image assets:', error);
      }
    }

    // Move video assets to temp album
    if (videoAssets.length > 0) {
      try {
        await MediaLibrary.addAssetsToAlbumAsync(videoAssets, tempAlbum.id, false);
        console.log('Video assets moved to temp album');
      } catch (error) {
        console.error('Error moving video assets:', error);
      }
    }

    // Delete temp album
    try {
      await MediaLibrary.deleteAlbumsAsync([tempAlbum], false);
      console.log('Temp album deleted');
    } catch (error) {
      console.error('Error deleting temp album:', error);
    }

    return true;
  } catch (error) {
    console.error('Error in deleteAssets:', error);
    return false;
  }
};
