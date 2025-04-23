"use client";
import { useAuth } from '@/context/AuthContext';

export default function SymptomsPage() {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return <p className="p-6 text-gray-500">Đang tải thông tin người dùng...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">
        {user ? `Chào ${user.fullname} 👋` : 'Chế độ khách'}
      </h2>
      {user && (
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-400 text-white rounded-full hover:bg-red-500"
        >
          Đăng xuất
        </button>
      )}
    </div>
  );
}
