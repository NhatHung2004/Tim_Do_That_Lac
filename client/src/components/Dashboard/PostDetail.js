import { useState, useRef, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  Alert,
  Image,
  FlatList,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import Api, { endpoints } from '../../configs/Api';
import { useRoute } from '@react-navigation/native';
import { MyUserContext } from '../../configs/MyContext';
import FormatDate from '../../utils/FormatDate';

const { width } = Dimensions.get('window');

const PostDetail = () => {
  const user = useContext(MyUserContext);

  const navigation = useNavigation();
  const route = useRoute();
  const [postData, setPostData] = useState({});

  const { postID } = route.params; // Lấy postID từ params

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await Api.get(`${endpoints['posts']}${postID}/`);
        setPostData(response.data);
      } catch (error) {
        console.error('Error fetching post data:', error);
        Alert.alert('Lỗi', 'Không thể tải dữ liệu bài đăng');
      }
    };
    fetchPostData(); // Lấy dữ liệu bài đăng chi tiết từ API
  }, []);

  console.log(postData);

  const images = postData.images || []; // Đảm bảo images là mảng, tránh lỗi khi không có dữ liệu
  const user_post = postData.user || {}; // Đảm bảo user là đối tượng, tránh lỗi khi không có dữ liệu

  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef(null);

  // --- Hàm xử lý cho ProductImageCarousel ---
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'light-content' : 'dark-content'}
        backgroundColor={Colors.primary}
      />

      {/* ProductHeader */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.rightIcons}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="heart-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="share-outline" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {/* ProductImageCarousel */}
        <View style={styles.carouselContainer}>
          <FlatList
            ref={flatListRef}
            data={postData.images}
            renderItem={({ item }) => (
              <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="cover" />
            )}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            keyExtractor={(item, index) => index.toString()}
          />
          <View style={styles.pagination}>
            <Text style={styles.paginationText}>
              {activeIndex + 1}/{images.length}
            </Text>
          </View>
        </View>

        {/* Product Details Section */}
        <View style={styles.detailsSection}>
          <Text style={styles.productName}>{postData.title}</Text>

          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={18} color="#666" />
            <Text style={styles.productLocation}>{postData.location}</Text>
          </View>
          <View style={styles.postedTimeContainer}>
            <Ionicons name="time-outline" size={18} color="#666" />
            <Text style={styles.productPostedTime}>{FormatDate(postData.posted_time)}</Text>
          </View>
        </View>

        {/* SellerInfo */}
        <View style={styles.sellerContainer}>
          <View style={styles.sellerHeader}>
            {user_post.avatar ? (
              <Image source={{ uri: user_post.avatar }} style={styles.sellerAvatar} />
            ) : (
              <Image source={require('../../../assets/img/user.png')} style={styles.sellerAvatar} />
            )}
            <View style={styles.sellerDetails}>
              <Text style={styles.sellerName}>{user_post.username}</Text>
              <Text style={styles.activeStatus}>Hoạt động 5 giờ trước</Text>
            </View>
            <TouchableOpacity style={styles.sellerBagIcon}>
              <Ionicons name="briefcase-outline" size={20} color="#666" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.descriptionSection}>
          <Text style={styles.sectionTitle}>Mô tả</Text>
          <Text style={styles.descriptionText}>
            {postData.description || 'Chưa có mô tả cho bài đăng này.'}
          </Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {user?.current_user.id === user_post.id ? (
          <TouchableOpacity style={[styles.footerButton, styles.chatButton]}>
            <Text style={[styles.footerButtonText, styles.chatButtonText]}>Chỉnh sửa bài đăng</Text>
          </TouchableOpacity>
        ) : (
          <>
            {postData.phone && (
              <TouchableOpacity style={[styles.footerButton, styles.callButton]}>
                <Ionicons name="call-outline" size={20} color="#3B71F3" />
                <Text style={[styles.footerButtonText, styles.callButtonText]}>Gọi</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.footerButton, styles.chatButton]}
              onPress={() => {
                if (user) {
                  navigation.navigate('chat_screen', {
                    other_user_id: postData.user.id,
                  });
                } else navigation.navigate('login');
              }}
            >
              <Ionicons name="chatbox-ellipses-outline" size={20} color="#fff" />
              <Text style={[styles.footerButtonText, styles.chatButtonText]}>Chat</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  scrollViewContent: {
    paddingTop: Platform.OS === 'ios' ? 90 : 70,
    paddingBottom: 80,
    marginTop: Platform.OS === 'ios' ? -25 : 25,
  },
  // --- Header Styles ---
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
    paddingBottom: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: Colors.primary,
  },
  iconButton: {
    padding: 5,
  },
  rightIcons: {
    flexDirection: 'row',
  },
  // --- ProductImageCarousel Styles ---
  carouselContainer: {
    width: '100%',
    height: width * 0.9,
    backgroundColor: '#f0f0f0',
    position: 'relative',
  },
  productImage: {
    width: width,
    height: '100%',
  },
  pagination: {
    position: 'absolute',
    bottom: 10,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  paginationText: {
    color: '#fff',
    fontSize: 12,
  },
  // --- Product Details Section Styles ---
  detailsSection: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  productLocation: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  postedTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productPostedTime: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  // --- SellerInfo Styles ---
  sellerContainer: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sellerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sellerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sellerDetails: {
    flex: 1,
  },
  sellerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  activeStatus: {
    fontSize: 12,
    color: 'gray',
  },
  sellerBagIcon: {
    padding: 5,
  },
  // --- Description Section Styles ---
  descriptionSection: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  descriptionText: {
    fontSize: 15,
    color: '#555',
    lineHeight: 22,
  },
  // --- Footer Styles ---
  footer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  footerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  footerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  callButton: {
    backgroundColor: '#fff',
    borderColor: '#3B71F3',
    borderWidth: 1,
  },
  callButtonText: {
    color: '#3B71F3',
  },
  chatButton: {
    backgroundColor: '#3B71F3',
    borderColor: '#3B71F3',
    borderWidth: 1,
  },
  chatButtonText: {
    color: '#fff',
  },
});

export default PostDetail;
