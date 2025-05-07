"use client";

import Lottie from "lottie-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { AnimationItem } from "lottie-web";

export default function LandingPage() {
  const router = useRouter();
  const [animationData, setAnimationData] = useState<AnimationItem | null>(null);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    fetch("/assets/logo-landing.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => {
        router.push("/home");
      }, 500); // fade duration
    }, 4500); // animation duration
    return () => clearTimeout(timer);
  }, [router]);

  if (!animationData) return null;

  return (
    <main
      className={`flex flex-col items-center justify-center h-screen w-screen p-4 transition-opacity duration-500 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="w-[80%] max-w-[500px]">
        <Lottie animationData={animationData} loop={false} />
      </div>
    </main>
  );
}
