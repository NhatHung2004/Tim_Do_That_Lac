import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, StyleSheet, View } from 'react-native';
import AuthHeader from '../ui/AuthHeader';
import { useNavigation } from '@react-navigation/native';
import Colors from '../../constants/colors';

export default function ForgotPass() {
  const [phone, setPhone] = useState('');
  const navigation = useNavigation();

  const handleContinue = () => {
    console.log('Số điện thoại:', phone);
  };

  return (
    <>
      <AuthHeader navigation={navigation} />
      <View style={styles.container}>
        <Text style={styles.header}>Đặt lại mật khẩu</Text>
        <Text style={styles.subHeader}>Nhập số điện thoại để đặt lại mật khẩu của bạn</Text>

        <TextInput
          style={styles.input}
          placeholder="Nhập SĐT của bạn"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>TIẾP TỤC</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subHeader: {
    fontSize: 14,
    marginBottom: 24,
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 24,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
