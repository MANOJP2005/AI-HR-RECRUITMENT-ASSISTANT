import { CandidateResume, KnowledgeChunk, JobRequirements } from '../types';

// ==========================================
// APPROVED KNOWLEDGE BASE SOURCES
// ==========================================

export const APPROVED_EVALUATION_CRITERIA_POLICY: KnowledgeChunk[] = [
  {
    id: 'crit-mandatory-01',
    sourceType: 'policy',
    sourceTitle: 'Evaluation Criteria Standard',
    section: 'Mandatory Requirements',
    content:
      'Skills and capabilities marked as mandatory must be explicitly supported by factual resume evidence (e.g., in skills lists, work experience descriptions, academic coursework, or concrete project implementations). If evidence is absent, it must be marked as "Not evidenced in resume".',
  },
  {
    id: 'crit-edu-exp-02',
    sourceType: 'policy',
    sourceTitle: 'Evaluation Criteria Standard',
    section: 'Education & Experience Consideration',
    content:
      'Relevant degree coursework, software engineering internships, open-source repositories, and verified certifications may be evaluated as legitimate qualification indicators. Do not invent details not present in the text.',
  },
  {
    id: 'crit-pref-03',
    sourceType: 'policy',
    sourceTitle: 'Evaluation Criteria Standard',
    section: 'Preferred Requirements',
    content:
      'Preferred technologies and secondary domain experience provide additional signal but must never override missing mandatory competencies. Mark each preferred item as either evidenced with citation or not evidenced.',
  },
  {
    id: 'resp-safety-01',
    sourceType: 'policy',
    sourceTitle: 'Responsible AI Policy',
    section: 'Blind Evaluation & Protected Attributes',
    content:
      'Strict Blind Evaluation Guardrail: Do NOT use, infer, or consider any protected or sensitive personal attributes, including age, gender, race, religion, caste, ethnicity, marital/parental status, physical appearance/photos, disabilities, address/location, or political affiliation. Evaluate solely on documented, job-related competencies.',
  },
  {
    id: 'resp-hallucination-02',
    sourceType: 'policy',
    sourceTitle: 'Responsible AI Policy',
    section: 'Factual Grounding & Evidence Integrity',
    content:
      'Do not invent candidate qualifications. Missing evidence must be reported explicitly as "Not evidenced in resume". Lack of evidence must not automatically be interpreted as proof that the candidate lacks a skill, but rather as incomplete documentation.',
  },
  {
    id: 'resp-human-review-03',
    sourceType: 'policy',
    sourceTitle: 'Responsible AI Policy',
    section: 'Advisory Role & Human Oversight',
    content:
      'AI output is advisory decision support only. The system must NOT make an automatic hiring or rejection decision. A human recruiter must review the original application and take final employment responsibility.',
  },
];

// ==========================================
// BLIND EVALUATION SANITIZER GUARDRAIL
// ==========================================

export function applyBlindEvaluationGuardrail(rawText: string): {
  sanitizedText: string;
  redactedCategories: string[];
} {
  const redactedCategories: string[] = [];
  let text = rawText;

  // 1. Contact / Address sanitization (Emails, Phone numbers, Physical addresses)
  if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(text)) {
    text = text.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/gi, '[REDACTED_EMAIL]');
    redactedCategories.push('Personal Email Address');
  }

  if (/(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/.test(text)) {
    text = text.replace(/(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g, '[REDACTED_PHONE]');
    redactedCategories.push('Personal Phone Number');
  }

  // 2. Personal demographic cues (Gender, Pronouns, Marital status)
  const demographicRegex = /\b(gender|sex|marital status|marital|single|married|divorced|male|female|he\/him|she\/her|they\/them|pronouns?)\s*[:\-]?\s*([a-zA-Z/]+)?/gi;
  if (demographicRegex.test(text)) {
    text = text.replace(demographicRegex, '[REDACTED_DEMOGRAPHIC_INFO]');
    redactedCategories.push('Gender / Marital Status Attributes');
  }

  // 3. Age / Date of Birth
  const dobRegex = /\b(date of birth|dob|age)\s*[:\-]?\s*([0-9\/\-a-zA-Z\s]{2,15})/gi;
  if (dobRegex.test(text)) {
    text = text.replace(dobRegex, '[REDACTED_AGE_OR_DOB]');
    redactedCategories.push('Age / Date of Birth');
  }

  // 4. Religion, Caste, Ethnicity, Nationality
  const sensitiveHeritageRegex = /\b(religion|caste|ethnicity|nationality|race|caste\/category)\s*[:\-]?\s*([a-zA-Z\s]+)/gi;
  if (sensitiveHeritageRegex.test(text)) {
    text = text.replace(sensitiveHeritageRegex, '[REDACTED_HERITAGE_INFO]');
    redactedCategories.push('Religion / Caste / Nationality');
  }

  // 5. Photos / Disability info
  const disabilityPhotoRegex = /\b(disability|handicap|differently abled|photo|photograph|headshot)\s*[:\-]?\s*([a-zA-Z\s]+)?/gi;
  if (disabilityPhotoRegex.test(text)) {
    text = text.replace(disabilityPhotoRegex, '[REDACTED_PHOTO_OR_DISABILITY]');
    redactedCategories.push('Photograph / Disability Details');
  }

  // 6. Redact full name headers if present at the top
  const lines = text.split('\n');
  if (lines.length > 0 && /^[A-Z][a-z]+ [A-Z][a-z]+/.test(lines[0].trim())) {
    lines[0] = '[CANDIDATE_NAME_REDACTED]';
    text = lines.join('\n');
    redactedCategories.push('Candidate Identity Name');
  }

  return {
    sanitizedText: text,
    redactedCategories: Array.from(new Set(redactedCategories)),
  };
}

// ==========================================
// RESUME SECTION PARSER
// ==========================================

export function parseResumeSections(text: string): {
  education: string;
  skills: string;
  experience: string;
  projects: string;
  certifications: string;
} {
  const sections = {
    education: '',
    skills: '',
    experience: '',
    projects: '',
    certifications: '',
  };

  const lines = text.split('\n');
  let currentSection: keyof typeof sections | 'other' = 'other';

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const lower = trimmed.toLowerCase();

    // Section header detection
    if (
      lower.includes('education') ||
      lower.includes('academic background') ||
      lower.includes('qualification')
    ) {
      currentSection = 'education';
      continue;
    } else if (
      lower.includes('skill') ||
      lower.includes('technical skills') ||
      lower.includes('technologies') ||
      lower.includes('competencies')
    ) {
      currentSection = 'skills';
      continue;
    } else if (
      lower.includes('experience') ||
      lower.includes('work history') ||
      lower.includes('employment') ||
      lower.includes('internship')
    ) {
      currentSection = 'experience';
      continue;
    } else if (
      lower.includes('project') ||
      lower.includes('academic projects') ||
      lower.includes('key initiatives')
    ) {
      currentSection = 'projects';
      continue;
    } else if (
      lower.includes('certification') ||
      lower.includes('courses') ||
      lower.includes('licenses')
    ) {
      currentSection = 'certifications';
      continue;
    }

    if (currentSection !== 'other') {
      sections[currentSection] += (sections[currentSection] ? '\n' : '') + trimmed;
    }
  }

  // Fallback: If heuristic sectioning failed to capture text, search via regex or distribute
  if (!sections.skills) {
    const skillsMatch = text.match(/(?:skills|technologies|tools)[\s\S]*?(?=(?:education|experience|projects|certifications|$))/i);
    if (skillsMatch) sections.skills = skillsMatch[0].trim();
  }
  if (!sections.education) {
    const eduMatch = text.match(/(?:education|degree|b\.tech|bachelor|master)[\s\S]*?(?=(?:skills|experience|projects|certifications|$))/i);
    if (eduMatch) sections.education = eduMatch[0].trim();
  }
  if (!sections.projects) {
    const projMatch = text.match(/(?:projects|project experience)[\s\S]*?(?=(?:skills|education|experience|certifications|$))/i);
    if (projMatch) sections.projects = projMatch[0].trim();
  }
  if (!sections.experience) {
    const expMatch = text.match(/(?:experience|employment|work history)[\s\S]*?(?=(?:skills|education|projects|certifications|$))/i);
    if (expMatch) sections.experience = expMatch[0].trim();
  }

  return sections;
}

// ==========================================
// RAG RETRIEVAL & VECTOR SIMILARITY (TF-IDF / TOKEN COSINE)
// ==========================================

function tokenize(str: string): string[] {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1);
}

function calculateSimilarity(queryTokens: string[], docTokens: string[]): number {
  if (queryTokens.length === 0 || docTokens.length === 0) return 0;

  const queryFreq: Record<string, number> = {};
  for (const t of queryTokens) queryFreq[t] = (queryFreq[t] || 0) + 1;

  const docFreq: Record<string, number> = {};
  for (const t of docTokens) docFreq[t] = (docFreq[t] || 0) + 1;

  let dotProduct = 0;
  for (const t in queryFreq) {
    if (docFreq[t]) {
      dotProduct += queryFreq[t] * docFreq[t];
    }
  }

  const queryNorm = Math.sqrt(
    Object.values(queryFreq).reduce((acc, val) => acc + val * val, 0)
  );
  const docNorm = Math.sqrt(
    Object.values(docFreq).reduce((acc, val) => acc + val * val, 0)
  );

  return dotProduct / (queryNorm * docNorm || 1);
}

export function chunkCandidateResume(candidate: CandidateResume): KnowledgeChunk[] {
  const chunks: KnowledgeChunk[] = [];
  const sec = candidate.sections;

  if (sec.skills) {
    chunks.push({
      id: `${candidate.id}-skills`,
      sourceType: 'resume',
      sourceTitle: `${candidate.displayId} Resume`,
      section: 'Skills section',
      content: sec.skills,
    });
  }

  if (sec.projects) {
    // Break projects into individual project chunks if multi-line
    const lines = sec.projects.split('\n').filter((l) => l.trim().length > 10);
    if (lines.length > 1) {
      lines.forEach((line, idx) => {
        chunks.push({
          id: `${candidate.id}-project-${idx + 1}`,
          sourceType: 'resume',
          sourceTitle: `${candidate.displayId} Resume`,
          section: `Project section (Item ${idx + 1})`,
          content: line,
        });
      });
    } else {
      chunks.push({
        id: `${candidate.id}-projects`,
        sourceType: 'resume',
        sourceTitle: `${candidate.displayId} Resume`,
        section: 'Project section',
        content: sec.projects,
      });
    }
  }

  if (sec.experience) {
    chunks.push({
      id: `${candidate.id}-experience`,
      sourceType: 'resume',
      sourceTitle: `${candidate.displayId} Resume`,
      section: 'Experience section',
      content: sec.experience,
    });
  }

  if (sec.education) {
    chunks.push({
      id: `${candidate.id}-education`,
      sourceType: 'resume',
      sourceTitle: `${candidate.displayId} Resume`,
      section: 'Education section',
      content: sec.education,
    });
  }

  if (sec.certifications) {
    chunks.push({
      id: `${candidate.id}-certifications`,
      sourceType: 'resume',
      sourceTitle: `${candidate.displayId} Resume`,
      section: 'Certifications section',
      content: sec.certifications,
    });
  }

  // Also include whole sanitized text chunk if chunks are too few
  if (chunks.length === 0 && candidate.sanitizedText.trim()) {
    chunks.push({
      id: `${candidate.id}-general`,
      sourceType: 'resume',
      sourceTitle: `${candidate.displayId} Resume`,
      section: 'General Content',
      content: candidate.sanitizedText.slice(0, 1500),
    });
  }

  return chunks;
}

export function retrieveGroundingContext(
  candidate: CandidateResume,
  jobReq: JobRequirements,
  topKResumeChunks = 4
): {
  candidateContext: string;
  policyContext: string;
  retrievedSources: KnowledgeChunk[];
} {
  const queryText = [
    jobReq.jobTitle,
    jobReq.jobDescription,
    ...jobReq.mandatorySkills,
    ...jobReq.preferredSkills,
    jobReq.educationRequirements,
    jobReq.experienceRequirements,
  ].join(' ');

  const queryTokens = tokenize(queryText);

  // 1. Score Candidate Resume Chunks
  const resumeChunks = chunkCandidateResume(candidate);
  const scoredResumeChunks = resumeChunks.map((chunk) => {
    const docTokens = tokenize(chunk.content + ' ' + chunk.section);
    const score = calculateSimilarity(queryTokens, docTokens);
    return { ...chunk, relevanceScore: score };
  });

  // Always keep sections with high relevance or all if small
  scoredResumeChunks.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
  const selectedResumeChunks = scoredResumeChunks.slice(0, topKResumeChunks);

  // Ensure skills, projects, and education are present if available
  for (const chunk of scoredResumeChunks) {
    if (
      !selectedResumeChunks.find((c) => c.id === chunk.id) &&
      (chunk.section.includes('Skills') || chunk.section.includes('Education'))
    ) {
      selectedResumeChunks.push(chunk);
    }
  }

  // 2. Format Candidate Context with explicit source tags
  const candidateContext = selectedResumeChunks
    .map(
      (c) =>
        `[SOURCE: ${c.sourceTitle} — ${c.section}]\n${c.content}\n`
    )
    .join('\n');

  // 3. Format Policy Context
  const policyContext = APPROVED_EVALUATION_CRITERIA_POLICY.map(
    (p) => `[POLICY: ${p.sourceTitle} — ${p.section}]\n${p.content}\n`
  ).join('\n');

  const allRetrieved = [
    ...selectedResumeChunks,
    ...APPROVED_EVALUATION_CRITERIA_POLICY,
  ];

  return {
    candidateContext,
    policyContext,
    retrievedSources: allRetrieved,
  };
}
