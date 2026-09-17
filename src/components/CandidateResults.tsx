import React, { useState } from 'react';
import { CandidateEvaluationResult } from '../types';
import {
  UserCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  FileText,
  Layers,
  GraduationCap,
  Briefcase,
  Quote,
  Scale,
  ArrowUpDown,
  CheckSquare,
  MessageSquare,
} from 'lucide-react';

interface CandidateResultsProps {
  results: CandidateEvaluationResult[];
  onRefineCriteria: () => void;
}

export const CandidateResults: React.FC<CandidateResultsProps> = ({
  results,
  onRefineCriteria,
}) => {
  const [recruiterNotes, setRecruiterNotes] = useState<Record<string, string>>({});
  const [recruiterVerified, setRecruiterVerified] = useState<Record<string, boolean>>({});

  // Sort candidates deterministically by mandatory evidence ratio, then preferred
  const sortedCandidates = [...results].sort((a, b) => {
    const aMandatoryRatio =
      a.mandatoryCriteria.total > 0
        ? a.mandatoryCriteria.evidenced / a.mandatoryCriteria.total
        : 0;
    const bMandatoryRatio =
      b.mandatoryCriteria.total > 0
        ? b.mandatoryCriteria.evidenced / b.mandatoryCriteria.total
        : 0;

    if (bMandatoryRatio !== aMandatoryRatio) {
      return bMandatoryRatio - aMandatoryRatio;
    }

    const aPrefRatio =
      a.preferredCriteria.total > 0
        ? a.preferredCriteria.evidenced / a.preferredCriteria.total
        : 0;
    const bPrefRatio =
      b.preferredCriteria.total > 0
        ? b.preferredCriteria.evidenced / b.preferredCriteria.total
        : 0;

    return bPrefRatio - aPrefRatio;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner with Transparent Ordering Label */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-900 text-white">
              <Scale className="w-3.5 h-3.5 text-indigo-400" />
              Evidence-based comparison for human review
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
              <UserCheck className="w-3.5 h-3.5" />
              Human Review Required
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Ranked purely by verified requirement evidence coverage. No automated hiring or rejection is performed.
          </p>
        </div>

        <button
          type="button"
          onClick={onRefineCriteria}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer self-start md:self-auto"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          Refine Criteria & Re-run
        </button>
      </div>

      {/* Mandatory Human Review System Notice (Section 14) */}
      <div className="rounded-xl bg-slate-900 text-slate-100 p-4 shadow-xs flex items-start gap-3 text-xs leading-relaxed">
        <UserCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-amber-300 uppercase tracking-wider text-[11px] mb-0.5">
            Recruiter Oversight Policy
          </p>
          “This assessment is decision support only. A human recruiter must review the original application and make the final employment decision.”
          Evaluations omit sensitive demographic attributes and reflect grounded resume documentation.
        </div>
      </div>

      {/* Candidate Cards Grid */}
      <div className="grid grid-cols-1 gap-6">
        {sortedCandidates.map((candidate, index) => {
          const mPercent = Math.round(
            (candidate.mandatoryCriteria.evidenced / (candidate.mandatoryCriteria.total || 1)) * 100
          );
          const pPercent = Math.round(
            (candidate.preferredCriteria.evidenced / (candidate.preferredCriteria.total || 1)) * 100
          );

          const isVerified = recruiterVerified[candidate.candidateId] || false;

          return (
            <div
              key={candidate.candidateId}
              className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition-all overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-5 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-900 text-white font-mono font-bold flex items-center justify-center text-sm shadow-xs">
                    {candidate.candidateId}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">
                        Candidate {candidate.candidateId}
                      </h3>
                      <span className="text-[11px] px-2 py-0.5 rounded-md font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        Rank #{index + 1} by evidence
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {candidate.summary}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200">
                    <UserCheck className="w-3.5 h-3.5 text-amber-700" />
                    Human Review Required
                  </span>
                </div>
              </div>

              {/* Evidence Coverage Metrics Bar */}
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mandatory Coverage */}
                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-800">Mandatory Criteria Evidenced</span>
                    <span className="font-mono font-bold text-indigo-700">
                      {candidate.mandatoryCriteria.evidenced} / {candidate.mandatoryCriteria.total} ({mPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all rounded-full ${
                        mPercent === 100 ? 'bg-emerald-500' : mPercent >= 50 ? 'bg-indigo-600' : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(mPercent, 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5">{candidate.mandatoryCriteria.details}</p>
                </div>

                {/* Preferred Coverage */}
                <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-2xs">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-slate-800">Preferred Criteria Evidenced</span>
                    <span className="font-mono font-bold text-teal-700">
                      {candidate.preferredCriteria.evidenced} / {candidate.preferredCriteria.total} ({pPercent}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-teal-500 transition-all rounded-full"
                      style={{ width: `${Math.min(pPercent, 100)}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1.5">{candidate.preferredCriteria.details}</p>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="p-5 space-y-5 text-xs">
                {/* Matched vs Not Evidenced Breakdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Matched Mandatory */}
                  <div className="p-3.5 bg-emerald-50/40 border border-emerald-200 rounded-lg">
                    <h4 className="font-bold text-emerald-900 text-xs flex items-center gap-1.5 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Matched Requirements
                    </h4>
                    {candidate.matchedRequirements.length === 0 ? (
                      <p className="text-[11px] text-slate-500 italic">None evidenced</p>
                    ) : (
                      <ul className="space-y-1">
                        {candidate.matchedRequirements.map((req, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-slate-800 font-medium">
                            <span className="text-emerald-600 font-bold">✓</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Preferred Evidence */}
                  <div className="p-3.5 bg-teal-50/40 border border-teal-200 rounded-lg">
                    <h4 className="font-bold text-teal-900 text-xs flex items-center gap-1.5 mb-2">
                      <Layers className="w-4 h-4 text-teal-600" />
                      Preferred Evidence
                    </h4>
                    {candidate.preferredEvidence.length === 0 ? (
                      <p className="text-[11px] text-slate-500 italic">No preferred items evidenced</p>
                    ) : (
                      <ul className="space-y-1">
                        {candidate.preferredEvidence.map((pref, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-slate-800 font-medium">
                            <span className="text-teal-600 font-bold">✓</span>
                            <span>{pref}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Not Evidenced */}
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <h4 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 mb-2">
                      <AlertCircle className="w-4 h-4 text-slate-500" />
                      Not Evidenced in Resume
                    </h4>
                    {candidate.missingEvidence.length === 0 ? (
                      <p className="text-[11px] text-emerald-700 font-medium">
                        All specified requirements evidenced.
                      </p>
                    ) : (
                      <ul className="space-y-1">
                        {candidate.missingEvidence.map((missing, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-slate-600">
                            <span className="text-slate-400 font-bold">&bull;</span>
                            <span>{missing}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Education & Experience Alignment */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg border border-slate-200 bg-white">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1 text-[11px] uppercase tracking-wider">
                      <GraduationCap className="w-4 h-4 text-indigo-600" />
                      Education Alignment
                    </span>
                    <p className="text-slate-700 text-xs leading-relaxed">{candidate.educationMatch}</p>
                  </div>
                  <div className="p-3 rounded-lg border border-slate-200 bg-white">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-1 text-[11px] uppercase tracking-wider">
                      <Briefcase className="w-4 h-4 text-indigo-600" />
                      Experience Alignment
                    </span>
                    <p className="text-slate-700 text-xs leading-relaxed">{candidate.experienceMatch}</p>
                  </div>
                </div>

                {/* Grounded Supporting Evidence with Citations */}
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                    <Quote className="w-4 h-4 text-slate-600" />
                    Grounded Supporting Evidence & Source Citations
                  </h4>
                  <div className="space-y-2">
                    {candidate.supportingEvidence.map((item, i) => (
                      <div key={i} className="p-2.5 bg-white rounded-md border border-slate-200/80">
                        <p className="italic text-slate-800 font-serif text-xs mb-1">
                          “{item.quote}”
                        </p>
                        <p className="text-[11px] font-mono font-semibold text-indigo-700 flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          Source: {item.source}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Uncertainties & Human Review Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 bg-amber-50/50 border border-amber-200 rounded-lg">
                    <h4 className="font-bold text-amber-900 text-xs flex items-center gap-1.5 mb-1.5">
                      <HelpCircle className="w-4 h-4 text-amber-700" />
                      Documented Uncertainties
                    </h4>
                    <ul className="space-y-1">
                      {candidate.uncertainties.map((unc, i) => (
                        <li key={i} className="text-amber-950 text-[11px] leading-tight">
                          &bull; {unc}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 bg-indigo-50/50 border border-indigo-200 rounded-lg">
                    <h4 className="font-bold text-indigo-900 text-xs flex items-center gap-1.5 mb-1.5">
                      <UserCheck className="w-4 h-4 text-indigo-700" />
                      Human Review Notes
                    </h4>
                    <p className="text-indigo-950 text-[11px] leading-relaxed">
                      {candidate.humanReviewNotes}
                    </p>
                  </div>
                </div>

                {/* Recruiter Manual Verification Panel */}
                <div className="pt-3 border-t border-slate-200">
                  <div className="p-3.5 bg-slate-100 rounded-lg border border-slate-200 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="flex items-center gap-2 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={isVerified}
                          onChange={(e) =>
                            setRecruiterVerified((prev) => ({
                              ...prev,
                              [candidate.candidateId]: e.target.checked,
                            }))
                          }
                          className="h-4 w-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                        />
                        <span className="text-xs font-bold text-slate-800">
                          Recruiter Manual Resume Verification Completed
                        </span>
                      </label>
                      <span className="text-[11px] text-slate-500">
                        {isVerified ? '✓ Verified by human reviewer' : 'Pending human confirmation'}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={recruiterNotes[candidate.candidateId] || ''}
                        onChange={(e) =>
                          setRecruiterNotes((prev) => ({
                            ...prev,
                            [candidate.candidateId]: e.target.value,
                          }))
                        }
                        placeholder="Add human recruiter notes (e.g., schedule technical screen, verify internship dates)..."
                        className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
