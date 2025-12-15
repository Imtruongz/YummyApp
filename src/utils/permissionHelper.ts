import { Platform, PermissionsAndroid } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import RNFS from 'react-native-fs';

/**
 * Converts an image URI to Base64 string
 * @param uri - Image URI (file://, content://, or http://)
 * @returns Base64 encoded image string
 */
export const convertImageToBase64 = async (uri: string): Promise<string> => {
  try {
    if (uri.startsWith('file://') || uri.startsWith('content://')) {
      const base64Data = await RNFS.readFile(uri, 'base64');
      return `data:image/jpeg;base64,${base64Data}`;
    } else {
      console.log('Unsupported URI format:', uri);
      return '';
    }
  } catch (error) {
    console.log('Error converting image to base64:', error);
    return '';
  }
};

/**
 * Requests permission to access device photo library
 * @returns true if permission is granted, false otherwise
 */
const requestPhotoLibraryPermission = async (): Promise<boolean> => {
  try {
    if (Platform.OS === 'android') {
      const androidVersion = Platform.Version as number;
      // Android 13+ requires READ_MEDIA_IMAGES instead of READ_EXTERNAL_STORAGE
      const permission = androidVersion >= 33
        ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
        : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

      const granted = await PermissionsAndroid.request(permission);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    // iOS handles permissions automatically via Info.plist
    return true;
  } catch (error) {
    console.log('Error requesting permission:', error);
    return false;
  }
};

/**
 * Launches image picker to select an image from device
 * @param options - Optional configuration for image picker
 * @returns Object containing imageUri and base64Image, or null if selection failed
 */
export const pickImageFromLibrary = async (options?: {
  maxWidth?: number;
  maxHeight?: number;
}): Promise<{ imageUri: string; base64Image: string } | null> => {
  try {
    // Request permission first
    const hasPermission = await requestPhotoLibraryPermission();
    if (!hasPermission) {
      console.log('Photo library permission denied');
      return null;
    }

    // Launch image picker
    const result: any = await launchImageLibrary({
      mediaType: 'photo',
      includeBase64: false,
      maxWidth: options?.maxWidth || 800,
      maxHeight: options?.maxHeight || 800,
    });

    // Check if user selected an image
    if (result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      const base64Image = await convertImageToBase64(imageUri);

      if (!base64Image) {
        console.log('Failed to convert image to base64');
        return null;
      }

      return { imageUri, base64Image };
    } else if (result.errorCode) {
      console.log('Image picker error:', result.errorMessage);
      return null;
    } else if (!result.didCancel) {
      // Handle unexpected errors
      console.log('Image picker failed for unknown reason');
      return null;
    }

    return null;
  } catch (error) {
    console.log('Error picking image:', error);
    return null;
  }
};

/**
 * Alternative simpler version that returns only base64 image
 * @param options - Optional configuration for image picker
 * @returns Base64 encoded image string or empty string if failed
 */
export const pickImageAsBase64 = async (options?: {
  maxWidth?: number;
  maxHeight?: number;
}): Promise<string> => {
  const result = await pickImageFromLibrary(options);
  return result?.base64Image || '';
};

/**
 * Alternative simpler version that returns only image URI
 * @param options - Optional configuration for image picker
 * @returns Image URI string or empty string if failed
 */
export const pickImageAsURI = async (options?: {
  maxWidth?: number;
  maxHeight?: number;
}): Promise<string> => {
  const result = await pickImageFromLibrary(options);
  return result?.imageUri || '';
};
