import type {
  CalculationResult,
  GoldInputs,
  InstrumentCalculatorService,
} from '../../types/calculator';

export class GoldCalculator implements InstrumentCalculatorService<GoldInputs> {
  public instrumentType = 'gold' as const;

  public getDefaults(balance: number = 10000): GoldInputs {
    return {
      instrumentType: 'gold',
      symbol: 'XAU/USD',
      accountCurrency: 'USD',
      accountBalance: balance,
      direction: 'BUY',
      leverage: 100,
      lotSize: 1.0,
      entryPrice: 2750.00,
      stopLossPrice: 2740.00,
      takeProfitPrice: 2770.00,
    };
  }

  public validate(inputs: GoldInputs): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!inputs.entryPrice || inputs.entryPrice <= 0) errors.entryPrice = 'Valid gold price required.';
    if (!inputs.lotSize || inputs.lotSize <= 0) errors.lotSize = 'Valid lot size required.';
    return errors;
  }

  public calculate(inputs: GoldInputs): CalculationResult {
    // 1 Standard Lot Gold = 100 Troy Ounces
    const ounces = inputs.lotSize * 100;
    const positionValue = ounces * inputs.entryPrice;
    const requiredMargin = inputs.leverage > 0 ? positionValue / inputs.leverage : positionValue;
    const freeMarginRemaining = inputs.accountBalance - requiredMargin;

    let potentialLoss: number | null = null;
    let potentialProfit: number | null = null;

    if (inputs.stopLossPrice) {
      const diff = inputs.direction === 'BUY'
        ? inputs.entryPrice - inputs.stopLossPrice
        : inputs.stopLossPrice - inputs.entryPrice;
      potentialLoss = Math.max(0, diff * ounces);
    }

    if (inputs.takeProfitPrice) {
      const diff = inputs.direction === 'BUY'
        ? inputs.takeProfitPrice - inputs.entryPrice
        : inputs.entryPrice - inputs.takeProfitPrice;
      potentialProfit = Math.max(0, diff * ounces);
    }

    const riskRewardRatio =
      potentialProfit !== null && potentialLoss !== null && potentialLoss > 0
        ? potentialProfit / potentialLoss
        : null;

    return {
      instrumentType: 'gold',
      direction: inputs.direction,
      positionSizeUnits: ounces,
      positionValue,
      requiredMargin,
      freeMarginRemaining,
      potentialProfit,
      potentialLoss,
      riskAmount: potentialLoss,
      riskPercent: potentialLoss !== null ? (potentialLoss / inputs.accountBalance) * 100 : null,
      rewardPercent: potentialProfit !== null ? (potentialProfit / inputs.accountBalance) * 100 : null,
      riskRewardRatio,
      pipValue: ounces * 0.01,
      stopLossDistancePips: null,
      takeProfitDistancePips: null,
    };
  }
}

export const goldCalculator = new GoldCalculator();
