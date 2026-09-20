import { Check, Clock3, Dumbbell, Flame, Users } from "lucide-react";
import { FlagshipAction, type FlagshipPreviewProps } from "./flagship-shared";

export function GymFlagshipPreview({
  business,
  direction,
}: FlagshipPreviewProps) {
  return (
    <article
      className="studio-flagship studio-gym-flagship"
      data-testid="studio-gym-flagship"
      aria-label={`${business.sampleName} gym and fitness website concept`}
    >
      <header className="studio-flagship-nav">
        <strong>{business.sampleName}</strong>
        <span className="studio-flagship-nav-links" aria-hidden="true">
          <span>Programs</span>
          <span>Coaches</span>
          <span>Join</span>
        </span>
        <FlagshipAction>Claim a trial week</FlagshipAction>
      </header>

      <section className="studio-flagship-hero studio-forge-hero">
        <div className="studio-flagship-copy">
          <p>{business.sampleEyebrow}</p>
          <h3>{business.sampleHeadline}</h3>
          <span>{business.sampleCopy}</span>
          <div className="studio-flagship-actions" aria-hidden="true">
            <b>{business.primaryAction}</b>
            <em>{business.secondaryAction}</em>
          </div>
          <div
            className="studio-forge-programs"
            aria-label="Example training programs"
          >
            <span>Strength</span>
            <span>Conditioning</span>
            <span>Mobility</span>
          </div>
        </div>

        <div className="studio-forge-scene" aria-hidden="true">
          <span className="studio-forge-lanes" />
          <span className="studio-forge-ring" />
          <span className="studio-forge-timer">
            <Clock3 size={14} /> Next class 06:00
          </span>
          <span className="studio-forge-note">
            <Flame size={13} /> Coached floor · open from 5 am
          </span>
        </div>
      </section>

      <section
        className="studio-gym-schedule"
        aria-labelledby="gym-schedule-title"
      >
        <div className="studio-flagship-section-copy">
          <p>This week on the floor</p>
          <h4 id="gym-schedule-title">A timetable you can plan around.</h4>
          <span>
            Coached sessions capped in size, open floor hours for your own work,
            and every class bookable from the schedule.
          </span>
        </div>
        <ol>
          <li>
            <span>Mon</span>
            <div>
              <small>06:00 · Coached</small>
              <strong>Strength — barbell fundamentals</strong>
            </div>
            <b>Book</b>
          </li>
          <li>
            <span>Wed</span>
            <div>
              <small>18:00 · Coached</small>
              <strong>Conditioning — engine builder</strong>
            </div>
            <b>Book</b>
          </li>
          <li>
            <span>Sat</span>
            <div>
              <small>08:00 · Open floor</small>
              <strong>Open gym — coach on the floor</strong>
            </div>
            <b>Book</b>
          </li>
        </ol>
        <span className="studio-flagship-note">
          <Check size={15} aria-hidden="true" /> {direction.name} direction ·
          see the week, book in one tap
        </span>
      </section>

      <section
        className="studio-gym-coaches"
        aria-labelledby="gym-coaches-title"
      >
        <div className="studio-flagship-section-copy">
          <p>The people counting your reps</p>
          <h4 id="gym-coaches-title">Coaches who train with you.</h4>
        </div>
        <div className="studio-gym-coach-list">
          <article className="studio-gym-coach">
            <span className="studio-gym-coach-mark" aria-hidden="true">
              K
            </span>
            <div>
              <strong>Kinley</strong>
              <small>Head coach · Strength</small>
              <span>Barbell club · Foundations</span>
            </div>
          </article>
          <article className="studio-gym-coach">
            <span className="studio-gym-coach-mark" aria-hidden="true">
              D
            </span>
            <div>
              <strong>Dechen</strong>
              <small>Conditioning lead</small>
              <span>Engine builder · Mobility</span>
            </div>
          </article>
        </div>
      </section>

      <section
        className="studio-gym-membership"
        aria-labelledby="gym-membership-title"
      >
        <div className="studio-flagship-section-copy">
          <p>Membership</p>
          <h4 id="gym-membership-title">Two ways in. No lock-ins.</h4>
        </div>
        <div className="studio-gym-plans">
          <div className="studio-gym-plan">
            <small>Open train</small>
            <strong>Nu 3,500 / month</strong>
            <span>All classes · Open floor · App booking</span>
          </div>
          <div className="studio-gym-plan is-coached">
            <small>
              <Users size={12} aria-hidden="true" /> Coached
            </small>
            <strong>Nu 6,500 / month</strong>
            <span>Everything in Open · Personal plan · Monthly review</span>
          </div>
        </div>
        <span className="studio-gym-trial">
          <Dumbbell size={15} aria-hidden="true" /> First trial week is free —
          three coached sessions
        </span>
      </section>
    </article>
  );
}
