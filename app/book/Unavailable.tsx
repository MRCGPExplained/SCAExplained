import Link from "next/link";

/** Shown when a [date] has no matching upcoming event — past, cancelled,
 *  sold out of existence, or simply not a real date. */
export function Unavailable({ kind }: { kind: "webinar" | "intensive" }) {
  const anchor = kind === "webinar" ? "#webinar-dates" : "#intensive-dates";
  return (
    <main className="bg-cream min-h-screen flex items-center justify-center px-6">
      <div className="max-w-[460px] text-center">
        <h1 className="font-display font-extrabold text-[28px] text-navy mb-3">
          This date isn&apos;t available
        </h1>
        <p className="text-[14.5px] leading-[1.6] text-navy/65 mb-7">
          The session you&apos;re looking for may have already taken place or been
          fully booked. Take a look at our upcoming dates instead.
        </p>
        <Link
          href={`/${anchor}`}
          className="inline-flex items-center rounded-lg bg-navy text-white font-semibold px-6 py-3 text-sm no-underline hover:-translate-y-0.5 transition-transform"
        >
          See upcoming dates
        </Link>
      </div>
    </main>
  );
}
