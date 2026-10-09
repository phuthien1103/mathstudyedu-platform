'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedUserStr = localStorage.getItem('user');
      if (savedUserStr) {
        const userObj = JSON.parse(savedUserStr);
        setUserRole(userObj.role);
      }
    } catch (e) {
      console.error('Lỗi đọc user từ localStorage:', e);
    }
  }, []);

  // Nếu đang ở trang đăng nhập thì không render Sidebar và Bottom Nav
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
        className={`fixed top-0 left-0 h-screen bg-[#0d1526] border-r border-gray-800 flex flex-col pt-6 z-40 transition-all duration-300 ease-in-out ${isHovered ? 'w-64' : 'w-20 hidden md:flex'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center px-6 mb-10 h-12">
          <div className="text-blue-500 flex-shrink-0 flex items-center justify-center w-8 h-8">
             <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M12 14l9-5-9-5-9 5 9 5z" />
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
             </svg>
          </div>
          <span className={`text-xl font-bold text-white ml-4 whitespace-nowrap transition-opacity duration-300 ${isHovered ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
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
                className={`flex items-center h-12 px-3 rounded-xl transition-all duration-200 group ${isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                title={!isHovered ? item.name : ''}
              >
                <div className={`flex-shrink-0 flex items-center justify-center w-6 h-6 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-400'}`}>
                  {item.icon}
                </div>
                <span className={`ml-4 text-sm font-medium whitespace-nowrap transition-opacity duration-300 ${isHovered ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>

         <div className="mt-auto mb-6 px-3">
            <Link className="flex items-center h-12 px-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200 group" href="/login">
                <div className="flex-shrink-0 flex items-center justify-center w-6 h-6">
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

      {/* Thanh menu dưới dành riêng cho điện thoại */}
      <div className="fixed bottom-0 left-0 right-0 h-16 bg-[#0d1526] border-t border-gray-800 flex items-center justify-around px-2 z-50 md:hidden shadow-lg">
        <Link href="/" className={`flex flex-col items-center justify-center ${pathname === '/' ? 'text-blue-500' : 'text-gray-400 hover:text-white'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-[10px] mt-1 font-medium">Trang chủ</span>
        </Link>

        <Link href="/courses" className={`flex flex-col items-center justify-center ${pathname === '/courses' ? 'text-blue-500' : 'text-gray-400 hover:text-white'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="text-[10px] mt-1 font-medium">Khóa học</span>
        </Link>

        <Link href="/my-courses" className={`flex flex-col items-center justify-center ${pathname === '/my-courses' ? 'text-blue-500' : 'text-gray-400 hover:text-white'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          <span className="text-[10px] mt-1 font-medium">Của tôi</span>
        </Link>

        <Link href="/documents" className={`flex flex-col items-center justify-center ${pathname === '/documents' ? 'text-blue-500' : 'text-gray-400 hover:text-white'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="text-[10px] mt-1 font-medium">Tài liệu</span>
        </Link>
      </div>
    </>
  );
}