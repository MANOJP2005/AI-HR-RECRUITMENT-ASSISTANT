import React from 'react';
import { ShieldCheck, AlertTriangle, EyeOff, FileText, Ban, UserCheck, Scale, Info } from 'lucide-react';

export const ResponsibleAIPanel: React.FC = () => {
  const controls = [
    {
      icon: EyeOff,
      title: 'Blind evaluation enabled',
      desc: 'Candidate names, gender, age, and contact details are masked prior to model evaluation.',
    },
    {
      icon: Ban,
      title: 'Sensitive attributes excluded',
      desc: 'Religion, caste, ethnicity, photos, marital status, and political affiliations are stripped.',
    },
    {
      icon: FileText,
      title: 'Evidence-based evaluation',
      desc: 'All ratings are strictly tied to grounded text chunks retrieved from the uploaded resume.',
    },
    {
      icon: Scale,
      title: 'No invented qualifications',
      desc: 'The model is instructed never to hallucinate or assume unstated competencies.',
    },
    {
      icon: AlertTriangle,
      title: 'Missing evidence explicitly reported',
      desc: 'Absence of evidence is reported as "Not evidenced" rather than negative capability.',
    },
    {
      icon: UserCheck,
      title: 'Human review required',
      desc: 'Every candidate card mandates independent human verification before hiring decisions.',
    },
    {
      icon: ShieldCheck,
      title: 'AI does not make final hiring decisions',
      desc: 'Provides transparent decision support without opaque hire/reject automations.',
    },
  ];

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">Responsible AI Controls</h2>
        </div>
        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          Enforced
        </span>
      </div>

      {/* Control Checklist */}
      <div className="space-y-2.5">
        {controls.map((ctrl, index) => {
          const Icon = ctrl.icon;
          return (
            <div key={index} className="flex items-start gap-2.5 text-xs">
              <span className="mt-0.5 text-emerald-600 font-bold shrink-0">✓</span>
              <div>
                <p className="font-semibold text-slate-800">{ctrl.title}</p>
                <p className="text-slate-500 text-[11px] leading-tight mt-0.5">{ctrl.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Warning Banner */}
      <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 flex items-start gap-2.5">
        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-900 leading-relaxed">
          <p className="font-semibold mb-0.5">Human Verification Notice</p>
          AI-generated assessments may contain errors. Verify candidate information using the original resume before making employment decisions.
        </div>
      </div>

      {/* Grounding Source Info */}
      <div className="pt-2 border-t border-slate-100 flex items-start gap-2 text-[11px] text-slate-500">
        <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
        <span>
          Knowledge grounding uses local vector retrieval with verified Evaluation Policy and Responsible AI standards.
        </span>
      </div>
    </div>
  );
};
