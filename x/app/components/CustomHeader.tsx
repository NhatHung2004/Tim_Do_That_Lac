import React, { useState } from "react";
import {
	View,
	TextInput,
	TouchableOpacity,
	StyleSheet,
	Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import Colors from "../constants/colors";

interface CustomHeaderProps {
	onSearch: (text: string) => void;
	onNotificationsPress: () => void;
	onMessagesPress: () => void;
}

export default function CustomHeader({
	onSearch,
	onNotificationsPress,
	onMessagesPress,
}: CustomHeaderProps) {
	const [searchText, setSearchText] = useState("");

	const handleSearchSubmit = () => {
		onSearch(searchText);
	};

	return (
		<SafeAreaView style={[styles.headerContainer]}>
			<View style={styles.contentWrapper}>
				{/* Ô tìm kiếm */}
				<View style={styles.searchBar}>
					<Ionicons
						name='search-outline'
						size={20}
						color='#888'
						style={styles.searchIcon}
					/>
					<TextInput
						style={styles.searchInput}
						placeholder='Tìm kiếm...'
						placeholderTextColor='#888'
						value={searchText}
						onChangeText={setSearchText}
						onSubmitEditing={handleSearchSubmit} // Xử lý khi nhấn Enter/Done
						returnKeyType='search'
					/>
				</View>

				{/* Nút thông báo */}
				<TouchableOpacity
					onPress={onNotificationsPress}
					style={styles.iconButton}
				>
					<Ionicons name='notifications-outline' size={24} color='#333' />
				</TouchableOpacity>

				{/* Nút tin nhắn */}
				<TouchableOpacity onPress={onMessagesPress} style={styles.iconButton}>
					<Ionicons name='chatbox-outline' size={24} color='#333' />
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	headerContainer: {
		backgroundColor: Colors.primary, // Nền trắng cho header
		width: "100%",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 3,
		elevation: 4, // Android shadow
		zIndex: 10, // Đảm bảo header nằm trên cùng
		paddingBottom: Platform.OS === "ios" ? 0 : 10, // Padding dưới cho nội dung
	},
	contentWrapper: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 15,
		paddingTop: Platform.OS === "android" ? 10 : 0, // Padding trên cho Android
	},
	searchBar: {
		flex: 1, // Chiếm phần lớn không gian
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: "#f0f0f0", // Nền xám nhạt cho ô tìm kiếm
		borderRadius: 25, // Bo tròn
		height: 40,
		paddingHorizontal: 10,
		marginRight: 10,
	},
	searchIcon: {
		marginRight: 8,
	},
	searchInput: {
		flex: 1,
		fontSize: 16,
		color: "#333",
	},
	iconButton: {
		padding: 8,
		marginLeft: 5,
	},
});
