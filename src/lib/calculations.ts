import { PlatformSettings, Product, PlatformId } from './types'

export function calcTargetPrice(
  cost: number,
  settings: PlatformSettings,
  taxRate: number,
  targetMargin: number,
  platformId?: PlatformId,
  shippingOverride?: number,
): number {
  const shipping = shippingOverride !== undefined ? shippingOverride : settings.shippingCost
  const denominator = 1 - settings.feeRate - taxRate - targetMargin
  if (denominator <= 0) return 0

  if (platformId === 'meli_classic' || platformId === 'meli_premium') {
    const priceWithFixedFee = (cost + settings.fixedFee) / denominator

    if (priceWithFixedFee < 79 && shippingOverride === undefined) {
      return priceWithFixedFee
    } else {
      return (cost + shipping) / denominator
    }
  }

  return (cost + shipping + settings.fixedFee) / denominator
}

export function calcBreakeven(
  cost: number,
  settings: PlatformSettings,
  taxRate: number,
  platformId?: PlatformId,
  shippingOverride?: number,
): number {
  return calcTargetPrice(cost, settings, taxRate, 0, platformId, shippingOverride)
}

export function calcMarginPercent(
  price: number,
  cost: number,
  settings: PlatformSettings,
  taxRate: number,
  platformId?: PlatformId,
  shippingOverride?: number,
): number {
  if (price <= 0) return 0

  let currentFixedFee = settings.fixedFee
  let currentShipping = shippingOverride !== undefined ? shippingOverride : settings.shippingCost

  if (platformId === 'meli_classic' || platformId === 'meli_premium') {
    if (price < 79 && shippingOverride === undefined) {
      currentShipping = 0
    } else if (shippingOverride === undefined) {
      currentFixedFee = 0
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
