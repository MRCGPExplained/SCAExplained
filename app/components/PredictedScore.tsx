import { MAX_SCORE, scoreColour, isPassingScore } from "@/lib/report-score";

/**
 * The score and its verdict, rendered once for both reports.
 *
 * lib/report-score holds the threshold and the colour bands, but each report
 * used to size its own type and they had drifted: one let "/10.5" inherit
 * 44px while the other overrode it to 28, so the same score looked like two
 * designs depending which page you were on. The whole presentation lives here
 * now.
 *
 * The denominator matches the number. It is part of the figure rather than a
 * footnote to it, and at a smaller size the eye reads "7" as the score and
 * has to go back for the scale.
 *
 * No caption naming the pass mark. It said "Pass threshold: 7 pts" under a
 * number that is already green and already badged, which is the third way of
 * saying the same thing on one line of a card.
 *
 * No hooks and no state, so a server component and a client component can
 * both render it.
 */
export function PredictedScore({
  total,
  className = "",
  badgeFontSize = 30,
}: {
  total: number;
  /** Extra layout for the row; the hero panel and the full report sit in
   *  different widths. Everything inside it is fixed. */
  className?: string;
  badgeFontSize?: number;
}) {
  return (
    <div className={`flex items-end gap-2.5 mb-5 ${className}`}>
      {/* Green at or above the pass mark, orange within striking distance of
          it, red well short. A candidate reads where they stand off the
          number itself. */}
      <span className="font-extrabold leading-none shrink-0" style={{ fontSize: 44, color: scoreColour(total) }}>
        {total}
        <span className="font-extrabold">/{MAX_SCORE}</span>
      </span>

      {/* The badge sits centred in whatever room is left rather than hard
          against the number or hard against the right edge, so it reads as
          the verdict on the score instead of a second, unrelated label.
          The spacer keeps its width whether or not a badge is in it, which
          stops the number shifting between a pass and a fail. */}
      <span className="flex-1 flex justify-center">
        {isPassingScore(total) && (
          <span
            className="font-extrabold uppercase px-4 py-1.5 rounded-xl leading-none tracking-[0.02em]"
            style={{ fontSize: badgeFontSize, background: "rgba(34,197,94,0.11)", color: "#166534" }}
          >
            Pass
          </span>
        )}
      </span>
    </div>
  );
}
