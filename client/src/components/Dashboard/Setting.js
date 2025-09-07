import { View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView } from 'react-native';
import { MaterialCommunityIcons, SimpleLineIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import SectionContainer from '../ui/SectionContainer';
import SectionItem from '../ui/SectionItem';
import { MyUserContext, MyDispatchContext } from '../../configs/MyContext';
import { useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import styles from '../../styles/SettingStyle';

export default function MoreScreen() {
  const navigation = useNavigation();
  const user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);

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
          <Text style={styles.headerTitle}>Thêm</Text>
          <TouchableOpacity>
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
