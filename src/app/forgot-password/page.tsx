'use client';
import Image from "next/image";
import { useState } from "react";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return setError("Vui lòng nhập email");
    setError(null);

    try {
      // Gửi request tới backend reset password
      const res = await fetch('http://localhost:3001/auth/forgot-password', {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi không xác định");

      setMessage("Đã gửi liên kết đặt lại mật khẩu đến email của bạn.");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      <div className="absolute top-6 left-6 flex items-center space-x-2">
        <Image src="/assets/logo.png" alt="iSymptom Logo" width={150} height={150} />
      </div>

      <div className="w-full max-w-sm text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Quên mật khẩu</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="text-left">
            <label className="block text-sm text-gray-600">Email</label>
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="abc@gmail.com"
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#00BDF9]"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-500 text-sm">{message}</p>}

          <button
            type="submit"
            className="w-full bg-[#00BDF9] hover:bg-[#00acd6] text-white py-2 rounded-full mt-2"
          >
            Gửi yêu cầu
          </button>
        </form>
      </div>
    </main>
  );
}
