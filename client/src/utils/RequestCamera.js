import { PermissionsAndroid } from 'react-native';

const requestCameraPermission = async () => {
  try {
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
      title: 'Camera Permission',
      message: 'App cần quyền truy cập camera để chụp ảnh',
      buttonNeutral: 'Hỏi lại sau',
      buttonNegative: 'Hủy',
      buttonPositive: 'OK',
    });
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch (err) {
    console.warn(err);
    return false;
  }
};

export default requestCameraPermission;
