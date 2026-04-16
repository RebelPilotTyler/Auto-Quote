import { PricingSettings, PrintRequest, QuoteBreakdown } from '../types';

const round = (value: number) => Math.round(value * 100) / 100;

export const calculateQuote = (
  request: PrintRequest,
  settings: PricingSettings
): QuoteBreakdown => {
  const material = settings.materials.find((option) => option.id === request.materialId);
  const materialCost = (material?.costPerGram ?? 0) * request.estimatedGrams;
  const machineCost = settings.machineHourlyRate * settings.estimatedPrintHours;
  const laborCost = settings.baseLaborFee;
  const multicolorCost = Math.max(request.colorCount - 1, 0) * settings.multicolorFeePerExtraColor;
  const designCost = request.designHours * settings.designHourlyRate;
  const postProcessingCost = request.postProcessingFee;
  const shippingCost =
    request.shippingCost + request.shippingCost * (settings.defaultShippingMarkupPercent / 100);

  const subtotalRaw =
    materialCost +
    machineCost +
    laborCost +
    multicolorCost +
    designCost +
    postProcessingCost +
    shippingCost;

  const subtotal = Math.max(subtotalRaw, settings.minimumOrderAmount);
  const marginAmount = subtotal * (settings.serviceMarginPercent / 100);
  const taxableAmount = subtotal + marginAmount;
  const taxAmount = taxableAmount * (settings.taxPercent / 100);
  const total = taxableAmount + taxAmount;

  return {
    materialCost: round(materialCost),
    machineCost: round(machineCost),
    laborCost: round(laborCost),
    multicolorCost: round(multicolorCost),
    designCost: round(designCost),
    postProcessingCost: round(postProcessingCost),
    shippingCost: round(shippingCost),
    subtotal: round(subtotal),
    marginAmount: round(marginAmount),
    taxableAmount: round(taxableAmount),
    taxAmount: round(taxAmount),
    total: round(total)
  };
};
