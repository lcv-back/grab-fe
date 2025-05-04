'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { registerUser, loginUser } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Lock, User, Calendar, Mail } from 'lucide-react';

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
    if (password.length < 6) return setError('Mật khẩu phải có ít nhất 6 ký tự');
    if (password !== confirm) return setError('Xác nhận mật khẩu không khớp');

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
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Đã xảy ra lỗi không xác định.");
      }
      setSuccess(false);
    }
    
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#e0f7ff] to-white p-6">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        <div className="flex justify-center mb-6">
          <Image src="/assets/logo.png" alt="iSymptom Logo" width={140} height={40} />
        </div>

        <h2 className="text-xl font-semibold text-[#005a74] mb-4 text-center">Tạo tài khoản</h2>

        <form className="space-y-4 text-sm" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <div className="flex items-center border rounded-lg px-3 py-2">
              <Mail className="text-gray-400 mr-2" size={16} />
              <input
                name="email"
                type="email"
                placeholder="abc@gmail.com"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Họ và tên</label>
            <div className="flex items-center border rounded-lg px-3 py-2">
              <User className="text-gray-400 mr-2" size={16} />
              <input
                name="fullname"
                type="text"
                placeholder="Nguyễn Văn A"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Ngày sinh</label>
            <div className="flex items-center border rounded-lg px-3 py-2">
              <Calendar className="text-gray-400 mr-2" size={16} />
              <input
                name="birthday"
                type="date"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Giới tính</label>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setGender('male')}
                className={`px-4 py-2 rounded-full border ${gender === 'male' ? 'bg-[#00BDF9] text-white' : 'text-gray-600'}`}
              >
                Nam
              </button>
              <button
                type="button"
                onClick={() => setGender('female')}
                className={`px-4 py-2 rounded-full border ${gender === 'female' ? 'bg-[#00BDF9] text-white' : 'text-gray-600'}`}
              >
                Nữ
              </button>
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Mật khẩu</label>
            <div className="flex items-center border rounded-lg px-3 py-2">
              <Lock className="text-gray-400 mr-2" size={16} />
              <input
                name="password"
                type="password"
                placeholder="Mật khẩu"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Xác nhận mật khẩu</label>
            <div className="flex items-center border rounded-lg px-3 py-2">
              <Lock className="text-gray-400 mr-2" size={16} />
              <input
                name="confirm"
                type="password"
                placeholder="Nhập lại mật khẩu"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">Đăng ký thành công!</p>}

          <button
            type="submit"
            className="w-full bg-[#00BDF9] hover:bg-[#00acd6] text-white py-2 rounded-lg font-semibold"
          >
            Đăng ký
          </button>
        </form>
      </div>
    </main>
  );
}
