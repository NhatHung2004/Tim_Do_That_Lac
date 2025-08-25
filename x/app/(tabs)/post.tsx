// app/(tabs)/post.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function PostScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Màn hình Đăng tin</Text>
			<Text style={styles.subtitle}>Form để tạo tin đăng mới</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#fefefe",
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
