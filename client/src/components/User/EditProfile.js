import React, { use, useContext, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView } from 'react-native';
import styles from '../../styles/EditProfile';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'react-native-image-picker';
import { MyDispatchContext, MyUserContext } from '../../configs/MyContext';
import requestCameraPermission from '../../utils/RequestCamera';
import Colors from '../../constants/colors';
import { AuthApi, endpoints } from '../../configs/Api';
import MyLoading from '../ui/MyLoading';

export default function EditProfile() {
  const user = useContext(MyUserContext);

  console.log(user);

  const [name, setName] = useState(
    user?.current_user.full_name || user?.current_user.username || '',
  );
  const [email, setEmail] = useState(user?.current_user.email || '');
  const [avatar, setAvatar] = useState(user?.current_user.avatar || null);
  const [loading, setLoading] = useState(false);
  const dispatch = useContext(MyDispatchContext);

  // Pick image from gallery
  const pickImageFromGallery = () => {
    ImagePicker.launchImageLibrary({ mediaType: 'photo', quality: 0.7 }, response => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Lỗi', 'Không thể chọn ảnh');
      } else {
        setAvatar(response.assets[0].uri);
      }
    });
  };

  // Take photo with camera
  const takePhoto = async () => {
    await requestCameraPermission();
    ImagePicker.launchCamera({ mediaType: 'photo', quality: 0.7 }, response => {
      if (response.didCancel) return;
      if (response.errorCode) {
        Alert.alert('Lỗi', 'Không thể chụp ảnh');
      } else {
        setAvatar(response.assets[0].uri);
      }
    });
  };

  const saveProfile = async () => {
    try {
      setLoading(true);
      const form = new FormData();
      if (name) form.append('full_name', name);
      if (email) form.append('email', email);
      if (avatar)
        form.append('avatar', {
          uri: avatar,
          type: 'image/jpeg',
          name: 'avatar.jpg',
        });
      const res = await AuthApi().patch(endpoints.userDetail(user.current_user.id), form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const current_user = res.data;

      dispatch({ type: 'login', payload: { current_user } });
      Alert.alert('Thành công', 'Thông tin đã được cập nhật!');
    } catch (error) {
      setLoading(false);
      Alert.alert('Lỗi', 'Không thể cập nhật thông tin');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.avatarContainer}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <MaterialIcons name="person" size={50} color="#999" />
          </View>
        )}
        <View style={styles.avatarActions}>
          <TouchableOpacity style={styles.iconBtn} onPress={pickImageFromGallery}>
            <MaterialIcons name="photo-library" size={22} color={Colors.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={takePhoto}>
            <MaterialIcons name="photo-camera" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Họ và tên</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
          <Text style={styles.saveButtonText}>
            {loading ? <MyLoading color={Colors.white} /> : 'Lưu thay đổi'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
