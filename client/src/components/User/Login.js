import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
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
import styles from '../../styles/LoginStyle';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useContext(MyDispatchContext);

  // Google Signin configuration
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: WEB_CLIENT_ID,
    });
  }, []);

  // Sign in with Google
  const googleLogin = async () => {
    try {
      setLoadingGoogle(true);

      await GoogleSignin.signOut();

      // Check if device has Google Play services
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const signInResult = await GoogleSignin.signIn();

      const res = await Api.post(endpoints['google'], {
        token: signInResult.data.idToken,
      });

      await AsyncStorage.setItem('token', res.data.access_token);
      await AsyncStorage.setItem('refresh', res.data.refresh);

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

  // Standard login
  const handleLogin = async () => {
    setLoading(true);

    try {
      const response = await Api.post(endpoints['login'], {
        username,
        password,
      });

      const token = response.data.access;
      const refresh = response.data.refresh;
      const current_user = response.data.user;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('refresh', refresh);

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
      console.log(error);
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
