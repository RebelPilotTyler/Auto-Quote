import { JobCard } from '../types';

const money = (value: number) => `$${value.toFixed(2)}`;

export const buildQuoteMessage = (job: JobCard) => {
  const { request, breakdown } = job;
  return `Hi ${request.clientName},\n\nThanks for your 3D printing request for "${request.projectTitle}".\n\nQuote total: ${money(
    breakdown.total
  )}\nIncludes material, machine time, labor, design/post-processing, and shipping.\n\nIf you'd like to proceed, reply with approval and your preferred payment method.\n\n- Auto Quote`;
};

export const buildInvoiceMessage = (job: JobCard) => {
  const { request, breakdown } = job;
  return `Invoice for ${request.projectTitle}\nClient: ${request.clientName}\nEmail: ${request.clientEmail}\n\nAmount due: ${money(
    breakdown.total
  )}\n\nPlease remit payment within 7 days.\nThank you for choosing our 3D printing services.`;
};
