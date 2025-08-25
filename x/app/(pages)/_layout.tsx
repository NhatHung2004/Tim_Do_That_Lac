import { Stack } from "expo-router";

export default function Pages() {
	return (
		<Stack>
			<Stack.Screen name='login' options={{ headerShown: false }} />
			<Stack.Screen name='register' options={{ headerShown: false }} />
		</Stack>
	);
}
