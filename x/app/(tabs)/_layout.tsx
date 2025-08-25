// app/(tabs)/_layout.tsx
import React from "react";
import { Tabs } from "expo-router";
import { View, StyleSheet, Platform, Text, Alert } from "react-native";
import { MaterialCommunityIcons, Ionicons, Feather } from "@expo/vector-icons";

import CustomHeader from "../components/CustomHeader";
import Colors from "../constants/colors";

export default function TabLayout() {
	// Các hàm xử lý sự kiện cho header
	const handleSearch = (text: string) => {
		Alert.alert("Tìm kiếm", `Bạn đã tìm kiếm: ${text}`);
		// Thực hiện logic tìm kiếm tại đây
	};

	const handleNotificationsPress = () => {
		Alert.alert("Thông báo", "Nút thông báo được nhấn!");
		// Điều hướng đến màn hình thông báo
	};

	const handleMessagesPress = () => {
		Alert.alert("Tin nhắn", "Nút tin nhắn được nhấn!");
		// Điều hướng đến màn hình tin nhắn
	};

	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors.primary, // Màu cam chủ đạo cho active tab
				tabBarInactiveTintColor: Colors.inactive, // Màu xám cho inactive tab
				tabBarShowLabel: true,
				headerShown: false, // Ẩn header mặc định
				tabBarStyle: {
					backgroundColor: "#FFFFFF", // Nền trắng
					borderTopWidth: 1,
					borderTopColor: "#f0f0f0",
					height: Platform.OS === "ios" ? 85 : 60,
					paddingBottom: Platform.OS === "ios" ? 20 : 0,
					elevation: 8, // Đổ bóng cho Android
					shadowColor: "#000", // Đổ bóng cho iOS
					shadowOffset: { width: 0, height: -2 },
					shadowOpacity: 0.1,
					shadowRadius: 5,
					marginBottom: Platform.OS === "ios" ? 20 : 10, // Đẩy tab lên trên
				},
				tabBarLabelStyle: {
					fontSize: 12,
					fontWeight: "500",
					marginTop: Platform.OS === "ios" ? 0 : 2, // Điều chỉnh vị trí label
					marginBottom: Platform.OS === "ios" ? 0 : 2, // Điều chỉnh vị trí label
				},
			}}
		>
			{/* Tab Trang chủ */}
			<Tabs.Screen
				name='home'
				options={{
					title: "Trang chủ",
					headerShown: true,
					header: () => (
						<CustomHeader
							onSearch={handleSearch}
							onNotificationsPress={handleNotificationsPress}
							onMessagesPress={handleMessagesPress}
						/>
					),
					tabBarIcon: ({ color, size }) => (
						// Dùng MaterialCommunityIcons cho icon nhà
						<MaterialCommunityIcons name='home' size={size} color={color} />
					),
				}}
			/>

			{/* Tab Quản lý tin */}
			<Tabs.Screen
				name='manage'
				options={{
					title: "Quản lý tin",
					tabBarIcon: ({ color, size }) => (
						// Dùng Feather cho icon danh sách
						<Feather name='list' size={size} color={color} />
					),
				}}
			/>

			{/* Tab Đăng tin (nổi bật) */}
			<Tabs.Screen
				name='post'
				options={{
					title: "Đăng tin",
					tabBarIcon: ({ size }) => (
						<View style={styles.postButtonContainer}>
							<Text>
								<Feather name='edit-2' size={size + 8} color='white' />{" "}
							</Text>
						</View>
					),
					tabBarLabelStyle: {
						fontSize: 12,
						fontWeight: "500",
						marginTop: 10, // Điều chỉnh khoảng cách label do nút lớn hơn
						color: "#FF8C00", // Màu label của nút post có vẻ luôn cam
					},
				}}
			/>

			{/* Tab Dạo chợ */}
			<Tabs.Screen
				name='settings'
				options={{
					title: "Dạo chợ",
					tabBarIcon: ({ color, size }) => (
						// Dùng MaterialCommunityIcons cho icon túi mua sắm
						<MaterialCommunityIcons name='shopping' size={size} color={color} />
					),
				}}
			/>

			{/* Tab Tài khoản */}
			<Tabs.Screen
				name='profile'
				options={{
					title: "Tài khoản",
					tabBarIcon: ({ color, size }) => (
						// Dùng Ionicons cho icon người dùng
						<Ionicons name='person-outline' size={size} color={color} />
					),
				}}
			/>
		</Tabs>
	);
}

const styles = StyleSheet.create({
	postButtonContainer: {
		backgroundColor: Colors.secondary,
		width: 60, // Kích thước hình tròn
		height: 60,
		borderRadius: 30, // Tạo hình tròn
		justifyContent: "center",
		alignItems: "center",
		marginTop: -20, // Đẩy nút lên trên để tạo hiệu ứng nổi
		shadowColor: Colors.secondary, // Đổ bóng cùng màu để tăng hiệu ứng
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.6,
		shadowRadius: 8,
		elevation: 10, // Đổ bóng Android
		borderWidth: 3, // Viền trắng
		borderColor: "#FFFFFF",
	},
});
