import { DocumentKind, JobCard } from '../types';

const money = (value: number) => `$${value.toFixed(2)}`;

const css = `
  <style>
    body { font-family: Arial, sans-serif; margin: 32px; color: #1f2a44; }
    h1 { margin-bottom: 2px; }
    p { margin: 4px 0; }
    .meta { color: #55617f; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { border: 1px solid #d2d9ea; padding: 8px; text-align: left; }
    th { background: #eff3ff; }
    .totals { margin-top: 16px; text-align: right; }
    .totals p { margin: 2px 0; }
    .grand { font-size: 18px; font-weight: bold; }
  </style>
`;

export const buildDocumentHtml = (job: JobCard, kind: DocumentKind) => {
  const title = kind === 'quote' ? 'Quote' : 'Invoice';

  return `
  <html>
    <head>
      <meta charset="utf-8" />
      <title>${title} - ${job.request.projectTitle}</title>
      ${css}
    </head>
    <body>
      <h1>${title}</h1>
      <p class="meta">Generated ${new Date().toLocaleString()}</p>
      <p><strong>Client:</strong> ${job.request.clientName}</p>
      <p><strong>Email:</strong> ${job.request.clientEmail}</p>
      <p><strong>Project:</strong> ${job.request.projectTitle}</p>
      <table>
        <thead>
          <tr><th>Line Item</th><th>Amount</th></tr>
        </thead>
        <tbody>
          <tr><td>Material</td><td>${money(job.breakdown.materialCost)}</td></tr>
          <tr><td>Machine Time</td><td>${money(job.breakdown.machineCost)}</td></tr>
          <tr><td>Labor</td><td>${money(job.breakdown.laborCost)}</td></tr>
          <tr><td>Multicolor</td><td>${money(job.breakdown.multicolorCost)}</td></tr>
          <tr><td>Design</td><td>${money(job.breakdown.designCost)}</td></tr>
          <tr><td>Post Processing</td><td>${money(job.breakdown.postProcessingCost)}</td></tr>
          <tr><td>Shipping</td><td>${money(job.breakdown.shippingCost)}</td></tr>
        </tbody>
      </table>
      <div class="totals">
        <p>Subtotal: ${money(job.breakdown.subtotal)}</p>
        <p>Margin: ${money(job.breakdown.marginAmount)}</p>
        <p>Tax: ${money(job.breakdown.taxAmount)}</p>
        <p class="grand">Total: ${money(job.breakdown.total)}</p>
      </div>
      <p>${kind === 'quote' ? 'This quote is valid for 14 days.' : 'Please remit payment within 7 days.'}</p>
    </body>
  </html>
  `;
};
