'use client';

import Link from 'next/link';

export default function ContactWidget() {
  return (
    <>
      <style jsx>{`
        .btn-3d-glass {
          /* Đã giảm độ dày của bóng đổ cho phù hợp với nút nhỏ hơn */
          box-shadow: inset 0px 2px 4px rgba(255, 255, 255, 0.5), 
                      inset 0px -4px 8px rgba(0, 0, 0, 0.4), 
                      0px 6px 15px rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(10px);
        }
        .icon-shadow {
          filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.5));
        }
        @keyframes radar-wave {
          0% { transform: scale(1); opacity: 0.8; border-width: 1.5px; }
          100% { transform: scale(2.2); opacity: 0; border-width: 0px; }
        }
        .animate-radar-1 {
          animation: radar-wave 2.5s cubic-bezier(0.1, 0.4, 0.8, 1) infinite;
        }
        .animate-radar-2 {
          animation: radar-wave 2.5s cubic-bezier(0.1, 0.4, 0.8, 1) 1.25s infinite;
        }
        @keyframes phone-ring {
          0%, 100% { transform: rotate(0deg); }
          10%, 30%, 50%, 70%, 90% { transform: rotate(-10deg); }
          20%, 40%, 60%, 80% { transform: rotate(10deg); }
        }
        .group:hover .icon-phone {
          animation: phone-ring 1s ease-in-out infinite;
        }
      `}</style>

      {/* Đã giảm khoảng cách (gap) xuống gap-4 và vị trí góc bottom-6 right-6 */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 flex flex-col gap-3 z-50 items-center">
        
        {/* ================= NÚT EMAIL ================= */}
        <div className="relative group flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-blue-400 animate-radar-1"></div>
          <div className="absolute inset-0 rounded-full border-indigo-400 animate-radar-2"></div>
          {/* Giảm độ nhòe ánh sáng nền */}
          <div className="absolute inset-[-10px] rounded-full bg-blue-600/10 blur-lg"></div>

          {/* Kích thước nút giảm 30%: w-9 h-9 (36px) */}
          <Link href="mailto:meocon110307@gmail.com" 
                className="relative z-10 flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 via-blue-600 to-indigo-900 border border-white/20 btn-3d-glass transition-transform duration-300 hover:scale-110">
            
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/30 to-transparent"></div>
            
            {/* Kích thước icon giảm 30%: w-[18px] h-[18px] */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] text-white icon-shadow relative z-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-.4 4.25l-7.07 4.42c-.32.2-.74.2-1.06 0L4.4 8.25a.85.85 0 1 1 .9-1.44L12 11l6.7-4.19a.85.85 0 1 1 .9 1.44z"/>
            </svg>

            {/* Khung chữ hiển thị kéo lại gần hơn: right-12 */}
            <span className="absolute right-12 whitespace-nowrap opacity-0 group-hover:opacity-100 bg-indigo-900/80 backdrop-blur-md border border-white/10 shadow-lg text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-300 translate-x-4 group-hover:translate-x-0 pointer-events-none">
              meocon110307@gmail.com
            </span>
          </Link>
        </div>

        {/* ================= NÚT ĐIỆN THOẠI ================= */}
        <div className="relative group flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-green-300 animate-radar-1"></div>
          <div className="absolute inset-0 rounded-full border-emerald-400 animate-radar-2"></div>
          <div className="absolute inset-[-10px] rounded-full bg-green-500/20 blur-lg"></div>

          {/* Kích thước nút giảm 30%: w-9 h-9 (36px) */}
          <Link href="tel:0812086107"
                className="relative z-10 flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-emerald-300 via-green-500 to-teal-900 border border-white/20 btn-3d-glass transition-transform duration-300 hover:scale-110">
            
            <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/40 to-transparent"></div>
            
            {/* Kích thước icon giảm 30%: w-[18px] h-[18px] */}
            <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px] text-white icon-shadow icon-phone relative z-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 0 0-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.03 21c.76 0 .98-.66.98-1.21v-3.42c0-.54-.45-.99-.99-.99z"/>
            </svg>

            {/* Khung chữ hiển thị kéo lại gần hơn: right-12 */}
            <span className="absolute right-12 whitespace-nowrap opacity-0 group-hover:opacity-100 bg-teal-900/80 backdrop-blur-md border border-white/10 shadow-lg text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-300 translate-x-4 group-hover:translate-x-0 pointer-events-none">
              0812 086 107
            </span>
          </Link>
        </div>

      </div>
    </>
  );
}