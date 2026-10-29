export default function Hero() {
  return (
    <section className="bg-zinc-50 px-4 pt-16 pb-4 font-sans text-[#2b211b] sm:px-6 sm:pt-24 sm:pb-6 lg:pt-28">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <p className="rounded-full bg-white px-3 py-1 text-xs font-medium tracking-wide text-zinc-600 ring-1 ring-zinc-200">
          Aktuální data 2026 • Bez registrace
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-balance text-[#2b211b] sm:text-4xl md:text-5xl">
          Banka vám z investic potichu ukrajuje až 30 % na poplatcích
        </h1>

        <p className="max-w-2xl text-base leading-7 text-zinc-600 sm:text-lg sm:leading-8">
          Zajímá vás, o kolik peněz reálně přicházíte v běžných fondech? Spočítejte si,
          <br />
          o kolik více naspoříte díky nízkonákladovým ETF z burzy NYSE.
        </p>

        <a
          href="#kalkulacka"
          className="mt-2 inline-flex items-center justify-center rounded-full bg-[#2b211b] px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-[#3d322c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2b211b]"
        >
          Spočítat rozdíl na kalkulačce
        </a>
      </div>
    </section>
  );
}
