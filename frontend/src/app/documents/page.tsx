'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, Download, Search } from 'lucide-react';

interface DocumentItem {
  id: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileType?: string;
  createdAt: string;
}

export default function DocumentsPage() {
  const router = useRouter();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const token = sessionStorage.getItem('token') || sessionStorage.getItem('accessToken');
    if (!token) {
      router.replace('/login');
      return;
    }

    const fetchDocuments = async () => {
      try {
        const res = await fetch('https://mathstudyedu-api.onrender.com/api/documents', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setDocuments(data);
          else if (Array.isArray(data.data)) setDocuments(data.data);
        }
      } catch (err) {
        console.error('Lỗi tải tài liệu:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [router]);

  const filteredDocs = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-8 pb-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Tài liệu & Đề thi</h1>
            <p className="text-sm text-slate-500 mt-1">
              Kho tàng tài liệu, slide học tập và đề thi từ hệ thống
            </p>
          </div>
          
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu, đề thi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-500 gap-3">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Đang tải danh sách tài liệu...</span>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-slate-300 rounded-2xl bg-white text-slate-500 shadow-sm">
            Chưa có tài liệu hoặc đề thi nào được chia sẻ.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-sm hover:shadow-md transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-100">
                      <FileText className="w-3.5 h-3.5" />
                      Tài liệu
                    </span>
                    <span className="text-xs text-slate-400">
                      {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('vi-VN') : ''}
                    </span>
                  </div>

                  <h3 className="font-semibold text-slate-900 text-base mb-1">{doc.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {doc.description || 'Không có mô tả chi tiết cho tài liệu này.'}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Hệ thống OpenEdu</span>
                  <a
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Tải về
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}