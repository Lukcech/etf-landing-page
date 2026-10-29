import { etfs } from "@/data/etf-data";

const terFormat = new Intl.NumberFormat("cs-CZ", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatTer(percent: number): string {
  return `${terFormat.format(percent)} %`;
}

export default function EtfCards() {
  return (
    <section className="bg-zinc-50 px-4 py-6 font-sans text-[#2b211b] sm:px-6 sm:py-10">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 lg:grid-cols-3">
        {etfs.map((etf) => (
          <article
            key={etf.ticker}
            className="flex flex-col justify-between rounded-2xl border border-emerald-500/30 bg-white p-5 shadow-sm"
          >
            <div>
              <p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
                {etf.exchange}
              </p>
              <h2 className="mt-1 text-lg leading-snug font-semibold text-[#2b211b]">
                {etf.ticker}
                <span className="mt-0.5 block text-sm font-normal text-zinc-500">{etf.name}</span>
              </h2>
              <p className="mt-4 text-sm leading-6 text-zinc-700">{etf.description}</p>
            </div>
            <div>
              <div className="group relative mt-5">
                <div className="flex items-center gap-1.5">
                  <p className="text-sm font-medium text-zinc-500">Poplatek TER</p>
                  <button
                    type="button"
                    className="inline-flex size-4 shrink-0 cursor-help items-center justify-center rounded-full text-[11px] leading-none font-semibold text-zinc-500 ring-1 ring-zinc-300"
                    aria-label="Vysvětlení zkratky TER"
                  >
                    <span aria-hidden="true">?</span>
                  </button>
                </div>
                <p
                  role="tooltip"
                  className="pointer-events-none absolute bottom-full left-0 z-10 mb-2 hidden w-full rounded-lg bg-[#2b211b] px-3 py-2 text-xs leading-5 font-normal text-white group-hover:block group-focus-within:block"
                >
                  TER = Total Expense Ratio (veškeré roční náklady fondu stržené přímo z majetku, bez
                  dalších skrytých poplatků)
                </p>
              </div>
              <p className="mt-1 text-2xl font-semibold tabular-nums">{formatTer(etf.terPercent)}</p>
              <p className="mt-1 text-xs text-zinc-500">ročně z objemu investice</p>
              <p className="pt-6 text-xs text-zinc-500">{etf.source}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
