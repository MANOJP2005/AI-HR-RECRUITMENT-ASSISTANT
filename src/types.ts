export interface JobRequirements {
  jobTitle: string;
  jobDescription: string;
  mandatorySkills: string[];
  preferredSkills: string[];
  educationRequirements: string;
  experienceRequirements: string;
  confirmed: boolean;
}

export interface ResumeSection {
  title: string;
  content: string;
}

export interface CandidateResume {
  id: string; // e.g., 'C001'
  displayId: string; // e.g., 'Candidate C001'
  fileName: string;
  rawText: string;
  sanitizedText: string; // Non-job-related sensitive info stripped
  detectedRedactedInfo: string[]; // List of sensitive items scrubbed
  sections: {
    education: string;
    skills: string;
    experience: string;
    projects: string;
    certifications: string;
  };
  uploadTimestamp: number;
}

export interface KnowledgeChunk {
  id: string;
  sourceType: 'policy' | 'resume';
  sourceTitle: string;
  section: string;
  content: string;
  relevanceScore?: number;
}

export interface CandidateEvaluationResult {
  candidateId: string;
  mandatoryCriteria: {
    total: number;
    evidenced: number;
    details: string;
  };
  preferredCriteria: {
    total: number;
    evidenced: number;
    details: string;
  };
  educationMatch: string;
  experienceMatch: string;
  matchedRequirements: string[];
  preferredEvidence: string[];
  missingEvidence: string[];
  supportingEvidence: Array<{
    quote: string;
    source: string;
  }>;
  uncertainties: string[];
  humanReviewNotes: string;
  summary: string;
  retrievedSources: KnowledgeChunk[];
}

export interface PromptExperimentResult {
  candidateId: string;
  baseline: {
    rawOutput: string;
    consistencyScore: string;
    missingEvidenceIdentified: boolean;
    durationMs: number;
    evaluation: Partial<CandidateEvaluationResult>;
  };
  structured: {
    rawOutput: string;
    consistencyScore: string;
    missingEvidenceIdentified: boolean;
    durationMs: number;
    evaluation: CandidateEvaluationResult;
  };
}

export interface TestCase {
  id: string;
  title: string;
  category: 'functional' | 'validation' | 'safety' | 'ethical';
  inputDescription: string;
  expectedBehavior: string;
  status: 'Passed' | 'Failed' | 'Needs Improvement';
  notes: string;
  autoExecutable?: boolean;
}
