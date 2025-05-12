import { motion, AnimatePresence } from "framer-motion";

interface FollowupQuestionsProps {
  symptoms: string[];
  answers: Record<string, 'yes' | 'no'>;
  setAnswers: (answers: Record<string, 'yes' | 'no'>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function FollowupQuestions({
  symptoms,
  answers,
  setAnswers,
  onNext,
  onBack
}: FollowupQuestionsProps) {
  const handleAnswer = (symptom: string, answer: 'yes' | 'no') => {
    setAnswers({ ...answers, [symptom]: answer });
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 w-full max-w-xl space-y-6 mx-auto">
      <h3 className="text-lg text-gray-600 font-semibold mb-4">Please confirm if you're experiencing any of the following symptoms:</h3>
      <div className="space-y-4">
        {symptoms.map((symptom) => (
          <div key={symptom} className="flex justify-between items-center border p-3 rounded-lg">
            <span className="text-sm font-medium text-[#005a74]">{symptom}</span>
            <div className="flex gap-2">
              <button
                className={`px-4 py-1 rounded-full text-sm font-semibold ${answers[symptom] === 'yes' ? 'bg-[#00BDF9] text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => handleAnswer(symptom, 'yes')}
              >
                Yes
              </button>
              <button
                className={`px-4 py-1 rounded-full text-sm font-semibold ${answers[symptom] === 'no' ? 'bg-[#00BDF9] text-white' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => handleAnswer(symptom, 'no')}
              >
                No
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between pt-4">
        <button onClick={onBack} className="text-sm text-gray-500 hover:underline">← Back</button>
        <button onClick={onNext} className="text-sm font-semibold bg-[#00BDF9] hover:bg-[#00acd6] text-white px-6 py-2 rounded-full">Next</button>
      </div>
    </div>
  );
}
