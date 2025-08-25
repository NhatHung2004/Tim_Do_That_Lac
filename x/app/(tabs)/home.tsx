import React, { useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	FlatList,
	TouchableOpacity,
	Alert,
} from "react-native";

import Colors from "../constants/colors";
import PostItem from "../components/PostItem";

export default function HomeScreen() {
	const [activeTab, setActiveTab] = useState<"find_owner" | "find_item">(
		"find_owner"
	); // Mặc định là 'Tìm chủ'

	// Dữ liệu mẫu cho các bài đăng "Tìm chủ" (found items)
	const foundItems = [
		{
			id: "1",
			title: "Ví da màu nâu",
			description:
				"Tìm thấy ví da màu nâu tại công viên. Bên trong có CCCD tên Nguyễn Văn A.",
			location: "Công viên Thống Nhất",
			date: "01/07/2025",
			image: "https://placehold.co/150x150/FF6347/FFFFFF?text=Found+Wallet",
			type: "found",
		},
		{
			id: "2",
			title: "Điện thoại iPhone 13",
			description:
				"Tìm thấy điện thoại iPhone 13 màu xanh ở khu vực cổng trường ĐH Bách Khoa.",
			location: "ĐH Bách Khoa",
			date: "30/06/2025",
			image: "https://placehold.co/150x150/6A5ACD/FFFFFF?text=Found+Phone",
			type: "found",
		},
		{
			id: "3",
			title: "Thẻ sinh viên",
			description:
				"Tìm thấy thẻ sinh viên của bạn Trần Thị B tại thư viện ĐHQG.",
			location: "Thư viện ĐHQG",
			date: "28/06/2025",
			image: "https://placehold.co/150x150/3CB371/FFFFFF?text=Found+Card",
			type: "found",
		},
		{
			id: "4",
			title: "Chó Poodle lạc",
			description:
				"Tìm thấy một bé chó Poodle màu trắng, có vòng cổ xanh, bị lạc ở khu dân cư.",
			location: "Khu dân cư ABC",
			date: "27/06/2025",
			image: "https://placehold.co/150x150/FFD700/FFFFFF?text=Found+Dog",
			type: "found",
		},
		{
			id: "24",
			title: "Chó Poodle lạc",
			description:
				"Tìm thấy một bé chó Poodle màu trắng, có vòng cổ xanh, bị lạc ở khu dân cư.",
			location: "Khu dân cư ABC",
			date: "27/06/2025",
			image: "https://placehold.co/150x150/FFD700/FFFFFF?text=Found+Dog",
			type: "found",
		},
		{
			id: "14",
			title: "Chó Poodle lạc",
			description:
				"Tìm thấy một bé chó Poodle màu trắng, có vòng cổ xanh, bị lạc ở khu dân cư.",
			location: "Khu dân cư ABC",
			date: "27/06/2025",
			image: "https://placehold.co/150x150/FFD700/FFFFFF?text=Found+Dog",
			type: "found",
		},
	];

	// Dữ liệu mẫu cho các bài đăng "Tìm đồ" (lost items)
	const lostItems = [
		{
			id: "5",
			title: "Mất chìa khóa xe máy",
			description:
				"Đánh rơi chùm chìa khóa xe máy Honda màu đen tại khu vực bãi xe siêu thị.",
			location: "Siêu thị Coopmart",
			date: "01/07/2025",
			image: "https://placehold.co/150x150/FF0000/FFFFFF?text=Lost+Keys",
			type: "lost",
		},
		{
			id: "6",
			title: "Mất balo laptop",
			description:
				"Bị mất balo màu xám hiệu XYZ, bên trong có laptop và một số tài liệu quan trọng.",
			location: "Quán cà phê X",
			date: "29/06/2025",
			image: "https://placehold.co/150x150/800080/FFFFFF?text=Lost+Bag",
			type: "lost",
		},
		{
			id: "7",
			title: "Mất đồng hồ thông minh",
			description:
				"Đánh rơi đồng hồ thông minh Apple Watch Series 7 màu đen khi đang tập thể dục.",
			location: "Phòng gym ABC",
			date: "26/06/2025",
			image: "https://placehold.co/150x150/0000FF/FFFFFF?text=Lost+Watch",
			type: "lost",
		},
	];

	const currentPosts = activeTab === "find_owner" ? foundItems : lostItems;

	const handlePostPress = (id: string) => {
		Alert.alert("Chi tiết bài đăng", `Bạn đã nhấn vào bài đăng ID: ${id}`);
		// Trong thực tế, bạn sẽ điều hướng đến màn hình chi tiết bài đăng
		// Ví dụ: router.push(`/post-detail/${id}`);
	};

	return (
		<View style={styles.container}>
			{/* Header với 2 tab */}
			<View style={styles.headerTabContainer}>
				<TouchableOpacity
					style={[
						styles.tabButton,
						activeTab === "find_owner" && styles.activeTabButton,
					]}
					onPress={() => setActiveTab("find_owner")}
				>
					<Text
						style={[
							styles.tabButtonText,
							activeTab === "find_owner" && styles.activeTabButtonText,
						]}
					>
						Tìm chủ
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						styles.tabButton,
						activeTab === "find_item" && styles.activeTabButton,
					]}
					onPress={() => setActiveTab("find_item")}
				>
					<Text
						style={[
							styles.tabButtonText,
							activeTab === "find_item" && styles.activeTabButtonText,
						]}
					>
						Tìm đồ
					</Text>
				</TouchableOpacity>
			</View>

			{/* Danh sách bài đăng */}
			<FlatList
				data={currentPosts}
				renderItem={({ item }) => (
					<PostItem {...item} onPress={handlePostPress} />
				)}
				keyExtractor={(item) => item.id}
				contentContainerStyle={styles.postList}
				showsVerticalScrollIndicator={false}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f0f2f5", // Nền tổng thể
	},
	headerTabContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		alignItems: "center",
		backgroundColor: "#FFFFFF",
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: "#e0e0e0",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 3,
	},
	tabButton: {
		paddingVertical: 8,
		paddingHorizontal: 20,
		borderRadius: 20,
	},
	activeTabButton: {
		backgroundColor: Colors.secondary,
	},
	tabButtonText: {
		fontSize: 16,
		fontWeight: "500",
		color: "#666",
	},
	activeTabButtonText: {
		color: "#FFFFFF", // Chữ trắng khi active
		fontWeight: "bold",
	},
	postList: {
		paddingVertical: 10,
	},
});
