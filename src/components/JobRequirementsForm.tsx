import React, { useState } from 'react';
import { JobRequirements } from '../types';
import { Briefcase, Plus, X, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';

interface JobRequirementsFormProps {
  jobRequirements: JobRequirements;
  setJobRequirements: React.Dispatch<React.SetStateAction<JobRequirements>>;
  validationError: string | null;
}

export const JobRequirementsForm: React.FC<JobRequirementsFormProps> = ({
  jobRequirements,
  setJobRequirements,
  validationError,
}) => {
  const [mandatoryInput, setMandatoryInput] = useState('');
  const [preferredInput, setPreferredInput] = useState('');

  const addMandatorySkill = () => {
    const trimmed = mandatoryInput.trim();
    if (trimmed && !jobRequirements.mandatorySkills.includes(trimmed)) {
      setJobRequirements((prev) => ({
        ...prev,
        mandatorySkills: [...prev.mandatorySkills, trimmed],
      }));
      setMandatoryInput('');
    }
  };

  const removeMandatorySkill = (skill: string) => {
    setJobRequirements((prev) => ({
      ...prev,
      mandatorySkills: prev.mandatorySkills.filter((s) => s !== skill),
    }));
  };

  const addPreferredSkill = () => {
    const trimmed = preferredInput.trim();
    if (trimmed && !jobRequirements.preferredSkills.includes(trimmed)) {
      setJobRequirements((prev) => ({
        ...prev,
        preferredSkills: [...prev.preferredSkills, trimmed],
      }));
      setPreferredInput('');
    }
  };

  const removePreferredSkill = (skill: string) => {
    setJobRequirements((prev) => ({
      ...prev,
      preferredSkills: prev.preferredSkills.filter((s) => s !== skill),
    }));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Job Requirements & Criteria</h2>
            <p className="text-xs text-slate-500">
              Define the explicit competencies required for objective, evidence-based screening.
            </p>
          </div>
        </div>
      </div>

      {/* Validation Banner if present */}
      {validationError && (
        <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 flex items-start gap-2.5 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <span className="font-semibold">{validationError}</span>
        </div>
      )}

      {/* Job Title */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Job Title <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          value={jobRequirements.jobTitle}
          onChange={(e) =>
            setJobRequirements((prev) => ({ ...prev, jobTitle: e.target.value }))
          }
          placeholder="e.g. Junior Python Developer"
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        />
      </div>

      {/* Job Description */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Job Description <span className="text-rose-500">*</span>
        </label>
        <textarea
          rows={3}
          value={jobRequirements.jobDescription}
          onChange={(e) =>
            setJobRequirements((prev) => ({ ...prev, jobDescription: e.target.value }))
          }
          placeholder="Enter the complete job description, core responsibilities, and team expectations..."
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        />
      </div>

      {/* Mandatory Skills Chips */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Mandatory Skills (Required Evidence) <span className="text-rose-500">*</span>
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={mandatoryInput}
            onChange={(e) => setMandatoryInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addMandatorySkill();
              }
            }}
            placeholder="Add mandatory skill (e.g. Python, SQL, Git) & press Enter"
            className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          <button
            type="button"
            onClick={addMandatorySkill}
            className="px-3 py-1.5 bg-slate-800 text-white rounded-md text-xs font-medium hover:bg-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5 min-h-[30px] p-2 bg-slate-50 border border-slate-100 rounded-lg">
          {jobRequirements.mandatorySkills.length === 0 ? (
            <span className="text-xs text-slate-400 italic">No mandatory skills added yet.</span>
          ) : (
            jobRequirements.mandatorySkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeMandatorySkill(skill)}
                  className="hover:text-indigo-950 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      {/* Preferred Skills Chips */}
      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">
          Preferred Skills (Bonus Evidence)
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={preferredInput}
            onChange={(e) => setPreferredInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addPreferredSkill();
              }
            }}
            placeholder="Add preferred skill (e.g. Flask, REST API, Machine Learning) & press Enter"
            className="flex-1 px-3 py-1.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          <button
            type="button"
            onClick={addPreferredSkill}
            className="px-3 py-1.5 bg-slate-800 text-white rounded-md text-xs font-medium hover:bg-slate-900 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5 min-h-[30px] p-2 bg-slate-50 border border-slate-100 rounded-lg">
          {jobRequirements.preferredSkills.length === 0 ? (
            <span className="text-xs text-slate-400 italic">No preferred skills added.</span>
          ) : (
            jobRequirements.preferredSkills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-teal-100 text-teal-800 border border-teal-200"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removePreferredSkill(skill)}
                  className="hover:text-teal-950 p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          )}
        </div>
      </div>

      {/* Education & Experience Requirements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Education Requirements
          </label>
          <input
            type="text"
            value={jobRequirements.educationRequirements}
            onChange={(e) =>
              setJobRequirements((prev) => ({ ...prev, educationRequirements: e.target.value }))
            }
            placeholder="e.g. B.Tech Computer Science or related degree"
            className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Experience Requirements
          </label>
          <input
            type="text"
            value={jobRequirements.experienceRequirements}
            onChange={(e) =>
              setJobRequirements((prev) => ({ ...prev, experienceRequirements: e.target.value }))
            }
            placeholder="e.g. 0-2 years (internship or project experience)"
            className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Confirmation Checkbox */}
      <div className="pt-3 border-t border-slate-100">
        <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100/70 transition-colors cursor-pointer select-none">
          <input
            type="checkbox"
            checked={jobRequirements.confirmed}
            onChange={(e) =>
              setJobRequirements((prev) => ({ ...prev, confirmed: e.target.checked }))
            }
            className="mt-0.5 h-4 w-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
          />
          <div className="text-xs text-slate-800 leading-normal">
            <span className="font-semibold text-slate-900 block">
              “I confirm that the job requirements entered above are accurate and appropriate for this role.”
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              Verification ensures that evaluations are conducted solely against validated, job-relevant standards.
            </span>
          </div>
        </label>
      </div>
    </div>
  );
};
