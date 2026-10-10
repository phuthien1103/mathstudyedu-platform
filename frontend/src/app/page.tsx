'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, CheckCircle2, Clock, Sparkles, ArrowRight, ShieldCheck, PlayCircle, Award } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('Học viên');

  useEffect(() => {
    const token = sessionStorage.getItem('token') || sessionStorage.getItem('accessToken');
    if (!token) {
      router.replace('/login');
      return;
    }

    try {
      const userStr = sessionStorage.getItem('user');
      if (userStr) {
        const userObj = JSON.parse(userStr);
        setUserName(userObj.fullName || userObj.name || 'Học viên');
      }
    } catch (e) {
      console.error(e);
    }

    const fetchData = async () => {
      try {
        const [resCourses, resEnroll] = await Promise.all([
          fetch('https://mathstudyedu-api.onrender.com/api/courses', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('https://mathstudyedu-api.onrender.com/api/enrollments/my', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (resCourses.ok) {
          const resData = await resCourses.json();
          if (Array.isArray(resData)) setCourses(resData);
          else if (Array.isArray(resData.data)) setCourses(resData.data);
        }

        if (resEnroll.ok) {
          const enrollData = await resEnroll.json();
          const items = Array.isArray(enrollData) ? enrollData : (enrollData.data || []);
          setEnrollments(items);
        }
      } catch (err) {
        console.error('Lỗi tải dữ liệu trang chủ:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-24">
      {/* Hero Banner Section */}
      <div className="bg-white border-b border-slate-200 py-12 px-4 sm:px-8 mb-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex-1 space-y-4 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold border border-blue-100">
              <Sparkles className="w-3.5 h-3.5" />
              Nền tảng học tập trực tuyến hàng đầu
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Chào mừng <span className="text-blue-600">{userName}</span> trở lại OpenEdu!
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
              Khám phá các lộ trình ôn tập kiến thức trọng tâm, rèn luyện tư duy và chinh phục mọi cột mốc học tập với chất lượng tốt nhất.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <Link
                href="/courses"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors shadow-sm inline-flex items-center gap-2 text-sm"
              >
                Khám phá khóa học ngay
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Banner Illustration Card */}
          <div className="w-full lg:w-auto">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 sm:p-8 rounded-2xl text-white shadow-xl max-w-md w-full relative overflow-hidden">
              <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-300" />
                Lộ trình chuẩn hóa
              </h3>
              <p className="text-xs text-blue-100 mb-6 leading-relaxed">
                Tích hợp video bài giảng, tài liệu ôn thi chi tiết và hệ thống xét duyệt ghi danh nhanh chóng.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/15 text-xs">
                <div className="flex items-center gap-2">
                  <PlayCircle className="w-4 h-4 text-emerald-300" />
                  <span>Video sắc nét</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>Học mọi lúc</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Courses Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Khóa học của bạn</h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Chọn khóa học để bắt đầu lộ trình học tập và làm bài trắc nghiệm</p>
          </div>
          <Link href="/courses" className="text-xs sm:text-sm font-semibold text-blue-600 hover:underline">
            Xem tất cả →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 text-slate-500 gap-3">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Đang tải khóa học...</span>
          </div>
        ) : courses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-500 bg-white shadow-sm">
            Chưa có khóa học nào trên hệ thống.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              const currentEnrollment = enrollments.find(
                (e: any) => e.courseId === course.id || e.course?.id === course.id
              );

              return (
                <div
                  key={course.id}
                  className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                    {course.thumbnailUrl ? (
                      <img
                        crossOrigin="anonymous"
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
                        <BookOpen className="h-10 w-10 opacity-40" />
                      </div>
                    )}
                    {course.category && (
                      <span className="absolute top-3 left-3 rounded-md bg-white/90 px-2.5 py-1 text-xs font-semibold text-blue-600 backdrop-blur-sm shadow-sm">
                        {course.category.name}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="line-clamp-2 text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-600 flex-1">
                      {course.description || 'Chưa có mô tả chi tiết cho khóa học này.'}
                    </p>

                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Giảng viên: <strong className="text-slate-800">{course.instructor?.fullName || course.instructor?.name || 'Giảng viên'}</strong></span>
                      <span className="font-semibold text-emerald-600">
                        {course.price === 0 ? 'Miễn phí' : `${course.price.toLocaleString('vi-VN')} đ`}
                      </span>
                    </div>

                    {currentEnrollment?.status === 'ACTIVE' ? (
                      <div className="mt-4 py-2.5 px-4 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium flex items-center justify-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span>Bạn đã đăng ký thành công môn học</span>
                      </div>
                    ) : currentEnrollment?.status === 'PENDING' ? (
                      <div className="mt-4 py-2.5 px-4 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 font-medium flex items-center justify-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-amber-600" />
                        <span>Đang chờ Admin xét duyệt</span>
                      </div>
                    ) : (
                      <Link
                        href="/courses"
                        className="w-full mt-4 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 font-medium text-white transition-colors text-center text-sm shadow-sm block"
                      >
                        Xem chi tiết & Đăng ký
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}