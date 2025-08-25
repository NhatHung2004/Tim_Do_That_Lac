import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView, // Để xử lý phần notch/status bar
  ScrollView,
  Platform, // Để có thể cuộn nếu nội dung dài
} from 'react-native';
import Colors from '../../constants/colors';
import { MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import SectionContainer from '../ui/SectionContainer';
import SectionItem from '../ui/SectionItem';
import { MyUserContext, MyDispatchContext } from '../../configs/MyContext';
import { useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MoreScreen() {
  const navigation = useNavigation();
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    dispatch({ type: 'logout' });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Thêm</Text>
          <TouchableOpacity style={styles.notificationButton}>
            <SimpleLineIcons name="bell" size={24} color="black" />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            style={styles.profileSection}
            onPress={() => navigation.navigate('login', { redirectScreen: 'dashboard' })}
            disabled={user !== null}
          >
            {user ? (
              <>
                {user.current_user.avatar ? (
                  <Image
                    source={{
                      uri: user.current_user.avatar,
                    }}
                    style={styles.avatar}
                  />
                ) : (
                  <Image source={require('../../../assets/img/user.png')} style={styles.avatar} />
                )}
                <Text style={styles.profileText}>{user.current_user.username}</Text>
              </>
            ) : (
              <>
                <Image source={require('../../../assets/img/user.png')} style={styles.avatar} />
                <Text style={styles.profileText}>Đăng nhập</Text>
              </>
            )}
          </TouchableOpacity>

          <SectionContainer title="Quản lý">
            <SectionItem title="Đơn mua">
              <MaterialCommunityIcons name="golf-cart" size={25} style={styles.listItemIcon} />
            </SectionItem>
            <SectionItem title="Đơn bán">
              <MaterialCommunityIcons name="golf-cart" size={25} style={styles.listItemIcon} />
            </SectionItem>
          </SectionContainer>

          {user && (
            <SectionContainer title="Tài khoản">
              <SectionItem title="Thông tin cá nhân">
                <MaterialCommunityIcons name="account" size={25} style={styles.listItemIcon} />
              </SectionItem>
              <SectionItem title="Đổi mật khẩu">
                <MaterialCommunityIcons name="lock-reset" size={25} style={styles.listItemIcon} />
              </SectionItem>
              <SectionItem title="Đăng xuất" onPress={handleLogout}>
                <MaterialCommunityIcons name="logout" size={25} style={styles.listItemIcon} />
              </SectionItem>
            </SectionContainer>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 15 : 40,
    paddingBottom: 10,
    backgroundColor: Colors.primary,
    borderBottomWidth: 0,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationIcon: {
    width: 24,
    height: 24,
    tintColor: '#333',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 25,
    marginRight: 15,
  },
  profileText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  listItemIcon: {
    marginRight: 15,
    tintColor: '#555', // Màu icon mặc định
  },
});
