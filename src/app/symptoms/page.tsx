"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import AutocompleteSymptomInput from "@/components/AutoCompleteSymptomInput";
import { X, Plus } from "lucide-react";
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import animationData from '@/data/doctor-note.json';


type Symptom = {
  id: number;
  name: string;
};

export default function SymptomsPage() {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const savedToken = localStorage.getItem("access_token");
    if (savedToken) setToken(savedToken);
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  const removeImage = () => setImage(null);

  return (
    <main className="min-h-screen bg-[#f9fafa]">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col-reverse lg:flex-row items-center justify-between gap-10">
        {/* Form Section */}
        <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 w-full max-w-xl space-y-6">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-[#005a74] mb-2">Enter your symptoms</h2>
            <AutocompleteSymptomInput
              symptoms={symptoms}
              setSymptoms={setSymptoms}
              token={token}
            />
          </div>

          {/* Persistent container for selected symptoms */}
          <div className="min-h-[56px] transition-all">
            <p className="text-sm font-medium text-[#005a74] mb-2">Selected symptoms:</p>
            {symptoms.length > 0 ? (
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
                {symptoms.map((s) => (
                  <span
                    key={`${s.id}-${s.name}`}
                    className="bg-[#fca5a5] text-white px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {s.name}
                    <button onClick={() => setSymptoms(symptoms.filter((x) => x.id !== s.id || x.name !== s.name))}>
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm italic">No symptoms selected yet.</p>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-[#005a74] mb-2">Upload an image (optional):</p>
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

          <div className="flex justify-end">
            <button className="bg-[#00BDF9] hover:bg-[#00acd6] text-white px-6 py-2 rounded-full font-semibold text-sm transition">
              Check
            </button>
          </div>
        </div>

        {/* Lottie Section */}
        <div className="w-full max-w-sm md:max-w-md">
          {animationData && <Lottie animationData={animationData} loop />}
        </div>
      </div>
    </main>
  );
}
