import { useState, useEffect } from "react";
import { marked } from "marked";
import axios from "axios";
import { Loader2, Copy, X } from "lucide-react";

import { Prediction } from "@/types";

interface DiagnosisResultProps {
  predictions: Prediction[];
  onReset: () => void;
  // onBack: () => void;
}

export default function DiagnosisResult({ predictions, onReset }: DiagnosisResultProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [diseaseDescriptions, setDiseaseDescriptions] = useState<Record<number, string>>({});
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [readMoreIndex, setReadMoreIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [activeIndex]);

  const getTruncatedMarkdown = (text: string) => {
    const splitIndex = text.indexOf("## 2. Common Signs & Symptoms");
    return splitIndex !== -1 ? text.substring(0, splitIndex) : text;
  };

  const handleOpen = async (index: number, name: string) => {
    setActiveIndex(index);
    if (!diseaseDescriptions[index]) {
      setLoadingIndex(index);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/disease?disease_name=${encodeURIComponent(name)}`);
        setDiseaseDescriptions(prev => ({ ...prev, [index]: res.data.description }));
      } catch (err) {
        console.error("Error fetching disease description:", err);
        setDiseaseDescriptions(prev => ({ ...prev, [index]: "**Error loading description.**" }));
      } finally {
        setLoadingIndex(null);
      }
    }
  };

  const handleCopy = (index: number) => {
    const name = predictions[index]?.disease.name;
    navigator.clipboard.writeText(name || "");
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleClose = () => {
    setActiveIndex(null);
    setReadMoreIndex(null);
  };

  return (
    <>
      <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 w-full max-w-xl space-y-6 mx-auto">
        <h2 className="text-lg md:text-xl font-bold text-[#005a74] mb-2">Top 5 Possible Conditions</h2>
        <ul className="space-y-2">
          {predictions.map((p, idx) => (
            <li
              key={idx}
              className="bg-blue-50 px-4 py-3 rounded-xl cursor-pointer hover:shadow-md transition"
              onClick={() => handleOpen(idx, p.disease.name)}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-[#005a74]">{p.disease.name}</span>
                <span className="text-sm text-gray-600">{p.probability}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 mt-2">
                <div className="bg-[#00BDF9] h-2 rounded-full" style={{ width: `${p.probability}%` }} />
              </div>
              <span className="text-xs text-gray-500 italic">Tap to view details</span>
            </li>
          ))}
        </ul>

        <div className="flex justify-end pt-4">
          {/* <button onClick={onBack} className="text-sm text-gray-500 hover:underline">← Back</button> */}
          <button
            onClick={onReset}
            className="px-6 py-2 bg-[#00BDF9] hover:bg-[#00acd6] text-white rounded-full font-semibold"
          >
            OK
          </button>
        </div>
      </div>

      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm transition-opacity duration-300"
          onClick={handleClose}
        >
          <div
            className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl transform transition-all duration-300 ease-out overflow-hidden animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start gap-4 mb-4 px-6 pt-6 sticky top-0 bg-white z-10">
              <h3 className="text-2xl font-bold text-[#005a74] leading-snug">
                {predictions[activeIndex].disease.name}
              </h3>
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => handleCopy(activeIndex)}
                  className="text-sm text-gray-400 hover:text-[#00BDF9] flex items-center gap-1"
                >
                  <Copy size={16} /> {copiedIndex === activeIndex ? "Copied" : "Copy name"}
                </button>
                <button
                  onClick={handleClose}
                  className="text-white bg-[#00BDF9] hover:bg-[#00acd6] rounded-full p-2 shadow-lg"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="max-h-[75vh] overflow-y-auto px-6 pb-6 rounded-b-3xl scrollbar-thin scrollbar-thumb-[#00BDF9]/50 scrollbar-track-transparent custom-scrollbar">
              {loadingIndex === activeIndex ? (
                <div className="flex items-center gap-2 text-sm italic text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin text-[#00BDF9]" /> Loading...
                </div>
              ) : (
                <article className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-[#333] leading-relaxed tracking-normal">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: marked.parse(
                        readMoreIndex === activeIndex
                          ? diseaseDescriptions[activeIndex] || ""
                          : getTruncatedMarkdown(diseaseDescriptions[activeIndex] || "")
                      ),
                    }}
                  />
                  {(diseaseDescriptions[activeIndex] || "").includes("## 2. Common Signs & Symptoms") && (
                    <div className="text-right mt-4">
                      <button
                        onClick={() =>
                          setReadMoreIndex(prev => (prev === activeIndex ? null : activeIndex))
                        }
                        className="text-sm text-gray-500 hover:text-[#00BDF9]"
                      >
                        {readMoreIndex === activeIndex ? "Read less" : "Read more"}
                      </button>
                    </div>
                  )}
                </article>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
