"use client";

import { TestimonialRowActions } from "./TestimonialRowActions";

type Testimonial = {
  id: string;
  quote: string;
  name: string;
  vts: string | null;
  sca_date: string | null;
  display_order: number;
  published: boolean;
};

export function TestimonialTable({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <div className="rounded-2xl border border-navy/10 bg-white overflow-hidden">
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-navy/10 bg-navy/[0.03]">
            <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50 w-8">#</th>
            <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Quote</th>
            <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Name</th>
            <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">VTS</th>
            <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">SCA Date</th>
            <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Status</th>
            <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Actions</th>
          </tr>
        </thead>
        <tbody>
          {testimonials.map((t, i) => (
            <tr
              key={t.id}
              className={i < testimonials.length - 1 ? "border-b border-navy/[0.06]" : ""}
            >
              <td className="px-5 py-3 text-navy/30 text-[12px]">{t.display_order}</td>
              <td className="px-5 py-3 max-w-[320px]">
                <div className="text-navy line-clamp-2">&ldquo;{t.quote}&rdquo;</div>
              </td>
              <td className="px-5 py-3 font-semibold text-navy whitespace-nowrap">{t.name}</td>
              <td className="px-5 py-3 text-navy/60 whitespace-nowrap">{t.vts ?? "—"}</td>
              <td className="px-5 py-3 text-navy/60 whitespace-nowrap">{t.sca_date ?? "—"}</td>
              <td className="px-5 py-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${t.published ? "bg-green-50 text-green-700" : "bg-navy/10 text-navy/40"}`}>
                  {t.published ? "Published" : "Draft"}
                </span>
              </td>
              <td className="px-5 py-3">
                <TestimonialRowActions id={t.id} name={t.name} published={t.published} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
