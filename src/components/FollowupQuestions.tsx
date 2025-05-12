import { motion, AnimatePresence } from "framer-motion";

interface FollowupQuestionsProps {
  question: string;
  currentQ: number;
  onAnswer: (answer: string) => void;
  onBack: () => void;
}

export default function FollowupQuestions({
  question,
  currentQ,
  onAnswer,
  onBack
}: FollowupQuestionsProps) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 w-full max-w-xl space-y-6 mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}>
          <h3 className="text-lg text-gray-600 font-semibold mb-4 flex items-center gap-2">
            <span className="inline-block w-4 h-4 bg-[#00BDF9] rounded-full"></span>
            {`Are you experiencing ${question}?`}
          </h3>
          <div className="flex gap-4">
            <button onClick={() => onAnswer('yes')} className="px-6 py-2 bg-[#00BDF9] text-white rounded-full">Yes</button>
            <button onClick={() => onAnswer('no')} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-full">No</button>
          </div>
        </motion.div>
      </AnimatePresence>
      <button onClick={onBack} className="text-sm text-gray-500 hover:underline">Back</button>
    </div>
  );
}
