import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Feather } from '@expo/vector-icons';
import styles from '../../styles/PostStyle';

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

export default PostScreen;
