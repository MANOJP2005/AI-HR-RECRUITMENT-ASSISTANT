import { CandidateResume, JobRequirements } from '../types';
import { applyBlindEvaluationGuardrail, parseResumeSections } from './rag';

export const DEMO_JOB_REQUIREMENTS: JobRequirements = {
  jobTitle: 'Junior Python Developer',
  jobDescription:
    'Looking for a junior developer with strong Python and SQL skills and basic understanding of Git and Data Structures. Experience with Flask, REST APIs and Machine Learning is preferred.',
  mandatorySkills: ['Python', 'SQL', 'Git', 'Data Structures'],
  preferredSkills: ['Flask', 'REST API', 'Machine Learning'],
  educationRequirements: 'B.Tech in Computer Science, Information Science, or related discipline.',
  experienceRequirements: '0–2 years (internship or entry-level software project experience).',
  confirmed: false,
};

const rawDemoResumes = [
  {
    id: 'C001',
    displayId: 'Candidate C001',
    fileName: 'candidate_c001_anonymized.pdf',
    rawText: `Alex Doe (Confidential)
Email: alex.candidate1@demo-example.com | Phone: +1 555-019-2831
Location: San Francisco, CA | Age: 23 | Gender: Female

EDUCATION:
B.Tech Computer Science (GPA: 3.8/4.0)

SKILLS:
Python, SQL, Git, Data Structures, Flask

PROJECTS:
- Developed a Flask REST API for an e-commerce application handling product catalogs and order transactions.
- Created a machine learning prediction system using Python and scikit-learn for customer classification.

EXPERIENCE:
Software Engineering Intern at CloudTech Labs. Assisted in building backend API microservices using Python and Git version control.

CERTIFICATIONS:
Python Programmer Certificate (2025)
`,
  },
  {
    id: 'C002',
    displayId: 'Candidate C002',
    fileName: 'candidate_c002_anonymized.pdf',
    rawText: `Taylor Smith
Email: taylor.c002@demo-email.org | Phone: +1 555-482-9102
Personal Address: 404 Elm St, Seattle WA | Marital Status: Single | Religion: Declared Not Applicable

EDUCATION:
B.Tech Computer Science

SKILLS:
Java, Python, MySQL

PROJECTS:
- Developed a Java-based library management system with desktop GUI and database records.
- Completed Python programming coursework and academic mini-projects for data algorithms.

EXPERIENCE:
Computer Lab Assistant. Provided tutoring in Java syntax, SQL basics, and debugging algorithms.

CERTIFICATIONS:
Java Standard Edition Associate
`,
  },
  {
    id: 'C003',
    displayId: 'Candidate C003',
    fileName: 'candidate_c003_anonymized.pdf',
    rawText: `Jordan Lee
Contact: jordan.c003@testresume.io | Phone: +1 555-901-3847
Ethnicity: Non-Disclosed | Personal Demographics: Confidential

EDUCATION:
B.Tech Information Science

SKILLS:
Python, SQL, Git, Data Structures, Django

PROJECTS:
- Developed an inventory management system using Django and MySQL with automated stock alerts and relational schemas.
- Built command-line data processing tools in Python utilizing tree and graph data structures.

EXPERIENCE:
Undergraduate Developer. Collaborated with 3 peers via Git repositories to deliver campus portal services.

CERTIFICATIONS:
Relational Database Design with SQL
`,
  },
];

export function getDemoCandidates(): CandidateResume[] {
  return rawDemoResumes.map((raw) => {
    const { sanitizedText, redactedCategories } = applyBlindEvaluationGuardrail(raw.rawText);
    const sections = parseResumeSections(sanitizedText);

    return {
      id: raw.id,
      displayId: raw.displayId,
      fileName: raw.fileName,
      rawText: raw.rawText,
      sanitizedText,
      detectedRedactedInfo: redactedCategories,
      sections,
      uploadTimestamp: Date.now(),
    };
  });
}
