import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/current-user";
import { PlanCards } from "@/app/components/PlanCards";
import { TrialTutorial } from "./TrialTutorial";
import { trialCapacityAction } from "./actions";
import { TRIAL_CAP_MESSAGE } from "@/lib/trial";

export const dynamic = "force-dynamic";

const DARK = "#333333";

export const metadata = {
  title: "Try a case free · SCA Focus",
  description:
    "One full SCA case, free and with no account: a real consultation with a partner, transcribed and marked against the RCGP domains.",
};

export default async function TryPage() {
  /*
    A signed-in visitor is sent to the case bank rather than shown this.

    Not tidiness: starting a trial calls signInAnonymously, which REPLACES
    the current session. Somebody with a live plan who wandered in here would
    be quietly signed out of what they paid for and handed a one-case
    anonymous account instead. The homepage hides the button for the same
    reason; this is the half that cannot be bypassed by typing the URL.
  */
  const user = await getCurrentUser();
  if (user && !user.is_anonymous) redirect("/case-bank");

  const { available } = await trialCapacityAction();

  return (
    <main className="min-h-screen px-6 py-16" style={{ background: "#FAFAF8" }}>
      {available ? (
        <TrialTutorial />
      ) : (
        /*
          A capped day is a sales moment, not an error page. Somebody who got
          here wanted to try the product; the worst thing to do is show them a
          failure and nothing else.
        */
        <div className="max-w-[1150px] mx-auto">
          <div className="max-w-[560px] mx-auto text-center mb-14">
            <h1 className="font-display font-extrabold text-[30px] leading-[1.2] mb-4" style={{ color: DARK }}>
              Today&apos;s free sessions have all gone
            </h1>
            <p className="text-[15px] leading-[1.7] mb-6" style={{ color: "rgba(51,51,51,0.68)" }}>
              {TRIAL_CAP_MESSAGE}
            </p>
            <Link
              href="/"
              className="text-[14px] underline"
              style={{ color: "rgba(51,51,51,0.6)" }}
            >
              Back to the homepage
            </Link>
          </div>
          <PlanCards />
        </div>
      )}
    </main>
  );
}
