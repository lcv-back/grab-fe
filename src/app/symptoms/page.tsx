"use client";
import Header from '@/components/Header';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plus, Search, X } from 'lucide-react';
import Lottie from "lottie-react";


export default function SymptomsPage() {
  const [input, setInput] = useState('');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);

  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    fetch("/assets/doctor-note.json")
      .then((res) => res.json())
      .then((data) => setAnimationData(data))
      .catch((err) => console.error(err));
  }, []);

  const addSymptom = () => {
    if (input.trim() && !symptoms.includes(input.trim())) {
      setSymptoms([...symptoms, input.trim()]);
      setInput('');
    }
  };

  const removeSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter((s) => s !== symptom));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  const removeImage = () => setImage(null);

  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col lg:flex-row items-center justify-between gap-10">
        <Lottie
          animationData={animationData}
          loop={true}
          style={{ width: 500, height: 500 }}
        />

        <div className="bg-white rounded-3xl shadow p-8 w-full max-w-xl space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-[#005a74] mb-2">Nhập triệu chứng</h2>
            <div className="flex items-center border rounded-full px-4 py-2 focus-within:ring-2 ring-[#00BDF9]">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ví dụ: ho, sốt, đau bụng..."
                className="flex-1 bg-transparent outline-none text-sm text-gray-700"
              />
              <button onClick={addSymptom} className="text-[#00BDF9] hover:text-[#009dcc]">
                <Plus size={18} />
              </button>
            </div>
          </div>

          {symptoms.length > 0 && (
            <div>
              <p className="text-sm font-medium text-[#005a74] mb-2">Triệu chứng đã thêm:</p>
              <div className="flex flex-wrap gap-2">
                {symptoms.map((s) => (
                  <span key={s} className="bg-[#fca5a5] text-white px-3 py-1 rounded-full text-sm flex items-center gap-1">
                    {s}
                    <button onClick={() => removeSymptom(s)}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-[#005a74] mb-2">Hình ảnh:</p>
            {image ? (
              <div className="relative w-20 h-20">
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-xl border"
                />
                <button
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full p-1 text-red-500 hover:bg-red-100"
                >
                  <X size={12} />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer w-20 h-20 rounded-xl border-2 border-dashed border-[#00BDF9] flex items-center justify-center hover:bg-blue-50">
                <input type="file" accept="image/*" onChange={handleImageChange} hidden />
                <Plus className="text-[#00BDF9]" />
              </label>
            )}
          </div>

          <div className="flex justify-end mt-4">
            {/* <label className="bg-[#fca311] hover:bg-[#e69500] text-white px-6 py-2 rounded-full font-semibold text-sm cursor-pointer">
              <input type="file" accept="image/*" onChange={handleImageChange} hidden />
              Thêm ảnh
            </label> */}
            <button className="bg-[#00BDF9] hover:bg-[#00acd6] text-white px-6 py-2 rounded-full font-semibold text-sm">
              Kiểm tra
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}