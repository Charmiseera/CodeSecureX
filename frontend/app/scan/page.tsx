import { ScanForm } from "@/components/ScanForm";
import { ShieldCheck } from "lucide-react";

export const metadata = {
  title: "AI Code Security Analyzer — SecureCodeAI",
  description: "Instantly audit your codebase for vulnerabilities using our proprietary LLM.",
};

export default function ScanPage() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <div className="flex items-start justify-between mb-10">
        <div className="max-w-xl">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-3">AI Code Security Analyzer</h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Instantly audit your codebase for vulnerabilities using our proprietary LLM trained on millions of security exploits. Secure your logic before it reaches production.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5">
          <ShieldCheck className="w-4 h-4 text-[#aca1fd]" />
          <span className="text-xs font-bold text-[#aca1fd] tracking-widest uppercase">Active Protection</span>
        </div>
      </div>
      
      <ScanForm />
    </div>
  );
}
