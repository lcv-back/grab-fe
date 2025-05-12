"use client";
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import Introduction from "@/components/Introduction";
import SymptomForm from "@/components/SymptomForm";
import FollowupQuestions from "@/components/FollowupQuestions";
import DiagnosisResult from "@/components/DiagnosisResult";
import { useAuth } from "@/contexts/AuthContext";
import type { Symptom, Prediction } from "@/types";

export default function SymptomsPage() {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [token, setToken] = useState("");
  const { user, loading } = useAuth();

  const [step, setStep] = useState<'introduction' | 'symptoms' | 'follow-ups' | 'result'>('introduction');
  const [followUpSymptoms, setFollowUpSymptoms] = useState<string[]>([]);
  const [followUpAnswers, setFollowUpAnswers] = useState<Record<string, 'yes' | 'no'>>({});
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("access_token");
    if (savedToken) setToken(savedToken);
  }, [loading, user]);

  const handleReceiveTopNames = (topNames: string[], predicted: Prediction[]) => {
    setFollowUpSymptoms(topNames);
    setPredictions(predicted);
    setStep('follow-ups');
  };

  const handleFinalSubmit = async () => {
    try {
      const yesSymptoms = Object.entries(followUpAnswers)
        .filter(([, ans]) => ans === 'yes')
        .map(([key]) => key);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/symptoms/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: "1",
          symptoms: [...symptoms.map(s => s.name), ...yesSymptoms],
          image_paths: image ? [URL.createObjectURL(image)] : [],
          num_data: 5,
          answers: followUpAnswers
        })
      });
      const data = await res.json();
      setPredictions(data.predicted_diseases);
      setStep('result');
    } catch (err) {
      console.error('Final prediction request failed:', err);
    }
  };

  const handleReset = () => {
    setSymptoms([]);
    setImage(null);
    setFollowUpAnswers({});
    setFollowUpSymptoms([]);
    setPredictions([]);
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
            onReceiveTopNames={handleReceiveTopNames}
            onBack={() => setStep('introduction')}
          />
        )}

        {step === 'follow-ups' && (
          <FollowupQuestions
            symptoms={followUpSymptoms}
            answers={followUpAnswers}
            setAnswers={setFollowUpAnswers}
            onNext={handleFinalSubmit}
            onBack={() => setStep('symptoms')}
          />
        )}

        {step === 'result' && (
          <DiagnosisResult
            predictions={predictions}
            onReset={handleReset}
            onBack={() => setStep('follow-ups')}
          />
        )}
      </div>
    </main>
  );
}
