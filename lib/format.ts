const czechCrowns = new Intl.NumberFormat("cs-CZ", {
  style: "currency",
  currency: "CZK",
  maximumFractionDigits: 0,
});

/** Celé koruny v českém zápisu, například „2 400 000 Kč“. */
export function formatCzk(amount: number): string {
  return czechCrowns.format(amount);
}
