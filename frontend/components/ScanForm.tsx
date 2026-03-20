"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { VulnerabilityTable } from "@/components/VulnerabilityTable";
import { scanCode, downloadReportUrl } from "@/services/api";
import type { Language, ScanResponse } from "@/services/api";
import { Loader2, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  onScanComplete?: (result: ScanResponse) => void;
}

export function ScanForm({ onScanComplete }: Props) {
  const [code, setCode]           = useState("");
  const [language, setLanguage]   = useState<Language>("python");
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState<ScanResponse | null>(null);

  const handleScan = async () => {
    if (!code.trim()) {
      toast.error("Please enter some code first.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const data = await scanCode(code, language);
      setResult(data);
      onScanComplete?.(data);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ?? "Scan failed. Is the backend running?";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  // Simulated score based on vulnerabilities
  const score = result 
    ? Math.max(0, 100 - result.vulnerabilities.length * 15)
    : 100;

  let scoreStatus = "";
  let scoreColor = "";
  if (score >= 90) { scoreStatus = "EXCELLENT"; scoreColor = "#22c55e"; } // Green
  else if (score >= 70) { scoreStatus = "GOOD"; scoreColor = "#3b82f6"; } // Blue/Good 
  else if (score >= 50) { scoreStatus = "NEEDS IMPROVEMENT"; scoreColor = "#eab308"; } // Yellow
  else { scoreStatus = "HIGH RISK"; scoreColor = "#ef4444"; } // Red

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Editor Box */}
        <div className="lg:col-span-2 glass rounded-3xl p-6 border border-white/5 relative bg-[hsl(226,12%,14%)] shadow-2xl flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5 mr-4">
                <div className="w-3 h-3 rounded-full bg-[#f87171]"></div>
                <div className="w-3 h-3 rounded-full bg-[#fbbf24]"></div>
                <div className="w-3 h-3 rounded-full bg-[#2dd4bf]"></div>
              </div>
              <span className="text-sm font-medium text-zinc-400 font-mono">
                {language}_v3.11
              </span>
            </div>
            <button
              onClick={handleScan}
              disabled={loading}
              className="px-6 py-2 rounded-xl bg-[#aca1fd] text-[#131418] font-bold text-xs uppercase tracking-widest hover:bg-[#c4bcff] transition-all disabled:opacity-50"
            >
              Analyze Code
            </button>
          </div>

          <div className="flex-1 relative">
            <CodeEditor
              value={code}
              language={language}
              onChange={setCode}
              onLanguageChange={setLanguage}
            />
            {/* Loading Overlay within the editor bounds visually */}
            {loading && (
              <div className="absolute inset-0 bg-[hsl(226,12%,10%)/0.8] backdrop-blur-sm flex flex-col items-center justify-center rounded-xl z-10 transition-all border border-white/5">
                <Loader2 className="w-12 h-12 text-[#aca1fd] animate-spin mb-6" />
                <h3 className="text-lg font-bold text-white tracking-widest uppercase mb-2">Analyzing with AI...</h3>
                <p className="text-xs font-semibold text-[#aca1fd] tracking-widest uppercase">Contextualizing vulnerabilities</p>
                <div className="w-48 h-1 bg-white/10 rounded-full mt-6 overflow-hidden">
                  <div className="h-full bg-[#aca1fd] w-1/2 rounded-full animate-pulse"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Info Box */}
        <div className="glass rounded-3xl p-8 border border-white/5 bg-[hsl(226,12%,12%)] shadow-2xl flex flex-col items-center justify-center text-center">
             <h3 className="text-xs font-bold text-zinc-500 tracking-widest uppercase mb-8">Security Health Score</h3>
             
             {/* Circular Progress (Fake) */}
             <div className="relative w-40 h-40 flex items-center justify-center mb-8">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="none" />
                  <circle cx="80" cy="80" r="70" stroke={scoreColor} strokeWidth="12" fill="none" 
                          strokeDasharray="440" strokeDashoffset={440 - (440 * score) / 100} 
                          className="transition-all duration-1000 ease-out" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-5xl font-bold text-white tracking-tight leading-none">{loading ? "-" : score}</span>
                  <span className="text-xs font-bold text-zinc-500 mt-1">/ 100</span>
                </div>
             </div>

             <div className="mb-10 px-6 py-2 rounded-full bg-white/5 border border-white/5">
                <span className={`text-xs font-bold uppercase tracking-widest`} style={{ color: scoreColor }}>
                  {scoreStatus}
                </span>
             </div>

             <div className="w-full flex justify-between gap-4">
               <div className="flex-1 bg-white/5 rounded-xl p-4 border border-white/5 text-left">
                 <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Vulnerabilities</p>
                 <p className="text-2xl font-bold text-white">{result ? result.vulnerabilities.length.toString().padStart(2, '0') : "00"}</p>
               </div>
               <div className="flex-1 bg-white/5 rounded-xl p-4 border border-white/5 text-left">
                 <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Critical Paths</p>
                 <p className="text-2xl font-bold text-white">{result ? result.vulnerabilities.filter(v=>v.severity==='HIGH').length.toString().padStart(2,'0') : "00"}</p>
               </div>
             </div>
        </div>

      </div>

      {/* Results Section */}
      {result && (
        <div className="glass rounded-3xl p-8 border border-white/5 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 mt-12">
          <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight">Vulnerability Audit</h2>

            <div className="flex items-center gap-6">
              <a
                href={downloadReportUrl(result.scan_id)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-zinc-400 uppercase tracking-widest hover:text-white transition-colors"
              >
                Export PDF
              </a>
              <button className="text-xs font-bold text-zinc-400 uppercase tracking-widest hover:text-white transition-colors">
                Generate Fixes
              </button>
            </div>
          </div>

          <VulnerabilityTable vulnerabilities={result.vulnerabilities} />

          {/* Footer inside audit box */}
          <div className="flex items-center justify-between mt-12 pt-6 border-t border-white/5 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
            <p>© 2024 SECURECODEAI. ALL RIGHTS RESERVED.</p>
            <div className="flex gap-6">
              <span className="hover:text-zinc-400 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-zinc-400 cursor-pointer transition-colors">Terms of Service</span>
              <span className="hover:text-zinc-400 cursor-pointer transition-colors">Security Disclosure</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
