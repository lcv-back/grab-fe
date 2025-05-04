'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return setError('Vui lòng nhập email');
    setError(null);

    try {
      const res = await fetch('http://localhost:3001/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Lỗi không xác định');

      setMessage('Đã gửi liên kết đặt lại mật khẩu đến email của bạn.');
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
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 text-center">
        <div className="flex justify-center mb-6 cursor-pointer" onClick={() => router.push('/')}> 
          <Image src="/assets/logo.png" alt="iSymptom Logo" width={140} height={40} />
        </div>

        <h2 className="text-xl font-semibold text-[#005a74] mb-4">Quên mật khẩu</h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-sm text-left">
          <label className="block text-gray-600 mb-1">Email</label>
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Mail size={16} className="text-gray-400 mr-2" />
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="abc@gmail.com"
              className="w-full bg-transparent outline-none"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-500 text-sm">{message}</p>}

          <button
            type="submit"
            className="w-full bg-[#00BDF9] hover:bg-[#00acd6] text-white py-2 rounded-lg font-semibold"
          >
            Gửi yêu cầu
          </button>
        </form>
      </div>
    </main>
  );
}
