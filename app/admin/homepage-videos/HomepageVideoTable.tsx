"use client";

import { useState, useRef } from "react";
import { reorderHomepageVideosAction } from "../actions";
import { HomepageVideoRowActions } from "./HomepageVideoRowActions";

type HomepageVideo = {
  id: string;
  title: string;
  description: string | null;
  bunny_video_id: string | null;
  display_order: number;
  published: boolean;
};

export function HomepageVideoTable({ initial }: { initial: HomepageVideo[] }) {
  const [videos, setVideos] = useState(initial);
  const [saving, setSaving] = useState(false);
  const dragIdx = useRef<number | null>(null);

  function onDragStart(i: number) { dragIdx.current = i; }

  function onDragOver(e: React.DragEvent, i: number) {
    e.preventDefault();
    const from = dragIdx.current;
    if (from === null || from === i) return;
    const next = [...videos];
    const [moved] = next.splice(from, 1);
    next.splice(i, 0, moved);
    dragIdx.current = i;
    setVideos(next);
  }

  async function onDrop() {
    dragIdx.current = null;
    setSaving(true);
    await reorderHomepageVideosAction(videos.map((v, i) => ({ id: v.id, display_order: i + 1 })));
    setSaving(false);
  }

  return (
    <div className="rounded-2xl border border-navy/10 bg-white overflow-hidden">
      {saving && (
        <div className="px-5 py-2 text-[11px] text-navy/40 border-b border-navy/10 bg-navy/[0.02]">Saving order…</div>
      )}
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-navy/10 bg-navy/[0.03]">
            <th className="text-left px-3 py-3 w-8"></th>
            <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50 w-8">#</th>
            <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Title</th>
            <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Video</th>
            <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Status</th>
            <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Actions</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((v, i) => (
            <tr
              key={v.id}
              draggable
              onDragStart={() => onDragStart(i)}
              onDragOver={(e) => onDragOver(e, i)}
              onDrop={onDrop}
              className={`${i < videos.length - 1 ? "border-b border-navy/[0.06]" : ""} cursor-grab active:cursor-grabbing active:bg-navy/[0.02]`}
            >
              <td className="px-3 py-3 text-navy/20 text-[14px] select-none">⠿</td>
              <td className="px-5 py-3 text-navy/30 text-[12px]">{i + 1}</td>
              <td className="px-5 py-3">
                <div className="font-semibold text-navy">{v.title}</div>
                {v.description && <div className="text-[12px] text-navy/45 mt-0.5 line-clamp-1">{v.description}</div>}
              </td>
              <td className="px-5 py-3 text-[12px]">
                {v.bunny_video_id ? <span className="text-green-600 font-semibold">Set</span> : <span className="text-navy/30 italic">Not set</span>}
              </td>
              <td className="px-5 py-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${v.published ? "bg-green-50 text-green-700" : "bg-navy/10 text-navy/40"}`}>
                  {v.published ? "Published" : "Draft"}
                </span>
              </td>
              <td className="px-5 py-3">
                <HomepageVideoRowActions id={v.id} title={v.title} published={v.published} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
