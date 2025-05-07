"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import { AnimationItem } from 'lottie-web';

export default function Home() {
  const router = useRouter();
  const [animationData, setAnimationData] = useState<AnimationItem | null>(null);

  useEffect(() => {
    fetch("/assets/doctor-animation.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white px-4 py-6">
      {/* Logo */}
      <div className="mb-10">
        <Image src="/assets/logo.png" alt="iSymptom Logo" width={200} height={77} />
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row items-center gap-8 w-full max-w-6xl">
        {/* Doctor Animation */}
        <div className="w-full max-w-sm md:max-w-md">
          {animationData && (
            <Lottie animationData={animationData} loop />
          )}
        </div>

        {/* Text Content */}
        <div className="text-center md:text-left flex-1">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Xin chào, hôm nay bạn thế nào?</h2>
          <p className="text-gray-600 mb-4 text-base md:text-lg">Bắt đầu bằng cách:</p>

          <div className="flex justify-center md:justify-start">
            <button
              className="px-5 py-2 bg-red-400 hover:bg-red-500 text-white rounded-full text-sm md:text-base"
              onClick={() => router.push("/login")}
            >
              Đăng nhập
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
