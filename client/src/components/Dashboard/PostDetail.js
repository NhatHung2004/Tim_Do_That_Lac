import { useState, useRef, useEffect, useContext } from 'react';
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  Alert,
  Image,
  FlatList,
  SafeAreaView,
  Platform,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/colors';
import { useNavigation } from '@react-navigation/native';
import Api, { endpoints } from '../../configs/Api';
import { useRoute } from '@react-navigation/native';
import { MyUserContext } from '../../configs/MyContext';
import FormatDate from '../../utils/FormatDate';
import styles from '../../styles/PostDetailStyle';

const PostDetail = () => {
  const user = useContext(MyUserContext);

  const commentsData = [
    {
      id: '1',
      name: 'Thanh Minh Vũ',
      content: 'ádasdasd',
      time: '5 ngày trước',
    },
    {
      id: '2',
      name: 'Nhi Lâm',
      content: 'lkslkdhflh',
      time: '2 tuần trước',
    },
  ];

  const navigation = useNavigation();
  const route = useRoute();
  const [postData, setPostData] = useState({});
  const [comments, setComments] = useState(commentsData);
  const [newComment, setNewComment] = useState('');

  const { postID } = route.params; // Get postID from params

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
    fetchPostData(); // Fetch detail post api
  }, []);

  const images = postData.images || [];
  const user_post = postData.user || {};

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

  const addComment = () => {
    if (newComment.trim() === '') return;
    const newItem = {
      id: (comments.length + 1).toString(),
      name: 'Bạn',
      content: newComment,
      time: 'Vừa xong',
    };
    setComments([newItem, ...comments]);
    setNewComment('');
  };

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

        {/** Comment  */}
        <View style={styles.descriptionSection}>
          <Text style={styles.title}>Bình luận</Text>

          <ScrollView style={styles.scrollArea} contentContainerStyle={{ paddingBottom: 10 }}>
            {comments.length === 0 ? (
              <Text style={styles.emptyText}>Chưa có bình luận</Text>
            ) : (
              comments.map(item => (
                <View key={item.id} style={styles.commentContainer}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{item.name[0]}</Text>
                  </View>
                  <View style={styles.commentBox}>
                    <Text style={styles.userName}>{item.name}</Text>
                    <Text style={styles.commentText}>{item.content}</Text>
                    <View style={styles.footerComment}>
                      <Text style={styles.reply}>Trả lời</Text>
                      <Text style={styles.time}>{item.time}</Text>
                    </View>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          <View style={styles.inputContainer}>
            <View style={styles.inputAvatar}>
              <Text style={styles.avatarText}>N</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Bình luận..."
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity onPress={addComment}>
              <Text style={styles.send}>➤</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        {user?.current_user.id === user_post.id ? (
          <TouchableOpacity
            style={[styles.footerButton, styles.chatButton]}
            onPress={() => navigation.navigate('edit_post', { post_id: postData.id })}
          >
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

export default PostDetail;
