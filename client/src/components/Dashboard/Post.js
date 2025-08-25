import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Feather } from '@expo/vector-icons';

const PostScreen = () => {
  const categories = [
    { name: 'Tìm đồ', icon: 'devices', type: 'lost', msg: 'Đăng tin tìm đồ' },
    { name: 'Tìm người', icon: 'person', type: 'found', msg: 'Đăng tin tìm người' },
  ];
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.headerIcon}
            onPress={() => navigation.navigate('dashboard')}
          >
            <AntDesign name="close" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đăng tin</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Quick Post Section */}
          <View style={styles.quickPostSection}>
            <Text style={styles.sectionTitle}>ĐĂNG TIN NHANH</Text>
            <TouchableOpacity style={styles.aiPostButton}>
              <View style={styles.aiIconContainer}>
                <Text style={styles.aiText}>AI</Text>
              </View>
              <View style={styles.aiButtonContent}>
                <Text style={styles.aiButtonTitle}>Đăng nhanh bằng AI</Text>
                <Text style={styles.aiButtonSubtitle}>Bạn quay sản phẩm, AI tạo tin đăng</Text>
              </View>
              <Feather name="chevron-right" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Category Selection Section */}
          <View style={styles.categorySection}>
            <Text style={styles.sectionTitle}>CHỌN DANH MỤC</Text>
            {categories.map((category, index) => (
              <TouchableOpacity
                key={index}
                style={styles.categoryItem}
                onPress={() =>
                  navigation.navigate('upload_post', { type: category.type, msg: category.msg })
                }
              >
                <MaterialIcons
                  name={category.icon}
                  size={24}
                  color="#333"
                  style={styles.categoryIcon}
                />
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f2f5', // Màu nền tổng thể
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    marginTop: Platform.OS === 'ios' ? 0 : 40,
  },
  headerIcon: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  headerRightPlaceholder: {
    width: 24, // Để cân đối với icon bên trái
  },
  quickPostSection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 10,
  },
  aiPostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  aiIconContainer: {
    backgroundColor: '#ffaa00', // Màu vàng cam tương tự AI trong ảnh
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  aiText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  aiButtonContent: {
    flex: 1,
  },
  aiButtonTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  aiButtonSubtitle: {
    fontSize: 13,
    color: '#666',
  },
  categorySection: {
    backgroundColor: '#fff',
    marginTop: 10,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoryIcon: {
    marginRight: 15,
  },
  categoryName: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  highlightBadge: {
    backgroundColor: '#ff5c5c', // Màu đỏ cho badge "MỚI"
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginRight: 10,
  },
  highlightText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  categoryArrow: {
    marginLeft: 10,
  },
});

export default PostScreen;
