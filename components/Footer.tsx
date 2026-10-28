export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 px-4 py-10 font-sans text-xs leading-5 text-zinc-500 sm:px-6">
      <div className="mx-auto flex max-w-3xl flex-col gap-4">
        <p>
          <span className="font-medium">Upozornění na rizika: </span>
          Investování na kapitálových trzích zahrnuje riziko kolísání hodnoty a ztráty investovaného
          kapitálu. Historické výnosy nejsou zárukou budoucích výsledků.
        </p>
        <p>
          <span className="font-medium">Zdroje dat: </span>
          Data o fondech a poplatcích pocházejí z oficiálních přehledů Vanguard, Invesco a burz
          NYSE / Nasdaq (stav k roku 2026).
        </p>
        <p>© 2026</p>
      </div>
    </footer>
  );
}
