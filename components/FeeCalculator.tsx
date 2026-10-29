"use client";

import { useState, type CSSProperties } from "react";
import { bankFund, etfs } from "@/data/etf-data";
import { calculateInvestment } from "@/lib/calculations";
import { formatCzk } from "@/lib/format";

export default function FeeCalculator() {
  const [initialDeposit, setInitialDeposit] = useState(50_000);
  const [monthlyContribution, setMonthlyContribution] = useState(5_000);
  const [years, setYears] = useState(20);
  const [selectedEtfIndex, setSelectedEtfIndex] = useState(0);

  const selectedEtf = etfs[selectedEtfIndex] ?? etfs[0];

  const bankResult = calculateInvestment({
    initialDeposit,
    monthlyContribution,
    years,
    grossAnnualReturnPercent: bankFund.expectedGrossAnnualReturnPercent,
    annualFeePercent: bankFund.annualManagementFeePercent,
    entryFeePercent: bankFund.entryFeePercent,
  });

  const etfResult = calculateInvestment({
    initialDeposit,
    monthlyContribution,
    years,
    grossAnnualReturnPercent: selectedEtf.historicalAnnualReturnPercent,
    annualFeePercent: selectedEtf.terPercent,
  });

  const etfNetAdvantage = etfResult.netFutureValue - bankResult.netFutureValue;

  return (
    <section
      id="kalkulacka"
      lang="cs"
      className="flex scroll-mt-6 flex-1 flex-col bg-[#faf8f5] font-sans text-[#2b211b]"
    >
      <form className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-6 rounded-2xl border border-stone-300 bg-white p-4 shadow-sm">
          <RangeField
            label="Počáteční vklad"
            min={0}
            max={1_000_000}
            step={10_000}
            value={initialDeposit}
            display={formatCzk(initialDeposit)}
            onChange={setInitialDeposit}
          />
          <RangeField
            label="Měsíční úložka"
            min={0}
            max={50_000}
            step={500}
            value={monthlyContribution}
            display={formatCzk(monthlyContribution)}
            onChange={setMonthlyContribution}
          />
          <RangeField
            label="Počet let"
            min={1}
            max={40}
            step={1}
            value={years}
            display={`${years} let`}
            onChange={setYears}
          />

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-zinc-700">ETF</span>
            <div className="grid grid-cols-3 gap-2" role="group" aria-label="Výběr ETF">
              {etfs.map((etf, index) => {
                const selected = index === selectedEtfIndex;

                return (
                  <button
                    key={etf.ticker}
                    type="button"
                    aria-pressed={selected}
                    className={`cursor-pointer rounded-xl px-2 py-3 text-base font-semibold ${
                      selected
                        ? "bg-[#2b211b] text-white transition-opacity hover:opacity-90"
                        : "bg-zinc-100 text-[#2b211b] transition-colors duration-150 hover:bg-stone-200 hover:text-[#2b211b]"
                    }`}
                    onClick={() => setSelectedEtfIndex(index)}
                  >
                    {etf.ticker}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-12 sm:grid-cols-2 sm:gap-4">
          <article className="flex flex-col rounded-2xl border-2 border-emerald-500/80 bg-white p-5 shadow-md sm:row-span-6 sm:grid sm:grid-rows-subgrid">
            <p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">ETF</p>
            <div className="mt-1">
              <p className="mb-2 inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                Nízkonákladové řešení
              </p>
              <h2 className="text-lg leading-snug font-semibold text-[#2b211b]">
                {selectedEtf.ticker}
                <span className="mt-0.5 block text-sm font-normal text-zinc-500">{selectedEtf.name}</span>
              </h2>
            </div>
            <p className="mt-5 text-sm font-medium text-zinc-500">Na konci vám zůstane:</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-emerald-700 tabular-nums sm:text-4xl">
              {formatCzk(etfResult.netFutureValue)}
            </p>
            <p className="mt-4 text-sm text-zinc-500">Odevzdáte na poplatcích:</p>
            <p className="mt-0.5 text-base font-medium text-zinc-700 tabular-nums">
              {formatCzk(etfResult.totalFeesLost)}
            </p>
          </article>

          <article className="flex flex-col rounded-2xl border border-stone-300 bg-stone-100/70 p-5 sm:row-span-6 sm:grid sm:grid-rows-subgrid">
            <p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">Banka</p>
            <div className="mt-1 flex items-start gap-1.5 sm:min-h-16">
              <h2 className="text-lg font-semibold leading-snug text-[#2b211b]">{bankFund.name}</h2>
              <div className="group relative mt-1 shrink-0">
                <button
                  type="button"
                  className="inline-flex size-4 cursor-help items-center justify-center text-sm leading-none text-zinc-400"
                  aria-label="Detail poplatků bankovního fondu"
                >
                  <span aria-hidden="true">ⓘ</span>
                </button>
                <p
                  role="tooltip"
                  className="pointer-events-none absolute right-0 bottom-full z-20 mb-12 hidden w-64 rounded-lg bg-[#2b211b]/90 px-3 py-2 text-xs leading-5 font-normal text-white backdrop-blur-sm group-hover:block group-focus-within:block"
                >
                  Průměrný akciový fond velkých českých bank (správa 1,8 % p.a. + vstup 2,5 %)
                </p>
              </div>
            </div>
            <p className="mt-5 text-sm font-medium text-zinc-500">Na konci vám zůstane:</p>
            <div className="mt-1 text-3xl font-bold tracking-tight text-stone-400 tabular-nums sm:text-4xl">
              {formatCzk(bankResult.netFutureValue)}
            </div>
            <p className="mt-4 text-sm text-zinc-500">Odevzdáte na poplatcích:</p>
            <p className="mt-0.5 text-base font-medium text-zinc-700 tabular-nums">
              {formatCzk(bankResult.totalFeesLost)}
            </p>
          </article>
        </div>

        <div className="flex flex-col gap-3">
          <p className="rounded-2xl border-[3px] border-emerald-500 bg-white px-5 py-8 text-center text-3xl font-semibold tracking-tight text-[#2b211b] shadow-md sm:text-4xl">
            S ETF budete mít navíc:{" "}
            <span className="text-3xl font-bold tracking-tight text-emerald-700 tabular-nums sm:text-4xl">
              {formatCzk(etfNetAdvantage)}
            </span>
          </p>
          <p className="text-center text-xs leading-5 text-zinc-500">
            Poznámka: Tento rozdíl tvoří jak ušetřené statisíce na poplatcích, tak historicky vyšší
            růst indexu na burze oproti konzervativnímu fondu banky.
          </p>
        </div>
      </form>
    </section>
  );
}

function RangeField({
  label,
  min,
  max,
  step,
  value,
  display,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  display: string;
  onChange: (value: number) => void;
}) {
  const progress = max === min ? 0 : ((value - min) / (max - min)) * 100;

  return (
    <label className="flex flex-col gap-3">
      <span className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-zinc-700">{label}</span>
        <span className="text-base font-semibold tabular-nums text-[#2b211b]">{display}</span>
      </span>
      <input
        className="range-espresso h-8 w-full cursor-pointer accent-[#2b211b]"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ "--range-progress": `${progress}%` } as CSSProperties}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
