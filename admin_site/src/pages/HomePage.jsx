import React, { useContext, useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Home, BarChart2, LogOut, CheckCircle, Trash2 } from 'lucide-react';
import { MyDispatchContext, MyUserContext } from '../config/MyContext';
import { useNavigate } from 'react-router-dom';
import { AuthApi, endpoints } from '../config/Api';

export default function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
      const token = localStorage.getItem('token');
      const res = await AuthApi(token).get(endpoints['posts']);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (current_user) fetchPosts();
  }, []);

  const approvePost = (id) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'Approved' } : p)));
  };

  const deletePost = (id) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, status: 'Deleted' } : p)));
  };

  // Thống kê
  const stats = [
    { name: 'Pending', value: posts.filter((p) => p.status === 'Pending').length },
    { name: 'Approved', value: posts.filter((p) => p.status === 'Approved').length },
    { name: 'Deleted', value: posts.filter((p) => p.status === 'Deleted').length },
  ];

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
            <h2 className="text-xl font-semibold text-green-700 mb-4">Danh sách bài đăng</h2>
            <div className="overflow-x-auto bg-white shadow rounded-lg">
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
                      onClick={() => navigate(`/posts/${post.id}`)} // 👉 click row sang chi tiết
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
                        onClick={(e) => e.stopPropagation()} // 👉 chặn khi click icon không bị navigate
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
            </div>
          </section>
        )}

        {activeTab === 'stats' && (
          <section>
            <h2 className="text-xl font-semibold text-green-700 mb-4">Thống kê</h2>
            <div className="bg-white shadow rounded-lg p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#16a34a" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
