import { Slot, Stack, useRouter } from "expo-router";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootLayout() {
	return (
		<Stack>
			<Stack.Screen
				name='(pages)'
				options={{
					headerShown: false, // Ẩn header cho trang chủ
					animation: "fade", // Tùy chọn: thêm hiệu ứng chuyển cảnh
				}}
			/>
			<Stack.Screen name='(tabs)' options={{ headerShown: false }} />
		</Stack>
	);
}
