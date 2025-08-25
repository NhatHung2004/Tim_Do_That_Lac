import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions, Alert } from 'react-native';
import Colors from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import PasswordInput from '../ui/PasswordInput';
import CustomButton from '../ui/CustomButton';
import CustomInput from '../ui/CustomInput';
import AuthHeader from '../ui/AuthHeader';
import Api, { endpoints } from '../../configs/Api';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState({});

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const navigation = useNavigation();

  const handleRegister = async () => {
    let newErrors = {};

    if (!username.trim()) newErrors.username = 'Tên đăng nhập không được để trống';
    if (!phone.trim()) newErrors.phone = 'Số điện thoại không được để trống';
    if (!password.trim()) newErrors.password = 'Mật khẩu không được để trống';
    if (!confirmPassword.trim()) newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc.';
    else if (confirmPassword !== password)
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp.';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await Api.post(endpoints['register'], {
          username: username,
          phone: phone,
          password: password,
        });

        Alert.alert('Đăng ký thành công');
        navigation.goBack();
      } catch (error) {
        console.log(error);
      }
    } else {
      // Nếu có lỗi, hiển thị thông báo
      Alert.alert('Lỗi đăng ký', 'Vui lòng kiểm tra lại thông tin.');
    }
  };

  // Hàm kiểm tra mật khẩu theo các yêu cầu
  const validatePassword = pwd => {
    const minLength = 8; // Giới hạn từ 8-32 ký tự
    const maxLength = 32;
    const hasUppercase = /[A-Z]/.test(pwd);
    const hasLowercase = /[a-z]/.test(pwd);
    const hasDigit = /\d/.test(pwd);

    return {
      isLengthValid: pwd.length >= minLength && pwd.length <= maxLength,
      hasUppercase: hasUppercase,
      hasLowercase: hasLowercase,
      hasDigit: hasDigit,
    };
  };
  const passwordRequirements = validatePassword(password);

  return (
    <>
      <AuthHeader navigation={navigation} />

      <View style={styles.container}>
        <Text style={styles.title}>Đăng ký tài khoản</Text>

        <CustomInput
          placeholder="Tên đăng nhập"
          value={username}
          setValue={setUsername}
          error={errors.username}
        />

        <CustomInput
          placeholder="Số điện thoại"
          value={phone}
          setValue={setPhone}
          keyboardType="phone-pad"
          error={errors.phone}
        />

        <PasswordInput
          placeholder="Mật khẩu"
          value={password}
          setValue={setPassword}
          error={errors.password}
          onFocus={() => setIsPasswordFocused(true)}
          onBlur={() => setIsPasswordFocused(false)}
        />

        {isPasswordFocused && (
          <View style={styles.passwordRequirements}>
            <Text style={styles.requirementTitle}>Giới hạn từ 8-32 ký tự.</Text>
            <Text
              style={[
                styles.requirementItem,
                passwordRequirements.hasUppercase ? styles.validRequirement : {},
              ]}
            >
              <Ionicons
                name={passwordRequirements.hasUppercase ? 'checkmark-circle' : 'alert-circle'}
                size={16}
                color={passwordRequirements.hasUppercase ? '#0a0' : '#E04F5F'}
              />{' '}
              Tối thiểu 01 ký tự IN HOA.
            </Text>
            <Text
              style={[
                styles.requirementItem,
                passwordRequirements.hasLowercase ? styles.validRequirement : {},
              ]}
            >
              <Ionicons
                name={passwordRequirements.hasLowercase ? 'checkmark-circle' : 'alert-circle'}
                size={16}
                color={passwordRequirements.hasLowercase ? '#0a0' : '#E04F5F'}
              />{' '}
              Tối thiểu 01 ký tự in thường.
            </Text>
            <Text
              style={[
                styles.requirementItem,
                passwordRequirements.hasDigit ? styles.validRequirement : {},
              ]}
            >
              <Ionicons
                name={passwordRequirements.hasDigit ? 'checkmark-circle' : 'alert-circle'}
                size={16}
                color={passwordRequirements.hasDigit ? '#0a0' : '#E04F5F'}
              />{' '}
              Tối thiểu 01 chữ số.
            </Text>
          </View>
        )}

        <PasswordInput
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          setValue={setConfirmPassword}
          error={errors.confirmPassword}
        />

        <CustomButton text="ĐĂNG KÝ" onPress={handleRegister} bgColor={Colors.primary} />

        <View style={styles.separatorContainer}>
          <View style={styles.line} />
          <Text style={styles.separatorText}>Hoặc đăng nhập bằng</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require('../../../assets/img/facebook-new.png')}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require('../../../assets/img/google-logo.png')}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Image source={require('../../../assets/img/zalo.png')} style={styles.socialIcon} />
          </TouchableOpacity>
        </View>

        {/* Register Link */}
        <TouchableOpacity style={styles.loginLinkContainer} onPress={() => navigation.goBack()}>
          <Text style={styles.loginText}>Đã có tài khoản? </Text>
          <Text style={styles.loginLink}>Đăng nhập</Text>
        </TouchableOpacity>

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
  passwordRequirements: {
    marginTop: 5,
    marginBottom: 15,
    marginLeft: 5,
    alignSelf: 'flex-start',
  },
  requirementTitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 13,
    color: '#E04F5F',
    marginBottom: 3,
  },
  validRequirement: {
    color: '#0a0',
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
    width: (width - 80) / 3, // Khoảng cách giữa các nút
    height: 50,
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
  loginLinkContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  loginText: {
    fontSize: 15,
    color: '#555',
  },
  loginLink: {
    fontSize: 15,
    color: Colors.link,
    fontWeight: 'bold',
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
