import dynamic from 'next/dynamic';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
import animationData from '@/data/doctor-note.json';

interface Props {
  onNext: () => void;
  acceptedTerms: boolean;
  agreedPrivacy: boolean;
  setAcceptedTerms: (v: boolean) => void;
  setAgreedPrivacy: (v: boolean) => void;
  showTerms: boolean;
  setShowTerms: (v: boolean) => void;
}

export default function Introduction({
  onNext,
  acceptedTerms,
  agreedPrivacy,
  setAcceptedTerms,
  setAgreedPrivacy,
  showTerms,
  setShowTerms
}: Props) {
  const canProceed = acceptedTerms && agreedPrivacy;

  if (showTerms) {
    return (
      <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 w-full max-w-xl mx-auto space-y-6">
        <h2 className="text-lg md:text-xl font-bold text-[#005a74]">Terms of Service</h2>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li>
            iSymptom isn&apos;t a diagnosis. It&apos;s only for your information and not a qualified medical opinion.
          </li>
          <li>
            iSymptom   isn&apos;t for emergencies. Call your local emergency number right away when there&apos;s a health emergency.
          </li>
          <li>
            Your data is safe. The information you give won&apos;t be shared or used to identify you.
          </li>
        </ul>

        <div className="pt-4 space-y-3 text-sm text-gray-700">
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 accent-blue-600"
            />
            <span>
              I read and accept <a className="font-bold">Terms of Service</a>.
            </span>
          </div>
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={agreedPrivacy}
              onChange={(e) => setAgreedPrivacy(e.target.checked)}
              className="mt-1 accent-blue-600"
            />
            <span>
              I agree for my health information to be used for the interview.
            </span>
          </div>
        </div>

        <div className="flex gap-3 pt-6">
          <button
            onClick={() => setShowTerms(false)}
            className="text-sm text-gray-500 hover:underline"
          >
            ← Back
          </button>
          <button
            onClick={onNext}
            disabled={!canProceed}
            className={`ml-auto text-white text-sm font-semibold py-2.5 px-6 rounded-full transition-all
              ${canProceed ? 'bg-[#00BDF9] hover:bg-[#00acd6]' : 'bg-gray-400 cursor-not-allowed'}`}
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-10 flex flex-col-reverse lg:flex-row items-center justify-between gap-10">
      <div className="flex-1 space-y-6">
        <div>
          <h1 className="text-lg md:text-xl font-bold text-[#005a74] mb-4">Check your symptoms</h1>
          <p className="text-[#333] text-base leading-relaxed">
            Take a short symptom assessment. The information you give is safe and won&apos;t be shared.
            Your results will include:
          </p>
          <ul className="list-disc pl-6 mt-3 text-gray-700">
            <li>Possible causes of symptoms.</li>
            <li>Description of each disease you&apos;re might having.</li>
          </ul>
        </div>

        {/* <div className="pt-4">
          <h2 className="font-semibold text-[#005a74] text-base mb-2">About this symptom checker</h2>
          <ul className="space-y-2 text-sm text-[#1e1e1e]">
            <li className="flex items-start gap-2">
              <span className="text-blue-600">✔</span>
              Created and validated by doctors
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">✔</span>
              Clinically validated with real patient cases
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">✔</span>
              Class I medical device in European Union
            </li>
          </ul>
        </div> */}

        <button
          onClick={() => setShowTerms(true)}
          className="mt-6 bg-[#00BDF9] hover:bg-[#00acd6] text-white text-sm font-semibold py-2.5 px-6 rounded-full transition-all"
        >
          Next
        </button>
      </div>

      <div className="flex-1">
        <div className="w-full max-w-[240px] sm:max-w-sm md:max-w-md mx-auto">
          <Lottie animationData={animationData} loop />
        </div>
      </div>
    </div>
  );
}