'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Download, Search } from 'lucide-react';

interface DocumentItem {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  category: string;
  createdAt: string;
}

export default function DocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken');
    if (!token) {
      router.replace('/login');
      return;
    }

    const fetchDocuments = async () => {
      try {
        // Gọi API lấy danh sách tài liệu từ Backend của bạn
        // (Đảm bảo backend đã có route GET /api/documents)
        const res = await fetch('https://mathstudyedu-api.onrender.com/api/documents', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data) ? data : (data.data || data.documents || []);
          setDocuments(items);
        } else {
          // Fallback dữ liệu mẫu nếu API chưa sẵn sàng
          setDocuments([
            {
              id: '1',
              title: 'Tổng hợp công thức Giải tích 12 luyện thi THPT',
              description: 'Hệ thống đầy đủ công thức đạo hàm, tích phân, số phức và hình học không gian.',
              fileUrl: 'https://drive.google.com/', // Link Google Drive của bạn
              category: 'Đề thi & Tài liệu',
              createdAt: '2026-10-01',
            }
          ]);
        }
      } catch (err) {
        console.error('Lỗi khi tải tài liệu:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [router]);

  const filteredDocs = documents.filter(doc =>
    doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      <main className="mx-auto max-w-7xl">
        {/* Tiêu đề trang */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">Tài liệu & Đề thi</h1>
            <p className="mt-1 text-sm text-slate-400">Kho tàng tài liệu, slide học tập và đề thi thử từ Google Drive</p>
          </div>

          {/* Ô tìm kiếm nhanh */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu, đề thi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Nội dung danh sách */}
        {loading ? (
          <div className="flex justify-center items-center py-20 text-slate-400 gap-3">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Đang tải tài liệu...</span>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-700 p-12 text-center text-slate-400">
            Không tìm thấy tài liệu hoặc đề thi phù hợp với từ khóa của bạn.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="group flex flex-col justify-between overflow-hidden rounded-xl border border-slate-800 bg-slate-800/50 p-6 shadow-md hover:border-slate-700 transition-all hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-400 border border-blue-500/20">
                      <FileText className="h-3.5 w-3.5" />
                      {doc.category || 'Tài liệu'}
                    </span>
                    <span className="text-xs text-slate-500">
                      {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('vi-VN') : ''}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                    {doc.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-400 line-clamp-3">
                    {doc.description || 'Chưa có mô tả chi tiết.'}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Lưu trữ: Google Drive</span>
                  <a
                    href={doc.fileUrl || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Tải về</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}