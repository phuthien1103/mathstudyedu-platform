'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface EnrollmentItem {
  id: string;
  status: 'PENDING' | 'ACTIVE' | 'CANCELLED';
  enrolledAt: string;
  user: {
    id: string;
    fullName?: string;
    name?: string;
    email: string;
  };
  course: {
    id: string;
    title: string;
    price: string | number;
    thumbnailUrl: string | null;
  };
}

export default function AdminEnrollmentsPage() {
  const router = useRouter();
  const [list, setList] = useState<EnrollmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrollments = async () => {
    try {
      const token = sessionStorage.getItem('token') || sessionStorage.getItem('accessToken');

      if (!token) {
        alert('Vui lòng đăng nhập với tài khoản Quản trị viên!');
        router.replace('/login');
        return;
      }

      const res = await fetch('https://mathstudyedu-api.onrender.com/api/enrollments/admin', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 401 || res.status === 403) {
        alert('Tài khoản của bạn không có quyền truy cập hoặc phiên đăng nhập đã hết hạn. Hãy đăng nhập lại bằng tài khoản ADMIN!');
        router.replace('/login');
        return;
      }

      const data = await res.json();
      if (res.ok) {
        if (Array.isArray(data)) {
          setList(data);
        } else if (Array.isArray(data.data)) {
          setList(data.data);
        } else {
          setList([]);
        }
      } else {
        alert(data.message || 'Không thể lấy danh sách đăng ký');
      }
    } catch (e) {
      console.error(e);
      alert('Không thể kết nối đến máy chủ backend');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleUpdateStatus = async (id: string, status: 'ACTIVE' | 'CANCELLED') => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
      const res = await fetch(`https://mathstudyedu-api.onrender.com/api/enrollments/admin/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        fetchEnrollments();
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.message || 'Cập nhật thất bại');
      }
    } catch (e) {
      console.error(e);
      alert('Không thể gửi yêu cầu cập nhật');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8 pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Quản lý Đăng ký Môn học</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Xem danh sách học viên đăng ký và xét duyệt môn học
            </p>
          </div>
          <Link
            href="/"
            className="self-start sm:self-auto px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sm font-medium transition-colors border border-slate-700 hover:border-slate-600"
          >
            ← Về trang chủ
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400 gap-3">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Đang tải danh sách đăng ký...</span>
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30 text-slate-400 text-sm">
            Chưa có yêu cầu đăng ký nào đang chờ duyệt.
          </div>
        ) : (
          <>
            {/* Giao diện dạng bảng (Table) cho Máy tính (Desktop) */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 shadow-xl">
              <table className="w-full text-left border-collapse text-sm">
                <thead className="bg-slate-800/80 text-slate-300 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-4">Học viên</th>
                    <th className="p-4">Môn học đăng ký</th>
                    <th className="p-4">Học phí</th>
                    <th className="p-4">Ngày đăng ký</th>
                    <th className="p-4">Trạng thái</th>
                    <th className="p-4 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {list.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-white">{item.user?.fullName || item.user?.name || 'Học viên'}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{item.user?.email}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {item.course?.thumbnailUrl ? (
                            <img
                              crossOrigin="anonymous"
                              src={item.course.thumbnailUrl}
                              alt=""
                              className="h-10 w-16 object-cover rounded bg-slate-800"
                            />
                          ) : (
                            <div className="h-10 w-16 bg-slate-800 rounded flex items-center justify-center text-xs text-slate-500">
                              Không ảnh
                            </div>
                          )}
                          <span className="font-medium text-slate-200">{item.course?.title}</span>
                        </div>
                      </td>
                      <td className="p-4 font-medium text-amber-400">
                        {Number(item.course?.price || 0) === 0 ? 'Miễn phí' : `${Number(item.course?.price).toLocaleString('vi-VN')} đ`}
                      </td>
                      <td className="p-4 text-slate-400 text-xs">
                        {item.enrolledAt ? new Date(item.enrolledAt).toLocaleDateString('vi-VN') : '—'}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                            item.status === 'ACTIVE'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : item.status === 'PENDING'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {item.status === 'ACTIVE'
                            ? 'Đã duyệt'
                            : item.status === 'PENDING'
                            ? 'Chờ duyệt'
                            : 'Đã từ chối'}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {item.status === 'PENDING' ? (
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleUpdateStatus(item.id, 'ACTIVE')}
                              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors shadow-sm shadow-blue-600/30"
                            >
                              Duyệt
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(item.id, 'CANCELLED')}
                              className="px-3.5 py-1.5 bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 border border-rose-600/30 rounded-lg text-xs font-medium transition-colors"
                            >
                              Từ chối
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Giao diện dạng thẻ (Card list) cho Điện thoại (Mobile) */}
            <div className="block md:hidden space-y-4">
              {list.map((item) => (
                <div key={item.id} className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col gap-3 shadow-md">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="font-semibold text-white text-sm">{item.user?.fullName || item.user?.name || 'Học viên'}</h3>
                      <p className="text-xs text-slate-400">{item.user?.email}</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold whitespace-nowrap ${
                        item.status === 'ACTIVE'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : item.status === 'PENDING'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {item.status === 'ACTIVE' ? 'Đã duyệt' : item.status === 'PENDING' ? 'Chờ duyệt' : 'Từ chối'}
                    </span>
                  </div>

                  <div className="border-t border-slate-800 pt-3 flex items-center gap-3">
                    {item.course?.thumbnailUrl ? (
                      <img
                        crossOrigin="anonymous"
                        src={item.course.thumbnailUrl}
                        alt=""
                        className="h-12 w-16 object-cover rounded bg-slate-800 flex-shrink-0"
                      />
                    ) : (
                      <div className="h-12 w-16 bg-slate-800 rounded flex items-center justify-center text-[10px] text-slate-500 flex-shrink-0">
                        Không ảnh
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-xs text-slate-200 line-clamp-1">{item.course?.title}</p>
                      <p className="text-xs font-semibold text-amber-400 mt-0.5">
                        {Number(item.course?.price || 0) === 0 ? 'Miễn phí' : `${Number(item.course?.price).toLocaleString('vi-VN')} đ`}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        Đăng ký: {item.enrolledAt ? new Date(item.enrolledAt).toLocaleDateString('vi-VN') : '—'}
                      </p>
                    </div>
                  </div>

                  {item.status === 'PENDING' && (
                    <div className="flex gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => handleUpdateStatus(item.id, 'ACTIVE')}
                        className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition-colors text-center"
                      >
                        Duyệt
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(item.id, 'CANCELLED')}
                        className="flex-1 py-1.5 bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 border border-rose-600/30 rounded-lg text-xs font-medium transition-colors text-center"
                      >
                        Từ chối
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}