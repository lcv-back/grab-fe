"use client";
import { useState, useEffect, useRef, useCallback } from "react";

type Suggestion = {
  id: number;
  name: string;
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

  const fetchSuggestions = useCallback(
    async (q: string) => {
      try {
        const res = await fetch(
          `http://127.0.0.1:3001/api/symptoms/autocomplete?query=${encodeURIComponent(q)}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();

        const freeTextSuggestion: Suggestion = {
          id: -1,
          name: q,
        };

        setSuggestions([freeTextSuggestion, ...data]);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
      }
    },
    [token]
  );

  const selectSymptom = (symptom: Suggestion) => {
    if (!symptoms.some((s) => s.name.toLowerCase() === symptom.name.toLowerCase())) {
      setSymptoms([...symptoms, symptom]);
    }
    setQuery("");
    setSuggestions([]);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
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
  }, [query, fetchSuggestions]);

  const highlightMatch = (text: string, query: string) => {
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;
    return (
      <>
        {text.substring(0, index)}
        <strong>{text.substring(index, index + query.length)}</strong>
        {text.substring(index + query.length)}
      </>
    );
  };

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
              key={sug.id === -1 ? `free-text-${sug.name}` : sug.id}
              className={`px-4 py-2 cursor-pointer ${
                selectedIndex === index ? "bg-gray-200" : ""
              }`}
              onClick={() => selectSymptom(sug)}
            >
              {highlightMatch(sug.name, query)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
