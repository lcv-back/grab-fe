"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import Introduction from "@/components/Introduction";
import SymptomForm from "@/components/SymptomForm";
import FollowupQuestions from "@/components/FollowupQuestions";
import DiagnosisResult from "@/components/DiagnosisResult";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import type { Symptom } from "@/types";

const mockFollowUpSymptoms = ['Headache', 'Nausea', 'Shortness of breath'];
const mockPredictions = [
  { disease: "A53 diffuse large b-cell lymphoma", confidence: 92, markdown: "### Comprehensive Overview of ..." },
  { disease: "COVID-19", confidence: 85 },
  { disease: "Common Cold", confidence: 76 },
  { disease: "Allergy", confidence: 65 },
  { disease: "Bronchitis", confidence: 50 }
];

export default function SymptomsPage() {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [token, setToken] = useState("");
  const { user, loading } = useAuth();
  const router = useRouter();

  const [step, setStep] = useState<'introduction' | 'symptoms' | 'follow-ups' | 'result'>('introduction');
  const [followUpSymptoms, setFollowUpSymptoms] = useState<string[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("access_token");
    if (savedToken) setToken(savedToken);
  }, [loading, user, router]);

  const handleCheck = () => {
    const userInputNames = symptoms.map((s) => s.name.toLowerCase());
    const filtered = mockFollowUpSymptoms.filter((sym) => !userInputNames.includes(sym.toLowerCase())).slice(0, 3);
    setFollowUpSymptoms(filtered);
    setCurrentQ(0);
    setStep('follow-ups');
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
      setStep('symptoms');
    }
  };

  const handleReset = () => {
    setSymptoms([]);
    setImage(null);
    setAnswers([]);
    setFollowUpSymptoms([]);
    setStep('symptoms');
  };

  return (
    <main className="min-h-screen bg-[#f9fafa]">
      <Header />
      <ProgressBar current={step} />

      <div className="max-w-6xl mx-auto px-4 py-10">
        {step === 'introduction' && (
          <Introduction
            onNext={() => setStep('symptoms')}
            acceptedTerms={acceptedTerms}
            agreedPrivacy={agreedPrivacy}
            setAcceptedTerms={setAcceptedTerms}
            setAgreedPrivacy={setAgreedPrivacy}
            showTerms={showTerms}
            setShowTerms={setShowTerms}
          />
        )}

        {step === 'symptoms' && (
          <SymptomForm
            symptoms={symptoms}
            setSymptoms={setSymptoms}
            image={image}
            setImage={setImage}
            token={token}
            onSubmit={handleCheck}
            onBack={() => setStep('introduction')}
          />
        )}

        {step === 'follow-ups' && (
          <FollowupQuestions
            question={followUpSymptoms[currentQ]}
            currentQ={currentQ}
            onAnswer={handleAnswer}
            onBack={handleBack}
          />
        )}

        {step === 'result' && (
          <DiagnosisResult
            predictions={mockPredictions}
            onReset={handleReset}
            onBack={() => setStep('follow-ups')}
          />
        )}
      </div>
    </main>
  );
}