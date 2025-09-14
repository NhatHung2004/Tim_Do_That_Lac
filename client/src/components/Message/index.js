import React, { useState, useRef, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Dimensions,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import { endpoints, AuthApi } from '../../configs/Api';
import { MyUserContext } from '../../configs/MyContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const MessagesScreen = () => {
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);
  const filterButtonRef = useRef(null); // Tạo ref để lấy vị trí nút
  const [filterModalPosition, setFilterModalPosition] = useState({ top: 0, left: 0, width: 0 });
  const [selectedFilter, setSelectedFilter] = useState('Tất cả'); // State để lưu tùy chọn lọc
  const navigation = useNavigation();
  const user = useContext(MyUserContext);
  const [chatData, setChatData] = useState([]); // Mảng chứa toàn bộ tin nhắn của current_user

  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem('token');
      try {
        const res = await AuthApi(token).get(endpoints.chatrooms);
        setChatData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const renderNormalChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItemContainer}
      onPress={() =>
        navigation.navigate('chat_screen', {
          other_user_id:
            item.user1.username === user?.current_user.username ? item.user2.id : item.user1.id,
        })
      }
    >
      <Image
        source={{
          uri:
            item.user1.username === user?.current_user.username
              ? item.user2.avatar
              : item.user1.avatar,
        }}
        style={styles.chatUserAvatar}
      />
      <View style={styles.chatContent}>
        <View style={styles.chatHeader}>
          <Text style={styles.chatUserName}>
            {item.user1.username === user?.current_user.username
              ? item.user2.full_name || item.user2.username
              : item.user1.full_name || item.user1.username}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Hàm để lấy vị trí của nút "Tất cả"
  const measureFilterButton = () => {
    filterButtonRef.current.measure((fx, fy, width, height, px, py) => {
      // px, py là tọa độ X, Y tương đối so với màn hình
      setFilterModalPosition({
        top: py + height + 5, // Đặt modal ngay dưới nút + một chút khoảng cách
        left: px,
        width: width, // Chiều rộng của modal bằng chiều rộng của nút
      });
      setFilterModalVisible(true);
    });
  };

  const handleSelectFilter = filter => {
    setSelectedFilter(filter);
    setFilterModalVisible(false); // Đóng modal sau khi chọn
  };

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('dashboard');
            }}
          >
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tin nhắn</Text>
          <TouchableOpacity
            onPress={() => {
              /* Xử lý các tùy chọn khác */
            }}
          >
            <Feather name="more-horizontal" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Search and Filter */}
        <View style={styles.searchFilterContainer}>
          <TouchableOpacity
            ref={filterButtonRef} // Gán ref vào nút "Tất cả"
            style={styles.filterButton}
            onPress={measureFilterButton} // Khi nhấn, lấy vị trí và mở modal
          >
            <Text style={styles.filterText}>{selectedFilter}</Text>
            <Ionicons name="chevron-down" size={16} color="#000" style={styles.filterIcon} />
          </TouchableOpacity>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm..."
              placeholderTextColor="#888"
            />
          </View>
        </View>

        {chatData.length <= 0 ? (
          <View style={styles.emptyStateContainer}>
            <Image
              source={require('../../../assets/img/chat.jpeg')}
              style={styles.emptyStateImage}
              resizeMode="contain"
            />
            <Text style={styles.emptyStateTitle}>Bạn chưa có cuộc trò chuyện nào!</Text>
            <Text style={styles.emptyStateSubtitle}>Trải nghiệm chat</Text>
            <TouchableOpacity
              style={styles.goToHomeButton}
              onPress={() => {
                navigation.navigate('dashboard');
              }}
            >
              <Text style={styles.goToHomeButtonText}>Về trang chủ</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={chatData}
            keyExtractor={item => item.id}
            renderItem={({ item }) => renderNormalChatItem({ item })}
            contentContainerStyle={{ paddingVertical: 10 }}
          />
        )}
      </View>

      {/* Filter Options Modal */}
      <Modal
        transparent={true}
        visible={isFilterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)} // Cho phép đóng modal khi nhấn nút back trên Android
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1} // Đảm bảo không có hiệu ứng khi chạm vào overlay
          onPress={() => setFilterModalVisible(false)} // Đóng modal khi chạm ra ngoài
        >
          <View
            style={[
              styles.filterModalContent,
              {
                top: filterModalPosition.top,
                left: filterModalPosition.left,
                width: filterModalPosition.width + 20, // Chiều rộng bằng nút
              },
            ]}
          >
            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => handleSelectFilter('Tất cả')}
            >
              <Text style={styles.filterOptionText}>Tất cả</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => handleSelectFilter('Chưa đọc')}
            >
              <Text style={styles.filterOptionText}>Chưa đọc</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => handleSelectFilter('Đã đọc')}
            >
              <Text style={styles.filterOptionText}>Đã đọc</Text>
            </TouchableOpacity>
            {/* Thêm các tùy chọn lọc khác nếu cần */}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'android' ? 25 : 60,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.primary,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
  },
  searchFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 10,
  },
  filterText: {
    fontSize: 15,
    marginRight: 5,
    color: Colors.textDark,
  },
  filterIcon: {
    marginLeft: 2,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 12,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#ddd',
    height: 40,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.textDark,
    paddingVertical: 0,
  },

  chatItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white || Colors.white,
    padding: 12,
    marginBottom: 8,
    marginHorizontal: 10,
    borderRadius: 8,
    shadowColor: Colors.black, // Basic shadow for Android
    shadowOffset: { width: 0, height: 1 }, // Basic shadow for iOS
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2, // Android elevation
  },
  chatUserAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    backgroundColor: Colors.gray,
  },
  chatContent: {
    flex: 1,
    marginRight: 10,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  chatUserName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.textDark,
  },
  chatLastActive: {
    fontSize: 12,
    color: '#888',
  },
  chatLastMessage: {
    fontSize: 14,
    color: '#555',
  },

  // Empty styles
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: Colors.white, // Nền trắng cho phần nội dung trống
  },
  emptyStateImage: {
    width: width * 0.6, // Khoảng 60% chiều rộng màn hình
    height: width * 0.6, // Hình vuông
    marginBottom: 5,
    marginTop: 150,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: Colors.textDark,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 20, // Tăng khoảng cách dòng để dễ đọc
  },
  goToHomeButton: {
    backgroundColor: Colors.secondary || '#ffaa00', // Sử dụng màu cam đậm hơn nếu có, hoặc Colors.primary
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8, // Góc bo tròn nhẹ
    width: '80%', // Chiều rộng nút
    alignItems: 'center',
    shadowColor: Colors.black, // Thêm đổ bóng nhẹ
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  goToHomeButtonText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.white, // Chữ trắng
  },

  // === Modal Styles ===
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Nền mờ cho modal
    justifyContent: 'flex-start', // Căn trên để modal nằm đúng vị trí
    alignItems: 'flex-start', // Căn trái
  },
  filterModalContent: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    paddingVertical: 5,
    position: 'absolute', // Quan trọng để định vị
  },
  filterOption: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    width: '100%', // Đảm bảo chiếm hết chiều rộng của modal content
  },
  filterOptionText: {
    fontSize: 16,
    color: Colors.textDark,
  },
});

export default MessagesScreen;
