import { MAX_SCORE, PASS_THRESHOLD, scoreColour, isPassingScore } from "@/lib/report-score";

/**
 * The score and its verdict, rendered once for both reports.
 *
 * lib/report-score already held the threshold and the colour bands, but each
 * report still sized its own type, and they had drifted: the real report let
 * "/10.5" inherit 44px while the sample overrode it to 28px, so the same
 * score looked like two different designs depending on which page you were
 * on. Moving the logic and leaving the typography behind is how that
 * happened, so the whole thing lives here now.
 *
 * The denominator matches the number. It is part of the figure rather than a
 * footnote to it, and at a smaller size the eye reads "7" as the score and
 * has to go back for the scale.
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
  /** Layout of the row, which differs between the hero panel and the full
   *  report. Everything inside it is fixed. */
  className?: string;
  badgeFontSize?: number;
}) {
  return (
    <>
    <div className={`flex items-end gap-2.5 flex-wrap ${className}`}>
      {/* Green at or above the pass mark, orange within striking distance of
          it, red well short. A candidate reads where they stand off the
          number itself. */}
      <span className="font-extrabold leading-none" style={{ fontSize: 44, color: scoreColour(total) }}>
        {total}
        <span className="font-extrabold">/{MAX_SCORE}</span>
      </span>

      {/* Only a pass is named: the colour already carries the two bands of
          shortfall, and saying it again in a word was noise. Set a little
          below the number's own size because at matching type the padding
          made the badge the tallest thing in the row. */}
      {isPassingScore(total) && (
        <span
          className="font-extrabold uppercase px-4 py-1.5 rounded-xl leading-none tracking-[0.02em]"
          style={{ fontSize: badgeFontSize, background: "rgba(34,197,94,0.11)", color: "#166534" }}
        >
          Pass
        </span>
      )}
    </div>

    {/* Where the line is. The sample stated this and the full report did not,
        with the number typed out rather than read from the threshold, so the
        two pages disagreed about whether a candidate is told what they are
        aiming at. Both say it now, and it comes from the constant. */}
    <p className="text-[12px] mb-5" style={{ color: "rgba(51,51,51,0.4)" }}>
      Pass threshold: {PASS_THRESHOLD} pts
    </p>
    </>
  );
}
