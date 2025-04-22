import Image from "next/image";

export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
      {/* Logo */}
      <div className="absolute top-6 left-6 flex items-center space-x-2">
        <Image src="/assets/logo.png" alt="iSymptom Logo" width={150} height={150} />
      </div>

      {/* Illustration */}
      <div className="w-72 h-72 relative mb-6">
        <Image
          src="/assets/heart-rate.png" // Replace with actual image path
          alt="Medical Illustration"
          fill
          className="object-contain"
        />
      </div>

      {/* Login Form */}
      <div className="w-full max-w-sm text-center">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Đăng nhập</h2>

        <form className="space-y-4">
          <div className="text-left">
            <label className="block text-sm text-gray-600">Email</label>
            <input
              type="email"
              placeholder="abc@gmail.com"
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#00BDF9]"
            />
          </div>

          <div className="text-left">
            <label className="block text-sm text-gray-600">Mật khẩu</label>
            <input
              type="password"
              placeholder="**************"
              className="w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#00BDF9]"
            />
          </div>

          <div className="flex justify-between items-center text-sm text-gray-500">
            <a href="#" className="hover:text-[#00BDF9]">Quên mật khẩu</a>
          </div>

          <button
            type="submit"
            className="w-full bg-red-400 hover:bg-red-500 text-white py-2 rounded-full mt-2"
          >
            Đăng nhập
          </button>
        </form>

        <div className="mt-6 text-sm text-gray-600">
          Chưa có tài khoản?
          <a href="#" className="text-[#00BDF9] font-semibold ml-1">Đăng ký ngay</a>
        </div>
      </div>
    </main>
  );
}
