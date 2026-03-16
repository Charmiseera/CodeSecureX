"use client";

import { downloadReportUrl } from "@/services/api";
import { FileDown, FileText } from "lucide-react";

interface Props {
  reportId: string;
  scanId: string;
  createdAt?: string;
}

export function ReportViewer({ reportId, scanId, createdAt }: Props) {
  return (
    <div className="glass rounded-2xl p-5 flex items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-[hsl(210,100%,56%)/0.1] border border-[hsl(210,100%,56%)/0.3] rounded-xl flex items-center justify-center">
          <FileText className="w-5 h-5 text-[hsl(210,100%,56%)]" />
        </div>
        <div>
          <p className="font-semibold text-sm">Security Report</p>
          <p className="text-xs text-[hsl(215,16%,55%)]">
            {createdAt ? new Date(createdAt).toLocaleString() : "Ready for download"}
          </p>
        </div>
      </div>

      <a
        href={downloadReportUrl(reportId)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-4 py-2 bg-[hsl(210,100%,56%)] hover:bg-[hsl(210,100%,48%)] text-white rounded-xl text-sm font-medium transition-colors glow"
      >
        <FileDown className="w-4 h-4" />
        Download PDF
      </a>
    </div>
  );
}
