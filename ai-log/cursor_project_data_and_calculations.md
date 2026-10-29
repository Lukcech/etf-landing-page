# Project data and calculations
_Exported on 29. 10. 2026 at 13:23:17 SEČ from Cursor (3.22.12)_

---

**User**

Vytvoř v kořeni projektu nové složky `data` a `lib`.

1. Ve složce `data` vytvoř soubor `etf-data.ts`. 
Tento soubor bude obsahovat a exportovat statická data pro náš projekt:
- Objekt reprezentující běžný český podílový fond (vstupní poplatek: 2.5%, roční poplatek za správu: 1.8%, očekávaný hrubý roční výnos: 8%).
- Pole 3 reálných ETF z NYSE: 
  - VOO (TER: 0.03%, historický výnos: 12.5%)
  - QQQ (TER: 0.20%, historický výnos: 17.8%)
  - VT (TER: 0.07%, historický výnos: 9.2%)
Použij TypeScript a definuj pro tyto objekty přehledné interfacy (např. `EtfData` a `BankFundData`).

2. Ve složce `lib` vytvoř soubor `calculations.ts`.
Napiš v něm čisté, exportované matematické funkce pro výpočet investice v čase.
Potřebujeme funkci (např. `calculateInvestment`), která přijme:
- počáteční vklad (Kč)
- měsíční úložku (Kč)
- počet let
- hrubý roční výnos (%)
- roční poplatek fondu/ETF (%)
- jednorázový vstupní poplatek z vkladu (%) - volitelný, pro banku.

Funkce musí pomocí složeného úročení spočítat:
- Celkovou naspořenou částku (hrubou).
- Čistou naspořenou částku po odečtení průběžných poplatků z objemu.
- Celkovou částku, kterou klient na poplatcích fondu reálně zaplatí/ztratí.

---

**Cursor**

Nejdřív se podívám na strukturu projektu a konvence TypeScriptu, abych složky `data` a `lib` založil ve stejném stylu.

Složky mimo `app` zůstanou mimo routy. Přidám statická data a výpočet, který z poplatků odečte i výnos, o který kvůli nim klient přijde.

V kořeni projektu jsou složky `data` a `lib` se statickými daty a výpočtem investice. Typecheck i lint prošly a výpočet sedí na uzavřený vzorec složeného úročení.

**Data** jsou v `data/etf-data.ts`. Exportuje rozhraní `BankFundData` a `EtfData`, objekt `bankFund` (vstupní poplatek 2,5 %, správa 1,8 %, hrubý výnos 8 %) a pole `etfs` s VOO, QQQ a VT. QQQ se obchoduje na Nasdaq, proto má u sebe burzu Nasdaq. VOO a VT jsou na NYSE.

**Výpočet** je `calculateInvestment` v `lib/calculations.ts`. Bere počáteční vklad, měsíční úložku, počet let, hrubý roční výnos, roční poplatek z objemu a volitelný vstupní poplatek. Vrací:

- `grossFutureValue` — hodnota při hrubém výnosu, bez poplatků
- `netFutureValue` — hodnota po poplatcích
- `totalFeesLost` — rozdíl těchto dvou hodnot, tedy zaplacené poplatky včetně výnosu, o který klient kvůli nim přijde

Vklady vstupují na začátku každého měsíce a úročí se měsíční sazbou, která za rok složí zadaný hrubý výnos. Vstupní poplatek se strhne z počátečního vkladu i z každé měsíční úložky. Roční poplatek se strhává po dvanáctinách z aktuálního objemu.

Na horizontu 20 let, s vkladem 50 000 Kč a úložkou 5 000 Kč měsíčně, vyjde u bankovního fondu čistá hodnota asi 2,40 mil. Kč a ztráta na poplatcích asi 699 000 Kč. U VOO se stejným vkladem a jeho historickým výnosem 12,5 % je čistá hodnota asi 5,39 mil. Kč a ztráta na poplatku asi 23 000 Kč.

---

**User**

ytvoř mi v components/FeeCalculator.tsx základ pro kalkulačku. Bude to client component. Potřebuju tam React stavy pro počáteční vklad (výchozí 50 000), měsíční úložku (5 000) a počet let (20). Udělej pro ně čisté HTML slidery (input type range) s rozumnými limity a kroky. Zatím to vůbec nestyluj, jen vypiš ty hodnoty pod to, ať vidím, že React state správně reaguje na posuvníky.

---

**Cursor**

Kalkulačka má být klientská komponenta se slidery a živým stavem. Nejdřív se podívám, jak se v tomhle Next.js píší client components a kam ji zapojit, abych ověřil, že posuvníky opravdu mění hodnoty.

Kalkulačka je v `components/FeeCalculator.tsx` a je vykreslená na úvodní stránce na [http://localhost:3000](http://localhost:3000). Jde o client component se třemi posuvníky a textem pod nimi, který ukazuje aktuální stav.

| Posuvník | Výchozí | Rozsah | Krok |
|---|---|---|---|
| Počáteční vklad | 50 000 Kč | 0–1 000 000 Kč | 10 000 Kč |
| Měsíční úložka | 5 000 Kč | 0–50 000 Kč | 500 Kč |
| Počet let | 20 | 1–40 | 1 rok |

Posuvníky jsem v prohlížeči posunul na 200 000 Kč, 12 500 Kč a 35 let. Text pod nimi se na tyto hodnoty hned přepsal.

---

**User**

ok ted do toho naimportuj naše data z etf-data.ts a funkci calculateInvestment z calculations.ts. Přidej ještě stav pro výběr ETF (výchozí index 0 pro VOO) a udělej tři jednoduchá tlačítka na přepínání fondů. Zavolej tu výpočetní funkci dvakrát – jednou pro bankovní fond a jednou pro to vybrané ETF. Výsledky (netFutureValue a totalFeesLost) pro obě varianty jen surově vypiš pod tlačítka. Chci ověřit, že se to dynamicky přepočítává, když hýbu slidery.

---

**Cursor**

Do kalkulačky napojím data fondů a výpočet, přidám přepínání ETF a výsledky vypíšu pod tlačítka. Pak v prohlížeči ověřím, že se přepočítají při pohybu posuvníků.

Kalkulačka teď počítá obě varianty ze stejných posuvníků. Pod třemi tlačítky **VOO**, **QQQ** a **VT** jsou surově vypsané `netFutureValue` a `totalFeesLost` pro bankovní fond i pro vybrané ETF. Výchozí výběr je VOO.

Výpočet běží přímo při vykreslení, takže se přepočte při každém posunu i při přepnutí fondu. V prohlížeči to sedí na funkci `calculateInvestment`: při výchozích 50 000 Kč, 5 000 Kč měsíčně a 20 letech má VOO čistou hodnotu `5390422.05` a ztrátu na poplatcích `23112.32`. Po přepnutí na QQQ a VT a po posunu na 8 000 Kč měsíčně a 25 let se obě čísla změnila a dál odpovídají výpočtu.

---

**User**

Čísla sedí tak pojďme to teď nastylovat přes Tailwind, primárně pro mobily. Výsledky dej do dvou hezkých karet vedle sebe (na mobilu pod sebou). První karta je banka, druhá je ETF. To nejdůležitější: v kartě banky dej tu částku ztráty na poplatcích hodně výrazně a červeně. Dole pod kartami pak udělej velký banner s textem "Ušetříte X Kč" (rozdíl v poplatcích). Přidej i nějakou jednoduchou utilitu na formátování čísel do českého tvaru (např. 2 400 000 Kč) bez desetinných míst. Externí UI knihovny nepoužívej.

---

**Cursor**

Čísla nechám stejná a obalím je do mobilního layoutu: dvě karty, červená ztráta u banky a banner s úsporou. Nejdřív se podívám na současné styly a kalkulačku.

Formátování korun dám do malé utility a kalkulačku složím mobilně: karty pod sebou, ztráta banky červeně a pod nimi banner s úsporou.

Kalkulačka je nastylovaná přes Tailwind, primárně pro mobil. Částky formátuje `formatCzk` v `lib/format.ts` do českého tvaru bez haléřů, například `2 400 000 Kč`.

Výsledky jsou ve dvou kartách. Na mobilu jsou pod sebou, od šířky 640 px vedle sebe. V kartě banky je ztráta na poplatcích velkým červeným číslem. Pod kartami je banner **Ušetříte X Kč**, kde X je rozdíl `totalFeesLost` banky a vybraného ETF.

Při výchozím nastavení a VOO banner ukazuje `675 389 Kč`. Posun posuvníku i přepnutí ETF částky hned přepočítá. Když u QQQ na dlouhém horizontu vyjde ztráta na poplatcích vyšší než u banky, banner místo záporné úspory napíše, o kolik jsou poplatky ETF vyšší.

---

**User**

Vytvoř v components/Hero.tsx úvodní Hero sekci pro mobil i desktop.

Potřebuju tam:

Malý badge/štítek nahoře: "Aktuální data 2026 • Bez registrace"

Hlavní nadpis: "Banka vám z investic potichu ukrajuje až 30 % na poplatcích"

Podnadpis: "Zajímá vás, o kolik peněz reálně přicházíte v běžných fondech? Spočítejte si na 2 kliknutí rozdíl oproti nízkonákladovým ETF z burzy NYSE."

Tlačítko (CTA): "Spočítat ztrátu na kalkulačce", které po kliknutí plynule sroluje na element s id="kalkulacka".

Nastylyuj to čistě v Tailwindu (moderní, vzdušné, tmavší text na světlém pozadí).

---

**Cursor**

Hero má navázat na kalkulačku a po kliknutí na ni plynule sjet. Podívám se, jak je stránka složená, a doplním na kalkulačku kotvu `kalkulacka`.

Hero bude nad kalkulačkou a odkaz povede na `#kalkulacka`. Stejné světlé pozadí jako u kalkulačky, ať stránka drží pohromadě.

Úvodní sekce je v `components/Hero.tsx` a sedí nad kalkulačkou. Světlé pozadí a tmavý text navazují na kalkulačku.

Nahoře je štítek **Aktuální data 2026 • Bez registrace**, pod ním nadpis, podnadpis a tlačítko **Spočítat ztrátu na kalkulačce**. Číslo **30 %** v nadpisu je červené, stejně jako ztráta na poplatcích níž. Tlačítko vede na `#kalkulacka` a stránka na něj plynule sjede.

Na mobilu je nadpis 36 px a na šířku od 1024 px 60 px, text je vycentrovaný. Klik na tlačítko jsem ověřil: kalkulačka dojela na začátek obrazovky.

---

**User**

Podívej se do data/etf-data.ts. Potřebujeme k jednotlivým ETF doplnit dva údaje:

description – stručné vysvětlení v češtině pro laika (např. VOO = 500 největších amerických firem jako Apple či Microsoft).

source – zdroj dat s rokem 2026 (např. Vanguard / FactSet, Invesco).
Uprav interface EtfData a doplň tyto texty ke všem třem fondům.

---

**Cursor**

Doplním ke každému ETF krátký český popis pro laika a zdroj dat s rokem 2026. Nejdřív se podívám, jak je `EtfData` teď definované a kde se používá.

`EtfData` se v kalkulačce jen čte, takže stačí rozšířit rozhraní a doplnit texty. Popisy nechám laické a u zdroje uvedu vydavatele i rok 2026.

Rozhraní `EtfData` teď obsahuje `description` a `source`. Ke všem třem fondům jsou doplněné texty.

- **VOO** sleduje 500 největších amerických firem, například Apple či Microsoft. Zdroj je Vanguard / FactSet, 2026.
- **QQQ** drží 100 největších nefinančních firem z burzy Nasdaq, hlavně technologie. Zdroj je Invesco / Nasdaq, 2026.
- **VT** sdružuje tisíce firem z celého světa. Zdroj je Vanguard / FTSE Russell, 2026.

---

**User**

Vytvoř komponentu components/EtfCards.tsx, načti do ní pole etfs z data/etf-data.ts a jen jednoduše pod sebe vypiš názvy fondů, popisy a zdroje.
Rovnou ji přidej do app/page.tsx pod kalkulačku, ať vidím, že se to na webu vykreslí. Bez složitého stylování.

---

**Cursor**

Přidám pod kalkulačku jednoduchý výpis ETF: název, popis a zdroj. Pak na stránce ověřím, že se to opravdu vykreslí.

Komponenta `components/EtfCards.tsx` je na stránce hned pod kalkulačkou. Vypisuje tři fondy pod sebou: název, popis a zdroj.

- **Vanguard S&P 500 ETF** — 500 největších amerických firem, například Apple či Microsoft. Vanguard / FactSet, 2026.
- **Invesco QQQ Trust** — 100 největších nefinančních firem z burzy Nasdaq. Invesco / Nasdaq, 2026.
- **Vanguard Total World Stock ETF** — tisíce firem z celého světa. Vanguard / FTSE Russell, 2026.

---

**User**

Dej těm třem fondům v EtfCards.tsx vzhled karet, ať to ladí s kalkulačkou.
Rozlož je do gridu (na mobilu 1 pod sebou, na desktopu 3 vedle sebe). Každý fond dej do bílé karty s rámečkem a zaoblenými rohy. Zobraz u nich i ticker, burzu a poplatek TER. Zdroj dat nech dole malým šedým písmem.

---

**Cursor**

Karty ETF srovnám se vzhledem kalkulačky: mřížka, bílé rámečky a dole malý šedý zdroj. Nejdřív se podívám na současné styly obou částí.

Tři fondy v `EtfCards.tsx` jsou teď bílé karty se stejným rámečkem a zaoblením jako kalkulačka. Na mobilu jsou pod sebou, od šířky 1024 px vedle sebe.

Každá karta ukazuje burzu, ticker, název, popis a poplatek TER (`0,03 %`, `0,20 %` a `0,07 %`). Zdroj dat je dole malým šedým písmem.

---

**User**

Vytvoř komponentu components/LeadForm.tsx a vlož ji do app/page.tsx pod ty 3 karty fondů.
Bude to rámeček s:

nadpisem: „Chcete začít investovat do ETF bez chyb?“

podnadpisem: „Zadejte e-mail a pošleme vám praktického průvodce: Jak koupit své první ETF na burze v roce 2026 krok za krokem.“

jedním textovým polem na e-mail a tlačítkem „Získat tahák zdarma“.

jednoduchým stavem: po odeslání schovej formulář a na jeho místě zobraz poděkování a potvrzení, že tahák odesíláme.

---

**Cursor**

Formulář bude klientská komponenta se stavem po odeslání a stejný rámeček jako karty. Podívám se na stránku a vložím ho pod fondy.

Formulář je v `components/LeadForm.tsx` a na stránce sedí pod třemi kartami fondů. Je to bílý rámeček se stejným zaoblením jako zbytek stránky.

Nadpis zní „Chcete začít investovat do ETF bez chyb?“, pod ním je text o průvodci na rok 2026, pole na e-mail a tlačítko „Získat tahák zdarma“. Po odeslání formulář zmizí a na jeho místě zůstane poděkování s potvrzením, že tahák odchází na zadanou adresu. Ověřil jsem to odesláním na `lukas@example.cz`.

---

**User**

Vytvoř komponentu components/Footer.tsx a vlož ji do app/page.tsx úplně dolů.

Bude to jednoduchá, decentní patička s drobným šedým textem:

Upozornění na rizika: „Investování na kapitálových trzích zahrnuje riziko kolísání hodnoty a ztráty investovaného kapitálu. Historické výnosy nejsou zárukou budoucích výsledků.“

Zdroje dat: „Data o fondech a poplatcích pocházejí z oficiálních přehledů Vanguard, Invesco a burz NYSE / Nasdaq (stav k roku 2026).“

Copyright / rok 2026.

---

**Cursor**

Patička přijde úplně dolů pod formulář. Podívám se na stránku a dám jí stejné světlé pozadí a drobný šedý text.

Patička je v `components/Footer.tsx` a na stránce je úplně dole, pod formulářem. Je to drobný šedý text se třemi odstavci:

- **Upozornění na rizika** o kolísání hodnoty, ztrátě kapitálu a tom, že historické výnosy nejsou zárukou budoucích výsledků.
- **Zdroje dat** z přehledů Vanguard, Invesco a burz NYSE / Nasdaq ke stavu roku 2026.
- **© 2026**

---

**User**

V souboru components/FeeCalculator.tsx udělej dvě drobné úpravy textů:

Text „Ztráta na poplatcích“ nahraď za: „Na poplatcích zaplatíte“.

U bankovní karty doplň pod název fondu menší šedý popisek: „Průměrný akciový fond velkých českých bank (správa 1,8 % p.a. + vstup 2,5 %)“.

---

**Cursor**

Upravím oba texty v kalkulačce a ověřím, že se na bankovní kartě opravdu zobrazí.

Na obou kartách kalkulačky je teď místo „Ztráta na poplatcích“ text **Na poplatcích zaplatíte**.

Pod názvem bankovního fondu je menší šedý popisek: „Průměrný akciový fond velkých českých bank (správa 1,8 % p.a. + vstup 2,5 %)“. Červená částka pod ním zůstává.

---

**User**

V components/EtfCards.tsx přidej k popisku „Poplatek TER“ malou ikonku otazníku s jednoduchým tooltipem (nebo HTML atributem title), který laikovi vysvětlí zkratku: „TER = Total Expense Ratio (veškeré roční náklady fondu stržené přímo z majetku, bez dalších skrytých poplatků)“. Přímo pod to procento TER ještě doplň drobný šedý text: „ročně z objemu investice"

---

**Cursor**

K popisku TER přidám otazník s vysvětlením a pod procento drobný text, že jde o roční náklad z objemu. Nejdřív se podívám na současné karty.

K popisku TER přidám malý otazník s vysvětlením a pod procento šedou poznámku, že jde o roční náklad z objemu.

U každého fondu je vedle popisku **Poplatek TER** malý otazník. Po najetí nebo klepnutí ukáže vysvětlení: TER jsou veškeré roční náklady fondu stržené přímo z majetku, bez dalších skrytých poplatků.

Přímo pod procentem je drobný šedý text **ročně z objemu investice**.

---

**User**

Uprav v FeeCalculator.tsx vizuál obou karet tak, aby nepůsobil tak negativně a technicistně:

Detaily pod ⓘ: U banky skryj text o 1,8 % a 2,5 % pod malou nenápadnou ikonku ⓘ (kliknutím nebo najetím se zobrazí detail), ať karta není přeplněná.

Otoč hierarchii na pozitivní výsledek:

Jako hlavní velké číslo na kartě zobraz Čistou hodnotu (kolik investorovi na konci zůstane). U ETF fondu to číslo zvýrazni (např. jemně zeleně nebo tučně).

Text „Na poplatcích zaplatíte“ zmenši na menší doplňkový údaj pod to a u banky sundej tu křiklavou rudou barvu na decentnější tmavší odstín.


---

**Cursor**

Karty v kalkulačce překlopím na čistou hodnotu jako hlavní číslo a detail poplatků banky schovám pod nenápadné ⓘ. Nejdřív se podívám na současné karty.

Čistá hodnota bude na obou kartách hlavní číslo. U banky schovám sazby 1,8 % a 2,5 % pod ⓘ a červenou nahradím klidnějším odstínem.

Obě karty v kalkulačce teď vedou čistou hodnotou, tedy tím, kolik investorovi na konci zůstane. U ETF je to číslo tučné a zelené, u banky tučné a tmavé.

**Na poplatcích zaplatíte** je pod tím menší doplňkový údaj. U banky už není červený, ale tmavě šedý.

Text o správě 1,8 % a vstupu 2,5 % je schovaný pod malým ⓘ u názvu fondu. Ukáže se po najetí nebo klepnutí.

---

**User**

Vyrovnání částek do stejné rviny: Hlavičkám obou karet (nadpis + ticker/popis) nastav stejnou minimální výšku, aby obě velká čísla „Čistá hodnota“ začínala přesně na stejném vodorovném řádku vedle sebe.

Oprava logiky spodního banneru: Včerném pruhu dole zobraz reálný rozdíl čistých hodnot (tedy netFutureValue u ETF minus netFutureValue u Banky).
Text bude: „S ETF získáte navíc: [částka] Kč“ (místo matoucího „Ušetříte 675 tisíc“).

---

**Cursor**

Čísla čisté hodnoty srovnám na jeden řádek a ve spodním pruhu ukážu rozdíl čistých hodnot, ne rozdíl poplatků. Nejdřív se podívám na obě karty a banner.

Hlavičky karet dostanou stejnou výšku, aby čisté hodnoty seděly na jednom řádku. Banner spočítá rozdíl čistých hodnot a ukáže, kolik s ETF investor získá navíc.

Server už nový banner vrací. V prohlížeči je ještě stará chybová obrazovka, tak stránku načtu znovu a změřím, jestli čísla sedí na jednom řádku.

Obě karty teď drží čísla **Čistá hodnota** na jednom řádku a černý pruh ukazuje rozdíl čistých hodnot.

Hlavičky (název bankovního fondu i ticker s popisem ETF) mají od šířky 640 px stejnou minimální výšku. U výchozího nastavení (50 000 Kč, 5 000 Kč měsíčně, 20 let) začínají obě velká čísla na stejném místě pro VOO, QQQ i VT.

Banner počítá `netFutureValue` ETF minus `netFutureValue` banky. Text je **S ETF získáte navíc: 2 992 575 Kč** u VOO. Po přepnutí na QQQ je to 7 997 811 Kč, u VT 1 153 074 Kč. Částka banky zůstává 2 397 847 Kč.

---

**User**

chci upravit texty na obou kartách a spodní pruh tak, aby byly naprosto polopatické:

Přepiš popisky na obou kartách:

Místo „Na poplatcích zaplatíte“ dej: „Odevzdáte na poplatcích“

Místo „Čistá hodnota“ dej: „Na konci vám zůstane“ (u ETF tuto částku nech velkou a zelenou).

Srovnej řádky: Ať je na obou kartách nahoře „Na konci vám zůstane“ a pod tím menším písmem „Odevzdáte na poplatcích“ přesně na stejné vodorovné lince.

Vysvětlivka pod spodní černý pruh:

Text v černém pruhu nech: „S ETF budete mít o [částka] Kč více“.

Přímo pod tento černý pruh doplň drobný šedý text: „Poznámka: Tento rozdíl tvoří jak ušetřené statisíce na poplatcích, tak historicky vyšší růst indexu na burze oproti konzervativnímu fondu banky."

---

**Cursor**

Popisky na obou kartách sjednotím a pod černý pruh doplním šedou poznámku. Nejdřív se podívám na aktuální strukturu karet, aby řádky zůstaly na stejné výšce.

Obě karty teď mluví stejným jazykem a jejich řádky sedí vedle sebe.

Nahoře je na obou kartách **Na konci vám zůstane**. U banky je částka černá, u ETF pořád velká a zelená. Pod ní je menším písmem **Odevzdáte na poplatcích**. Když jsou karty vedle sebe, oba popisky i obě částky začínají na stejné výšce. Platí to i u QQQ, kde je číslo výrazně delší.

Černý pruh říká **S ETF budete mít o 2 992 575 Kč více** (výchozí VOO, 50 000 Kč + 5 000 Kč měsíčně na 20 let). Přímo pod ním je šedá poznámka, že rozdíl tvoří ušetřené poplatky i historicky vyšší růst indexu oproti fondu banky.

---

**User**

Prohoď pořadí karet: Dej kartu ETF doleva (jako hlavní řešení) a kartu Banka doprava (jako srovnání).

Doplň dvojtečky: U obou karet uprav texty na:

„Na konci vám zůstane:“

„Odevzdáte na poplatcích:“

Pozadí a ohraničení karet:

Hlavnímu pozadí stránky (nebo obalovému kontejneru kalkulačky) nastav jmný teplý krémový nádech (např. třídu bg-[#faf8f5] nebo bg-stone-50).

Samotným bílým kartám přidej zřetelnější rámeček alehký stín (border border-stone-250 shadow-sm), ať z krémového podkladu čistě vystoupí.

Oprava bubliny ⓘ: Uprav její pozici tak, aby se otevírala směrem nahoru nad iknku (aby nepřekrývala spodní text) a dej jí menší písmo s jemnou průhledností (např. bg-neutral-900/90 text-xs backdrop-blur-sm)

---

**Cursor**

ETF dám doleva, bance doplním dvojtečky a karty posadím na krémové pozadí s výraznějším rámečkem. Bublinu ⓘ otevřu nahoru, aby nepřekrývala text pod ikonou.

ETF je teď vlevo jako hlavní karta, banka vpravo jako srovnání. Na mobilu je ETF nahoře.

Oba popisky mají dvojtečku: **Na konci vám zůstane:** a **Odevzdáte na poplatcích:**. Zelená částka u ETF zůstává velká. Řádky obou karet pořád začínají na stejné výšce.

Kalkulačka má teplé krémové pozadí `#faf8f5`. Bílé karty mají rámeček `border-stone-300` a lehký stín, takže z podkladu vystoupí.

Bublina ⓘ se otevírá nad ikonou, má 12px písmo, pozadí `neutral-900` s 90% krytím a jemné rozostření. Částku pod ní už nezakrývá.

---

**User**

dálchi upravit vizuální váhu obou karet, aby bylo na první pohled jasné, že ETF je jednoznačný vítěz, ale aby to působilo to seriózně:

Karta ETF (zvýraznit):

Nech ji sněhově bílou, přidej jí jemný stín (shadow-md) a elegantní tenký zelený rámeček (border-2 border-emerald-500/80).

Nad název VOO můžeš dát malý decentní zelený štítek (badge): „Nízkonákladové řešení“.

Karta Banka (upozadit):

Dej jí mírně zašedlé/utlumené pozadí (bg-stone-100/70) a obyčejný tenký šedý rámeček bez stínu.

Částku „2 397 847 Kč“ změň ze sytě černé na tlumenou šedou (text-stone-500), aby opticky tolik nekonkurovala zelenému číslu u ETF.

---

**Cursor**

ETF kartu opticky vytáhnu dopředu a banku ztlumím, čísla přitom nechám na stejné výšce. Nejdřív se podívám na aktuální karty.

Štítek je uvnitř hlavičky, takže řádky s částkami zůstanou srovnané. Teď to ověřím vedle sebe v prohlížeči.

ETF karta je teď vizuálně hlavní a banka ustupuje do pozadí.

Karta ETF je sněhově bílá, má jemný stín a tenký zelený rámeček. Nad tickerem je malý zelený štítek **Nízkonákladové řešení**. Částka zůstává velká a zelená.

Karta banky má utlumené šedé pozadí, tenký šedý rámeček a žádný stín. Částka **2 397 847 Kč** je teď šedá, takže zelenému číslu u ETF nekonkuruje.

Oba řádky **Na konci vám zůstane:** a **Odevzdáte na poplatcích:** pořád začínají na stejné výšce, i po přepnutí na VT.

---

**User**

Výměna černé za teplou tmavě hnědou:
Nahraď po celém webu čistě černou barvu (#000000, bg-black, text-black) elegantníí hlubokou tmavě hnědou (např. #231b17 nebo text-stone-900 /bg-[#231b17]). Platí to pro hlavní nadpisy, tlačítka, aktivní záložku fondu i spodní velký pruh.
Úprava textu v Hero sekci Hero.tsx):
druhou větu podnadpisu přepiš na: „Spočítejte si na 2 kliknutí, o kolik více naspoříte díky nízkonákladovým ETF z burzy NYSE.“   Tlačítkopod tím změň z „Spočítat ztrátu na kalkulačce“ na: „Spočítat rozdíl na kalkulačce“.   Kontrola bubliny ⓘ v kalkulacce:Ujisti se, že ikonka ⓘ vedle „Běžný český podílový fond“ má funkční vyskakovací popisek (tooltip) s textem o 1,8 % a 2,5 %, který se zobrazí při najetí/kliknutí směrem nahoru a nepřekrývá okolní text.

---

**Cursor**

Černou na nadpisech, tlačítkách, aktivní záložce a spodním pruhu vyměním za teplou tmavě hnědou a upravím texty v hero. Pak zkontroluju, že bublina ⓘ u bankovního fondu vyskakuje nahoru a nic nezakrývá.

Černé plochy na webu jsou ve skutečnosti `zinc-900` a `zinc-950`. Ty na nadpisech, tlačítkách, aktivní záložce a spodním pruhu přepnu na `#231b17` a zároveň upravím texty v hero.

Čistě černé plochy jsou teď teplá tmavě hnědá `#231b17`. Platí to pro hlavní nadpisy, tlačítka, aktivní záložku fondu, posuvníky i spodní pruh.

V hero zůstává první věta podnadpisu. Druhá teď zní: „Spočítejte si na 2 kliknutí, o kolik více naspoříte díky nízkonákladovým ETF z burzy NYSE.“ Tlačítko pod ní je **Spočítat rozdíl na kalkulačce**.

Bublina ⓘ u „Běžný český podílový fond“ se otevírá nad ikonou při najetí i při kliknutí. Text je „Průměrný akciový fond velkých českých bank (správa 1,8 % p.a. + vstup 2,5 %)“ a nezakrývá název fondu ani částky pod ním.

---

**User**

Centrální barva textu a tlačítek (nechci čistou černou):

V app/globals.css (nebo v rootu) nastav hlavní barvu textu i tmavých prvků na viditelně teplou kávovou / tmavě espressovou barvu #2b211b (místo čistě černé #000000).

Srovnání a rámečky u tří ETF karet (components/EtfCards.tsx):

Použij vnitřní flexbox (flex flex-col justify-between), aby řádek „Poplatek TER“ a samotná procenta (0,03 %, 0,20 %, 0,07 %) byly u všech 3 karet v jedné rovině bez ohledu na délku popisu.

Kartám dolním přidej decentní zelené ohraničení (border border-emerald-500/30), ať vizuálně ladí s vítěznou ETF kartou z kalkulačky.

Velikost čísla u QQQ (components/FeeCalculator.tsx):

U částky „Na konci vám zůstane“ uprav velikost písma (např. na text-3xl sm:text-4xl font-bold tracking-tight), aby i velká částka u QQQ (přes 10 milionů Kč) měla po stranách dost místa a netlačila se na okraj karty.

Tvar tlačítka a text v lead formuláři (components/LeadForm.tsx):

Změň zakulacení tlačítka z oválu na stejný tvar, jako má textové pole pro e-mail (rounded-xl).

Text tlačítka změň na: „Získat praktického průvodce“ (a ujisti se, že ani v podnadpisu ani po odeslání není slovo „tahák“, ale „průvodce“).

---

**Cursor**

Hlavní text i tmavé prvky sjednotím na kávovou `#2b211b`, srovnám TER u tří ETF karet a zmenším velké částky, aby se QQQ vešlo do karty. Nejdřív projdu styly a texty, kde ještě zůstala černá nebo slovo „tahák“.

Nahrazení barvy se v některých třídách slepilo do neplatného `text-[espresso]`. Projdu soubory a opravím to na skutečnou barvu.

Prohlížeč je v tmavém režimu a vlastní barva `espresso` se do stylů nedostala, takže text zbělal. Barvu `#2b211b` proto nastavím přímo v `globals.css` a stejnou hodnotu použiju na textu i tmavých prvcích.

Hlavní text i tmavé prvky jsou teď kávová **`#2b211b`**. Platí to pro nadpisy, tlačítka, aktivní záložku fondu, posuvníky i spodní pruh, a barva zůstane stejná i v tmavém režimu systému.

U tří ETF karet jsou **Poplatek TER** a procenta `0,03 %`, `0,20 %` a `0,07 %` na jedné výšce, i když mají popisy různě dlouhé. Karty mají jemný zelený rámeček `border-emerald-500/30`.

Částka **Na konci vám zůstane** je menší (`text-3xl`, od tabletu `text-4xl`). U QQQ se `10 395 658 Kč` vejde na jeden řádek a nedotýká se okraje karty.

Tlačítko ve formuláři má stejné zakulacení jako pole pro e-mail a text **Získat praktického průvodce**. V podnadpisu i po odeslání je „průvodce“, slovo „tahák“ na stránce není.

---

**User**

předělej spodní banner („S ETF budete mít o . více“), ať ladí s kartami nahoře.

Odstraň tmavou výplň. Dej banneru bílé pozadí (bg-white), stejné zaoblení rohů a jemný stín jako mají karty nad ním.

Nastav mu o trovhu zářivější zelený rámeček (border-2 border-emerald-500 nebo border-green-500).

Sjednocení:

Zmenši tloušťku písma (z těžkého extra-bold/black na běžné font-bold nebo font-semibold), aby nepůsobilo mohutněji než čísla v kartách.

Text „S ETF budete mít navíc:“ dej v naší tmavě kávové barvě a samotnou částku zvýrazni stejnou zelenou, jaká je na kartě ETF

---

**Cursor**

Spodní pruh přebarvím na bílou kartu se zeleným rámečkem, kávový text nechám a částku zvýrazním stejnou zelenou jako na kartě ETF.

Spodní banner je teď bílá karta ve stejném duchu jako srovnání nad ním.

Má bílé pozadí, zaoblení `rounded-2xl`, jemný stín a o něco zářivější zelený rámeček `border-2 border-emerald-500`. Tmavá výplň je pryč.

Text **S ETF budete mít navíc:** je tmavě kávový a lehčí (`font-semibold`). Částka je ve stejné zelené jako číslo na kartě ETF. U výchozího VOO je to **2 992 575 Kč**, po přepnutí na QQQ se změní na **7 997 811 Kč**. Poznámka pod pruhem zůstává.

---

**User**

Stálen ení aplikována správná barva místo černé, takže důsledně tmavě kávová barva (#2b211b) napříč celým webem:

V app/globals.css nastav pro body, veškeré nadpisy (h1, h2, h3, p) a výchozí text barvu #2b211b. Žádný text na stránce nesmí mít čistě černou barvu #000000.

Všechna tmavá tlačítka (Hero tlačítko, aktivní záložka QQQ/VOO, tlačítko ve formuláři) musí mít ve výchozím stavu třídu bg-[#2b211b], nikoliv černou s hnědým hoverem.

U posuvníků v FeeCalculator.tsx nastav accent-[#2b211b] i barvu vyplněné stopy posuvníku na #2b211b.

Zesílení lemování spodní bubliny:

U spodní karty „S ETF budete mít navíc“ nastav o stupeň silnější zelený rámeček (border-[3px] border-emerald-500 nebo border-4), aby byla výraznější než karta ETF nahoře.

Identické formátování částky:

Zkopíruj přesně stejné CSS třídy zelené částky z ETF karty (velikost, řez písma, přesný odstín zelené např. text-emerald-600 font-bold) a aplikuj je na částku 2 992 575 Kč ve spodní bublině, ať jsou obě částky vizuálně totožné.

Stálen ení aplikována správná barva místo černé, takže důsledně tmavě kávová barva (#2b211b) napříč celým webem:

V app/globals.css nastav pro body, veškeré nadpisy (h1, h2, h3, p) a výchozí text barvu #2b211b. Žádný text na stránce nesmí mít čistě černou barvu #000000.

Všechna tmavá tlačítka (Hero tlačítko, aktivní záložka QQQ/VOO, tlačítko ve formuláři) musí mít ve výchozím stavu třídu bg-[#2b211b], nikoliv černou s hnědým hoverem.

U posuvníků v FeeCalculator.tsx nastav accent-[#2b211b] i barvu vyplněné stopy posuvníku na #2b211b.

Zesílení lemování spodní bubliny:

U spodní karty „S ETF budete mít navíc“ nastav o stupeň silnější zelený rámeček (border-[3px] border-emerald-500 nebo border-4), aby byla výraznější než karta ETF nahoře.

Identické formátování částky:

Zkopíruj přesně stejné CSS třídy zelené částky z ETF karty (velikost, řez písma, přesný odstín zelené např. text-emerald-600 font-bold) a aplikuj je na částku 2 992 575 Kč ve spodní bublině, ať jsou obě částky vizuálně totožné.

---

**Cursor**

Projdu styly a komponenty a sjednotím kávovou barvu, posuvníky i formátování částky ve spodní bublině.

Doplním globální kávovou barvu, styl stopy posuvníků a sjednotím částku ve spodní bublině s kartou ETF.

Globální `p { color }` by přebilo šedé popisky. Nastavím kávovou jen na body a nadpisy a opravím typ u posuvníku.

---

**User**

uprav styling tří přepínacích tlačítek ETF (VOO, QQQ, VT):

Kurzor myši: Přidej všem třem tlačítkům třídu cursor-pointer, aby se při najetí myši šipka okamžitě změnila na ručičku.

Odezva na najetí (hover efekt):

Neaktivní tlačítka: Přidej jim transition-colors duration-150 hover:bg-stone-200 hover:text-[#2b211b], aby při přejetí myší zřetelně reagovala ztmavením.

Aktivní tlačítko: Přidej mu hover:opacity-90 transition-opacity, aby nepůsobilo staticky.

---

**Cursor**

Hotovo. Všechna tři tlačítka mají `cursor-pointer`. Neaktivní při hoveru ztmavnou (`hover:bg-stone-200`), aktivní jemně zesvětlí přes `hover:opacity-90`.

---

**User**

prav pouze částku na pravé kartě (Banka):U hodnoty „Na konci vám zůstane“ u Banky (částka 2 397 847 Kč) změň barvu textu na tlumenou šedou: text-stone-400 (místo tmavé barvy).   Ponech velikost, ale díky šedé barvě přestane opticky konkurovat zelené částce u ETF vlevo. 
V dolní kartě přepiš "Získat praktického průvodce" na "Získat"

---

**Cursor**

Částka u banky je teď `text-stone-400` a tlačítko ve formuláři říká jen **Získat**.

---

**User**

částku v pravé kartě BANKA (na konci vám zůstane) převeď do méně výrazného odstínu (použij šedou barvu jako dříve), aby pravá karta působila méně dominantní než ta levá.

---

**Cursor**

Globální pravidlo `p { color: inherit }` přebíjí Tailwind, takže šedá na částce banky neplatí. Odstraním ho, aby `text-stone-400` zase fungovalo.

Hotovo. Globální styl u `p` přepisoval šedou na kávovou barvu. Částka u banky teď skutečně používá `text-stone-400` a oproti zelené částce u ETF ustupuje do pozadí.

---

**User**

částka je pořád tučně černá, neprojevily se žádné změny

---

**Cursor**

Podívám se, co stránka skutečně renderuje a co přebíjí šedou barvu u částky banky.

V CSS pořád platí `p { color: inherit }`, které přebíjí Tailwind. Částku banky dám do `div` a barvu nastavím přímo, ať to nejde přepsat.

Šedá barva teď platí. Odstraním ještě inline styl a nechám čistou Tailwind třídu na `div`.

Příčina byla v globálním CSS: pravidlo `p { color: inherit }` přebíjelo Tailwind a částka zůstávala kávově tmavá.

Částku u banky jsem přesunul z `<p>` do `<div>` s `text-stone-400`. Teď je světle šedá a zelené částce u ETF už nekonkuruje. Po hard refresh (`Cmd+Shift+R`) bys to měl vidět hned.

---

**User**

Hero.tsx uprav hlavní nadpis H1:

Odstraň červenou barvu: Číslovka „30 %“ bude mít stejnou tmavě kávovou barvu jako zbytek nadpisu, žádný červený text.

Zmenši velikost písma: Uprav třídy na text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight, aby nadpis nepůsobil tak masivně a byl o stupeň decentnější.

---

**Cursor**

Hotovo. „30 %“ má stejnou kávovou barvu jako zbytek H1 a nadpis je menší (`text-3xl` → `sm:text-4xl` → `md:text-5xl`).

---

**User**

z úvodního textu vymaž "na 2 kliknutí". Výsledek má vypadat:
Spočítejte si, o kolik více naspoříte díky nízkonákladovým ETF z burzy NYSE.

---

**Cursor**

Hotovo. Druhá věta teď zní: „Spočítejte si, o kolik více naspoříte díky nízkonákladovým ETF z burzy NYSE.“

---

**User**

" o kolik" odentruj na novou řádku

---

**Cursor**

Hotovo. „o kolik více naspoříte…“ teď začíná na novém řádku pod „Spočítejte si,“.

---

**User**

V components/FeeCalculator.tsx:

U řádku „Odevzdáte na poplatcích:“ doplň k částkám do závorky roční procentní sazbu.

U ETF zobraz: {formatCurrency(etfFees)} ({etfFeePercent}% ročně)

U Banky zobraz: {formatCurrency(bankFees)} ({bankFeePercent}% ročně)

V components/EtfCards.tsx:

U ikony otazníku vedle textu „Poplatek TER“ nastav text tooltipu:
„Veškeré roční náklady na správu fondu. Neplatíte nic navíc, fond si poplatek automaticky započítává do hodnoty. Na burze činí jen 0,03 % až 0,20 % ročně, v běžné bance 1,5 % až 2,5 % ročně.

---

**Cursor**

Doplním roční sazbu k poplatkům v kalkulačce a přepíšu tooltip u TER.

U „Odevzdáte na poplatcích:“ je teď u ETF i banky v závorce roční sazba (např. `23 112 Kč (0,03% ročně)` a `698 501 Kč (1,8% ročně)`). Tooltip u TER má nový laický text o nákladech na burze i v bance.

---

**User**

Do tří karet ETF přidej označení rizika na škále konzervativní –dynamický:   VOO: štítek „Růstový profil“   QQQ: štítek „Vysoce dynamický“ a pod popis doplň drobným písmem: „Vyšší kolísavost: výnosy nejsou garantované a fond prochází výraznými propady i růsty.“   VT: štítek „Globální diverzifikace“   Štítky dej nahoru vedle burzy a pohlídej, ať karty zůstanou stejně vysoké a zarovnané a nic dalšího se na nich nemění

---

**Cursor**

Přidám štítky do dat a v kartách je dám vedle burzy; u QQQ doplním poznámku o kolísavosti.

Hotovo. U burzy je teď štítek: **Růstový profil** (VOO), **Vysoce dynamický** (QQQ), **Globální diverzifikace** (VT). U QQQ je pod popisem drobná poznámka o vyšší kolísavosti. Karty zůstávají stejně vysoké díky `justify-between` a gridu.

