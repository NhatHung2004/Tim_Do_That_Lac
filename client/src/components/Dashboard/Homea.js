import { useEffect, useState, useContext, useRef, useCallback, use } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Platform,
  Animated,
} from 'react-native';
import styles from '../../styles/HomeStyle';
import Colors from '../../constants/colors';
import PostItem from '../ui/PostItem';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Api, { AuthApi, endpoints } from '../../configs/Api';
import { Ionicons } from '@expo/vector-icons';
import { MyRefreshContext, MyUserContext } from '../../configs/MyContext';
import axios from 'axios';
import CustomModalFilter from '../ui/CustommModalFilter';
import {
  getMessaging,
  getToken,
  onTokenRefresh,
  requestPermission,
  onMessage,
} from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';

export default function HomeScreen() {
  const [posts, setPosts] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [categories, setCategories] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const navigation = useNavigation();
  const [refresh, setRefresh] = useContext(MyRefreshContext);

  const [modalCategoriesVisible, setModalCategoriesVisible] = useState(false);
  const [modalProvincesVisible, setModalProvincesVisible] = useState(false);
  const [searchQueryCate, setSearchQueryCate] = useState('');
  const [searchQueryCity, setSearchQueryCity] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả danh mục');
  const [selectedCity, setSelectedCity] = useState('Thành phố');
  const [selectedFilter, setSelectedFilter] = useState([]);
  const [badgeCount, setBadgeCount] = useState(0);
  const [badgeMess, setBadgeMess] = useState(false);
  const [unreadID, setUnreadID] = useState([]);

  const user = useContext(MyUserContext);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  const app = getApp();
  const messaging = getMessaging(app);

  // FCM token registration
  const registerForPush = async () => {
    try {
      await requestPermission(messaging);
      const fcm_token = await getToken(messaging);
      await AuthApi().post(endpoints.fcmToken, { token: fcm_token, platform: Platform.OS }); // Django lưu token
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user == null) return;

    registerForPush();

    // re-register when token refresh
    const unsubscribe = onTokenRefresh(messaging, async fcm_token => {
      console.log('New FCM token:', fcm_token);
      try {
        await AuthApi().post(endpoints.fcmToken, {
          token: fcm_token,
          platform: Platform.OS,
        });
        console.log('FCM token updated on server');
      } catch (err) {
        console.error('Error updating FCM token:', err);
      }
    });

    return unsubscribe;
  }, [user]);

  // Foreground state notification handler
  useEffect(() => {
    const unsubscribeForeground = onMessage(messaging, remoteMessage => {
      if (remoteMessage.data) {
        console.log('onMessage (Foreground):', remoteMessage.data);

        if (remoteMessage.data.type === 'message') {
          setBadgeMess(true);
          setUnreadID([...unreadID, parseInt(remoteMessage.data.user_chat_id)]);
        } else {
          setBadgeCount(prevCount => {
            const newCount = prevCount + 1;
            if (newCount > 3) return 3; // Maximum limit
            return newCount;
          });
        }
      }
    });

    return unsubscribeForeground;
  }, []);

  // Get notifications from api
  const fetchNotiApi = async () => {
    try {
      const res = await AuthApi().get(endpoints.notifications(user.current_user.id));
      res.data.map(n => {
        if (!n.is_read) {
          setBadgeCount(prevCount => {
            const newCount = prevCount + 1;
            if (newCount > 3) return 3; // Maximum limit
            return newCount;
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  // fetch notification when open app from background
  useFocusEffect(
    useCallback(() => {
      if (user) fetchNotiApi();
    }, [user]),
  );

  // Lấy danh sách tỉnh/thành phố từ API
  useEffect(() => {
    axios
      .get('https://provinces.open-api.vn/api/p/')
      .then(res => setProvinces(res.data))
      .catch(err => console.error('Error fetching provinces:', err));
  }, []);

  // Get categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await Api.get(endpoints['categories']);
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, []);

  const fetchPostsData = async () => {
    try {
      const response = await Api.get(endpoints['posts'], {
        params: {
          st: 'approved',
          kw: searchText, // Thêm từ khóa tìm kiếm vào tham số
        },
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching found items:', error);
    }
  };

  // Lấy dữ liệu bài đăng
  useEffect(() => {
    fetchPostsData();
  }, [searchText]);

  // lấy dữ liệu bài đăng mỗi khi focus screen
  useFocusEffect(
    useCallback(() => {
      if (refresh) fetchPostsData();
      setRefresh(false);
    }, [refresh]),
  );

  // Hàm lấy dữ liệu bài đăng đã lọc theo danh mục và thành phố
  const handleGetPostsFiltered = async () => {
    try {
      const response = await Api.get(endpoints['posts'], {
        params: {
          category: selectedCategory !== 'Tất cả danh mục' ? selectedCategory : undefined,
          city: selectedCity !== 'Thành phố' ? selectedCity : undefined,
        },
      });
      setPosts(response.data);
      toggleView();
    } catch (error) {
      console.error('Error fetching filtered posts:', error);
    }
  };

  // Hàm xử lý khi người dùng nhấn vào một bài đăng
  const handlePostPress = id => {
    navigation.navigate('post_detail', { postID: id }); // Điều hướng và truyền ID bài đăng
  };

  // Hàm xử lý chọn nội dung filter
  const handleFilterSelect = (type, value) => {
    if (type === 'category') {
      setSelectedCategory(value);
      setModalCategoriesVisible(false);
    } else if (type === 'city') {
      setSelectedCity(value);
      setModalProvincesVisible(false);
    }
    setSelectedFilter(prev => {
      const newFilter = [...prev];
      const existingIndex = newFilter.findIndex(item => item.type === type);
      if (existingIndex > -1) {
        newFilter[existingIndex].value = value;
      } else {
        newFilter.push({ type, value });
      }
      return newFilter;
    });
  };

  // Render modal item
  const renderModalItem = ({ item, type, selectedItem }) => (
    <TouchableOpacity
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
      }}
      onPress={() => handleFilterSelect(type, item.name)}
    >
      {selectedItem === item.name && (
        <Ionicons name="checkmark" size={20} color="#007bff" style={{ marginRight: 8 }} />
      )}
      <Text
        style={[
          { fontSize: 16 },
          selectedItem === item.name && { fontWeight: 'bold', color: '#007bff' },
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  // Hàm lọc từ khoá trong modal
  const filterItems = (items, query) => {
    if (!query) return items; // Nếu không có từ khóa, trả về toàn bộ danh sách
    return items.filter(item => item.name.toLowerCase().includes(query.toLowerCase()));
  };

  // Hàm để hiển thị hoặc ẩn bộ lọc
  const toggleView = () => {
    // Đảo ngược trạng thái
    setIsVisible(!isVisible);
    setSelectedCategory('Tất cả danh mục'); // Đặt lại danh mục đã chọn về mặc định

    // Bắt đầu animation
    Animated.timing(animatedHeight, {
      toValue: isVisible ? 0 : 300, // Chiều cao mục tiêu: 0 (ẩn) hoặc 200 (hiện)
      duration: 300, // Thời gian chuyển động
      useNativeDriver: false,
    }).start();
  };

  // Hàm để xóa bộ lọc
  const handleClearFilters = () => {
    setSelectedCategory('Tất cả danh mục');
    setSelectedCity('Thành phố');
    setSearchQueryCate('');
    setSearchText('');
    setSelectedFilter([]);
    toggleView();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.headerContainer]}>
        <View style={styles.contentWrapper}>
          {/* Ô tìm kiếm */}
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#888" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm..."
              placeholderTextColor="#888"
              value={searchText}
              onChangeText={setSearchText}
              returnKeyType="search"
            />
            <TouchableOpacity
              onPress={() => navigation.navigate('camera')}
              style={{ marginLeft: 6 }}
            >
              <Ionicons name="camera-outline" size={22} color="#555" />
            </TouchableOpacity>
          </View>

          {/* Nút thông báo */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              navigation.navigate('notification');
              setBadgeCount(0); // Clear badge count when navigating to notifications
            }}
          >
            <Ionicons name="notifications-outline" size={24} color="#333" />
            {badgeCount > 0 && (
              <View
                style={{
                  position: 'absolute',
                  right: -4,
                  top: -2,
                  backgroundColor: 'red',
                  borderRadius: 10,
                  minWidth: 16,
                  height: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 3,
                }}
              >
                <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
                  {badgeCount > 2 ? '2+' : badgeCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Nút tin nhắn */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => {
              if (user) {
                navigation.navigate('mess_index', { unreadID: unreadID });
                setBadgeMess(false);
              } else navigation.navigate('login', { redirectScreen: 'mess_index' });
            }}
          >
            <Ionicons name="chatbox-outline" size={24} color="#333" />
            {badgeMess && (
              <View
                style={{
                  position: 'absolute',
                  right: -4,
                  top: -2,
                  backgroundColor: 'red',
                  borderRadius: 10,
                  minWidth: 16,
                  height: 16,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 3,
                }}
              >
                <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>1+</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Nút bộ lọc */}
        <TouchableOpacity onPress={toggleView} style={styles.filterButton}>
          <Text>{isVisible ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}</Text>
          <Ionicons
            name={isVisible ? 'chevron-up-outline' : 'chevron-down-outline'}
            size={20}
            color={Colors.black}
          />
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.animatedContainer, { height: animatedHeight }]}>
        <View style={styles.headerTabContainer}>
          <View style={styles.filterContent}>
            {/* Danh mục */}
            <View style={styles.filterSection}>
              <View style={styles.filterTitleRow}>
                <View style={styles.dot} />
                <Text style={styles.filterTitle}>Danh mục</Text>
              </View>
              <TouchableOpacity
                style={styles.filterItem}
                onPress={() => setModalCategoriesVisible(true)}
              >
                <Text>{selectedCategory}</Text>
                <Ionicons name="chevron-forward-outline" size={20} color="#999" />
              </TouchableOpacity>
            </View>

            {/* Tỉnh/Thành phố */}
            <View style={styles.filterSection}>
              <View style={styles.filterTitleRow}>
                <View style={styles.dot} />
                <Text style={styles.filterTitle}>Tỉnh/Thành phố</Text>
              </View>
              <TouchableOpacity
                style={styles.filterItem}
                onPress={() => setModalProvincesVisible(true)}
              >
                <Text>{selectedCity}</Text>
                <Ionicons name="chevron-forward-outline" size={20} color="#999" />
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row' }}>
              {/* Nút xóa bộ lọc */}
              <TouchableOpacity style={styles.filterDeleteButton} onPress={handleClearFilters}>
                <Ionicons name="close-circle-outline" size={20} color={Colors.link} />
                <Text style={styles.filterDeleteText}>Xóa bộ lọc</Text>
              </TouchableOpacity>

              {/* Nút tìm kiếm */}
              <TouchableOpacity
                style={[styles.filterDeleteButton, { marginLeft: 5 }]}
                onPress={handleGetPostsFiltered}
              >
                <Ionicons name="search-circle-outline" size={20} color={Colors.link} />
                <Text style={styles.filterDeleteText}>Tìm kiếm</Text>
              </TouchableOpacity>
            </View>

            {/* Bộ lọc đang áp dụng */}
            {(selectedCategory !== 'Tất cả danh mục' || selectedCity !== 'Thành phố') && (
              <>
                <Text style={styles.filterSelectedText}>Bộ lọc đang áp dụng:</Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                  {selectedFilter.map((filter, index) => (
                    <View key={index} style={styles.filterSelectedContainer}>
                      <View style={styles.dot} />
                      <Text style={{ color: Colors.link }}>{filter.value}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        </View>
      </Animated.View>

      {/* Danh sách bài đăng */}
      <FlatList
        data={posts}
        renderItem={({ item }) => <PostItem {...item} onPress={() => handlePostPress(item.id)} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.postList}
        showsVerticalScrollIndicator={false}
      />

      {/* Modal danh mục */}
      <CustomModalFilter
        visible={modalCategoriesVisible}
        onClose={() => setModalCategoriesVisible(false)}
        searchQuery={searchQueryCate}
        setSearchQuery={setSearchQueryCate}
        data={filterItems(categories, searchQueryCate)}
        renderModal={({ item }) =>
          renderModalItem({ item, type: 'category', selectedItem: selectedCategory })
        }
      />

      {/* Modal tỉnh/thành phố */}
      <CustomModalFilter
        visible={modalProvincesVisible}
        onClose={() => setModalProvincesVisible(false)}
        searchQuery={searchQueryCity}
        setSearchQuery={setSearchQueryCity}
        data={filterItems(provinces, searchQueryCity)}
        renderModal={({ item }) =>
          renderModalItem({ item, type: 'city', selectedItem: selectedCity })
        }
      />
    </View>
  );
}
