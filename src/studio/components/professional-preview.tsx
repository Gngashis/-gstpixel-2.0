import { ArrowRight, Check, Clock3, Compass, FileText } from "lucide-react";
import { FlagshipAction, type FlagshipPreviewProps } from "./flagship-shared";

export function ProfessionalFlagshipPreview({
  business,
  direction,
}: FlagshipPreviewProps) {
  return (
    <article
      className="studio-flagship studio-corp-flagship"
      data-testid="studio-professional-flagship"
      aria-label={`${business.sampleName} professional services website concept`}
    >
      <header className="studio-flagship-nav">
        <strong>{business.sampleName}</strong>
        <span className="studio-flagship-nav-links" aria-hidden="true">
          <span>Capabilities</span>
          <span>Method</span>
          <span>Contact</span>
        </span>
        <FlagshipAction>Book a consultation</FlagshipAction>
      </header>

      <section className="studio-flagship-hero studio-corp-hero">
        <div className="studio-flagship-copy">
          <p>{business.sampleEyebrow}</p>
          <h3>{business.sampleHeadline}</h3>
          <span>{business.sampleCopy}</span>
          <div className="studio-flagship-actions" aria-hidden="true">
            <b>{business.primaryAction}</b>
            <em>{business.secondaryAction}</em>
          </div>
        </div>

        <div className="studio-corp-mark" aria-hidden="true">
          <span className="studio-corp-grid" />
          <span className="studio-corp-line studio-corp-line-one" />
          <span className="studio-corp-line studio-corp-line-two" />
          <span className="studio-corp-line studio-corp-line-three" />
          <span className="studio-corp-mark-note">
            Advisory work · shown as process, not promises
          </span>
        </div>
      </section>

      <section
        className="studio-corp-thesis"
        aria-labelledby="corp-thesis-title"
      >
        <p>Positioning</p>
        <h4 id="corp-thesis-title">
          We work on decisions that do not get a second try.
        </h4>
        <span>
          Market entries, pricing structures, operating models — the choices a
          business lives with. The advice is written, reasoned, and owned by the
          people who give it.
        </span>
      </section>

      <section className="studio-corp-list" aria-labelledby="corp-list-title">
        <div className="studio-flagship-section-copy">
          <p>Capabilities</p>
          <h4 id="corp-list-title">Three practices, kept deliberately few.</h4>
        </div>
        <ol>
          <li>
            <span>01</span>
            <div>
              <small>Strategy &amp; positioning</small>
              <strong>Choose the next market with evidence</strong>
            </div>
            <ArrowRight size={14} aria-hidden="true" />
          </li>
          <li>
            <span>02</span>
            <div>
              <small>Operations &amp; systems</small>
              <strong>Make the business run without heroics</strong>
            </div>
            <ArrowRight size={14} aria-hidden="true" />
          </li>
          <li>
            <span>03</span>
            <div>
              <small>Compliance &amp; structure</small>
              <strong>Stay clean while you grow</strong>
            </div>
            <ArrowRight size={14} aria-hidden="true" />
          </li>
        </ol>
      </section>

      <section
        className="studio-corp-method"
        aria-labelledby="corp-method-title"
      >
        <div className="studio-flagship-section-copy">
          <p>Method</p>
          <h4 id="corp-method-title">How an engagement actually runs.</h4>
        </div>
        <div className="studio-corp-steps">
          <div>
            <span>01 · Listen</span>
            <strong>A working session before any proposal</strong>
            <small>
              We learn the business from the people running it — no pitch deck.
            </small>
          </div>
          <div>
            <span>02 · Diagnose</span>
            <strong>A written view of what is actually wrong</strong>
            <small>
              Findings in plain language, with the trade-offs stated openly.
            </small>
          </div>
          <div>
            <span>03 · Deliver</span>
            <strong>Scoped work with named people</strong>
            <small>
              Fixed scope, weekly written updates, and a clear end point.
            </small>
          </div>
        </div>
        <dl className="studio-corp-terms" aria-label="Engagement details">
          <div>
            <dt>
              <Clock3 size={13} aria-hidden="true" /> First conversation
            </dt>
            <dd>Free · 30 minutes</dd>
          </div>
          <div>
            <dt>
              <FileText size={13} aria-hidden="true" /> Engagement model
            </dt>
            <dd>Fixed scope, named team</dd>
          </div>
          <div>
            <dt>
              <Compass size={13} aria-hidden="true" /> {direction.name} detail
            </dt>
            <dd>Plain-language reporting</dd>
          </div>
        </dl>
      </section>

      <section className="studio-corp-proof" aria-label="How we work">
        <div>
          <Check size={16} aria-hidden="true" />
          <small>Senior people</small>
          <strong>Do the work, not just sell it</strong>
        </div>
        <div>
          <Check size={16} aria-hidden="true" />
          <small>Confidentiality</small>
          <strong>Confidential by default</strong>
        </div>
        <div>
          <Check size={16} aria-hidden="true" />
          <small>Honesty</small>
          <strong>No juniors billed as experts</strong>
        </div>
      </section>
    </article>
  );
}
