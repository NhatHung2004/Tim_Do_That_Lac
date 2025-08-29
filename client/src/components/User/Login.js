import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import Colors from '../../constants/colors';
import { useContext, useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import Api, { endpoints } from '../../configs/Api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MyDispatchContext } from '../../configs/MyContext';
import CustomButton from '../ui/CustomButton';
import CustomInput from '../ui/CustomInput';
import PasswordInput from '../ui/PasswordInput';
import AuthHeader from '../ui/AuthHeader';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import MyLoading from '../ui/MyLoading';
import { WEB_CLIENT_ID } from '@env';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useContext(MyDispatchContext);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '766873287455-ejcno1nu4e0sqh13e0egnol3faa9j9hq.apps.googleusercontent.com',
    });
  }, []);

  const googleLogin = async () => {
    try {
      setLoadingGoogle(true);

      await GoogleSignin.signOut();

      // Kiểm tra thiết bị có hỗ trợ Google Play
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();

      const res = await Api.post(endpoints['google'], {
        token: signInResult.data.idToken,
      });

      await AsyncStorage.setItem('token', res.data.access_token);

      const current_user = res.data.user;
      dispatch({ type: 'login', payload: { current_user } });

      if (route.params !== undefined) {
        const { redirectScreen } = route.params;

        navigation.reset({
          index: 0,
          routes: [{ name: redirectScreen }],
        });
      } else navigation.goBack();
    } catch (error) {
      setLoadingGoogle(false);
      console.log(error);
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);

    try {
      const response = await Api.post(endpoints['login'], {
        username,
        password,
      });

      const token = response.data.access;
      const current_user = response.data.user;

      console.log('asdasd', current_user);

      await AsyncStorage.setItem('token', token);

      dispatch({ type: 'login', payload: { current_user } });

      if (route.params !== undefined) {
        const { redirectScreen } = route.params;

        navigation.reset({
          index: 0,
          routes: [{ name: redirectScreen }],
        });
      } else navigation.goBack();
    } catch (error) {
      setLoading(false);
      Alert.alert('Đăng nhập không thành công', 'Sai tài khoản hoặc mật khẩu', [{ text: 'OK' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header - Back Button */}
      <AuthHeader navigation={navigation} />

      <View style={styles.container}>
        {/* Title */}
        <Text style={styles.title}>Đăng nhập</Text>

        <CustomInput placeholder="Tên đăng nhập" value={username} setValue={setUsername} />

        <PasswordInput placeholder="Mật khẩu" value={password} setValue={setPassword} />

        <TouchableOpacity onPress={() => navigation.navigate('forgot_password')}>
          <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
        </TouchableOpacity>

        {loading ? (
          <MyLoading color={Colors.primary} />
        ) : (
          <CustomButton text="ĐĂNG NHẬP" onPress={handleLogin} bgColor={Colors.primary} />
        )}

        <View style={styles.separatorContainer}>
          <View style={styles.line} />
          <Text style={styles.separatorText}>Hoặc đăng nhập bằng</Text>
          <View style={styles.line} />
        </View>

        {/* Social Login Buttons */}
        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity style={styles.socialButton} onPress={googleLogin}>
            {loadingGoogle ? (
              <MyLoading color={Colors.primary} />
            ) : (
              <Image
                source={require('../../../assets/img/google-logo.png')}
                style={styles.socialIcon}
              />
            )}
          </TouchableOpacity>
        </View>

        {/* Register Link */}
        <TouchableOpacity
          style={styles.registerLinkContainer}
          onPress={() => navigation.navigate('register')}
        >
          <Text style={styles.registerText}>Chưa có tài khoản? </Text>
          <Text style={styles.registerLink}>Đăng ký tài khoản mới</Text>
        </TouchableOpacity>

        {/* Footer Links */}
        <View style={styles.footerLinksContainer}>
          <Text style={styles.footerLink}>Quy chế hoạt động sàn</Text>
          <Text style={styles.footerLink}>•</Text>
          <Text style={styles.footerLink}>Chính sách bảo mật</Text>
          <Text style={styles.footerLink}>•</Text>
          <Text style={styles.footerLink}>Liên hệ hỗ trợ</Text>
        </View>

        {/* Developed by Section */}
        <View style={styles.developedByContainer}>
          <Text style={styles.developedByText}>Được phát triển bởi NNH</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    alignSelf: 'flex-start',
  },
  forgotPassword: {
    color: Colors.link,
    marginBottom: 20,
    marginTop: 5,
    fontSize: 14,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.gray,
  },
  separatorText: {
    marginHorizontal: 10,
    color: '#888',
    fontSize: 14,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 30,
  },
  socialButton: {
    width: '80%',
    height: '50',
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  registerLinkContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  registerText: {
    fontSize: 15,
    color: '#555',
  },
  registerLink: {
    fontSize: 15,
    color: Colors.link,
    fontWeight: 'bold',
  },
  footerLinksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 'auto',
    marginBottom: 10,
  },
  footerLink: {
    fontSize: 9,
    color: '#888',
    marginHorizontal: 5,
  },
  developedByContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  developedByText: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
  },
});
