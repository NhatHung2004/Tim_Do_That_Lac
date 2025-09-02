import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MyDispatchContext } from '../config/MyContext';
import Api, { endpoints } from '../config/Api';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState(''); // 👈 thêm state để hiển thị lỗi đăng nhập

  const navigate = useNavigate();
  const dispatch = useContext(MyDispatchContext);

  const validate = () => {
    const e = {};
    if (!username) e.username = 'Vui lòng nhập username';
    if (!password) e.password = 'Vui lòng nhập mật khẩu';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      setLoginError(''); // reset lỗi cũ
      const res = await Api.post(endpoints.login, {
        username: username,
        password: password,
      });
      localStorage.setItem('token', res.data.access);
      dispatch({ type: 'login', payload: res.data.user });
      navigate('/');
    } catch (error) {
      console.error(error);
      setLoading(false);
      if (error.response && error.response.status === 401) {
        setLoginError('Sai tài khoản hoặc mật khẩu');
      } else {
        setLoginError('Có lỗi xảy ra, vui lòng thử lại sau');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-0 rounded-2xl shadow-xl overflow-hidden bg-white">
        {/* Left / brand panel */}{' '}
        <div className="hidden lg:flex flex-col justify-between bg-green-600 text-white p-10">
          {' '}
          <div>
            {' '}
            <div className="flex items-center gap-3">
              {' '}
              <div className="h-10 w-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center font-bold">
                {' '}
                🌿{' '}
              </div>{' '}
              <h1 className="text-2xl font-semibold">Lost&Found</h1>{' '}
            </div>{' '}
            <p className="mt-6 text-green-50/90 leading-relaxed">Chào mừng quay lại !</p>{' '}
          </div>{' '}
          <div className="space-y-3">
            {' '}
            <div className="h-2 w-20 bg-white/30 rounded" />{' '}
            <div className="h-2 w-32 bg-white/30 rounded" />{' '}
            <div className="h-2 w-16 bg-white/30 rounded" />{' '}
          </div>{' '}
        </div>
        {/* Right panel */}
        <div className="p-8 sm:p-12">
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-green-700">Admin</h2>
            <p className="text-sm text-gray-500 mt-2">Tiếp tục bằng tài khoản của bạn</p>
          </div>

          <div className="space-y-5">
            {loginError && (
              <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm">{loginError}</div>
            )}

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
              <input
                type="text"
                className={`mt-1 w-full rounded-xl border px-4 py-3 outline-none focus:ring-2 focus:ring-green-500/60 focus:border-green-500 ${
                  errors.username ? 'border-red-400' : 'border-gray-300'
                }`}
                placeholder="Tên đăng nhập..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {errors.username && <p className="mt-1 text-sm text-red-600">{errors.username}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
              <div
                className={`mt-1 flex items-center rounded-xl border ${
                  errors.password ? 'border-red-400' : 'border-gray-300'
                }`}
              >
                <input
                  type={showPw ? 'text' : 'password'}
                  className="w-full px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-green-500/60"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="px-3 py-2 text-gray-500 hover:text-green-600"
                >
                  {showPw ? '👁️‍🗨️' : '🙈'}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              onClick={handleLogin}
              className="w-full rounded-xl bg-green-600 hover:bg-green-700 text-white font-medium py-3 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
