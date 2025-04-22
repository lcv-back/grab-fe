'use client';
import Image from 'next/image';
import { useState } from 'react';

export default function RegisterPage() {
  const [gender, setGender] = useState<string>('');

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white p-6 relative">
      {/* Logo */}
      <div className="absolute top-6 left-6 flex items-center space-x-2">
        <Image src="/assets/logo.png" alt="iSymptom Logo" width={40} height={40} />
        <span className="text-xl font-bold text-[#00BDF9]">iSymptom</span>
      </div>

      {/* Form Content */}
      <div className="w-full max-w-sm text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">Đăng ký</h2>

        <form className="space-y-4">
          <input
            type="email"
            placeholder="abc@gmail.com"
            className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#00BDF9]"
          />

          <input
            type="text"
            placeholder="Nguyễn Văn A"
            className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#00BDF9]"
          />

          <div className="flex space-x-2">
            <input
              type="date"
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#00BDF9]"
            />

            <div className="flex items-center space-x-2">
              <button
                type="button"
                className={`px-4 py-2 rounded-full border ${gender === 'Nam' ? 'bg-[#00BDF9] text-white' : 'text-gray-500'}`}
                onClick={() => setGender('Nam')}
              >
                Nam
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-full border ${gender === 'Nữ' ? 'bg-[#00BDF9] text-white' : 'text-gray-500'}`}
                onClick={() => setGender('Nữ')}
              >
                Nữ
              </button>
            </div>
          </div>

          <input
            type="password"
            placeholder="Mật khẩu"
            className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#00BDF9]"
          />

          <input
            type="password"
            placeholder="Xác nhận mật khẩu"
            className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#00BDF9]"
          />

          <button
            type="submit"
            className="w-full bg-red-400 hover:bg-red-500 text-white py-2 rounded-full mt-2"
          >
            Đăng ký
          </button>
        </form>
      </div>
    </main>
  );
}
