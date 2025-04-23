'use client';
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { loginUser } from "@/lib/api/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

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
      setError("Vui lòng nhập email và mật khẩu");
      return;
    }

    try {
      const token = await loginUser({ email, password });
      login(token);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      {/* Logo */}
      <div className="absolute top-6 left-6 flex items-center space-x-2">
        <Image src="/assets/logo.png" alt="iSymptom Logo" width={150} height={150} />
      </div>

      {/* Illustration */}
      <div className="w-72 h-72 relative mb-6">
        <Image
          src="/assets/heart-rate.png"
          alt="Medical Illustration"
          fill
          className="object-contain"
        />
      </div>

      {/* Login Form */}
      <div className="w-full max-w-sm text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Đăng nhập</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="text-left">
            <label className="block text-sm text-gray-600">Email</label>
            <input
              name="email"
              type="email"
              placeholder="abc@gmail.com"
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#00BDF9]"
            />
          </div>

          <div className="text-left">
            <label className="block text-sm text-gray-600">Mật khẩu</label>
            <input
              name="password"
              type="password"
              placeholder="**************"
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#00BDF9]"
            />
          </div>

          <div className="flex justify-between items-center text-sm text-gray-500">
            <a href="#" className="hover:text-[#00BDF9]">Quên mật khẩu</a>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-red-400 hover:bg-red-500 text-white py-2 rounded-full mt-2"
          >
            Đăng nhập
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-600">
          Chưa có tài khoản?
          <Link href="/register" className="text-[#00BDF9] font-semibold ml-1">Đăng ký ngay</Link>
        </div>
      </div>
    </main>
  );
}