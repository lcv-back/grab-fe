'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { registerUser, loginUser } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const [gender, setGender] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const router = useRouter();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) router.replace('/symptoms');
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const email = form.email.value.trim();
    const fullname = form.fullname.value.trim();
    const birthday = form.birthday.value;
    const password = form.password.value;
    const confirm = form.confirm.value;

    if (!email || !fullname || !birthday || !password || !confirm)
      return setError('Vui lòng điền đầy đủ thông tin');

    if (!gender) return setError('Vui lòng chọn giới tính');

    if (password.length < 6)
      return setError('Mật khẩu phải có ít nhất 6 ký tự');

    if (password !== confirm)
      return setError('Xác nhận mật khẩu không khớp');

    try {
      await registerUser({
        email,
        fullname,
        birthday: new Date(birthday).toISOString(),
        gender,
        password,
      });
      const token = await loginUser({ email, password });
      login(token);
      setSuccess(true);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      setSuccess(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white p-6 relative">
      {/* Logo */}
      <div className="absolute top-6 left-6 flex items-center space-x-2">
        <Image src="/assets/logo.png" alt="iSymptom Logo" width={150} height={40} />
      </div>

      {/* Form Content */}
      <div className="w-full max-w-sm text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">Đăng ký</h2>

        <form className="space-y-4 text-left" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              name="email"
              type="email"
              placeholder="abc@gmail.com"
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#00BDF9]"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Họ và tên</label>
            <input
              name="fullname"
              type="text"
              placeholder="Nguyễn Văn A"
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#00BDF9]"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Ngày sinh</label>
            <input
              name="birthday"
              type="date"
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#00BDF9]"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Giới tính</label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                className={`px-4 py-2 rounded-full border ${gender === 'male' ? 'bg-[#00BDF9] text-white' : 'text-gray-500'}`}
                onClick={() => setGender('male')}
              >
                Nam
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-full border ${gender === 'female' ? 'bg-[#00BDF9] text-white' : 'text-gray-500'}`}
                onClick={() => setGender('female')}
              >
                Nữ
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Mật khẩu</label>
            <input
              name="password"
              type="password"
              placeholder="Mật khẩu"
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#00BDF9]"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Xác nhận mật khẩu</label>
            <input
              name="confirm"
              type="password"
              placeholder="Xác nhận mật khẩu"
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#00BDF9]"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">Đăng ký thành công!</p>}

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