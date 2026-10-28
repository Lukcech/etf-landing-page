export default function Hero() {
  return (
    <section className="bg-zinc-50 px-4 pt-16 pb-4 font-sans text-zinc-900 sm:px-6 sm:pt-24 sm:pb-6 lg:pt-28">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <p className="rounded-full bg-white px-3 py-1 text-xs font-medium tracking-wide text-zinc-600 ring-1 ring-zinc-200">
          Aktuální data 2026 • Bez registrace
        </p>

        <h1 className="text-4xl font-semibold tracking-tight text-balance text-zinc-950 sm:text-5xl lg:text-6xl lg:leading-[1.08]">
          Banka vám z investic potichu ukrajuje až <span className="text-red-600">30 %</span> na
          poplatcích
        </h1>

        <p className="max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8">
          Zajímá vás, o kolik peněz reálně přicházíte v běžných fondech? Spočítejte si na 2
          kliknutí rozdíl oproti nízkonákladovým ETF z burzy NYSE.
        </p>

        <a
          href="#kalkulacka"
          className="mt-2 inline-flex items-center justify-center rounded-full bg-zinc-900 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-zinc-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-900"
        >
          Spočítat ztrátu na kalkulačce
        </a>
      </div>
    </section>
  );
}
