'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, LogOut, User, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  price: number;
  category?: { name: string };
  instructor?: { name: string; fullName?: string };
}

export default function HomePage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [user, setUser] = useState<{ name?: string; fullName?: string; email: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  // 1. Kiểm tra xác thực và tải dữ liệu môn học + đăng ký của học viên
  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    const savedUserStr = localStorage.getItem('user');

    if (!token || !savedUserStr) {
      router.replace('/login');
      return;
    }

    try {
      setUser(JSON.parse(savedUserStr));
    } catch (e) {
      console.error('Lỗi đọc user:', e);
    }

    setIsAuthorized(true);

    const fetchData = async () => {
      try {
        // Tải danh sách tất cả các khóa học
        const resCourses = await fetch('http://localhost:5000/api/courses', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (resCourses.ok) {
          const resData = await resCourses.json();
          if (Array.isArray(resData)) setCourses(resData);
          else if (Array.isArray(resData.data)) setCourses(resData.data);
          else if (Array.isArray(resData.courses)) setCourses(resData.courses);
        }

        // Tải danh sách ghi danh của người dùng hiện tại
        const resEnroll = await fetch('http://localhost:5000/api/enrollments/my', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (resEnroll.ok) {
          const enrollData = await resEnroll.json();
          console.log('Dữ liệu ghi danh của tôi:', enrollData);
          const items = Array.isArray(enrollData) ? enrollData : (enrollData.data || []);
          setEnrollments(items);
        }
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // 2. Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    router.replace('/login');
  };

  // 3. Đăng ký môn học
  const handleEnroll = async (courseId: string) => {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');

    if (!token) {
      alert('Vui lòng đăng nhập để đăng ký môn học!');
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Đăng ký thất bại');
        return;
      }

      alert('Đăng ký môn học thành công! Đang chờ Admin xét duyệt.');
      // Thêm ngay vào state để cập nhật giao diện
      setEnrollments((prev) => [...prev, { courseId, status: 'PENDING' }]);
    } catch (err) {
      console.error(err);
      alert('Không thể kết nối đến máy chủ backend');
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm">Đang xác thực quyền truy cập...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-blue-500" />
            <span className="text-xl font-bold tracking-tight text-white">OpenEdu</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-300">
              <User className="h-4 w-4 text-blue-400" />
              <span>{user?.fullName || user?.name || user?.email}</span>
              {user?.role && (
                <span className="rounded bg-blue-500/10 px-2 py-0.5 text-xs text-blue-400 border border-blue-500/20 font-mono">
                  {user.role}
                </span>
              )}
            </div>

            {user?.role === 'ADMIN' && (
              <button
                onClick={() => router.push('/admin/enrollments')}
                className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-600/20 px-3.5 py-1.5 text-sm font-semibold text-emerald-400 hover:bg-emerald-600/30 transition-colors"
              >
                <ShieldCheck className="h-4 w-4" />
                <span>Duyệt ghi danh</span>
              </button>
            )}

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-1.5 text-sm font-medium hover:bg-slate-700 hover:text-white transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </header>

      {/* Danh sách khóa học */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white sm:text-3xl">Khóa học của bạn</h1>
          <p className="mt-1 text-sm text-slate-400">Chọn khóa học để bắt đầu lộ trình học tập và làm bài trắc nghiệm</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 text-slate-400 gap-3">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Đang tải khóa học...</span>
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 p-12 text-center text-slate-400">
            Chưa có khóa học nào được xuất bản trên hệ thống.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              // So khớp cả courseId trực tiếp hoặc course.id lồng nhau
              const currentEnrollment = enrollments.find(
                (e: any) => e.courseId === course.id || e.course?.id === course.id
              );

              return (
                <div
                  key={course.id}
                  className="group flex flex-col overflow-hidden rounded-xl border border-slate-800 bg-slate-800/50 shadow-md hover:border-slate-700 transition-all hover:-translate-y-1"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                    {course.thumbnailUrl ? (
                      <img
                        crossOrigin="anonymous"
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-800 text-slate-500">
                        <BookOpen className="h-10 w-10 opacity-40" />
                      </div>
                    )}
                    {course.category && (
                      <span className="absolute top-3 left-3 rounded-md bg-slate-900/80 px-2.5 py-1 text-xs font-medium text-blue-400 backdrop-blur-sm">
                        {course.category.name}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="line-clamp-2 text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-400 flex-1">
                      {course.description || 'Chưa có mô tả chi tiết cho khóa học này.'}
                    </p>

                    <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <span>Giảng viên: <strong className="text-slate-300">{course.instructor?.fullName || course.instructor?.name || 'Giảng viên'}</strong></span>
                      <span className="font-semibold text-emerald-400">
                        {course.price === 0 ? 'Miễn phí' : `${course.price.toLocaleString('vi-VN')} đ`}
                      </span>
                    </div>

                    {/* Kiểm tra và hiển thị nút theo trạng thái duyệt */}
                    {currentEnrollment?.status === 'ACTIVE' ? (
                      <button
                        disabled
                        className="w-full mt-4 py-2.5 px-4 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 font-medium flex items-center justify-center gap-2 cursor-default"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        <span>Bạn đã đăng ký thành công môn học</span>
                      </button>
                    ) : currentEnrollment?.status === 'PENDING' ? (
                      <button
                        disabled
                        className="w-full mt-4 py-2.5 px-4 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 font-medium flex items-center justify-center gap-2 cursor-default"
                      >
                        <Clock className="h-4 w-4" />
                        <span>Đang chờ Admin xét duyệt</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEnroll(course.id)}
                        className="w-full mt-4 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 font-medium text-white transition-colors"
                      >
                        Đăng ký môn học
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}