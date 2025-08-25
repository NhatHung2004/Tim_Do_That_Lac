import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";

export default function LoginScreen() {
	const [username, setUsername] = useState<string>(""); // Khai báo kiểu string
	const [password, setPassword] = useState<string>(""); // Khai báo kiểu string
	const router = useRouter();

	const handleLogin = () => {
		// Logic xác thực cơ bản cho mục đích minh họa
		if (username === "user" && password === "password") {
			Alert.alert("Đăng nhập thành công", "Bạn đã đăng nhập!", [
				{ text: "OK", onPress: () => router.replace("/") }, // Điều hướng về trang chủ hoặc dashboard
			]);
		} else {
			Alert.alert("Đăng nhập thất bại", "Sai tên đăng nhập hoặc mật khẩu.");
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Đăng nhập</Text>
			<TextInput
				style={styles.input}
				placeholder='Tên đăng nhập'
				value={username}
				onChangeText={setUsername}
				autoCapitalize='none'
				keyboardType='email-address' // Gợi ý bàn phím email
			/>
			<TextInput
				style={styles.input}
				placeholder='Mật khẩu'
				value={password}
				onChangeText={setPassword}
				secureTextEntry
			/>
			<Button title='Đăng nhập' onPress={handleLogin} />
			{/* Ví dụ điều hướng đến màn hình đăng ký */}
			<Button
				title='Chưa có tài khoản? Đăng ký'
				onPress={() => router.push("/register")} // Giả định bạn có file register.tsx
				color='#841584'
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
		backgroundColor: "#f5f5f5",
	},
	title: {
		fontSize: 32,
		fontWeight: "bold",
		marginBottom: 30,
		color: "#333",
	},
	input: {
		width: "100%",
		height: 50,
		borderColor: "#ccc",
		borderWidth: 1,
		borderRadius: 8,
		paddingHorizontal: 15,
		marginBottom: 15,
		backgroundColor: "#fff",
		fontSize: 16,
	},
});
