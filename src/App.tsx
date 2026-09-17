import React, { useState, useEffect } from 'react';
import { JobRequirements, CandidateResume, CandidateEvaluationResult } from './types';
import { DEMO_JOB_REQUIREMENTS, getDemoCandidates } from './lib/demoData';
import { retrieveGroundingContext } from './lib/rag';
import { Header, ActiveTab } from './components/Header';
import { JobRequirementsForm } from './components/JobRequirementsForm';
import { ResumeUpload } from './components/ResumeUpload';
import { ResponsibleAIPanel } from './components/ResponsibleAIPanel';
import { CandidateResults } from './components/CandidateResults';
import { PromptExperiment } from './components/PromptExperiment';
import { TestSuite } from './components/TestSuite';
import { Documentation } from './components/Documentation';
import { Sparkles, Play, Zap } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Job Requirements state
  const [jobRequirements, setJobRequirements] = useState<JobRequirements>({
    jobTitle: '',
    jobDescription: '',
    mandatorySkills: [],
    preferredSkills: [],
    educationRequirements: '',
    experienceRequirements: '',
    confirmed: false,
  });

  // Uploaded Candidates
  const [candidates, setCandidates] = useState<CandidateResume[]>([]);
  
  // UI & Processing States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingStep, setAnalyzingStep] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<CandidateEvaluationResult[] | null>(null);
  const [systemNotice, setSystemNotice] = useState<string | null>(null);

  // Initialize with demo data by default
  useEffect(() => {
    loadDemoData();
  }, []);

  const loadDemoData = () => {
    setJobRequirements({
      ...DEMO_JOB_REQUIREMENTS,
      confirmed: true,
    });
    const demoCandidates = getDemoCandidates();
    setCandidates(demoCandidates);
    setValidationError(null);
    setUploadError(null);
    setAnalysisResults(null);
  };

  const handleAnalyzeCandidates = async () => {
    setValidationError(null);
    setSystemNotice(null);

    // Validation checks
    if (!jobRequirements.jobDescription.trim()) {
      setValidationError('Please provide a job description.');
      return;
    }

    if (
      jobRequirements.mandatorySkills.length === 0 &&
      jobRequirements.preferredSkills.length === 0
    ) {
      setValidationError('Please provide at least one job-related evaluation criterion.');
      return;
    }

    if (candidates.length === 0) {
      setValidationError('Please upload at least one candidate resume.');
      return;
    }

    if (!jobRequirements.confirmed) {
      setValidationError('Please confirm the job requirements before continuing.');
      return;
    }

    setIsAnalyzing(true);
    const results: CandidateEvaluationResult[] = [];

    try {
      for (let i = 0; i < candidates.length; i++) {
        const candidate = candidates[i];
        setAnalyzingStep(`Retrieving grounded context & analyzing ${candidate.displayId} (${i + 1}/${candidates.length})...`);

        // RAG Grounding retrieval
        const { candidateContext, policyContext, retrievedSources } = retrieveGroundingContext(
          candidate,
          jobRequirements
        );

        const response = await fetch('/api/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jobDescription: jobRequirements.jobDescription,
            mandatorySkills: jobRequirements.mandatorySkills,
            preferredSkills: jobRequirements.preferredSkills,
            educationRequirements: jobRequirements.educationRequirements,
            experienceRequirements: jobRequirements.experienceRequirements,
            candidateId: candidate.id,
            candidateContext,
            policyContext,
            promptMode: 'structured',
          }),
        });

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || `Server responded with status ${response.status}`);
        }

        const resData = await response.json();
        if (resData.notice) {
          setSystemNotice(resData.notice);
        }

        results.push({
          ...resData.data,
          retrievedSources,
        });
      }

      setAnalysisResults(results);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Evaluation failed';
      setValidationError(`Evaluation encountered an error: ${msg}. Please review inputs and retry.`);
    } finally {
      setIsAnalyzing(false);
      setAnalyzingStep('');
    }
  };

  const handleRefineCriteria = () => {
    setAnalysisResults(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLoadDemoData={loadDemoData}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* System Notice banner if any */}
            {systemNotice && (
              <div className="rounded-lg bg-indigo-50 border border-indigo-200 p-3 flex items-center gap-2 text-xs text-indigo-900">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>{systemNotice}</span>
              </div>
            )}

            {/* If analysis is already performed, show results view */}
            {analysisResults ? (
              <CandidateResults
                results={analysisResults}
                onRefineCriteria={handleRefineCriteria}
              />
            ) : (
              /* Input & Upload Stage */
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left 2 Columns: Job Requirements & Resume Upload */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Job Requirements Card */}
                  <JobRequirementsForm
                    jobRequirements={jobRequirements}
                    setJobRequirements={setJobRequirements}
                    validationError={validationError}
                  />

                  {/* Candidate Resume Upload */}
                  <ResumeUpload
                    candidates={candidates}
                    setCandidates={setCandidates}
                    error={uploadError}
                    setError={setUploadError}
                  />

                  {/* Analyze Candidates CTA Button */}
                  <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Ready for Evidence-Based Screening
                      </h3>
                      <p className="text-xs text-slate-500">
                        {candidates.length} anonymized resume{candidates.length === 1 ? '' : 's'} staged for RAG-grounded Gemini evaluation against {jobRequirements.mandatorySkills.length} mandatory and {jobRequirements.preferredSkills.length} preferred criteria.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleAnalyzeCandidates}
                      disabled={isAnalyzing}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-indigo-600 disabled:bg-slate-400 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      {isAnalyzing ? (
                        <>
                          <Zap className="w-4 h-4 animate-spin text-amber-300" />
                          <span>{analyzingStep || 'Analyzing Candidates with Gemini...'}</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-white" />
                          <span>Analyze Candidates</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Right Column: Responsible AI & RAG Grounding Panel */}
                <div className="lg:col-span-1 space-y-6">
                  <ResponsibleAIPanel />

                  {/* Grounded RAG Summary info */}
                  <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-3 text-xs text-slate-600">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      RAG Grounding Pipeline
                    </h4>
                    <p className="leading-relaxed">
                      Resumes are partitioned into semantic sections (Skills, Projects, Education, Experience) and indexed with local vector similarity. The Gemini model is supplied exclusively with grounded context and the Responsible AI Policy.
                    </p>
                    <div className="p-2.5 bg-slate-50 rounded-md border border-slate-100 font-mono text-[11px] text-slate-700">
                      Context = Top-K Section Chunks + Approved Policy
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PROMPT EXPERIMENT */}
        {activeTab === 'experiment' && (
          <PromptExperiment
            jobRequirements={jobRequirements}
            candidates={candidates.length > 0 ? candidates : getDemoCandidates()}
          />
        )}

        {/* TAB 3: TEST SUITE */}
        {activeTab === 'test-suite' && <TestSuite />}

        {/* TAB 4: DOCUMENTATION */}
        {activeTab === 'documentation' && <Documentation />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>AI HR Recruitment Assistant &bull; Evidence-Based Candidate Screening</span>
          <span className="text-slate-400">
            Human Review Required &bull; No Automatic Hiring Decisions
          </span>
        </div>
      </footer>
    </div>
  );
}
