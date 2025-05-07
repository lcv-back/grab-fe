'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import animationData from '@/data/doctor-animation.json';

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[#f9fafa] px-4 py-4">
      {/* Logo */}
      <div className="mb-6">
        <Image src="/assets/logo.png" alt="iSymptom Logo" width={160} height={60} />
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 w-full max-w-6xl">
        {/* Doctor Animation */}
        <div className="w-full max-w-[280px] md:max-w-md">
          {animationData && <Lottie animationData={animationData} loop />}
        </div>

        {/* Text Content */}
        <div className="text-center md:text-left flex-1 px-2">
          <h2 className="text-xl md:text-3xl font-bold text-black mb-2">
            Hello, how are you feeling today?
          </h2>
          <p className="text-gray-600 mb-4 text-sm md:text-lg">
            Start by choosing an option:
          </p>

          <div className="flex justify-center md:justify-start gap-3">
            <button
              className="px-5 py-2 bg-[#00BDF9] hover:bg-[#00acd6] text-white rounded-full text-sm md:text-base"
              onClick={() => router.push('/login')}
            >
              Login
            </button>
            <button
              className="px-5 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full text-sm md:text-base"
              onClick={() => router.push('/register')}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
