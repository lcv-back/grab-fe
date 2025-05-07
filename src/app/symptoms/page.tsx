// page.tsx
"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import AutocompleteSymptomInput from "@/components/AutoCompleteSymptomInput";
import { X, Plus } from "lucide-react";
import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import animationData from '@/data/doctor-note.json';
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from 'framer-motion';
import { marked } from 'marked';

type Symptom = {
  id: number;
  name: string;
};

const mockFollowUpSymptoms = ['Headache', 'Nausea', 'Shortness of breath'];
const mockPredictions = [
  {
    disease: "A53 diffuse large b-cell lymphoma",
    confidence: 92,
    markdown: `### Comprehensive Overview of **A53 diffuse large b-cell lymphoma**

---

## 1. Overview & Molecular Features
- **Subtype:** Part of the larger category of diffuse large B-cell lymphomas.
- **Genetic feature:** Aneuploidy with TP53 inactivation.
- **Histology:** Medium-sized to large B cells with a diffuse growth pattern.
- **Prevalence:** Information not available

---

## 2. Common Signs & Symptoms
> Not every patient shows all manifestations below; list only those mentioned or clearly implied in the source.
> If a symptom appears more than once with similar wording, list it only once, choosing the most informative phrasing.

Information not available

---

## 3. Diagnostics
- **Method:** Immunohistochemistry (IHC) analysis
  - **Main role:** Information not available
  - **Notes:** Information not available
- **Method:** Morphological assessment
  - **Main role:** Information not available
  - **Notes:** Based on a single H & E slide.
- **Method:** Genetic testing
  - **Main role:** Information not available
  - **Notes:** Has identified four preferentially mutated genes (TP53, MYD88, SPEN, MYC) in untreated tumor samples.
- **Method:** PET-CT
  - **Main role:** Diagnosing DLBCL.
  - **Notes:** Provides high sensitivity and specificity but may not be sufficient for detecting indolent or low-volume disease.

---

## 4. Standard Therapy
### 4.1 First‑line regimen
- R-CHOP regimen (rituximab, cyclophosphamide, doxorubicin, vincristine, and prednisone). This treatment has a high chance of cure, with approximately 60% of patients being able to be cured with anti-lymphoma therapy.
### 4.2 Salvage / second‑line
- Autologous stem-cell transplantation (ASCT) is considered a standard of care for chemo-sensitive patients with relapsed DLBCL.
### 4.3 Individualised care
- Treatment approach can vary depending on individual patient factors and the severity of their condition.

---

## 5. Additional Key Points
1. More research is needed to determine the most effective diagnostic approach for A53 diffuse large B-cell lymphoma specifically.
2. Some patients may not respond well to R-CHOP treatment, particularly those with TP53-mutated DLBCL. In such cases, alternative treatments may be necessary.
3. A team approach may be necessary to ensure the best possible outcome.

---

## 6. Principal References
- **[1]** Vodicka 2022 – DLBCL represents a curable disease with 60–70% chance of cure with current chemoimmunotherapy.
- **[2]** Wang 2020 – As a widely recognized standard regimen, R-CHOP is able to cure.
- **[3]** Shi 2024 – Approximately 60% of patients with DLBCL can be cured with anti-...
- **[4]** Xu 2022 – ASCT is the standard of care for chemo-sensitive patients with relapsed DLBCL.

---
> **Disclaimer:** The information above is for reference only. Diagnosis, prognosis, and treatment must be determined by a qualified medical professional.`
  },
  { disease: "COVID-19", confidence: 85 },
  { disease: "Common Cold", confidence: 76 },
  { disease: "Allergy", confidence: 65 },
  { disease: "Bronchitis", confidence: 50 }
];

export default function SymptomsPage() {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [token, setToken] = useState<string>("");
  const { user, loading } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<'form' | 'questions' | 'result'>('form');
  const [followUpSymptoms, setFollowUpSymptoms] = useState<string[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  useEffect(() => {
    const savedToken = localStorage.getItem("access_token");
    if (savedToken) setToken(savedToken);
  }, [router, user, loading]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(file);
  };

  const removeImage = () => setImage(null);

  const handleCheck = () => {
    const userInputNames = symptoms.map((s) => s.name.toLowerCase());
    const filtered = mockFollowUpSymptoms.filter((sym) => !userInputNames.includes(sym.toLowerCase())).slice(0, 3);
    setFollowUpSymptoms(filtered);
    setCurrentQ(0);
    setStep('questions');
  };

  const handleAnswer = (ans: string) => {
    const updated = [...answers];
    updated[currentQ] = ans;
    setAnswers(updated);
    if (currentQ < followUpSymptoms.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      setStep('result');
    }
  };

  const handleBack = () => {
    if (currentQ > 0) {
      setCurrentQ(currentQ - 1);
    } else {
      setStep('form');
    }
  };

  return (
    <main className="min-h-screen bg-[#f9fafa]">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col-reverse lg:flex-row items-center justify-between">
        {step === 'form' && (
          <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 w-full max-w-xl space-y-6">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-[#005a74] mb-2">Enter your symptoms</h2>
              <AutocompleteSymptomInput
                symptoms={symptoms}
                setSymptoms={setSymptoms}
                token={token}
              />
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
              <button onClick={handleCheck} className="bg-green-400 hover:bg-green-500 text-white px-6 py-2 rounded-full font-semibold text-sm transition">
                Check
              </button>
            </div>
          </div>
        )}

        {step === 'questions' && (
          <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 w-full max-w-xl space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
  key={currentQ}
  initial={{ opacity: 0, y: 10 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10 }}
  transition={{ duration: 0.25 }}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="inline-block w-4 h-4 bg-[#00BDF9] rounded-full"></span>
                  {`Are you experiencing ${followUpSymptoms[currentQ]}?`}
                </h3>
                <div className="flex gap-4">
                  <button onClick={() => handleAnswer('yes')} className="px-6 py-2 bg-[#00BDF9] text-white rounded-full">Yes</button>
                  <button onClick={() => handleAnswer('no')} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-full">No</button>
                </div>
              </motion.div>
            </AnimatePresence>
            <button onClick={handleBack} className="text-sm text-gray-500 hover:underline">Back</button>
          </div>
        )}

        {step === 'result' && (
          <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 w-full max-w-xl space-y-6">
            <h2 className="text-lg md:text-xl font-bold text-[#005a74] mb-2">Top 5 Possible Conditions</h2>
            <ul className="space-y-2">
  {mockPredictions.map((p, idx) => (
    <li key={idx} className="bg-blue-50 px-4 py-2 rounded-lg">
      <details>
        <summary className="flex justify-between items-center cursor-pointer">
          <span className="font-medium text-[#005a74]">{p.disease}</span>
          <span className="text-sm text-gray-600">{p.confidence}% match</span>
        </summary>
        {p.markdown && (
          <div className="mt-4 prose prose-sm sm:prose-base max-w-none text-gray-800 leading-relaxed bg-white rounded-xl p-4 border border-gray-200 shadow-sm" dangerouslySetInnerHTML={{ __html: marked.parse(p.markdown) }} />
        )}
      </details>
    </li>
  ))}
</ul>
          </div>
        )}

        {/* Lottie Section */}
        <div className="w-full max-w-[240px] sm:max-w-sm md:max-w-md">
          {animationData && <Lottie animationData={animationData} loop />}
        </div>
      </div>
    </main>
  );
}
