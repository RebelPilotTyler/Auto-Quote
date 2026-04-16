import { PricingSettings } from '../types';

export const defaultSettings: PricingSettings = {
  materials: [
    { id: 'pla-basic', label: 'PLA (Basic)', costPerGram: 0.035 },
    { id: 'pla-premium', label: 'PLA (Premium)', costPerGram: 0.06 },
    { id: 'petg', label: 'PETG', costPerGram: 0.055 },
    { id: 'abs', label: 'ABS', costPerGram: 0.065 },
    { id: 'resin', label: 'Resin', costPerGram: 0.12 }
  ],
  machineHourlyRate: 2.5,
  estimatedPrintHours: 4,
  baseLaborFee: 7,
  multicolorFeePerExtraColor: 4,
  designHourlyRate: 28,
  serviceMarginPercent: 35,
  defaultShippingMarkupPercent: 10,
  taxPercent: 0,
  minimumOrderAmount: 18
};
