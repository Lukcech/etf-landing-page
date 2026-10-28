/**
 * Statická data pro srovnání bankovního fondu a ETF.
 * Procenta jsou v procentních bodech (8 znamená 8 %).
 */

export interface BankFundData {
  name: string;
  /** Jednorázový vstupní poplatek z vkladu. */
  entryFeePercent: number;
  /** Roční poplatek za správu, strhávaný z objemu. */
  annualManagementFeePercent: number;
  /** Očekávaný hrubý roční výnos před poplatky. */
  expectedGrossAnnualReturnPercent: number;
}

export interface EtfData {
  ticker: string;
  name: string;
  /** Burza, na které se ETF skutečně obchoduje. */
  exchange: string;
  /** Total expense ratio, roční poplatek z objemu. */
  terPercent: number;
  /** Historický průměrný roční výnos před poplatky. */
  historicalAnnualReturnPercent: number;
  /** Stručné vysvětlení pro laika. */
  description: string;
  /** Zdroj čísel včetně roku. */
  source: string;
}

export const bankFund: BankFundData = {
  name: "Běžný český podílový fond",
  entryFeePercent: 2.5,
  annualManagementFeePercent: 1.8,
  expectedGrossAnnualReturnPercent: 8,
};

export const etfs: readonly EtfData[] = [
  {
    ticker: "VOO",
    name: "Vanguard S&P 500 ETF",
    exchange: "NYSE",
    terPercent: 0.03,
    historicalAnnualReturnPercent: 12.5,
    description: "500 největších amerických firem, například Apple či Microsoft.",
    source: "Vanguard / FactSet, 2026",
  },
  {
    ticker: "QQQ",
    name: "Invesco QQQ Trust",
    exchange: "Nasdaq",
    terPercent: 0.2,
    historicalAnnualReturnPercent: 17.8,
    description:
      "100 největších nefinančních firem z burzy Nasdaq. Většinu tvoří technologie, například Apple, Microsoft nebo Nvidia.",
    source: "Invesco / Nasdaq, 2026",
  },
  {
    ticker: "VT",
    name: "Vanguard Total World Stock ETF",
    exchange: "NYSE",
    terPercent: 0.07,
    historicalAnnualReturnPercent: 9.2,
    description:
      "Tisíce firem z celého světa v jednom fondu, od amerických gigantů po společnosti v Evropě, Asii i na rozvíjejících se trzích.",
    source: "Vanguard / FTSE Russell, 2026",
  },
];
