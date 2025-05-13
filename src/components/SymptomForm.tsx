import { X, Plus } from "lucide-react";
import AutocompleteSymptomInput from "@/components/AutoCompleteSymptomInput";
import type { Symptom, Prediction, User } from "@/types";
import axios from 'axios';
import { useState } from 'react';

interface Props {
  symptoms: Symptom[];
  user: User;
  setSymptoms: (s: Symptom[]) => void;
  image: File | null;
  setImage: (img: File | null) => void;
  uploadedUrl: string;
  setUploadedUrl: (url: string) => void;
  token: string;
  onReceiveTopNames: (topNames: string[], predictions: Prediction[]) => void;
  onBack: () => void;
}

export default function SymptomForm({
  symptoms,
  user,
  setSymptoms,
  image,
  setImage,
  uploadedUrl,
  setUploadedUrl,
  token,
  onReceiveTopNames,
  onBack
}: Props) {
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");

  const handleUploadImage = async (file: File) => {
    setUploadStatus("uploading");
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/symptoms/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data?.url) {
        setUploadedUrl(res.data.url);
        setImage(file);
        setUploadStatus("success");
      } else {
        setUploadStatus("error");
      }
    } catch (error) {
      console.error("Image upload error:", error);
      setUploadStatus("error");
    }
  };

  const handleDeleteImage = async () => {
    if (!uploadedUrl) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/images/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        data: { url: uploadedUrl }
      });
    } catch (error) {
      console.error("Image delete error:", error);
    } finally {
      setImage(null);
      setUploadedUrl("");
      setUploadStatus("idle");
    }
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/symptoms/predict`,
        {
          user_id: user?.id || "1",
          symptoms: symptoms.map(s => s.name),
          image_paths: uploadedUrl ? [uploadedUrl] : [],
          num_data: 5,
          answers: {}
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

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
    <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 w-full max-w-xl space-y-6 mx-auto">
      <div>
        <h2 className="text-lg md:text-xl font-bold text-[#005a74] mb-2">Enter your symptoms</h2>
        <AutocompleteSymptomInput symptoms={symptoms} setSymptoms={setSymptoms} token={token} />
        <p className="text-xs text-gray-500 italic mt-1">
          The more symptoms you enter, the more accurate the results will be.
        </p>
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
        <div className="flex items-center gap-4">
          {image ? (
            <div className="relative w-20 h-20">
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className={`w-full h-full object-cover rounded-xl border transition-opacity duration-200 ${
                  uploadStatus === 'uploading' ? 'opacity-40' : 'opacity-100'
                }`}
              />
              {uploadStatus === 'uploading' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 animate-spin text-[#00BDF9]"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                </div>
              )}
              <button onClick={handleDeleteImage} className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full p-1 text-red-500 hover:bg-red-100">
                <X size={12} />
              </button>
            </div>
          ) : (
            <label className="cursor-pointer w-20 h-20 rounded-xl border-2 border-dashed border-[#00BDF9] flex items-center justify-center hover:bg-blue-50 duration-200">
              <input type="file" accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUploadImage(file);
              }} hidden />
              <Plus className="text-[#00BDF9]" />
            </label>
          )}
          {uploadStatus === "uploading" && <span className="text-sm text-gray-500 animate-pulse">Uploading...</span>}
          {uploadStatus === "success" && <span className="text-sm text-green-600">Uploaded</span>}
          {uploadStatus === "error" && <span className="text-sm text-red-600">Upload failed</span>}
        </div>
      </div>

      <div className="flex justify-between items-center pt-2">
        <button onClick={onBack} className="text-sm text-gray-500 hover:underline">← Back</button>
        <button
          onClick={handleSubmit}
          disabled={
            uploadStatus === 'uploading' || (symptoms.length === 0 && !image)
          }
          className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
            uploadStatus === 'uploading' || (symptoms.length === 0 && !image)
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-[#00BDF9] hover:bg-[#00acd6] text-white'
          }`}
        >
          Check
        </button>
      </div>
    </div>
  );
}
