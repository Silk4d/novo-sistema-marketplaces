import { PlatformSettings, Product, PlatformId } from './types'

export function calcTargetPrice(
  cost: number,
  settings: PlatformSettings,
  taxRate: number,
  targetMargin: number,
  platformId?: PlatformId,
): number {
  const denominator = 1 - settings.feeRate - taxRate - targetMargin
  if (denominator <= 0) return 0

  if (platformId === 'meli_classic' || platformId === 'meli_premium') {
    const priceWithFixedFee = (cost + settings.fixedFee) / denominator

    if (priceWithFixedFee < 79) {
      return priceWithFixedFee
    } else {
      return (cost + settings.shippingCost) / denominator
    }
  }

  return (cost + settings.shippingCost + settings.fixedFee) / denominator
}

export function calcBreakeven(
  cost: number,
  settings: PlatformSettings,
  taxRate: number,
  platformId?: PlatformId,
): number {
  return calcTargetPrice(cost, settings, taxRate, 0, platformId)
}

export function calcMarginPercent(
  price: number,
  cost: number,
  settings: PlatformSettings,
  taxRate: number,
  platformId?: PlatformId,
): number {
  if (price <= 0) return 0

  let currentFixedFee = settings.fixedFee
  let currentShipping = settings.shippingCost

  if (platformId === 'meli_classic' || platformId === 'meli_premium') {
    if (price < 79) {
      currentShipping = 0 // Below R$79 uses only the fixed fee
    } else {
      currentFixedFee = 0 // Above R$79 uses flat shipping cost
    }
  }

  const net =
    price - cost - currentShipping - currentFixedFee - price * settings.feeRate - price * taxRate
  return net / price
}

export function calcDaysOfCover(stock: number, avgDailySales: number): number {
  if (avgDailySales <= 0) return 999
  return stock / avgDailySales
}

export function calculateKitMetrics(
  p1: Product,
  p2: Product,
  settings: PlatformSettings,
  taxRate: number,
  targetMargin: number,
  platformId?: PlatformId,
) {
  const combinedCost = p1.cost + p2.cost
  const targetP1 = calcTargetPrice(p1.cost, settings, taxRate, targetMargin, platformId)
  const targetP2 = calcTargetPrice(p2.cost, settings, taxRate, targetMargin, platformId)
  const sumIndividualPrices = targetP1 + targetP2

  // Assume kit is offered at a 10% discount compared to buying separately
  const kitPrice = sumIndividualPrices * 0.9

  const kitMarginPercent = calcMarginPercent(kitPrice, combinedCost, settings, taxRate, platformId)

  return {
    combinedCost,
    sumIndividualPrices,
    kitPrice,
    kitMarginPercent,
    marginIncreasePercent: kitMarginPercent - targetMargin,
  }
}
