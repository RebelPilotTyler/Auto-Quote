export type MaterialOption = {
  id: string;
  label: string;
  costPerGram: number;
};

export type PrintRequest = {
  clientName: string;
  clientEmail: string;
  projectTitle: string;
  materialId: string;
  colorCount: number;
  estimatedGrams: number;
  designHours: number;
  shippingCost: number;
  postProcessingFee: number;
  stlLinks: string;
  notes: string;
  files: string[];
};

export type PricingSettings = {
  materials: MaterialOption[];
  machineHourlyRate: number;
  estimatedPrintHours: number;
  baseLaborFee: number;
  multicolorFeePerExtraColor: number;
  designHourlyRate: number;
  serviceMarginPercent: number;
  defaultShippingMarkupPercent: number;
  taxPercent: number;
  minimumOrderAmount: number;
};

export type QuoteBreakdown = {
  materialCost: number;
  machineCost: number;
  laborCost: number;
  multicolorCost: number;
  designCost: number;
  postProcessingCost: number;
  shippingCost: number;
  subtotal: number;
  marginAmount: number;
  taxableAmount: number;
  taxAmount: number;
  total: number;
};

export type JobStatus = 'pending' | 'approved' | 'quoted' | 'invoiced';

export type JobCard = {
  id: string;
  request: PrintRequest;
  breakdown: QuoteBreakdown;
  createdAt: string;
  status: JobStatus;
  quoteMessage?: string;
  invoiceMessage?: string;
};

export type FinanceRecord = {
  jobId: string;
  title: string;
  total: number;
  materialGrams: number;
  createdAt: string;
};
