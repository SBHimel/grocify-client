import { ProductUnitConversion } from "@/types";

const STANDARD_WEIGHT = new Set(["kg", "g"]);
const STANDARD_VOLUME = new Set(["litre", "ml"]);
const STANDARD_COUNTABLE = new Set(["piece", "pcs", "pc"]);

export interface UnitValidationResult {
  isValid: boolean;
  message?: string;
}

/**
 * Validates whether a product has a valid, defined unit conversion between
 * its selling unit and stock/base unit before order submission.
 */
export function validateProductUnitConversion(
  productName: string,
  unit?: ProductUnitConversion
): UnitValidationResult {
  if (!unit || !unit.baseUnit || !unit.sellUnit) {
    return {
      isValid: false,
      message: `"${productName}" is missing product unit configuration.`,
    };
  }

  const { baseUnit, sellUnit, multiplier } = unit;

  // 1. Identical units
  if (sellUnit === baseUnit) {
    return { isValid: true };
  }

  // 2. Countable discrete synonyms (piece <-> pcs)
  if (STANDARD_COUNTABLE.has(sellUnit) && STANDARD_COUNTABLE.has(baseUnit)) {
    return { isValid: true };
  }

  // 3. Physical weight (kg <-> g)
  if (STANDARD_WEIGHT.has(sellUnit) && STANDARD_WEIGHT.has(baseUnit)) {
    return { isValid: true };
  }

  // 4. Physical volume (litre <-> ml)
  if (STANDARD_VOLUME.has(sellUnit) && STANDARD_VOLUME.has(baseUnit)) {
    return { isValid: true };
  }

  // 5. Explicitly configured conversion multiplier (> 0)
  if (typeof multiplier === "number" && multiplier > 0 && !isNaN(multiplier)) {
    return { isValid: true };
  }

  return {
    isValid: false,
    message: `"${productName}" has an undefined conversion between selling unit '${sellUnit}' and stock unit '${baseUnit}'. No valid conversion multiplier configured.`,
  };
}
