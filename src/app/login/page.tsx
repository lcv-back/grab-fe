"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/api/auth';
import { useAuth } from '@/context/AuthContext';
import { Mail, Lock } from 'lucide-react';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) router.replace('/symptoms');
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form.email.value.trim();
    const password = form.password.value;

    if (!email || !password) {
      setError('Vui lòng nhập email và mật khẩu');
      return;
    }

    try {
      const token = await loginUser({ email, password });
      login(token);
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unexpected error occurred. Please try again.");
      }
    }
    
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#e0f7ff] to-white p-6">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <div className="flex justify-center mb-6">
          <Image src="/assets/logo.png" alt="iSymptom Logo" width={140} height={40} />
        </div>

        <h2 className="text-xl font-semibold text-[#005a74] mb-4 text-center">Đăng nhập</h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <div className="flex items-center border rounded-lg px-3 py-2">
              <Mail size={16} className="text-gray-400 mr-2" />
              <input
                name="email"
                type="email"
                placeholder="abc@gmail.com"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Mật khẩu</label>
            <div className="flex items-center border rounded-lg px-3 py-2">
              <Lock size={16} className="text-gray-400 mr-2" />
              <input
                name="password"
                type="password"
                placeholder="**************"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          <div className="text-right text-sm">
            <Link href="/forgot-password" className="text-gray-500 hover:text-[#00BDF9]">Quên mật khẩu?</Link>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[#00BDF9] hover:bg-[#00acd6] text-white py-2 rounded-lg font-semibold"
          >
            Đăng nhập
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-600 text-center">
          Chưa có tài khoản?
          <Link href="/register" className="text-[#00BDF9] font-semibold ml-1">Đăng ký ngay</Link>
        </div>
      </div>
    </main>
  );
}