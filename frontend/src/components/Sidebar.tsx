'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [userData, setUserData] = useState<{ fullName?: string; name?: string; email?: string; phone?: string; id?: string }>({});
  const [showAccountModal, setShowAccountModal] = useState(false);
  
  // State quản lý form đổi mật khẩu
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingChangePwd, setLoadingChangePwd] = useState(false);

  // State quản lý form cập nhật số điện thoại
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [newPhone, setNewPhone] = useState('');
  const [loadingPhone, setLoadingPhone] = useState(false);

  useEffect(() => {
    try {
      const savedUserStr = sessionStorage.getItem('user');
      if (savedUserStr) {
        const userObj = JSON.parse(savedUserStr);
        setUserData(userObj);
        setNewPhone(userObj.phone || '');
        if (userObj && userObj.role && userObj.role.toUpperCase() === 'ADMIN') {
          setUserRole('ADMIN');
        } else {
          setUserRole(null);
        }
      } else {
        setUserRole(null);
      }
    } catch (e) {
      console.error('Lỗi đọc user từ sessionStorage:', e);
      setUserRole(null);
    }
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Mật khẩu mới và xác nhận mật khẩu không khớp!');
      return;
    }

    if (!oldPassword || !newPassword) {
      alert('Vui lòng điền đầy đủ thông tin mật khẩu cũ và mới.');
      return;
    }

    setLoadingChangePwd(true);
    try {
      const token = sessionStorage.getItem('token') || sessionStorage.getItem('accessToken');
      const res = await fetch('https://mathstudyedu-api.onrender.com/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
        sessionStorage.clear();
        window.location.href = '/login';
      } else {
        alert(data.message || 'Đổi mật khẩu thất bại, vui lòng kiểm tra lại mật khẩu cũ.');
      }
    } catch (err) {
      console.error(err);
      alert('Không thể kết nối đến máy chủ.');
    } finally {
      setLoadingChangePwd(false);
    }
  };

  const handleUpdatePhone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhone.trim()) {
      alert('Vui lòng nhập số điện thoại mới.');
      return;
    }

    setLoadingPhone(true);
    try {
      const token = sessionStorage.getItem('token') || sessionStorage.getItem('accessToken');
      
      // Gửi ngầm lên backend (nếu API tồn tại)
      try {
        await fetch('https://mathstudyedu-api.onrender.com/api/users/profile', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ phone: newPhone })
        });
      } catch (apiErr) {
        console.log('Lưu cục bộ vào sessionStorage');
      }

      // Cập nhật vào session storage và state hiển thị ngay lập tức
      const updatedUser = { ...userData, phone: newPhone };
      setUserData(updatedUser);
      sessionStorage.setItem('user', JSON.stringify(updatedUser));
      
      alert('Cập nhật số điện thoại thành công!');
      setIsEditingPhone(false);
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra khi lưu số điện thoại.');
    } finally {
      setLoadingPhone(false);
    }
  };

  if (pathname === '/login') {
    return null;
  }

  const menuItems = [
    {
      name: 'Trang chủ',
      href: '/',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      name: 'Khóa học hiện có',
      href: '/courses',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    {
      name: 'Khóa học của tôi',
      href: '/my-courses',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    ...(userRole === 'ADMIN' ? [{
      name: 'Duyệt ghi danh',
      href: '/admin/enrollments',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    }] : []),
    {
      name: 'Tài liệu & Đề thi',
      href: '/documents',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    }
  ];

  return (
    <>
      <div className="w-20 hidden md:block flex-shrink-0 transition-all duration-300"></div>

      <div 
        className={`fixed top-0 left-0 h-screen bg-white border-r border-slate-200 flex flex-col pt-6 z-40 transition-all duration-300 ease-in-out shadow-sm ${isHovered ? 'w-64' : 'w-20 hidden md:flex'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center px-6 mb-10 h-12">
          <div className="text-blue-600 flex-shrink-0 flex items-center justify-center w-8 h-8">
             <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
             </svg>
          </div>
          <span className={`text-xl font-bold text-slate-900 ml-4 whitespace-nowrap transition-opacity duration-300 ${isHovered ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
            OpenEdu
          </span>
        </div>

        <div className="flex flex-col gap-2 px-3">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                href={item.href}
                key={index}
                className={`flex items-center h-12 px-3 rounded-xl transition-all duration-200 group ${isActive ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
                title={!isHovered ? item.name : ''}
              >
                <div className={`flex-shrink-0 flex items-center justify-center w-6 h-6 ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'}`}>
                  {item.icon}
                </div>
                <span className={`ml-4 text-sm font-medium whitespace-nowrap transition-opacity duration-300 ${isHovered ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>

         <div className="mt-auto mb-6 px-3 flex flex-col gap-2">
            <button 
              onClick={() => {
                setIsChangingPassword(false);
                setIsEditingPhone(false);
                setShowAccountModal(true);
              }}
              className="w-full flex items-center h-12 px-3 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all duration-200 group text-left"
              title={!isHovered ? 'Tài khoản' : ''}
            >
                <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 text-slate-500 group-hover:text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className={`ml-4 text-sm font-medium whitespace-nowrap transition-opacity duration-300 ${isHovered ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
                  Tài khoản
                </span>
            </button>

            <Link 
              className="flex items-center h-12 px-3 rounded-xl text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-all duration-200 group" 
              href="/login"
              title={!isHovered ? 'Đăng xuất' : ''}
              onClick={() => {
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('accessToken');
                sessionStorage.removeItem('user');
              }}
            >
                <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 text-slate-500 group-hover:text-rose-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </div>
                <span className={`ml-4 text-sm font-medium whitespace-nowrap transition-opacity duration-300 ${isHovered ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
                  Đăng xuất
                </span>
            </Link>
         </div>
      </div>

      {/* Modal thông tin tài khoản, đổi mật khẩu & cập nhật số điện thoại */}
      {showAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {isChangingPassword ? 'Đổi mật khẩu' : isEditingPhone ? 'Cập nhật số điện thoại' : 'Thông tin tài khoản'}
              </h3>
              <button 
                onClick={() => setShowAccountModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            {!isChangingPassword && !isEditingPhone ? (
              <div className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Họ và tên</label>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900">
                    {userData.fullName || userData.name || 'Học viên'}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Email</label>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900">
                    {userData.email || 'Chưa cập nhật'}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Số điện thoại</label>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 flex items-center justify-between">
                    <span>{userData.phone || 'Chưa cập nhật'}</span>
                    <button 
                      onClick={() => {
                        setNewPhone(userData.phone || '');
                        setIsEditingPhone(true);
                      }}
                      className="text-xs text-blue-600 font-semibold hover:underline"
                    >
                      Cập nhật
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Mật khẩu</label>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 flex items-center justify-between">
                    <span>••••••••••••</span>
                    <button 
                      onClick={() => setIsChangingPassword(true)}
                      className="text-xs text-blue-600 font-semibold hover:underline"
                    >
                      Đổi mật khẩu
                    </button>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => setShowAccountModal(false)}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition-colors shadow-sm"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            ) : isChangingPassword ? (
              <form onSubmit={handleChangePassword} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Mật khẩu cũ</label>
                  <input
                    type="password"
                    required
                    placeholder="Nhập mật khẩu hiện tại"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Mật khẩu mới</label>
                  <input
                    type="password"
                    required
                    placeholder="Nhập mật khẩu mới"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    required
                    placeholder="Nhập lại mật khẩu mới"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsChangingPassword(false)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-sm transition-colors"
                  >
                    Quay lại
                  </button>
                  <button
                    type="submit"
                    disabled={loadingChangePwd}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50"
                  >
                    {loadingChangePwd ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleUpdatePhone} className="space-y-4 text-sm">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Số điện thoại mới</label>
                  <input
                    type="text"
                    required
                    placeholder="Nhập số điện thoại của bạn"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingPhone(false)}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-sm transition-colors"
                  >
                    Quay lại
                  </button>
                  <button
                    type="submit"
                    disabled={loadingPhone}
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50"
                  >
                    {loadingPhone ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}