import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import styles from '../../styles/RegisterStyle';
import Colors from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import PasswordInput from '../ui/PasswordInput';
import CustomButton from '../ui/CustomButton';
import CustomInput from '../ui/CustomInput';
import AuthHeader from '../ui/AuthHeader';
import Api, { endpoints } from '../../configs/Api';
import MyLoading from '../ui/MyLoading';
import formatErrorMessages from '../../utils/FormatError';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const navigation = useNavigation();

  const handleRegister = async () => {
    let newErrors = {};

    if (!username.trim()) newErrors.username = 'Tên đăng nhập không được để trống';
    if (!fullname.trim()) newErrors.fullname = 'Tên không được để trống không được để trống';
    if (!password.trim()) newErrors.password = 'Mật khẩu không được để trống';
    if (!confirmPassword.trim()) newErrors.confirmPassword = 'Xác nhận mật khẩu là bắt buộc.';
    if (!email.trim()) newErrors.email = 'Email là bắt buộc';
    else if (confirmPassword !== password)
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp.';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        setLoading(true);
        const res = await Api.post(endpoints['register'], {
          username: username,
          fullname: fullname,
          password: password,
          email: email,
        });

        Alert.alert('Đăng ký thành công');
        navigation.goBack();
      } catch (error) {
        setLoading(false);
        if (error.response && error.response.status === 400) {
          // error.response.data chứa chi tiết validate error từ Django
          Alert.alert('Đăng ký thất bại', formatErrorMessages(error.response.data));
        } else {
          Alert.alert('Có lỗi xảy ra', 'Vui lòng thử lại sau');
        }
      } finally {
        setLoading(false);
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
          placeholder="Tên người dùng"
          value={fullname}
          setValue={setFullname}
          error={errors.fullname}
        />

        <CustomInput placeholder="Email" value={email} setValue={setEmail} error={errors.email} />

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

        {loading ? (
          <MyLoading color={Colors.primary} />
        ) : (
          <CustomButton text="ĐĂNG KÝ" onPress={handleRegister} bgColor={Colors.primary} />
        )}

        <View style={styles.separatorContainer}>
          <View style={styles.line} />
          <Text style={styles.separatorText}>Hoặc đăng nhập bằng</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.socialButtonsContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Image
              source={require('../../../assets/img/google-logo.png')}
              style={styles.socialIcon}
            />
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
