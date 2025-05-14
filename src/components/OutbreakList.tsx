import { Globe, AlertTriangle, ExternalLink } from "lucide-react";
import { format } from "date-fns";

interface Outbreak {
  id: string;
  date: string;
  disease: string;
  summary: string;
  link: string;
  who: {
    cases: number;
    deaths: number;
    last_updated: string;
  };
}

export default function OutbreakList({ data }: { data: Outbreak[] }) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 w-full max-w-4xl mx-auto space-y-6">
      <h2 className="text-xl font-bold text-[#005a74]">Recent Disease Outbreaks</h2>
      <ul className="space-y-4">
        {data.map((item) => (
          <li key={item.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-[#005a74] font-semibold text-lg">{item.disease}</h3>
                <p className="text-sm text-gray-500 mb-1">
                  {format(new Date(item.date), "PPP")} — {item.summary}
                </p>
                <div className="text-sm text-gray-600 flex gap-4">
                  <span><Globe className="inline w-4 h-4 mr-1" /> {item.who.cases} cases</span>
                  <span><AlertTriangle className="inline w-4 h-4 mr-1 text-red-500" /> {item.who.deaths} deaths</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Updated: {item.who.last_updated}</p>
              </div>
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00BDF9] text-sm hover:underline flex items-center gap-1 mt-1"
              >
                View Report <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
