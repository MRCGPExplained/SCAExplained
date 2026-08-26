"use client";

import { useState } from "react";
import {
  countEmptyStudyRoomsAction,
  deleteEmptyStudyRoomsAction,
  countExpiredGuestAccountsAction,
  deleteExpiredGuestAccountsAction,
  countOldCandidateAudioAction,
  deleteOldCandidateAudioAction,
} from "../actions";

const NAVY = "#333333";

function todayMinus(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

function ConfirmDeleteBar({
  label,
  disabled,
  onConfirm,
}: {
  label: string;
  disabled: boolean;
  onConfirm: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  const [typed, setTyped] = useState("");

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        disabled={disabled}
        className="px-4 py-2 rounded-lg text-[12.5px] font-semibold text-white disabled:opacity-40"
        style={{ background: "#B91C1C", border: "none", cursor: disabled ? "not-allowed" : "pointer" }}
      >
        {label}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-[12.5px] text-navy/60">Type <strong>Delete</strong> to confirm:</span>
      <input
        autoFocus
        value={typed}
        onChange={(e) => setTyped(e.target.value)}
        className="border border-navy/20 rounded-lg px-2.5 py-1.5 text-[13px] outline-none focus:border-red-500 w-28"
      />
      <button
        type="button"
        onClick={() => { onConfirm(); setConfirming(false); setTyped(""); }}
        disabled={typed !== "Delete"}
        className="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white disabled:opacity-40"
        style={{ background: "#B91C1C", border: "none", cursor: typed === "Delete" ? "pointer" : "not-allowed" }}
      >
        Confirm
      </button>
      <button
        type="button"
        onClick={() => { setConfirming(false); setTyped(""); }}
        className="text-[12px] text-navy/40 hover:text-navy/70 transition"
        style={{ background: "none", border: "none", cursor: "pointer" }}
      >
        Cancel
      </button>
    </div>
  );
}

function CleanupCard({
  title,
  description,
  count,
  loading,
  onRefresh,
  onDelete,
  deleteLabel,
  result,
  extraControls,
}: {
  title: string;
  description: string;
  count: number | null;
  loading: boolean;
  onRefresh: () => void;
  onDelete: () => void;
  deleteLabel: string;
  result: string;
  extraControls?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-navy/10 bg-white p-6">
      <h2 className="font-display font-bold text-[15px] text-navy mb-1">{title}</h2>
      <p className="text-[12.5px] text-navy/50 mb-4">{description}</p>

      {extraControls}

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <span
          className="text-[13px] font-bold px-3 py-1.5 rounded-lg"
          style={{ background: "rgba(51,51,51,0.05)", color: NAVY }}
        >
          {loading ? "…" : count === null ? "—" : `${count} found`}
        </span>
        <button
          type="button"
          onClick={onRefresh}
          disabled={loading}
          className="text-[12px] font-semibold text-navy/50 hover:text-navy transition"
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          Refresh count
        </button>
      </div>

      {result && <p className="text-[12.5px] text-green-700 mb-3">{result}</p>}

      <ConfirmDeleteBar label={deleteLabel} disabled={loading || !count} onConfirm={onDelete} />
    </div>
  );
}

export function CleanupClient({
  initialEmptyRooms,
  initialExpiredGuests,
}: {
  initialEmptyRooms: number;
  initialExpiredGuests: number;
}) {
  const [roomsCount, setRoomsCount] = useState<number | null>(initialEmptyRooms);
  const [roomsLoading, setRoomsLoading] = useState(false);
  const [roomsResult, setRoomsResult] = useState("");

  const [guestsCount, setGuestsCount] = useState<number | null>(initialExpiredGuests);
  const [guestsLoading, setGuestsLoading] = useState(false);
  const [guestsResult, setGuestsResult] = useState("");

  const [audioDate, setAudioDate] = useState(todayMinus(90));
  const [audioCount, setAudioCount] = useState<number | null>(null);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioResult, setAudioResult] = useState("");

  async function refreshRooms() {
    setRoomsLoading(true);
    setRoomsResult("");
    setRoomsCount(await countEmptyStudyRoomsAction());
    setRoomsLoading(false);
  }

  async function deleteRooms() {
    setRoomsLoading(true);
    const result = await deleteEmptyStudyRoomsAction();
    setRoomsLoading(false);
    if (result.error) { setRoomsResult(""); return; }
    setRoomsResult(`Deleted ${result.deleted} empty room${result.deleted === 1 ? "" : "s"}.`);
    setRoomsCount(0);
  }

  async function refreshGuests() {
    setGuestsLoading(true);
    setGuestsResult("");
    setGuestsCount(await countExpiredGuestAccountsAction());
    setGuestsLoading(false);
  }

  async function deleteGuests() {
    setGuestsLoading(true);
    const result = await deleteExpiredGuestAccountsAction();
    setGuestsLoading(false);
    if (result.error) { setGuestsResult(""); return; }
    setGuestsResult(`Deleted ${result.deleted} expired guest account${result.deleted === 1 ? "" : "s"}.`);
    setGuestsCount(0);
  }

  async function refreshAudio() {
    setAudioLoading(true);
    setAudioResult("");
    const iso = new Date(audioDate).toISOString();
    setAudioCount(await countOldCandidateAudioAction(iso));
    setAudioLoading(false);
  }

  async function deleteAudio() {
    setAudioLoading(true);
    const iso = new Date(audioDate).toISOString();
    const result = await deleteOldCandidateAudioAction(iso);
    setAudioLoading(false);
    if (result.error) { setAudioResult(""); return; }
    setAudioResult(`Deleted audio for ${result.deleted} recording${result.deleted === 1 ? "" : "s"} (reports kept).`);
    setAudioCount(0);
  }

  return (
    <div className="flex flex-col gap-4 max-w-[600px]">
      <CleanupCard
        title="Empty Study Rooms"
        description="Rooms with no participants left in them. Safe to remove — nothing else references them."
        count={roomsCount}
        loading={roomsLoading}
        onRefresh={refreshRooms}
        onDelete={deleteRooms}
        deleteLabel="Delete Empty Rooms"
        result={roomsResult}
      />

      <CleanupCard
        title="Expired Guest Accounts"
        description="Guest (anonymous) accounts past their 24-hour access window. Removes the account and its room/star/feedback activity."
        count={guestsCount}
        loading={guestsLoading}
        onRefresh={refreshGuests}
        onDelete={deleteGuests}
        deleteLabel="Delete Expired Guests"
        result={guestsResult}
      />

      <CleanupCard
        title="Old Candidate Audio"
        description="Deletes doctor/patient/examiner-voice-note audio for recordings created before the date below — the transcript, AI grade, and GP review stay. Trainer Insight and Sample Consultation audio are never affected."
        count={audioCount}
        loading={audioLoading}
        onRefresh={refreshAudio}
        onDelete={deleteAudio}
        deleteLabel="Delete Old Audio"
        result={audioResult}
        extraControls={
          <div className="mb-4">
            <label className="block text-[11px] font-bold uppercase tracking-[0.06em] mb-1.5 text-navy/50">
              Recordings created before
            </label>
            <input
              type="date"
              value={audioDate}
              onChange={(e) => { setAudioDate(e.target.value); setAudioCount(null); setAudioResult(""); }}
              className="border border-navy/20 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-navy/50"
            />
          </div>
        }
      />
    </div>
  );
}
