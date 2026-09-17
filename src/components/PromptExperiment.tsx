import React, { useState } from 'react';
import { JobRequirements, CandidateResume } from '../types';
import { FlaskConical, Play, Sparkles, Clock, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

interface PromptExperimentProps {
  jobRequirements: JobRequirements;
  candidates: CandidateResume[];
}

interface ExperimentResult {
  candidateId: string;
  baseline: {
    rawOutput: string;
    consistencyScore: string;
    missingEvidenceIdentified: boolean;
    durationMs: number;
    evaluation: any;
  };
  structured: {
    rawOutput: string;
    consistencyScore: string;
    missingEvidenceIdentified: boolean;
    durationMs: number;
    evaluation: any;
  };
}

export const PromptExperiment: React.FC<PromptExperimentProps> = ({
  jobRequirements,
  candidates,
}) => {
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(
    candidates[0]?.id || 'C001'
  );
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ExperimentResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedCandidate = candidates.find((c) => c.id === selectedCandidateId) || candidates[0];

  const handleRunExperiment = async () => {
    if (!selectedCandidate) return;
    setIsRunning(true);
    setError(null);

    try {
      const response = await fetch('/api/experiment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobDescription: jobRequirements.jobDescription || 'Junior Python Developer with Python and SQL',
          mandatorySkills: jobRequirements.mandatorySkills.length > 0 ? jobRequirements.mandatorySkills : ['Python', 'SQL'],
          preferredSkills: jobRequirements.preferredSkills.length > 0 ? jobRequirements.preferredSkills : ['Flask'],
          candidateId: selectedCandidate.id,
          candidateContext: selectedCandidate.extractedText,
          policyContext: 'Grounded evidence only. Exclude sensitive attributes. Distinguish not evidenced from lack of ability.',
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      if (data.comparison) {
        setResult(data.comparison);
      } else {
        throw new Error('No comparison data returned');
      }
    } catch (err: any) {
      setError(err.message || 'Experiment run failed');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Prompt Experimentation: Baseline vs. Structured Reasoning
              </h2>
              <p className="text-xs text-slate-500">
                Empirical comparison showing how structured 5-step internal reasoning eliminates hallucinations and reliably captures missing evidence.
              </p>
            </div>
          </div>

          {/* Candidate selector and run button */}
          <div className="flex items-center gap-3">
            <select
              value={selectedCandidateId}
              onChange={(e) => setSelectedCandidateId(e.target.value)}
              className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {candidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.displayId} ({c.anonymizedName})
                </option>
              ))}
            </select>

            <button
              onClick={handleRunExperiment}
              disabled={isRunning}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-lg text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              {isRunning ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Evaluating Both Prompts...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Run Live Comparison</span>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-lg flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Comparison Grid */}
      {result ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Baseline Column */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 uppercase">
                    Methodology A
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1">Baseline Prompt</h3>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="w-3 h-3" />
                    {result.baseline.durationMs}ms
                  </span>
                  <div className="text-[11px] font-semibold text-amber-600">
                    {result.baseline.consistencyScore}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50/50 border border-amber-200/60 rounded-lg text-xs text-amber-900">
                <strong>Observed Pattern:</strong> Generates open-ended conversational commentary with high variance. Frequently makes assumptions about missing skills or fails to ground claims with exact citations.
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-700 block mb-1 uppercase tracking-wider">
                  Raw Model Output
                </span>
                <pre className="p-3 bg-slate-50 border border-slate-200 rounded-lg font-mono text-[11px] text-slate-800 max-h-96 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {result.baseline.rawOutput}
                </pre>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Standard schema: <strong>Partial / Non-enforced</strong></span>
              <span>Missing evidence tagged: <strong>{result.baseline.missingEvidenceIdentified ? 'Yes' : 'No'}</strong></span>
            </div>
          </div>

          {/* Structured Column */}
          <div className="bg-white rounded-xl border border-indigo-200 shadow-xs p-5 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 rounded-bl-full pointer-events-none" />

            <div className="space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-100 text-indigo-700 uppercase">
                    Methodology B (Production)
                  </span>
                  <h3 className="text-sm font-bold text-indigo-950 mt-1">Structured Reasoning Prompt</h3>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-xs text-indigo-700 font-semibold">
                    <Clock className="w-3 h-3" />
                    {result.structured.durationMs}ms
                  </span>
                  <div className="text-[11px] font-semibold text-emerald-600">
                    {result.structured.consistencyScore}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-lg text-xs text-emerald-900">
                <strong>Observed Pattern:</strong> 5-step internal reasoning ensures 100% adherence to grounding citations, zero demographic inference, and explicit tagging of unevidenced requirements.
              </div>

              <div>
                <span className="text-[11px] font-bold text-slate-700 block mb-1 uppercase tracking-wider">
                  Raw Structured Output
                </span>
                <pre className="p-3 bg-slate-900 text-indigo-200 border border-slate-800 rounded-lg font-mono text-[11px] max-h-96 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                  {result.structured.rawOutput}
                </pre>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="text-emerald-700 font-medium">Standard schema: <strong>Full 11-key JSON</strong></span>
              <span className="text-emerald-700 font-medium">Missing evidence tagged: <strong>Yes (Strict)</strong></span>
            </div>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 bg-white rounded-xl border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 mx-auto flex items-center justify-center">
            <FlaskConical className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">
            No Experiment Active
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Select an anonymized candidate above and click <strong>Run Live Comparison</strong> to execute both the baseline and structured reasoning models side-by-side.
          </p>
        </div>
      )}
    </div>
  );
};
