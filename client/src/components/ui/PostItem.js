import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import moment from 'moment';
import 'moment/locale/vi';

export default function PostItem({
  id,
  title,
  description,
  province,
  posted_time,
  images,
  type,
  onPress,
  category,
  user,
  tags,
}) {
  const date_only = moment(posted_time).format('DD/MM/YYYY');

  return (
    <View style={styles.card}>
      {/* Label */}
      <View
        style={[
          styles.urgentLabel,
          type === 'lost' ? { backgroundColor: Colors.lost } : { backgroundColor: Colors.found },
        ]}
      >
        <Text style={styles.urgentText}>{type === 'lost' ? 'Tìm đồ' : 'Tìm người'}</Text>
      </View>

      {/* Ảnh */}
      {images.length > 0 ? (
        <Image source={{ uri: images[0].image }} style={styles.image} />
      ) : (
        <Image source={require('../../../assets/img/user.png')} style={styles.image} />
      )}

      {/* Nội dung */}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description || 'Mô tả không có sẵn'}</Text>

        {/* Địa điểm + Loại tin */}
        <View style={styles.row}>
          <View style={styles.badgeOutline}>
            <Ionicons name="location-outline" size={16} color="#4CAF50" />
            <Text style={styles.badgeText}>{province}</Text>
          </View>
          <View style={styles.badgeOutline}>
            <Text style={styles.badgeText}>{category !== null ? category.name : 'khong co'}</Text>
          </View>
        </View>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <View style={styles.tagRow}>
            {tags.map((tag, index) => (
              <View key={tag.id} style={styles.tag}>
                <Text style={styles.tagText}>{tag.name}</Text>
              </View>
            ))}
          </View>
        )}

        {/* User info */}
        <View style={styles.userRow}>
          {user.avatar !== null ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <Image source={require('../../../assets/img/user.png')} style={styles.avatar} />
          )}

          <Text style={styles.userName}>{user.username}</Text>
          <Ionicons name="time-outline" size={16} color="gray" style={{ marginLeft: 20 }} />
          <Text style={styles.timeText}>{date_only}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footerRow}>
          <View style={styles.iconRow}>
            <Ionicons name="eye-outline" size={18} color="gray" />
            <Text style={styles.footerText}>3691</Text>
          </View>
          <View style={styles.iconRow}>
            <Ionicons name="chatbubble-outline" size={18} color="gray" />
            <Text style={styles.footerText}>0</Text>
          </View>
          <TouchableOpacity style={styles.detailButton} onPress={() => onPress(id)}>
            <Text style={styles.detailText}>Xem chi tiết</Text>
            <Ionicons name="arrow-forward" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    margin: 12,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  urgentLabel: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    borderBottomRightRadius: 8,
  },
  urgentText: {
    color: Colors.white,
    fontWeight: 'bold',
  },
  lostBadge: {
    backgroundColor: Colors.lost,
  },
  foundBadge: {
    backgroundColor: Colors.found,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginTop: 6,
  },
  content: {
    padding: 12,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  description: {
    color: 'gray',
    marginVertical: 6,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 6,
    alignItems: 'center',
  },
  badgeOutline: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 6,
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 12,
    marginLeft: 4,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  tag: {
    backgroundColor: '#E8F5E9',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 6,
  },
  tagText: {
    color: '#388E3C',
    fontSize: 12,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 6,
  },
  userName: {
    fontWeight: '500',
  },
  timeText: {
    fontSize: 12,
    color: 'gray',
    marginLeft: 2,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  footerText: {
    marginLeft: 4,
    color: 'gray',
  },
  detailButton: {
    flexDirection: 'row',
    backgroundColor: '#00C853',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  detailText: {
    color: '#fff',
    fontWeight: '600',
    marginRight: 4,
  },
});
