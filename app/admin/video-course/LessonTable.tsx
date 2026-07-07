"use client";

import { useState, useRef } from "react";
import { reorderVideoLessonsAction } from "../actions";
import { VideoRowActions } from "./VideoRowActions";

type Lesson = {
  id: string;
  title: string;
  description: string | null;
  bunny_video_id: string | null;
  duration_minutes: number | null;
  display_order: number;
  published: boolean;
};

export function LessonTable({ initial }: { initial: Lesson[] }) {
  const [lessons, setLessons] = useState(initial);
  const [saving, setSaving] = useState(false);
  const dragIdx = useRef<number | null>(null);

  function onDragStart(i: number) {
    dragIdx.current = i;
  }

  function onDragOver(e: React.DragEvent, i: number) {
    e.preventDefault();
    const from = dragIdx.current;
    if (from === null || from === i) return;
    const next = [...lessons];
    const [moved] = next.splice(from, 1);
    next.splice(i, 0, moved);
    dragIdx.current = i;
    setLessons(next);
  }

  async function onDrop() {
    dragIdx.current = null;
    setSaving(true);
    const items = lessons.map((l, i) => ({ id: l.id, display_order: i + 1 }));
    await reorderVideoLessonsAction(items);
    setSaving(false);
  }

  return (
    <div className="rounded-2xl border border-navy/10 bg-white overflow-hidden">
      {saving && (
        <div className="px-5 py-2 text-[11px] text-navy/40 border-b border-navy/10 bg-navy/[0.02]">
          Saving order…
        </div>
      )}
      <table className="w-full text-[13px]">
        <thead>
          <tr className="border-b border-navy/10 bg-navy/[0.03]">
            <th className="text-left px-3 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/30 w-8"></th>
            <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50 w-10">#</th>
            <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Title</th>
            <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Video</th>
            <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Mins</th>
            <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Status</th>
            <th className="text-left px-5 py-3 text-[11px] font-bold tracking-[0.06em] uppercase text-navy/50">Actions</th>
          </tr>
        </thead>
        <tbody>
          {lessons.map((lesson, i) => (
            <tr
              key={lesson.id}
              draggable
              onDragStart={() => onDragStart(i)}
              onDragOver={(e) => onDragOver(e, i)}
              onDrop={onDrop}
              className={`${i < lessons.length - 1 ? "border-b border-navy/[0.06]" : ""} cursor-grab active:cursor-grabbing hover:bg-[#F6D44B]/10 active:bg-[#F6D44B]/10`}
            >
              <td className="px-3 py-3 text-navy/20 text-[14px] select-none">⠿</td>
              <td className="px-5 py-3 text-navy/30 text-[12px]">{i + 1}</td>
              <td className="px-5 py-3">
                <div className="font-semibold text-navy">{lesson.title}</div>
                {lesson.description && (
                  <div className="text-[12px] text-navy/45 mt-0.5 line-clamp-1">{lesson.description}</div>
                )}
              </td>
              <td className="px-5 py-3 text-[12px]">
                {lesson.bunny_video_id ? (
                  <span className="text-green-600 font-semibold">Set</span>
                ) : (
                  <span className="text-navy/30 italic">Not set</span>
                )}
              </td>
              <td className="px-5 py-3 text-[12px] text-navy/50">
                {lesson.duration_minutes ?? "—"}
              </td>
              <td className="px-5 py-3">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${lesson.published ? "bg-green-50 text-green-700" : "bg-navy/10 text-navy/40"}`}>
                  {lesson.published ? "Published" : "Draft"}
                </span>
              </td>
              <td className="px-5 py-3">
                <VideoRowActions id={lesson.id} title={lesson.title} published={lesson.published} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
