import React from 'react';
import { ShieldCheck, UserCheck, Sparkles, FlaskConical, CheckSquare, BookOpen, LayoutDashboard } from 'lucide-react';

export type ActiveTab = 'dashboard' | 'experiment' | 'test-suite' | 'documentation';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onLoadDemoData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onLoadDemoData,
}) => {
  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Brand & Subtitle */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  AI HR Recruitment Assistant
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                  <UserCheck className="w-3.5 h-3.5" />
                  Human Review Required
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Evidence-Based Candidate Screening & Blind Evaluation
              </p>
            </div>
          </div>

          {/* Actions & Tab Navigation */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onLoadDemoData}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors cursor-pointer"
              title="Load standard Junior Python Developer role with 3 fictional resumes"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Load Sample Job & Resumes
            </button>

            <nav className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-white text-slate-900 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('experiment')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  activeTab === 'experiment'
                    ? 'bg-white text-indigo-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FlaskConical className="w-3.5 h-3.5" />
                Prompt Experiment
              </button>
              <button
                onClick={() => setActiveTab('test-suite')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  activeTab === 'test-suite'
                    ? 'bg-white text-emerald-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                Test Results
              </button>
              <button
                onClick={() => setActiveTab('documentation')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                  activeTab === 'documentation'
                    ? 'bg-white text-purple-700 font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Documentation
              </button>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};
