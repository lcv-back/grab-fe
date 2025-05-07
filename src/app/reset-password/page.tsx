'use client';
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, CheckCircle, Loader2 } from "lucide-react";
import Image from "next/image";
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

  const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    if (!token) {
      setError("Invalid token.");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${BASE_URL}/auth/reset-password`, {
        token,
        new_password: password,
      });

      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "Failed to connect to server.");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-md text-center animate-slide-up">
      <div className="flex justify-center mb-6 cursor-pointer" onClick={() => router.push('/')}>
        <Image src="/assets/logo.png" alt="iSymptom Logo" width={140} height={40} />
      </div>

      <h2 className="text-xl font-bold text-[#005a74] mb-4">Reset Your Password</h2>
      {success ? (
        <div className="flex flex-col items-center text-green-600">
          <CheckCircle size={48} className="mb-2" />
          <p>Password reset successful!</p>
          <p className="text-sm mt-1">You will be redirected to login shortly...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <label className="block text-sm text-gray-700">New Password</label>
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Lock size={16} className="text-gray-400 mr-2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 outline-none text-sm"
              placeholder="Enter new password"
              required
            />
          </div>
          <label className="block text-sm text-gray-700">Confirm Password</label>
          <div className="flex items-center border rounded-lg px-3 py-2">
            <Lock size={16} className="text-gray-400 mr-2" />
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="flex-1 outline-none text-sm"
              placeholder="Re-enter new password"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full flex items-center justify-center bg-[#00BDF9] hover:bg-[#00acd6] text-white font-semibold py-2 rounded-lg transition-all"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Submitting...
              </>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#e0f7ff] to-white px-4 py-8">
      <Suspense fallback={<p className="text-gray-500">Loading...</p>}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
