// app/register.tsx
import React, { useState } from "react";
import {
	View,
	Text,
	TextInput,
	Button,
	StyleSheet,
	Alert,
	TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
	const [username, setUsername] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [confirmPassword, setConfirmPassword] = useState<string>("");
	const router = useRouter();

	const handleRegister = () => {
		// Logic xác thực và đăng ký cơ bản cho mục đích minh họa
		if (!username || !email || !password || !confirmPassword) {
			Alert.alert("Lỗi đăng ký", "Vui lòng điền đầy đủ tất cả các trường.");
			return;
		}

		if (password !== confirmPassword) {
			Alert.alert("Lỗi đăng ký", "Mật khẩu xác nhận không khớp.");
			return;
		}

		// Trong ứng dụng thực tế, bạn sẽ gửi dữ liệu này đến API backend
		// và xử lý phản hồi.
		Alert.alert("Đăng ký thành công", `Tài khoản ${username} đã được tạo!`, [
			{ text: "OK", onPress: () => router.replace("./index") }, // Điều hướng về trang đăng nhập sau khi đăng ký
		]);

		// Reset form
		setUsername("");
		setEmail("");
		setPassword("");
		setConfirmPassword("");
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Đăng ký</Text>
			<TextInput
				style={styles.input}
				placeholder='Tên đăng nhập'
				value={username}
				onChangeText={setUsername}
				autoCapitalize='none'
			/>
			<TextInput
				style={styles.input}
				placeholder='Email'
				value={email}
				onChangeText={setEmail}
				keyboardType='email-address'
				autoCapitalize='none'
			/>
			<TextInput
				style={styles.input}
				placeholder='Mật khẩu'
				value={password}
				onChangeText={setPassword}
				secureTextEntry
			/>
			<TextInput
				style={styles.input}
				placeholder='Xác nhận mật khẩu'
				value={confirmPassword}
				onChangeText={setConfirmPassword}
				secureTextEntry
			/>
			<Button title='Đăng ký' onPress={handleRegister} />

			<TouchableOpacity
				onPress={() => router.push("/")}
				style={styles.loginLink}
			>
				<Text style={styles.loginText}>Đã có tài khoản? Đăng nhập</Text>
			</TouchableOpacity>
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
	loginLink: {
		marginTop: 20,
	},
	loginText: {
		color: "#007AFF",
		fontSize: 16,
	},
});
