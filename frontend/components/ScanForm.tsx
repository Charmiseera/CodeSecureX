"use client";

import { useState } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { VulnerabilityTable } from "@/components/VulnerabilityTable";
import { Button } from "@/components/ui/button";
import { scanCode, generateReport, downloadReportUrl } from "@/services/api";
import type { Language, ScanResponse } from "@/services/api";
import {
  Loader2, ScanLine, ShieldAlert, FileDown, CheckCircle,
} from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  onScanComplete?: (result: ScanResponse) => void;
}

export function ScanForm({ onScanComplete }: Props) {
  const [code, setCode]           = useState("");
  const [language, setLanguage]   = useState<Language>("python");
  const [loading, setLoading]     = useState(false);
  const [result, setResult]       = useState<ScanResponse | null>(null);
  const [reportLoading, setReportLoading] = useState(false);
  const [reportId, setReportId]   = useState<number | null>(null);

  const handleScan = async () => {
    if (!code.trim()) {
      toast.error("Please enter some code first.");
      return;
    }
    setLoading(true);
    setResult(null);
    setReportId(null);
    try {
      const data = await scanCode(code, language);
      setResult(data);
      onScanComplete?.(data);
      toast.success(`Scan complete — ${data.vulnerabilities.length} issue(s) found.`);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ?? "Scan failed. Is the backend running?";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (!result) return;
    setReportLoading(true);
    try {
      const report = await generateReport(result.scan_id);
      setReportId(report.report_id);
      toast.success("PDF report generated!");
    } catch {
      toast.error("Failed to generate report.");
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Editor */}
      <div className="glass rounded-2xl p-5">
        <CodeEditor
          value={code}
          language={language}
          onChange={setCode}
          onLanguageChange={setLanguage}
        />
      </div>

      {/* Analyze button */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handleScan}
          disabled={loading}
          className="gap-2 bg-[hsl(210,100%,56%)] hover:bg-[hsl(210,100%,48%)] text-white font-semibold px-6 py-2.5 rounded-xl glow transition-all"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing…</>
          ) : (
            <><ScanLine className="w-4 h-4" /> Analyze Code</>
          )}
        </Button>

        {result && (
          <div className="flex items-center gap-2 text-sm text-[hsl(142,71%,45%)]">
            <CheckCircle className="w-4 h-4" />
            Scan #{result.scan_id} complete
          </div>
        )}
      </div>

      {/* Results */}
      {result && (
        <div className="glass rounded-2xl p-5 space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[hsl(0,72%,51%)]" />
              <h2 className="font-bold text-lg">Scan Results</h2>
            </div>

            <div className="flex items-center gap-2">
              {reportId ? (
                <a
                  href={downloadReportUrl(reportId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-[hsl(142,71%,45%)/0.15] hover:bg-[hsl(142,71%,45%)/0.25] text-[hsl(142,71%,45%)] border border-[hsl(142,71%,45%)/0.3] rounded-lg text-sm font-medium transition-colors"
                >
                  <FileDown className="w-4 h-4" /> Download PDF
                </a>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateReport}
                  disabled={reportLoading}
                  className="gap-1.5 border-[hsl(222,47%,14%)] hover:border-[hsl(210,100%,56%)] hover:text-[hsl(210,100%,56%)]"
                >
                  {reportLoading ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating…</>
                  ) : (
                    <><FileDown className="w-3.5 h-3.5" /> Generate PDF</>
                  )}
                </Button>
              )}
            </div>
          </div>

          <VulnerabilityTable vulnerabilities={result.vulnerabilities} />
        </div>
      )}
    </div>
  );
}
