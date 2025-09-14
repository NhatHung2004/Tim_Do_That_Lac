import React, { useContext, useEffect, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Clock,
  PackageSearch,
  User,
  Phone,
  MapPin,
  Calendar,
  Tag,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthApi, endpoints } from '../config/Api';
import FormatDate from '../utils/FormatDate';
import { MyUserContext } from '../config/MyContext';

export default function PostDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const navigate = useNavigate();
  const { post_id } = useParams();
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(false);
  const current_user = useContext(MyUserContext);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const fetchPostData = async () => {
    try {
      setLoading(true);
      const res = await AuthApi().get(endpoints.postDetail(post_id));
      setPost(res.data);
    } catch (error) {
      console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptedPost = async () => {
    try {
      setLoading(true);
      await AuthApi().patch(endpoints.approve(post_id));
      fetchPostData();
    } catch (error) {
      console.log(error.response.data);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectPost = async () => {
    if (!rejectReason.trim()) return alert('Vui lòng nhập lý do từ chối!');
    try {
      setLoading(true);
      await AuthApi().patch(endpoints.reject(post_id), {
        reason: rejectReason,
      });
      setShowRejectModal(false);
      setRejectReason('');
      fetchPostData();
    } catch (error) {
      console.log(error.response?.data || error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (current_user == null) return navigate('/login');
  }, [current_user, navigate]);

  useEffect(() => {
    fetchPostData();
  }, []);

  // Badge helper
  const StatusBadge = ({ status }) => {
    const map = {
      processing: {
        color: 'bg-yellow-100 text-yellow-700',
        icon: <Clock size={16} />,
        label: 'Đang xử lý',
      },
      approved: {
        color: 'bg-green-100 text-green-700',
        icon: <CheckCircle size={16} />,
        label: 'Đã duyệt',
      },
      rejected: {
        color: 'bg-red-100 text-red-700',
        icon: <XCircle size={16} />,
        label: 'Từ chối',
      },
      found: {
        color: 'bg-blue-100 text-blue-700',
        icon: <PackageSearch size={16} />,
        label: 'Tìm thấy',
      },
    };
    const cfg = map[status] || map.processing;
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${cfg.color}`}
      >
        {cfg.icon} {cfg.label}
      </span>
    );
  };

  const TypeBadge = ({ type }) => {
    const map = {
      lost: {
        color: 'bg-red-100 text-red-700',
        icon: <PackageSearch size={16} />,
        label: 'Mất đồ',
      },
      found: {
        color: 'bg-blue-100 text-blue-700',
        icon: <PackageSearch size={16} />,
        label: 'Tìm thấy',
      },
    };
    const cfg = map[type] || map.lost;
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${cfg.color}`}
      >
        {cfg.icon} {cfg.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4">
      {loading ? (
        // Loading UI
        <div className="flex items-center justify-center w-full h-96">
          <p className="text-green-600 text-lg font-medium animate-pulse">
            ⏳ Đang tải bài đăng...
          </p>
        </div>
      ) : (
        <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <button
              className="flex items-center gap-2 text-green-700 hover:underline"
              onClick={() => navigate('/')}
            >
              <ArrowLeft size={20} /> Quay lại
            </button>

            <div className="flex gap-2">
              <StatusBadge status={post.status} />
              <TypeBadge type={post.type} />
            </div>
          </div>

          {/* Body chia 2 cột */}
          <div className="grid md:grid-cols-2">
            {/* Left - Image gallery */}
            <div className="relative border-r">
              {post.images && post.images.length > 0 ? (
                <>
                  <img
                    src={post.images[selectedImage].image}
                    alt="post"
                    className="w-full h-96 object-cover"
                  />
                  <div className="flex gap-2 p-3 overflow-x-auto bg-gray-100">
                    {post.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img.image}
                        alt="thumb"
                        onClick={() => setSelectedImage(idx)}
                        className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                          selectedImage === idx ? 'border-green-600' : 'border-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-96 bg-gray-100 text-gray-500">
                  Không có hình ảnh
                </div>
              )}
            </div>

            {/* Right - Thông tin */}
            <div className="p-6 space-y-5">
              <h1 className="text-2xl font-bold text-green-700 flex items-center gap-2">
                <Tag size={20} /> {post.title}
              </h1>
              <p className="text-gray-700 whitespace-pre-line">{post.description}</p>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <Tag size={16} className="text-green-600" />
                  <span className="text-gray-500">Danh mục:</span>
                  <span className="font-medium">{post.category?.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User size={16} className="text-green-600" />
                  <span className="text-gray-500">Người đăng:</span>
                  <span className="font-medium">{post.user?.full_name || post.user?.username}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-green-600" />
                  <span className="text-gray-500">SĐT:</span>
                  <span className="font-medium">{post.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-green-600" />
                  <span className="text-gray-500">Địa chỉ:</span>
                  <span className="font-medium">
                    {post.location}, {post.ward}, {post.district}, {post.province}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-green-600" />
                  <span className="text-gray-500">Ngày đăng:</span>
                  <span className="font-medium">{FormatDate(post.posted_time)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex justify-end gap-3 p-4 border-t bg-gray-50">
            {post.status === 'processing' ? (
              <>
                <button
                  className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 flex items-center gap-2"
                  onClick={handleAcceptedPost}
                >
                  <CheckCircle size={18} /> {loading ? 'Đang xử lý...' : 'Duyệt tin'}
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-2"
                  onClick={() => setShowRejectModal(true)}
                >
                  <XCircle size={18} /> Từ chối
                </button>
              </>
            ) : (
              <button className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 flex items-center gap-2">
                <XCircle size={18} /> Xoá bài
              </button>
            )}
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-bold text-gray-700">Nhập lý do từ chối</h2>
            <textarea
              className="w-full border rounded-lg p-2 focus:outline-green-600"
              rows={4}
              placeholder="Ví dụ: Nội dung không phù hợp..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400"
                onClick={() => setShowRejectModal(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                onClick={handleRejectPost}
              >
                Xác nhận từ chối
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
