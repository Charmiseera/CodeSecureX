import { ScanForm } from "@/components/ScanForm";
import { ScanLine } from "lucide-react";

export const metadata = {
  title: "Scan Code — SecureCodeAI",
  description: "Paste or upload code to detect security vulnerabilities with AI.",
};

export default function ScanPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ScanLine className="w-5 h-5 text-[hsl(210,100%,56%)]" />
          <h1 className="text-2xl font-bold">Code Security Scanner</h1>
        </div>
        <p className="text-[hsl(215,16%,55%)] text-sm">
          Paste your code below and click <strong>Analyze Code</strong>. Results appear in seconds.
        </p>
      </div>
      <ScanForm />
    </div>
  );
}
