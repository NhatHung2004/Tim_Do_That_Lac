import React, { useContext, useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { Home, BarChart2, LogOut, CheckCircle, Trash2, RefreshCcw } from 'lucide-react';
import { MyDispatchContext, MyUserContext } from '../config/MyContext';
import { useNavigate } from 'react-router-dom';
import { AuthApi, endpoints } from '../config/Api';

export default function AdminDashboard() {
  const [summary, setSummary] = useState({});
  const [postsByMonth, setPostsByMonth] = useState([]);

  const fetchStatsSummary = async () => {
    try {
      const res = await AuthApi().get(endpoints.statsSummary);
      setSummary(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchStatsPostsByMonth = async () => {
    try {
      const res = await AuthApi().get(endpoints.stats_posts_by_month);
      setPostsByMonth(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const typeRatio = [
    { name: 'Mất đồ', value: 200 },
    { name: 'Nhặt được', value: 140 },
  ];

  const topCategories = [
    { key: 1, category: 'Điện thoại', count: 80 },
    { key: 2, category: 'Laptop', count: 45 },
    { key: 3, category: 'Giấy tờ', count: 60 },
    { key: 4, category: 'Thú cưng', count: 30 },
  ];

  const colors = ['#f39c12', '#3CB371'];

  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  const current_user = useContext(MyUserContext);
  const dispatch = useContext(MyDispatchContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (current_user == null) return navigate('/login');
  }, [current_user, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'logout' });
    navigate('/login');
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await AuthApi().get(endpoints['posts']);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (current_user) fetchPosts();
  }, [current_user]);

  const approvePost = (id) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'Approved' } : p)));
  };

  const deletePost = (id) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'Deleted' } : p)));
  };

  useEffect(() => {
    if (activeTab === 'stats') {
      fetchStatsSummary();
      fetchStatsPostsByMonth();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-green-600 text-white flex flex-col transition-all duration-300`}
      >
        {/* User Info */}
        <div className="flex items-center gap-3 p-4 border-b border-green-500">
          <img
            src={current_user?.avatar || '/img/user.png'}
            alt="User"
            className="w-10 h-10 rounded-full"
          />
          {sidebarOpen && (
            <div>
              <p className="font-semibold">{current_user?.username}</p>
              <p className="text-sm text-green-200">{current_user?.email}</p>
            </div>
          )}
        </div>

        {/* Toggle button */}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-3 hover:bg-green-700">
          {sidebarOpen ? '←' : '→'}
        </button>

        {/* Menu */}
        <nav className="flex-1 mt-4 space-y-2">
          <button
            onClick={() => setActiveTab('posts')}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded hover:bg-green-700 transition ${
              activeTab === 'posts' ? 'bg-green-800' : ''
            }`}
          >
            <Home size={20} />
            {sidebarOpen && <span>Quản lý bài đăng</span>}
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-3 w-full px-4 py-2 rounded hover:bg-green-700 transition ${
              activeTab === 'stats' ? 'bg-green-800' : ''
            }`}
          >
            <BarChart2 size={20} />
            {sidebarOpen && <span>Thống kê</span>}
          </button>
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t border-green-500">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-2 rounded hover:bg-green-700 transition"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>Đăng xuất</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 space-y-10">
        {activeTab === 'posts' && (
          <section>
            {/* Tiêu đề + nút Refresh */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-green-700">Danh sách bài đăng</h2>
              <button
                onClick={fetchPosts}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 rounded text-white transition ${
                  loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                <RefreshCcw size={18} className={loading ? 'animate-spin' : ''} />
                {loading ? 'Đang tải...' : 'Làm mới'}
              </button>
            </div>

            <div className="overflow-x-auto bg-white shadow rounded-lg">
              {loading ? (
                <div className="flex justify-center items-center p-10">
                  <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <table className="min-w-full text-sm">
                  <thead className="bg-green-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">ID</th>
                      <th className="px-4 py-3 text-left">Tiêu đề</th>
                      <th className="px-4 py-3 text-left">Trạng thái</th>
                      <th className="px-4 py-3 text-left">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map((post) => (
                      <tr
                        key={post.id}
                        className="border-b last:border-0 hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigate(`/posts/${post.id}`)}
                      >
                        <td className="px-4 py-2">{post.id}</td>
                        <td className="px-4 py-2">{post.title}</td>
                        <td className="px-4 py-2">
                          <span
                            className={`px-2 py-1 rounded text-xs font-medium ${
                              post.status === 'Pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : post.status === 'Approved'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                            }`}
                          >
                            {post.status}
                          </span>
                        </td>
                        <td
                          className="px-4 py-2 space-x-2 flex"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {post.status === 'Pending' && (
                            <CheckCircle
                              size={20}
                              className="text-green-600 cursor-pointer hover:text-green-800"
                              onClick={() => approvePost(post.id)}
                            />
                          )}
                          {post.status !== 'Deleted' && (
                            <Trash2
                              size={20}
                              className="text-red-600 cursor-pointer hover:text-red-800"
                              onClick={() => deletePost(post.id)}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

        {activeTab === 'stats' && (
          <div className="p-6 bg-gray-100 min-h-screen">
            {/* Cards tổng quan */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow">
                <h3 className="text-gray-500 text-sm">Người dùng</h3>
                <p className="text-2xl font-bold">{summary.users}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow">
                <h3 className="text-gray-500 text-sm">Tin đăng</h3>
                <p className="text-2xl font-bold">{summary.posts}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow">
                <h3 className="text-gray-500 text-sm">Đã giải quyết</h3>
                <p className="text-2xl font-bold">{summary.resolved}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow">
                <h3 className="text-gray-500 text-sm">Tỷ lệ thành công</h3>
                <p className="text-2xl font-bold">{summary.successRate}%</p>
              </div>
            </div>

            {/* Biểu đồ */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div className="bg-white p-6 rounded-2xl shadow">
                <h3 className="font-semibold mb-4">Tin đăng theo tháng</h3>
                <BarChart width={400} height={300} data={postsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="lost" fill="#EF4444" name="Mất đồ" />
                  <Bar dataKey="found" fill="#10B981" name="Nhặt được" />
                </BarChart>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow">
                <h3 className="font-semibold mb-4">Tỷ lệ Mất / Nhặt</h3>
                <PieChart width={400} height={300}>
                  <Pie data={typeRatio} cx="50%" cy="50%" outerRadius={100} dataKey="value" label>
                    {typeRatio.map((entry, index) => (
                      <Cell key={index} fill={colors[index % colors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>
            </div>

            {/* Top danh mục */}
            <div className="bg-white p-6 rounded-2xl shadow mt-6">
              <h3 className="font-semibold mb-4">Top danh mục mất đồ nhiều nhất</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-2">Danh mục</th>
                    <th className="p-2">Số lượng</th>
                  </tr>
                </thead>
                <tbody>
                  {topCategories.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="p-2">{item.category}</td>
                      <td className="p-2">{item.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
