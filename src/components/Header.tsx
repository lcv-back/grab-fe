'use client';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();

  return (
    <header className="flex justify-between items-center px-4 py-2 text-sm">
      <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}> 
        <Image src="/assets/logo.png" alt="Logo" width={120} height={30} />
      </div>
      {user ? (
        <div className="flex items-center space-x-3">
          <span className="text-gray-700 truncate max-w-[120px]">{user.fullname}</span>
          <button
            onClick={logout}
            className="px-3 py-1 bg-red-400 text-white rounded-full hover:bg-red-500"
          >
            Đăng xuất
          </button>
        </div>
      ) : (
        <button
          onClick={() => router.push('/login')}
          className="px-3 py-1 bg-[#00BDF9] text-white rounded-full hover:bg-[#00acd6]"
        >
          Đăng nhập
        </button>
      )}
    </header>
  );
}