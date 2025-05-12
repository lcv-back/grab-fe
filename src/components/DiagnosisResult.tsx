import { useRef, useState } from "react";
import { marked } from "marked";
import axios from "axios";

import { Prediction } from "@/types";

interface DiagnosisResultProps {
  predictions: Prediction[];
  onReset: () => void;
  onBack: () => void;
}

export default function DiagnosisResult({ predictions, onReset, onBack }: DiagnosisResultProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [diseaseDescriptions, setDiseaseDescriptions] = useState<Record<number, string>>({});
  const contentRefs = useRef<Record<number, HTMLDivElement | null>>({});

  const scrollToContent = (index: number) => {
    const el = contentRefs.current[index];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleToggle = async (index: number, name: string) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
      return;
    }

    if (diseaseDescriptions[index]) {
      setExpandedIndex(index);
      setTimeout(() => scrollToContent(index), 200);
      return;
    }

    setLoadingIndex(index);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/disease?disease_name=${encodeURIComponent(name)}`);
      setDiseaseDescriptions(prev => ({ ...prev, [index]: res.data.description }));
      setTimeout(() => {
        setExpandedIndex(index);
        setTimeout(() => scrollToContent(index), 200);
      }, 10);
    } catch (error) {
      console.error("Error fetching disease description:", error);
      setDiseaseDescriptions(prev => ({ ...prev, [index]: "**Error loading description.**" }));
      setTimeout(() => {
        setExpandedIndex(index);
        setTimeout(() => scrollToContent(index), 200);
      }, 10);
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 w-full max-w-xl space-y-6 mx-auto">
      <h2 className="text-lg md:text-xl font-bold text-[#005a74] mb-2">Top 5 Possible Conditions</h2>
      <ul className="space-y-2">
        {predictions.map((p, idx) => {
          const isExpanded = expandedIndex === idx;
          const isLoading = loadingIndex === idx;
          const hasContent = !!diseaseDescriptions[idx];

          return (
            <div key={idx}>
              <li
                className="bg-blue-50 px-4 py-2 rounded-lg cursor-pointer flex justify-between items-center"
                onClick={() => handleToggle(idx, p.disease.name)}
              >
                <span className="font-medium text-[#005a74]">{p.disease.name}</span>
                <span className="text-sm text-gray-600">{p.probability}% match</span>
              </li>

              <div
                ref={(el) => {
                  contentRefs.current[idx] = el;
                }}
                style={{
                  maxHeight: isExpanded && (isLoading || hasContent)
                    ? `${contentRefs.current[idx]?.scrollHeight ?? 80}px`
                    : "0px",
                }}
                className="overflow-hidden transition-[max-height] duration-500"
              >
                <div className="mt-2">
                  {isLoading ? (
                    <div className="flex items-center gap-2 text-sm italic text-gray-400 px-4 py-2">
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-[#00BDF9] rounded-full animate-spin"></div>
                      Loading description...
                    </div>
                  ) : (
                    <div
                      className="prose prose-sm sm:prose-base max-w-none text-gray-800 leading-relaxed bg-white rounded-xl px-4"
                      dangerouslySetInnerHTML={{ __html: marked.parse(diseaseDescriptions[idx] || "") }}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </ul>

      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="text-sm text-gray-500 hover:underline">← Back</button>
        <button
          onClick={onReset}
          className="px-6 py-2 bg-[#00BDF9] hover:bg-[#00acd6] text-white rounded-full font-semibold"
        >
          OK
        </button>
      </div>
    </div>
  );
}