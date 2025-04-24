"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      {/* Logo */}
      <div className="mb-10">
        <div className="flex items-center space-x-2">
          <Image src="/assets/logo.png" alt="iSymptom Logo" width={200} height={77} />
        </div>
      </div>

      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
        {/* Doctor Illustration */}
        <div className="w-48 h-48 relative">
          <Image
            src="/assets/doctor.png"
            alt="Doctor"
            fill
            className="object-contain"
          />
        </div>

        {/* Text Content */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold mb-2">Xin chào, hôm nay bạn thế nào?</h2>
          <p className="text-gray-500 mb-4">Bắt đầu bằng cách:</p>

          <div className="flex justify-center md:justify-start space-x-4">
            <button className="px-4 py-2 bg-red-400 hover:bg-red-500 text-white rounded-full" onClick={() => router.push("/login")}
            >
              Đăng nhập
            </button>
            <button className="px-4 py-2 bg-[#00BDF9] hover:bg-[#00a8dd] text-white rounded-full " onClick={() => router.push("/symptoms")}>
              Chế độ khách
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
