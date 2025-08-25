// app/(tabs)/browse.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function BrowseScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Màn hình Dạo chợ</Text>
			<Text style={styles.subtitle}>
				Duyệt các gian hàng hoặc tin đăng khác
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fff",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 10,
		color: "#333",
	},
	subtitle: {
		fontSize: 16,
		color: "#666",
	},
});
