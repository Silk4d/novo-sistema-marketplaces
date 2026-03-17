import { PlatformSettings, Product } from './types'

export function calcTargetPrice(
  cost: number,
  settings: PlatformSettings,
  taxRate: number,
  targetMargin: number,
): number {
  const denominator = 1 - settings.feeRate - taxRate - targetMargin
  if (denominator <= 0) return 0
  return (cost + settings.shippingCost + settings.fixedFee) / denominator
}

export function calcBreakeven(cost: number, settings: PlatformSettings, taxRate: number): number {
  return calcTargetPrice(cost, settings, taxRate, 0)
}

export function calcMarginPercent(
  price: number,
  cost: number,
  settings: PlatformSettings,
  taxRate: number,
): number {
  if (price <= 0) return 0
  const net =
    price -
    cost -
    settings.shippingCost -
    settings.fixedFee -
    price * settings.feeRate -
    price * taxRate
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
) {
  const combinedCost = p1.cost + p2.cost
  const targetP1 = calcTargetPrice(p1.cost, settings, taxRate, targetMargin)
  const targetP2 = calcTargetPrice(p2.cost, settings, taxRate, targetMargin)
  const sumIndividualPrices = targetP1 + targetP2

  // Assume kit is offered at a 10% discount compared to buying separately
  const kitPrice = sumIndividualPrices * 0.9

  const kitMarginPercent = calcMarginPercent(kitPrice, combinedCost, settings, taxRate)

  return {
    combinedCost,
    sumIndividualPrices,
    kitPrice,
    kitMarginPercent,
    marginIncreasePercent: kitMarginPercent - targetMargin,
  }
}
