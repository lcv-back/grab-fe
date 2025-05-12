import { X, Plus } from "lucide-react";
import dynamic from 'next/dynamic';
import AutocompleteSymptomInput from "@/components/AutoCompleteSymptomInput";
import type { Symptom, Prediction } from "@/types";
import axios from 'axios';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import animationData from '@/data/doctor-note.json';

interface Props {
  symptoms: Symptom[];
  setSymptoms: (s: Symptom[]) => void;
  image: File | null;
  setImage: (img: File | null) => void;
  token: string;
  onReceiveTopNames: (topNames: string[], predictions: Prediction[]) => void;
  onBack: () => void;
}

export default function SymptomForm({
  symptoms,
  setSymptoms,
  image,
  setImage,
  token,
  onReceiveTopNames,
  onBack
}: Props) {
  const handleSubmit = async () => {
    try {
      const imageUrl = image ? URL.createObjectURL(image) : ""; // Placeholder for actual uploaded path
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/symptoms/predict`, {
        user_id: "1",
        symptoms: symptoms.map(s => s.name),
        image_paths: image ? [imageUrl] : [],
        num_data: 5,
        answers: {}
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const { top_names, predicted_diseases } = res.data;
      const convertedPredictions: Prediction[] = predicted_diseases.map((d: { name: string; probability: number }) => ({
        disease: { name: d.name },
        probability: d.probability,
      }));

      onReceiveTopNames(top_names, convertedPredictions);
    } catch (err) {
      console.error("Prediction request failed", err);
    }
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10">
      <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 w-full max-w-xl space-y-6">
        <div>
          <h2 className="text-lg md:text-xl font-bold text-[#005a74] mb-2">Enter your symptoms</h2>
          <AutocompleteSymptomInput symptoms={symptoms} setSymptoms={setSymptoms} token={token} />
        </div>

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
              <img src={URL.createObjectURL(image)} alt="Preview" className="w-full h-full object-cover rounded-xl border" />
              <button onClick={() => setImage(null)} className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full p-1 text-red-500 hover:bg-red-100">
                <X size={12} />
              </button>
            </div>
          ) : (
            <label className="cursor-pointer w-20 h-20 rounded-xl border-2 border-dashed border-[#00BDF9] flex items-center justify-center hover:bg-blue-50">
              <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} hidden />
              <Plus className="text-[#00BDF9]" />
            </label>
          )}
        </div>

        <div className="flex justify-between items-center pt-2">
          <button onClick={onBack} className="text-sm text-gray-500 hover:underline">← Back</button>
          <button onClick={handleSubmit} className="bg-[#00BDF9] hover:bg-[#00acd6] text-white px-6 py-2 rounded-full font-semibold text-sm transition">
            Check
          </button>
        </div>
      </div>

      <div className="w-full max-w-[240px] sm:max-w-sm md:max-w-md">
        <Lottie animationData={animationData} loop />
      </div>
    </div>
  );
}