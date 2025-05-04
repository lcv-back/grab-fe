"use client";
import { useState, useEffect, useRef } from "react";

type Suggestion = {
  id: number;
  name: string;
  description: string;
};

export default function AutocompleteSymptomInput({
  symptoms,
  setSymptoms,
  token,
}: {
  symptoms: Suggestion[];
  setSymptoms: (s: Suggestion[]) => void;
  token: string;
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const fetchSuggestions = async (q: string) => {
    const res = await fetch(
      `http://127.0.0.1:3001/api/symptoms/autocomplete?query=${encodeURIComponent(q)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const data = await res.json();
    setSuggestions(data);
  };

  const selectSymptom = (symptom: Suggestion) => {
    if (!symptoms.find((s) => s.id === symptom.id)) {
      setSymptoms([...symptoms, symptom]);
    }
    setQuery("");
    setSuggestions([]);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      selectSymptom(suggestions[selectedIndex]);
    }
  };

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);
  }, [query]);

  return (
    <div className="relative">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Nhập triệu chứng..."
        className="w-full border rounded-full px-4 py-2 outline-none text-sm"
      />
      {suggestions.length > 0 && (
        <div className="absolute bg-white shadow rounded w-full z-10 max-h-60 overflow-auto">
          {suggestions.map((sug, index) => (
            <div
              key={sug.id}
              className={`px-4 py-2 cursor-pointer ${
                selectedIndex === index ? "bg-gray-200" : ""
              }`}
              onClick={() => selectSymptom(sug)}
            >
              <strong>{sug.name}</strong> -{" "}
              <span className="text-gray-500 text-sm">
                {sug.description || "Không có mô tả"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
