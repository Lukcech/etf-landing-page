const MONTHS_PER_YEAR = 12;

export interface InvestmentInput {
  /** Počáteční jednorázový vklad v Kč. */
  initialDeposit: number;
  /** Pravidelná měsíční úložka v Kč. */
  monthlyContribution: number;
  /** Délka investice v letech. Zaokrouhlí se na nejbližší měsíc. */
  years: number;
  /** Hrubý roční výnos v procentech, před poplatky. */
  grossAnnualReturnPercent: number;
  /** Roční poplatek z objemu (správa nebo TER) v procentech. */
  annualFeePercent: number;
  /**
   * Jednorázový vstupní poplatek z každého vkladu v procentech.
   * U ETF obvykle 0.
   */
  entryFeePercent?: number;
}

export interface InvestmentResult {
  /** Hodnota portfolia při hrubém výnosu, bez poplatků. */
  grossFutureValue: number;
  /** Hodnota portfolia po vstupním poplatku a průběžných poplatcích z objemu. */
  netFutureValue: number;
  /**
   * Rozdíl hrubé a čisté hodnoty.
   * Jde o poplatky, které klient reálně zaplatí, včetně výnosu, o který kvůli nim přijde.
   */
  totalFeesLost: number;
}

interface NormalizedInvestmentInput extends InvestmentInput {
  entryFeePercent: number;
}

function assertFiniteNumber(value: number, label: string): void {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${label} must be a finite number.`);
  }
}

function normalizeInput(input: InvestmentInput): NormalizedInvestmentInput {
  const entryFeePercent = input.entryFeePercent ?? 0;

  assertFiniteNumber(input.initialDeposit, "initialDeposit");
  assertFiniteNumber(input.monthlyContribution, "monthlyContribution");
  assertFiniteNumber(input.years, "years");
  assertFiniteNumber(input.grossAnnualReturnPercent, "grossAnnualReturnPercent");
  assertFiniteNumber(input.annualFeePercent, "annualFeePercent");
  assertFiniteNumber(entryFeePercent, "entryFeePercent");

  if (input.initialDeposit < 0 || input.monthlyContribution < 0) {
    throw new RangeError("Deposits must be zero or positive.");
  }

  if (input.years < 0) {
    throw new RangeError("years must be zero or positive.");
  }

  if (input.annualFeePercent < 0 || entryFeePercent < 0 || entryFeePercent > 100) {
    throw new RangeError("annualFeePercent must be zero or positive and entryFeePercent must be between 0 and 100.");
  }

  return { ...input, entryFeePercent };
}

/**
 * Efektivní měsíční sazba, která za 12 měsíců složí zadaný roční výnos.
 */
function monthlyGrowthRate(annualReturnPercent: number): number {
  return (1 + annualReturnPercent / 100) ** (1 / MONTHS_PER_YEAR) - 1;
}

/**
 * Hodnota portfolia na konci období.
 *
 * Vklady přicházejí na začátku měsíce: v prvním měsíci počáteční vklad
 * i první úložka, pak už jen měsíční úložka. Vklad se v daném měsíci
 * zhodnotí hrubým výnosem. Při zapnutých poplatcích se vstupní poplatek
 * strhne z každého vkladu před investováním a na konci měsíce se z objemu
 * strhne jedna dvanáctina ročního poplatku.
 */
function projectBalance(input: NormalizedInvestmentInput, applyFees: boolean): number {
  const months = Math.round(input.years * MONTHS_PER_YEAR);
  const growth = monthlyGrowthRate(input.grossAnnualReturnPercent);
  const entryFeeRate = applyFees ? input.entryFeePercent / 100 : 0;
  const monthlyFeeRate = applyFees ? input.annualFeePercent / 100 / MONTHS_PER_YEAR : 0;

  let balance = 0;

  for (let month = 0; month < months; month += 1) {
    const contribution =
      month === 0 ? input.initialDeposit + input.monthlyContribution : input.monthlyContribution;

    balance += contribution * (1 - entryFeeRate);
    balance *= 1 + growth;
    balance *= 1 - monthlyFeeRate;
  }

  return balance;
}

export function calculateInvestment(input: InvestmentInput): InvestmentResult {
  const normalized = normalizeInput(input);
  const grossFutureValue = projectBalance(normalized, false);
  const netFutureValue = projectBalance(normalized, true);

  return {
    grossFutureValue,
    netFutureValue,
    totalFeesLost: grossFutureValue - netFutureValue,
  };
}
