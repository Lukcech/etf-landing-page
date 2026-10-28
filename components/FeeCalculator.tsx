"use client";

import { useState } from "react";
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

  const feesSaved = bankResult.totalFeesLost - etfResult.totalFeesLost;

  return (
    <section
      id="kalkulacka"
      lang="cs"
      className="flex scroll-mt-6 flex-1 flex-col bg-zinc-50 font-sans text-zinc-900"
    >
      <form className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-zinc-200">
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
                    className={`rounded-xl px-2 py-3 text-base font-semibold ${
                      selected
                        ? "bg-zinc-900 text-white"
                        : "bg-zinc-100 text-zinc-800"
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <article className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-red-100">
            <p className="text-xs font-semibold tracking-wider text-red-700 uppercase">Banka</p>
            <h2 className="mt-1 text-lg font-semibold leading-snug">{bankFund.name}</h2>
            <p className="mt-5 text-sm font-semibold text-red-700">Ztráta na poplatcích</p>
            <p className="mt-1 text-4xl font-extrabold tracking-tight text-red-600 tabular-nums sm:text-5xl">
              {formatCzk(bankResult.totalFeesLost)}
            </p>
            <p className="mt-6 text-sm font-medium text-zinc-500">Čistá hodnota</p>
            <p className="mt-1 text-xl font-semibold tabular-nums">
              {formatCzk(bankResult.netFutureValue)}
            </p>
          </article>

          <article className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200">
            <p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">ETF</p>
            <h2 className="mt-1 text-lg leading-snug font-semibold">
              {selectedEtf.ticker}
              <span className="mt-0.5 block text-sm font-normal text-zinc-500">{selectedEtf.name}</span>
            </h2>
            <p className="mt-5 text-sm font-medium text-zinc-500">Ztráta na poplatcích</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">
              {formatCzk(etfResult.totalFeesLost)}
            </p>
            <p className="mt-6 text-sm font-medium text-zinc-500">Čistá hodnota</p>
            <p className="mt-1 text-xl font-semibold tabular-nums">
              {formatCzk(etfResult.netFutureValue)}
            </p>
          </article>
        </div>

        <p className="rounded-2xl bg-zinc-900 px-5 py-8 text-center text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          {feesSaved >= 0
            ? `Ušetříte ${formatCzk(feesSaved)}`
            : `Poplatky ETF jsou vyšší o ${formatCzk(-feesSaved)}`}
        </p>
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
  return (
    <label className="flex flex-col gap-3">
      <span className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-zinc-700">{label}</span>
        <span className="text-base font-semibold tabular-nums">{display}</span>
      </span>
      <input
        className="h-8 w-full cursor-pointer accent-zinc-900"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}
