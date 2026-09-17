import React, { useState, useRef } from 'react';
import { CandidateResume } from '../types';
import { extractTextFromPDFFile } from '../lib/pdfParser';
import { applyBlindEvaluationGuardrail, parseResumeSections } from '../lib/rag';
import { UploadCloud, FileText, Trash2, Eye, EyeOff, ShieldCheck, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';

interface ResumeUploadProps {
  candidates: CandidateResume[];
  setCandidates: React.Dispatch<React.SetStateAction<CandidateResume[]>>;
  error: string | null;
  setError: (err: string | null) => void;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({
  candidates,
  setCandidates,
  error,
  setError,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [expandedCandidateId, setExpandedCandidateId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFiles = async (files: FileList | File[]) => {
    setIsProcessing(true);
    setError(null);

    const newCandidates: CandidateResume[] = [];
    const currentCount = candidates.length;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const rawText = await extractTextFromPDFFile(file);
        const { sanitizedText, redactedCategories } = applyBlindEvaluationGuardrail(rawText);
        const sections = parseResumeSections(sanitizedText);

        const candidateNum = String(currentCount + i + 1).padStart(3, '0');
        const id = `C${candidateNum}`;
        const displayId = `Candidate C${candidateNum}`;

        newCandidates.push({
          id,
          displayId,
          fileName: file.name,
          rawText,
          sanitizedText,
          detectedRedactedInfo: redactedCategories,
          sections,
          uploadTimestamp: Date.now(),
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : `Failed to process ${file.name}`;
        setError(msg);
      }
    }

    if (newCandidates.length > 0) {
      setCandidates((prev) => [...prev, ...newCandidates]);
    }
    setIsProcessing(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(e.dataTransfer.files);
    }
  };

  const removeCandidate = (id: string) => {
    setCandidates((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      // Re-index candidate numbers cleanly
      return filtered.map((c, index) => {
        const num = String(index + 1).padStart(3, '0');
        return {
          ...c,
          id: `C${num}`,
          displayId: `Candidate C${num}`,
        };
      });
    });
  };

  const clearAllCandidates = () => {
    setCandidates([]);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
        <div>
          <h2 className="text-base font-bold text-slate-900">Candidate Resume Upload</h2>
          <p className="text-xs text-slate-500">
            Upload candidate resumes (PDF, TXT). Each candidate is automatically anonymized with a unique ID.
          </p>
        </div>
        {candidates.length > 0 && (
          <button
            type="button"
            onClick={clearAllCandidates}
            className="text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer"
          >
            Clear All ({candidates.length})
          </button>
        )}
      </div>

      {/* Blind Evaluation Notice (Section 7) */}
      <div className="rounded-lg bg-indigo-50/80 border border-indigo-200/80 p-3 flex items-start gap-2.5">
        <EyeOff className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
        <div className="text-xs text-indigo-950 leading-relaxed">
          <span className="font-semibold block text-indigo-900">Blind Evaluation Guardrail Active</span>
          “Blind evaluation enabled: non-job-related sensitive attributes are excluded from candidate assessment.” Personal names, age, gender, religion, caste, ethnicity, marital status, and photos are automatically stripped before evaluation.
        </div>
      </div>

      {/* Drag and Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-indigo-500 bg-indigo-50/50'
            : 'border-slate-200 hover:border-indigo-400 bg-slate-50/60'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              processFiles(e.target.files);
            }
          }}
          multiple
          accept=".pdf,.txt,.md"
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-800">
              {isProcessing ? 'Processing & anonymizing resumes...' : 'Click to browse or drag and drop resumes here'}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Supports multiple PDF or text files. Anonymity preserved automatically.
            </p>
          </div>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 flex items-center gap-2 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Uploaded Candidates List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Anonymized Candidates Queue ({candidates.length})
          </h3>
          <span className="text-[11px] text-slate-400">
            Personal information hidden from evaluation stage
          </span>
        </div>

        {candidates.length === 0 ? (
          <div className="p-6 text-center border border-slate-100 rounded-lg bg-slate-50/50 text-xs text-slate-400">
            No candidate resumes uploaded yet. Upload PDFs or click "Load Demo Data" above.
          </div>
        ) : (
          <div className="space-y-2">
            {candidates.map((candidate) => {
              const isExpanded = expandedCandidateId === candidate.id;
              return (
                <div
                  key={candidate.id}
                  className="border border-slate-200 rounded-lg overflow-hidden transition-all bg-white"
                >
                  <div className="p-3 flex items-center justify-between gap-3 bg-slate-50/50 hover:bg-slate-50">
                    <div className="flex items-center gap-3">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-slate-900 text-white font-mono">
                        {candidate.displayId}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-slate-500" />
                            {candidate.fileName}
                          </p>
                          {candidate.detectedRedactedInfo.length > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                              <ShieldCheck className="w-3 h-3" />
                              {candidate.detectedRedactedInfo.length} sensitive attribute(s) scrubbed
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Extracted {candidate.sanitizedText.length} characters &bull; Sections detected:{' '}
                          {Object.entries(candidate.sections)
                            .filter(([_, v]) => Boolean(v))
                            .map(([k]) => k)
                            .join(', ') || 'General'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setExpandedCandidateId(isExpanded ? null : candidate.id)
                        }
                        className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-200/60 text-xs font-medium flex items-center gap-1 cursor-pointer"
                        title="View extracted job-relevant sections"
                      >
                        {isExpanded ? (
                          <>
                            Hide Sections <ChevronUp className="w-3.5 h-3.5" />
                          </>
                        ) : (
                          <>
                            View Sections <ChevronDown className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeCandidate(candidate.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 cursor-pointer"
                        title="Remove resume"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded parsed sections preview */}
                  {isExpanded && (
                    <div className="p-4 border-t border-slate-200 bg-white space-y-3 text-xs">
                      {candidate.detectedRedactedInfo.length > 0 && (
                        <div className="p-2.5 bg-amber-50/80 border border-amber-200 rounded-md text-[11px] text-amber-900">
                          <span className="font-bold">Scrubbed Protected Demographics: </span>
                          {candidate.detectedRedactedInfo.join(', ')} (Excluded from RAG context).
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700">
                        <div className="p-2.5 bg-slate-50 rounded-md border border-slate-100">
                          <span className="font-bold text-slate-900 block mb-1 text-[11px] uppercase tracking-wider">
                            Skills Section
                          </span>
                          <p className="whitespace-pre-wrap font-mono text-[11px] text-slate-800">
                            {candidate.sections.skills || 'Not specifically partitioned (found in body)'}
                          </p>
                        </div>
                        <div className="p-2.5 bg-slate-50 rounded-md border border-slate-100">
                          <span className="font-bold text-slate-900 block mb-1 text-[11px] uppercase tracking-wider">
                            Education Section
                          </span>
                          <p className="whitespace-pre-wrap font-mono text-[11px] text-slate-800">
                            {candidate.sections.education || 'Not specifically partitioned'}
                          </p>
                        </div>
                        <div className="p-2.5 bg-slate-50 rounded-md border border-slate-100">
                          <span className="font-bold text-slate-900 block mb-1 text-[11px] uppercase tracking-wider">
                            Projects Section
                          </span>
                          <p className="whitespace-pre-wrap font-mono text-[11px] text-slate-800">
                            {candidate.sections.projects || 'Not specifically partitioned'}
                          </p>
                        </div>
                        <div className="p-2.5 bg-slate-50 rounded-md border border-slate-100">
                          <span className="font-bold text-slate-900 block mb-1 text-[11px] uppercase tracking-wider">
                            Experience Section
                          </span>
                          <p className="whitespace-pre-wrap font-mono text-[11px] text-slate-800">
                            {candidate.sections.experience || 'Not specifically partitioned'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
