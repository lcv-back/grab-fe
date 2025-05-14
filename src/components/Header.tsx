'use client';
import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const MobileMenu = (
    <>
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999]"
        onClick={() => setIsOpen(false)}
      />
      <div
        ref={panelRef}
        className="fixed top-0 right-0 h-full w-[80%] max-w-xs bg-white z-[1000] shadow-lg transition-transform duration-300 ease-in-out animate-slide-in"
      >
        <div className="flex justify-between items-center px-4 py-3 border-b">
          <h3 className="text-lg font-semibold text-[#005a74]">Menu</h3>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-[#00BDF9]">
            <X size={22} />
          </button>
        </div>
        <nav className="flex flex-col gap-4 px-4 py-4 text-[#005a74] font-medium">
          <Link href="/symptoms" onClick={() => setIsOpen(false)} className="hover:text-[#00BDF9]">Symptom Checker</Link>
          <Link href="/outbreaks" onClick={() => setIsOpen(false)} className="hover:text-[#00BDF9]">News</Link>
          <hr />
          {user ? (
            <>
              <Link href="/profile" onClick={() => setIsOpen(false)} className="hover:underline">{user.fullname}</Link>
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="text-red-500 hover:text-red-600 font-semibold text-left"
              >
                Log Out
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                router.push('/login');
                setIsOpen(false);
              }}
              className="text-[#00BDF9] hover:text-[#00acd6] font-semibold text-left"
            >
              Sign In
            </button>
          )}
        </nav>
      </div>
    </>
  );

  return (
    <>
      <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-[999]">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-6">
            <div className="cursor-pointer" onClick={() => router.push('/symptoms')}>
              <Image src="/assets/logo.png" alt="iSymptom Logo" width={120} height={40} />
            </div>
            <div className="h-6 w-px bg-gray-300 hidden md:block" />
            <nav className="hidden md:flex items-center gap-6 text-[15px] font-medium text-[#005a74]">
              <Link href="/symptoms" className="hover:text-[#00BDF9] py-1 transition">Symptom Checker</Link>
              <Link href="/outbreaks" className="hover:text-[#00BDF9] py-1 transition">News</Link>
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-4 text-sm">
            {user ? (
              <>
                <Link href="/profile" className="text-[#005a74] font-medium hover:underline truncate max-w-[160px]">
                  {user.fullname}
                </Link>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full font-semibold shadow-sm transition"
                >
                  Log Out
                </button>
              </>
            ) : (
              <button
                onClick={() => router.push('/login')}
                className="bg-[#00BDF9] hover:bg-[#00acd6] text-white px-5 py-2 rounded-full font-semibold shadow-sm transition"
              >
                Sign In
              </button>
            )}
          </div>

          <button className="md:hidden text-[#005a74] z-[1001]" onClick={() => setIsOpen(true)}>
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Render mobile menu into body to prevent layout clipping */}
      {mounted && isOpen && typeof window !== 'undefined'
        ? ReactDOM.createPortal(MobileMenu, document.body)
        : null}
    </>
  );
}
