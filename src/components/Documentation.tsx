import React from 'react';
import { BookOpen, ShieldCheck, Cpu, Code2, Scale, Brain } from 'lucide-react';

export const Documentation: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Overview Banner */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Project Documentation & Architecture</h2>
            <p className="text-xs text-slate-500">
              AI HR Recruitment Assistant — Technical, RAG & Responsible AI Specification
            </p>
          </div>
        </div>
      </div>

      {/* Main Sections */}
      <div className="space-y-6 text-xs text-slate-700 leading-relaxed">
        {/* 1. Problem */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">1. Problem Statement</h3>
          </div>
          <p>
            Resume screening is traditionally time-intensive, subjective, and prone to unconscious demographic bias. Recruiters often face hundreds of applicant resumes per vacancy and struggle to consistently evaluate candidates against concrete, grounded evidence. Conventional automated keyword matching either generates high false-negative rates or fails to interpret relevant projects, coursework, and practical experience in context.
          </p>
          <p>
            Crucially, high-stakes decisions like employment must never be delegated to black-box automated algorithms. Recruiters require structured, transparent, and evidence-grounded decision support that surfaces exact resume excerpts while preserving human accountability.
          </p>
        </section>

        {/* 2. Generative AI & RAG Solution */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900">2. Generative AI & RAG Grounding Solution</h3>
          </div>
          <p>
            The <strong>AI HR Recruitment Assistant</strong> combines local Retrieval-Augmented Generation (RAG), pre-inference blind evaluation sanitizers, and Google Gemini’s advanced reasoning to deliver an objective candidate screening dashboard.
          </p>
          <p>
            Rather than calculating an opaque "hire probability" or making autonomous decisions, the system extracts factual resume evidence, matches it against mandatory and preferred job criteria, explicitly identifies missing evidence, and presents an auditable candidate comparison for human recruiter review.
          </p>
        </section>

        {/* 3. Model & Platform */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">3. Model & Platform Architecture</h3>
          </div>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>Platform:</strong> Google AI Studio Build environment with Node.js/Express backend server and Vite + React frontend.
            </li>
            <li>
              <strong>AI Model:</strong> <code>gemini-3.8-flash</code> (with automated resilience to <code>gemini-3.1-flash-lite</code>) via the modern <code>@google/genai</code> TypeScript SDK.
            </li>
            <li>
              <strong>Security Protocol:</strong> Server-side API proxy (<code>/api/evaluate</code>) strictly isolates the <code>GEMINI_API_KEY</code> from client exposure.
            </li>
            <li>
              <strong>PDF Extraction:</strong> Browser-compatible text extraction (<code>pdfjs-dist</code>) enabling client-side anonymization before transmission.
            </li>
            <li>
              <strong>Reliability Guardrail:</strong> Grounded fallback engine ensures uninterrupted testing and zero crashes under any network condition.
            </li>
          </ul>
        </section>

        {/* 4. Prompting Technique */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">4. Prompting Technique: Structured Internal Reasoning</h3>
          </div>
          <p>
            The system employs a <strong>Structured Reasoning</strong> prompting strategy inspired by Chain-of-Thought (CoT) methodologies. The prompt instructs the model to sequentially execute five internal analytical steps:
          </p>
          <ol className="list-decimal pl-5 space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-100 font-mono text-[11px] text-slate-800">
            <li>Internally assess mandatory requirements against grounded resume evidence.</li>
            <li>Internally assess preferred requirements against grounded resume evidence.</li>
            <li>Identify concrete quotations and source section citations supporting each match.</li>
            <li>Explicitly flag missing evidence as "Not evidenced in resume".</li>
            <li>Isolate uncertainties where documentation is incomplete or ambiguous.</li>
          </ol>
          <p>
            <strong>Critical Guardrail:</strong> The prompt explicitly prohibits leaking intermediate hidden reasoning tokens to the recruiter. It mandates returning solely concise conclusions, factual quotations, and the strict JSON response schema.
          </p>
        </section>

        {/* 5. Responsible AI Guardrails */}
        <section className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-bold text-slate-900">5. Responsible AI Guardrails & Human Review Mandate</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <strong className="text-slate-900 block mb-1">Blind Evaluation Sanitization</strong>
              Candidate names, contact numbers, email addresses, age, gender, marital status, religion, caste, nationality, and photos are scrubbed prior to model context generation.
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <strong className="text-slate-900 block mb-1">Missing Evidence Distinction</strong>
              Absence of documented evidence is reported strictly as "Not evidenced in resume" rather than misinterpreting silence as candidate incompetence.
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <strong className="text-slate-900 block mb-1">No Hallucinated Qualifications</strong>
              Approved policy chunks constrain the model to factual quotes present in the uploaded resume.
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <strong className="text-slate-900 block mb-1">Human Recruiter Decision Authority</strong>
              The system prohibits automated hire/reject actions. Every card displays "Human Review Required" with interactive manual verification logging.
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
