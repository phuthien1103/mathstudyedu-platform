'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, CheckCircle2, Clock } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  price: number;
  category?: { name: string };
  instructor?: { name: string; fullName?: string };
}

export default function MyCoursesPage() {
  const router = useRouter();
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    if (!token) {
      router.replace('/login');
      return;
    }

    const fetchMyCourses = async () => {
      try {
        const [resCourses, resEnroll] = await Promise.all([
          fetch('https://mathstudyedu-api.onrender.com/api/courses', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('https://mathstudyedu-api.onrender.com/api/enrollments/my', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        let coursesList: Course[] = [];
        let enrollmentsList: any[] = [];

        if (resCourses.ok) {
          const data = await resCourses.json();
          coursesList = Array.isArray(data) ? data : (data.data || data.courses || []);
        }

        if (resEnroll.ok) {
          const data = await resEnroll.json();
          enrollmentsList = Array.isArray(data) ? data : (data.data || []);
        }

        const myRegistered = enrollmentsList.map((enroll: any) => {
          const courseId = enroll.courseId || enroll.course?.id;
          const matchedCourse = coursesList.find((c) => c.id === courseId) || enroll.course;
          return {
            ...matchedCourse,
            status: enroll.status,
          };
        }).filter((item: any) => item && item.title);

        setEnrolledCourses(myRegistered);
      } catch (err) {
        console.error('Lỗi khi tải khóa học của tôi:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-8 pb-24">
      <main className="mx-auto max-w-7xl">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-3xl font-bold text-white">Khóa học của tôi</h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-400">Danh sách các khóa học bạn đã đăng ký trên hệ thống</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 text-slate-400 gap-3">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Đang tải khóa học của bạn...</span>
          </div>
        ) : enrolledCourses.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 p-12 text-center text-slate-400 text-sm">
            Bạn chưa đăng ký khóa học nào. Hãy quay lại trang chủ để khám phá và đăng ký nhé!
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((course, index) => (
              <div
                key={course.id || index}
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
                </div>

                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <h3 className="line-clamp-2 text-base sm:text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {course.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-xs sm:text-sm text-slate-400 flex-1">
                    {course.description || 'Chưa có mô tả chi tiết cho khóa học này.'}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs sm:text-sm">
                    <span className="text-slate-400 font-medium">Trạng thái:</span>
                    {course.status === 'ACTIVE' ? (
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Đã kích hoạt
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-amber-300 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                        <Clock className="h-3.5 w-3.5" /> Chờ duyệt
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}