"use client";

import { useState, type FormEvent } from "react";

export default function LeadForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();
    if (!value) return;
    setEmail(value);
    setSubmitted(true);
  }

  return (
    <section className="bg-zinc-50 px-4 pt-2 pb-16 font-sans text-[#2b211b] sm:px-6">
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 sm:p-8">
        {submitted ? (
          <div role="status">
            <h2 className="text-2xl font-semibold tracking-tight text-[#2b211b]">Děkujeme</h2>
            <p className="mt-3 text-base leading-7 text-zinc-600">
              Průvodce odesíláme na {email}.
            </p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-semibold tracking-tight text-balance text-[#2b211b]">
              Chcete začít investovat do ETF bez chyb?
            </h2>
            <p className="mt-3 text-base leading-7 text-zinc-600">
              Zadejte e-mail a pošleme vám praktického průvodce: Jak koupit své první ETF na burze
              v roce 2026 krok za krokem.
            </p>
            <form className="mt-6 flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
              <label className="sr-only" htmlFor="lead-email">
                E-mail
              </label>
              <input
                id="lead-email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="vas@email.cz"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-zinc-200 px-4 py-3 text-base text-[#2b211b] outline-none focus:border-[#2b211b]"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-[#2b211b] px-6 py-3 text-base font-semibold text-white hover:bg-[#3d322c]"
              >
                Získat
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
