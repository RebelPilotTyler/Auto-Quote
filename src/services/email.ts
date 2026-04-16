import { DocumentKind, JobCard } from '../types';

export const buildEmailDraft = (job: JobCard, kind: DocumentKind, body: string) => {
  const subjectPrefix = kind === 'quote' ? '3D Print Quote' : '3D Print Invoice';
  const subject = `${subjectPrefix}: ${job.request.projectTitle}`;
  const mailto = `mailto:${encodeURIComponent(job.request.clientEmail)}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;

  return { subject, mailto };
};
