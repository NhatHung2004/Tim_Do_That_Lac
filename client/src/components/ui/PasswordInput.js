// src/components/PasswordInput.js
import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PasswordInput = ({ value, setValue, placeholder, error, onFocus, onBlur }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <View style={[styles.inputWrapper, error ? styles.inputWrapperError : {}]}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={setValue}
          secureTextEntry={!showPassword}
          placeholderTextColor="#999"
          onFocus={onFocus}
          onBlur={onBlur}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.passwordToggle}
        >
          {/* <Text style={styles.toggleText}>{showPassword ? 'Ẩn' : 'Hiện'}</Text> */}
          {/* Hoặc có thể dùng icon con mắt nếu bạn thích */}
          <Ionicons
            name={showPassword ? 'eye-outline' : 'eye-off-outline'}
            size={24}
            color="#666"
          />
        </TouchableOpacity>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </>
  );
};

const styles = StyleSheet.create({
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  inputWrapperError: {
    borderColor: '#E04F5F',
    backgroundColor: '#fff7f7',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingRight: 10, // Để tạo khoảng trống cho nút toggle
  },
  passwordToggle: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  toggleText: {
    color: '#3B71F3', // Màu xanh dương cho chữ "Ẩn" / "Hiện"
    fontWeight: 'bold',
    fontSize: 14,
  },
  errorText: {
    color: '#E04F5F',
    alignSelf: 'flex-start',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 5,
  },
});

export default PasswordInput;
