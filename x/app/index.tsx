import { Redirect } from "expo-router";
// import { useAuth } from '../hooks/useAuth'; // Giả sử bạn có hook quản lý trạng thái đăng nhập

export default function StartPage() {
	const isAuthenticated = true; // Thay bằng logic kiểm tra trạng thái đăng nhập thực tế

	// if (isLoading) {
	//     // Tùy chọn: Hiển thị màn hình loading trong khi kiểm tra trạng thái đăng nhập
	//     return null; // Hoặc một component <LoadingScreen />
	// }

	if (isAuthenticated) {
		// Nếu đã đăng nhập, chuyển hướng đến trang chính (ví dụ: (tabs)/index.tsx)
		return <Redirect href='/home' />; // Hoặc href="/home" nếu tab đầu tiên của bạn là "home"
	} else {
		// Nếu chưa đăng nhập, chuyển hướng đến trang login
		return <Redirect href='/login' />;
	}
}
