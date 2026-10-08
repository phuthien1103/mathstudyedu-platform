import Link from 'next/link';

export default function ContactWidget() {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
      {/* Nút Email với hiệu ứng nhịp đập (pulse) */}
      <Link href="mailto:meocon110307@gmail.com" 
            className="group flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full shadow-lg hover:scale-110 transition-all duration-300 animate-pulse">
        📧
        <span className="absolute right-14 whitespace-nowrap opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-sm px-3 py-1 rounded-md transition-opacity">
          meocon110307@gmail.com
        </span>
      </Link>

      {/* Nút SĐT với hiệu ứng nhấp nhô (bounce) */}
      <Link href="tel:0812086107"
            className="group flex items-center justify-center w-12 h-12 bg-green-500 text-white rounded-full shadow-lg hover:scale-110 transition-all duration-300 animate-bounce">
        📞
        <span className="absolute right-14 whitespace-nowrap opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-sm px-3 py-1 rounded-md transition-opacity">
          0812 086 107
        </span>
      </Link>
    </div>
  );
}