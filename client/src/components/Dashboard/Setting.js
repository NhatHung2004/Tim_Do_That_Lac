import {
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Switch,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { MyUserContext, MyDispatchContext } from '../../configs/MyContext';
import { useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import styles from '../../styles/SettingStyle';

export default function MoreScreen() {
  const navigation = useNavigation();
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    dispatch({ type: 'logout' });
    await GoogleSignin.signOut();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Cài đặt</Text>
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
                <Text style={styles.profileText}>
                  {user.current_user.full_name || user.current_user.username}
                </Text>
              </>
            ) : (
              <>
                <Image source={require('../../../assets/img/user.png')} style={styles.avatar} />
                <Text style={styles.profileText}>Đăng nhập</Text>
              </>
            )}
          </TouchableOpacity>

          {user && (
            <>
              {/* Account mmanagement */}
              <Text style={styles.sectionTitle}>Quản lý tài khoản</Text>
              <TouchableOpacity
                style={styles.item}
                onPress={() => navigation.navigate('edit_profile')}
              >
                <MaterialIcons name="edit" size={22} color="#000" style={styles.icon} />
                <Text style={styles.itemText}>Chỉnh sửa thông tin</Text>
                <MaterialIcons name="chevron-right" size={22} color="#999" style={styles.arrow} />
              </TouchableOpacity>
            </>
          )}

          {user && (
            <TouchableOpacity style={styles.item} onPress={handleLogout}>
              <MaterialIcons name="logout" size={22} color="#000" style={styles.icon} />
              <Text style={styles.itemText}>Đăng xuất</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
