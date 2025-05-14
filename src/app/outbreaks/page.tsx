'use client';

import { useEffect, useState } from 'react';
import OutbreakList from '@/components/OutbreakList';
import Header from '@/components/Header';

interface Outbreak {
  id: string;
  date: string;
  disease: string;
  summary: string;
  link: string;
  who: {
    cases: number;
    deaths: number;
    last_updated: string;
  };
}

export default function OutbreaksPage() {
  const [data, setData] = useState<Outbreak[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOutbreaks = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/outbreaks/rss`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Failed to fetch outbreaks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOutbreaks();
  }, []);

  return (
    <main className="relative z-0 min-h-screen bg-[#f9fafa]">
        <Header/>
        <div className="flex flex-col items-center justify-center py-10">
            {/* <h1 className="text-2xl font-bold mb-4">News</h1> */}
            {loading ? (
                <p className="text-center text-sm text-gray-500">Loading outbreaks...</p>
            ) : (
                <OutbreakList data={data} />
            )}
        </div>
    </main>
  );
}
