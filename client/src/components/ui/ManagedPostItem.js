import { MaterialIcons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../../styles/ManagedPostItemStyle';
import { AuthApi, endpoints } from '../../configs/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ManagedPostItem({ title, id, status, images, type, onDeleted }) {
  const navigation = useNavigation();

  const deletePost = async post_id => {
    try {
      const token = await AsyncStorage.getItem('token');
      await AuthApi(token).delete(endpoints.postDetail(post_id));
      Alert.alert('Thông báo', 'Xoá thành công');
      if (onDeleted) onDeleted(post_id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemovePost = post_id => {
    Alert.alert('Xoá bài đăng', 'Bạn có muốn xoá bài đăng này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: () => deletePost(post_id),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>
            {status === 'processing' ? 'Chờ duyệt' : ''}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>{type === 'lost' ? 'Tin tìm đồ' : 'Tin tìm người'}</Text>
        </TouchableOpacity>
        <Text style={styles.postId}>Mã tin: {id}</Text>
      </View>

      {/* Alert */}
      {status === 'processing' && (
        <View style={styles.alertBox}>
          <Text style={styles.alertTitle}>⚠️ Tin đăng chưa được công khai</Text>
          <Text style={styles.alertDesc}>
            Tin đăng của bạn đang chờ phê duyệt. Chỉ bạn mới có thể xem được tin này. Sau khi được
            duyệt hoặc nâng cấp gói hiện tại sẽ được công khai ngay.
          </Text>
        </View>
      )}

      {/* Image */}
      <View style={styles.imageBox}>
        {images.length > 0 ? (
          <Image source={{ uri: images[0].image }} style={styles.image} resizeMode="contain" />
        ) : (
          <Image
            source={require('../../../assets/img/user.png')}
            style={styles.image}
            resizeMode="contain"
          />
        )}

        <View style={styles.viewCount}>
          <Text style={styles.viewText}>👁 7 lượt xem</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>{title} 🔗</Text>

      {/* Action buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.primaryBtn}>
          <Text style={styles.primaryBtnText}>Đánh dấu đã tìm thấy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.outlineBtn}
          onPress={() => navigation.navigate('edit_post', { post_id: id })}
        >
          <Text style={styles.outlineBtnText}>Chỉnh sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => handleRemovePost(id)}>
          <MaterialIcons name="delete" size={24} color="#555" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
