// screens/CameraScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  PermissionsAndroid,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Api, { endpoints } from '../../configs/Api';
import PostItem from '../ui/PostItem';
import MyLoading from '../ui/MyLoading';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../constants/colors';

export default function CameraScreen() {
  const [imageUris, setImageUris] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  // Hàm xử lý chọn ảnh
  const handleImageSearch = async () => {
    try {
      setLoading(true);
      const result = await launchImageLibrary({ mediaType: 'photo', selectionLimit: 0 });

      if (!result.didCancel && result.assets?.length > 0) {
        setImageUris(result.assets);

        const formData = new FormData();
        result.assets.forEach((asset, index) => {
          formData.append('images', {
            uri: asset.uri,
            type: 'image/jpeg',
            name: 'query.jpg',
          });
        });

        const res = await Api.post(endpoints['search_image'], formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        const post_ids = res.data.all_results.flatMap(item => item.results.map(r => r.post_id));
        console.log(post_ids);

        if (post_ids.length > 0) {
          const res2 = await Api.post(
            endpoints['batchPosts'],
            {
              ids: post_ids,
            },
            {
              headers: {
                'Content-Type': 'application/json',
              },
            },
          );

          if (res2.data.length > 0) {
            setResults(res2.data);
          }
        }
      }
    } catch (error) {
      setLoading(false);
      console.error('Image search error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Camera
  async function requestCameraPermission() {
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
  }

  const handleTakePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await launchCamera({
      mediaType: 'photo',
      cameraType: 'back',
    });

    if (!result.didCancel && result.assets?.length > 0) {
      setImageUris(result.assets);

      const formData = new FormData();
      formData.append('images', {
        uri: result.assets[0].uri,
        type: 'image/jpeg',
        name: 'query.jpg',
      });

      try {
        setLoading(true);
        // gọi API search ảnh
        const res = await Api.post(endpoints['search_image'], formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        console.log(res.data);

        const post_ids = res.data.all_results.flatMap(item => item.results.map(r => r.post_id));
        console.log(post_ids);

        if (post_ids.length > 0) {
          const postsRes = await Api.post(
            endpoints['batchPosts'],
            { ids: post_ids },
            {
              headers: { 'Content-Type': 'application/json' },
            },
          );
          setResults(postsRes.data);
        }
      } catch (err) {
        setLoading(false);
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Nếu chưa chụp thì hiện nút chụp */}
      {imageUris.length === 0 ? (
        <>
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            <TouchableOpacity
              style={[styles.captureButton, { marginRight: 5 }]}
              onPress={handleTakePhoto}
            >
              <Text style={{ color: '#fff', fontSize: 18 }}>Chụp ảnh</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.captureButton, { marginLeft: 5 }]}
              onPress={handleImageSearch}
            >
              <Text style={{ color: '#fff', fontSize: 18 }}>Thư viện</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          {/* Hiển thị ảnh vừa chụp */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {imageUris.map((img, idx) => (
              <Image key={idx} source={{ uri: img.uri }} style={styles.previewImage} />
            ))}
          </View>

          {/* Kết quả trả về */}
          <Text style={styles.resultTitle}>Kết quả tìm kiếm bằng hình ảnh</Text>
          {loading ? (
            <MyLoading color={Colors.primary} />
          ) : results.length === 0 ? (
            <Text>Không tìm thấy kết quả</Text>
          ) : (
            <>
              <FlatList
                data={results}
                renderItem={({ item }) => (
                  <PostItem
                    {...item}
                    onPress={() => navigation.navigate('post_detail', { postID: item.id })}
                  />
                )}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.postList}
                showsVerticalScrollIndicator={false}
              />
            </>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  captureButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  previewImage: { width: 150, height: 150, marginVertical: 20, borderRadius: 12 },
  resultTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    width: 300,
  },
});
