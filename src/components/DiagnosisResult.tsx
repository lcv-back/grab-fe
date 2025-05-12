import { marked } from "marked";

export default function DiagnosisResult({ predictions, onReset }: any) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 w-full max-w-xl space-y-6 mx-auto">
      <h2 className="text-lg md:text-xl font-bold text-[#005a74] mb-2">Top 5 Possible Conditions</h2>
      <ul className="space-y-2">
        {predictions.map((p: any, idx: number) => (
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

      <div className="flex justify-center pt-4">
        <button onClick={onReset} className="px-6 py-2 bg-[#00BDF9] hover:bg-[#00acd6] text-white rounded-full font-semibold">
          OK
        </button>
      </div>
    </div>
  );
}
