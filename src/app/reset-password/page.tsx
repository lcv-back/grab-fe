"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, CheckCircle } from "lucide-react";
import axios from "axios";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Mật khẩu mới phải có ít nhất 8 ký tự.");
      return;
    }

    if (password !== confirm) {
      setError("Mật khẩu không khớp.");
      return;
    }

    if (!token) {
      setError("Token không hợp lệ.");
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:3001/auth/reset-password", {
        token,
        new_password: password,
      });

      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Lỗi kết nối đến máy chủ.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Đã xảy ra lỗi không xác định.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md text-center">
      <h2 className="text-xl font-bold text-[#005a74] mb-4">Đặt lại mật khẩu</h2>
      {success ? (
        <div className="flex flex-col items-center text-green-600">
          <CheckCircle size={48} className="mb-2" />
          <p>Đặt lại mật khẩu thành công!</p>
          <p className="text-sm mt-1">Bạn sẽ được chuyển đến trang đăng nhập...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <label className="block text-sm text-gray-700">Mật khẩu mới</label>
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Lock size={16} className="text-gray-400 mr-2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 outline-none text-sm"
              placeholder="Nhập mật khẩu mới"
              required
            />
          </div>
          <label className="block text-sm text-gray-700">Xác nhận mật khẩu</label>
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Lock size={16} className="text-gray-400 mr-2" />
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="flex-1 outline-none text-sm"
              placeholder="Nhập lại mật khẩu"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-[#00BDF9] hover:bg-[#00acd6] text-white font-semibold py-2 rounded-lg transition"
            disabled={loading}
          >
            {loading ? "Đang gửi..." : "Xác nhận"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#e0f7ff] to-white px-4">
      <Suspense fallback={<p className="text-gray-500">Đang tải...</p>}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
