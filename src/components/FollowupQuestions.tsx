interface FollowupQuestionsProps {
  symptoms: string[];
  answers: Record<string, boolean>;
  setAnswers: (answers: Record<string, boolean>) => void;
  onNext: (formattedAnswers: Record<string, 'Yes' | 'No'>) => void;
  onBack: () => void;
}

export default function FollowupQuestions({
  symptoms,
  answers,
  setAnswers,
  onNext,
  onBack
}: FollowupQuestionsProps) {
  const toggleCheckbox = (symptom: string) => {
    setAnswers({ ...answers, [symptom]: !answers[symptom] });
  };

  const convertAnswers = (
    rawAnswers: Record<string, boolean>,
    allSymptoms: string[]
  ): Record<string, 'Yes' | 'No'> => {
    const converted: Record<string, 'Yes' | 'No'> = {};
    allSymptoms.forEach((symptom) => {
      converted[symptom] = rawAnswers[symptom] ? 'Yes' : 'No';
    });
    return converted;
  };

  const handleNext = () => {
    const formattedAnswers = convertAnswers(answers, symptoms);
    onNext(formattedAnswers);
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 w-full max-w-xl space-y-6 mx-auto">
      <h3 className="text-lg md:text-xl font-semibold text-[#005a74] mb-4">
        Please tick the symptoms you are currently experiencing:
      </h3>

      <div className="space-y-3">
        {symptoms.map((symptom) => {
          const isChecked = !!answers[symptom];

          return (
            <label
              key={symptom}
              onClick={() => toggleCheckbox(symptom)}
              className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 border-2
                ${isChecked ? 'bg-[#00BDF9] text-white border-[#00BDF9]' : 'bg-white text-[#005a74] border-[#D1D5DB] hover:bg-[#f0faff]'}`}
            >
              <div
                className={`w-5 h-5 flex items-center justify-center rounded-full border transition-all duration-300
                  ${isChecked ? 'bg-white border-white' : 'border-gray-300'}`}
              >
                {isChecked && (
                  <span className="text-[#00BDF9] text-[14px] font-bold leading-none">✔</span>
                )}
              </div>
              <span className="text-sm font-semibold">{symptom}</span>
            </label>
          );
        })}
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="text-sm text-gray-500 hover:underline"
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          className="text-sm font-semibold bg-[#00BDF9] hover:bg-[#00acd6] text-white px-6 py-2 rounded-full transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}
