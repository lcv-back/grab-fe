"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { User, Mail, Calendar, Smile, Pencil } from 'lucide-react';
import axios from 'axios';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [editMode, setEditMode] = useState(false);
  const [fullname, setFullname] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
    if (user) {
      setFullname(user.fullname || '');
      setBirthday(user.birthday ? new Date(user.birthday).toISOString().substr(0, 10) : '');
      setGender(user.gender || '');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#e0f7ff] to-white">
        <p className="text-gray-600">Đang tải...</p>
      </main>
    );
  }

  if (!user) return null;

  const handleSave = async () => {
    if (!fullname.trim() || !birthday || !gender) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }
  
    try {
      setSaving(true);
      setError("");
      setSuccess(false);
  
      await axios.put(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/profile`, {
        fullname,
        birthday,
        gender,
      });
  
      setSuccess(true);
      setEditMode(false);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Lỗi cập nhật thông tin.");
      } else {
        setError("Unexpected error occurred. Please try again.");
      }
    } finally {
      setSaving(false);
    }
  };
  

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#e0f7ff] to-white p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#005a74]">Thông tin tài khoản</h2>
          <button
            onClick={() => setEditMode(!editMode)}
            className="text-[#00BDF9] hover:underline flex items-center"
          >
            <Pencil size={18} className="mr-1" /> {editMode ? 'Hủy' : 'Chỉnh sửa'}
          </button>
        </div>

        <div className="space-y-4 text-sm text-gray-700">
          {/* Fullname */}
          <div className="flex items-center gap-3">
            <User size={20} className="text-[#00BDF9]" />
            {editMode ? (
              <input
                className="border rounded-lg px-2 py-1 w-full"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
              />
            ) : (
              <span>{fullname}</span>
            )}
          </div>

          {/* Email (read only) */}
          <div className="flex items-center gap-3">
            <Mail size={20} className="text-[#00BDF9]" />
            <span>{user.email}</span>
          </div>

          {/* Birthday */}
          <div className="flex items-center gap-3">
            <Calendar size={20} className="text-[#00BDF9]" />
            {editMode ? (
              <input
                type="date"
                className="border rounded-lg px-2 py-1 w-full"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />
            ) : (
              <span>{new Date(birthday).toLocaleDateString('vi-VN')}</span>
            )}
          </div>

          {/* Gender */}
          <div className="flex items-center gap-3">
            <Smile size={20} className="text-[#00BDF9]" />
            {editMode ? (
              <select
                className="border rounded-lg px-2 py-1 w-full"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            ) : (
              <span>{gender === 'male' ? 'Nam' : gender === 'female' ? 'Nữ' : 'Khác'}</span>
            )}
          </div>
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {success && <p className="text-green-500 text-sm mt-2">Cập nhật thành công!</p>}

        {editMode && (
          <button
            onClick={handleSave}
            className="w-full mt-4 bg-[#00BDF9] hover:bg-[#00acd6] text-white py-2 rounded-lg font-semibold"
            disabled={saving}
          >
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </button>
        )}
      </div>
    </main>
  );
}
