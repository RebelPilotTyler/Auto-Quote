import { DocumentKind, JobCard } from '../types';
import { buildDocumentHtml } from '../logic/documentTemplates';

export const createDocument = (job: JobCard, kind: DocumentKind) => {
  return {
    html: buildDocumentHtml(job, kind),
    filename: `${kind}-${job.request.projectTitle || job.id}.html`
  };
};

export const downloadHtmlDocument = (html: string, filename: string) => {
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const openPrintPreview = (html: string) => {
  const win = window.open('', '_blank', 'width=900,height=1000');
  if (!win) {
    return false;
  }

  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  win.print();
  return true;
};
