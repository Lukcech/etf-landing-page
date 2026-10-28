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
    <section className="bg-zinc-50 px-4 py-6 font-sans text-zinc-900 sm:px-6 sm:py-10">
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 lg:grid-cols-3">
        {etfs.map((etf) => (
          <article
            key={etf.ticker}
            className="flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-zinc-200"
          >
            <p className="text-xs font-semibold tracking-wider text-zinc-500 uppercase">
              {etf.exchange}
            </p>
            <h2 className="mt-1 text-lg leading-snug font-semibold">
              {etf.ticker}
              <span className="mt-0.5 block text-sm font-normal text-zinc-500">{etf.name}</span>
            </h2>
            <p className="mt-4 text-sm leading-6 text-zinc-700">{etf.description}</p>
            <p className="mt-5 text-sm font-medium text-zinc-500">Poplatek TER</p>
            <p className="mt-1 text-2xl font-semibold tabular-nums">{formatTer(etf.terPercent)}</p>
            <p className="mt-auto pt-6 text-xs text-zinc-500">{etf.source}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
