'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, CheckCircle2, Clock } from 'lucide-react';

interface MyCourseItem {
  id: string;
  status: 'PENDING' | 'ACTIVE' | 'CANCELLED';
  enrolledAt: string;
  course: {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string | null;
    price: string | number;
  };
}

export default function MyCoursesPage() {
  const router = useRouter();
  const [list, setList] = useState<MyCourseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem('token') || sessionStorage.getItem('accessToken');
    if (!token) {
      router.replace('/login');
      return;
    }

    const fetchMyCourses = async () => {
      try {
        const res = await fetch('https://mathstudyedu-api.onrender.com/api/enrollments/my', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401 || res.status === 403) {
          router.replace('/login');
          return;
        }

        const data = await res.json();
        if (res.ok) {
          if (Array.isArray(data)) setList(data);
          else if (Array.isArray(data.data)) setList(data.data);
          else setList([]);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchMyCourses();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-8 pb-24">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Khóa học của tôi</h1>
          <p className="text-sm text-slate-500 mt-1">
            Danh sách các môn học bạn đã đăng ký trên hệ thống
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-500 gap-3">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Đang tải khóa học của bạn...</span>
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-300 rounded-2xl bg-white text-slate-500 shadow-sm">
            Bạn chưa đăng ký khóa học nào. Hãy khám phá các khóa học ngay nhé!
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  {item.course?.thumbnailUrl ? (
                    <img
                      crossOrigin="anonymous"
                      src={item.course.thumbnailUrl}
                      alt=""
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-400">
                      <BookOpen className="h-10 w-10 opacity-40" />
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="line-clamp-2 text-lg font-semibold text-slate-900">
                    {item.course?.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600 flex-1">
                    {item.course?.description || 'Khóa học trang bị kiến thức nền tảng và nâng cao.'}
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Trạng thái:</span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : item.status === 'PENDING'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {item.status === 'ACTIVE' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {item.status === 'PENDING' && <Clock className="w-3.5 h-3.5" />}
                      {item.status === 'ACTIVE' ? 'Đã kích hoạt' : item.status === 'PENDING' ? 'Chờ duyệt' : 'Đã từ chối'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}