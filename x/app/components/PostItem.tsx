import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/colors";

interface PostItemProps {
	id: string;
	title: string;
	description: string;
	location: string;
	date: string;
	image: string;
	type: string; // 'lost' (tìm đồ) hoặc 'found' (tìm chủ)
	onPress: (id: string) => void;
}

export default function PostItem({
	id,
	title,
	description,
	location,
	date,
	image,
	type,
	onPress,
}: PostItemProps) {
	return (
		<TouchableOpacity style={styles.card} onPress={() => onPress(id)}>
			<Image source={{ uri: image }} style={styles.image} />
			<View style={styles.content}>
				<Text style={styles.title}>{title}</Text>
				<Text style={styles.description} numberOfLines={2}>
					{description}
				</Text>
				<View style={styles.infoRow}>
					<Ionicons name='location-outline' size={14} color='#666' />
					<Text style={styles.location}>{location}</Text>
					<Text style={styles.date}> • {date}</Text>
				</View>
				<View
					style={[
						styles.typeBadge,
						type === "lost" ? styles.lostBadge : styles.foundBadge,
					]}
				>
					<Text style={styles.typeText}>
						{type === "lost" ? "Tìm đồ" : "Tìm chủ"}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	card: {
		backgroundColor: "#FFFFFF",
		borderRadius: 10,
		marginVertical: 8,
		marginHorizontal: 16,
		flexDirection: "row",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		overflow: "hidden",
	},
	image: {
		width: 100,
		height: 100,
		borderRadius: 10,
		margin: 10,
	},
	content: {
		flex: 1,
		padding: 10,
		justifyContent: "center",
	},
	title: {
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 4,
		color: "#333",
	},
	description: {
		fontSize: 13,
		color: "#666",
		marginBottom: 8,
	},
	infoRow: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 4,
	},
	location: {
		fontSize: 12,
		color: "#666",
		marginLeft: 4,
	},
	date: {
		fontSize: 12,
		color: "#666",
	},
	typeBadge: {
		position: "absolute",
		top: 10,
		right: 10,
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 5,
	},
	lostBadge: {
		backgroundColor: Colors.lost, // Màu đỏ cam
	},
	foundBadge: {
		backgroundColor: Colors.found, // Màu xanh lá
	},
	typeText: {
		color: "#FFFFFF",
		fontSize: 10,
		fontWeight: "bold",
	},
});
