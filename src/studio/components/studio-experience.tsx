import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  MessageCircle,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { ScrollReveal } from "@/components/page";
import { Button } from "@/components/ui/button";
import { useReducedMotion } from "@/lib/motion";
import {
  featuredStudioBusinessIds,
  getStudioBusiness,
  getStudioDirection,
  studioBusinesses,
  studioDirections,
  studioExperienceModules,
  studioVisualProfiles,
} from "../catalog";
import { buildStudioWhatsappHref } from "../contact";
import { initialStudioState, studioReducer } from "../state";
import type {
  StudioBusiness,
  StudioDirection,
  StudioVisualProfile,
} from "../types";
import { FlagshipPreview, flagshipBusinessIds } from "./flagship-previews";
import {
  PersonalizationPanel,
  type AppliedPersonalization,
} from "./personalization-panel";
import "../styles.css";

function StudioProgress({
  step,
}: {
  step: "business" | "direction" | "preview";
}) {
  const activeIndex = step === "business" ? 0 : step === "direction" ? 1 : 2;
  return (
    <ol className="studio-progress" aria-label="Website Studio progress">
      {["Business", "Direction", "Experience"].map((label, index) => (
        <li
          key={label}
          className={index <= activeIndex ? "is-active" : undefined}
          aria-current={index === activeIndex ? "step" : undefined}
        >
          <span>{String(index + 1).padStart(2, "0")}</span>
          <small>{label}</small>
        </li>
      ))}
    </ol>
  );
}

function BusinessCard({
  business,
  selected,
  onSelect,
}: {
  business: StudioBusiness;
  selected: boolean;
  onSelect: () => void;
}) {
  const Icon = business.icon;
  return (
    <button
      type="button"
      className={`studio-business-card${selected ? " is-selected" : ""}`}
      onClick={onSelect}
      aria-pressed={selected}
      data-business={business.id}
      style={
        {
          "--studio-business-accent": business.accent,
          "--studio-business-accent-soft": business.accentSoft,
        } as React.CSSProperties
      }
    >
      <span className="studio-business-icon" aria-hidden="true">
        <Icon size={22} strokeWidth={1.7} />
      </span>
      <span className="studio-business-copy">
        <strong>{business.name}</strong>
        <small>{business.prompt}</small>
      </span>
      <span className="studio-business-arrow" aria-hidden="true">
        <ChevronRight size={19} />
      </span>
    </button>
  );
}

function DirectionVisual({ direction }: { direction: StudioDirection }) {
  return (
    <span
      className={`studio-direction-visual is-${direction.id}`}
      aria-hidden="true"
    >
      <i className="studio-direction-signal" />
      <i className="studio-direction-field" />
      <i className="studio-direction-title-line" />
      <i className="studio-direction-copy-line" />
      <i className="studio-direction-action-line" />
    </span>
  );
}

function DirectionCard({
  direction,
  business,
  selected,
  onSelect,
}: {
  direction: StudioDirection;
  business: StudioBusiness;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={`studio-direction-card is-${direction.id}${selected ? " is-selected" : ""}`}
      onClick={onSelect}
      aria-pressed={selected}
      data-direction={direction.id}
      style={
        {
          "--studio-business-accent": business.accent,
          "--studio-business-accent-soft": business.accentSoft,
        } as React.CSSProperties
      }
    >
      <DirectionVisual direction={direction} />
      <span className="studio-direction-copy">
        <span className="studio-direction-cue">{direction.cue}</span>
        <strong>{direction.name}</strong>
        <small>{direction.character}</small>
        <span>{direction.description}</span>
      </span>
      <span className="studio-direction-check" aria-hidden="true">
        <Check size={15} strokeWidth={2.2} />
      </span>
    </button>
  );
}

function PreviewArtwork({
  business,
  profile,
}: {
  business: StudioBusiness;
  profile: StudioVisualProfile;
}) {
  return (
    <div
      className={`studio-preview-art is-${profile.imageTreatment}`}
      aria-hidden="true"
    >
      <span className="studio-art-orbit studio-art-orbit-one" />
      <span className="studio-art-orbit studio-art-orbit-two" />
      <span className="studio-art-horizon" />
      <span className="studio-art-mark">{business.shortName.slice(0, 1)}</span>
      <span className="studio-art-caption">A GSTPIXEL direction study</span>
    </div>
  );
}

function ExperiencePreview({
  business,
  direction,
  personalization,
}: {
  business: StudioBusiness;
  direction: StudioDirection;
  personalization: AppliedPersonalization | null;
}) {
  const profile = studioVisualProfiles[direction.id];
  const personalizedBusiness = personalization
    ? {
        ...business,
        sampleName: personalization.businessName || business.sampleName,
        sampleHeadline: personalization.content.headline,
        sampleCopy: personalization.content.intro,
      }
    : business;
  const isFlagship = flagshipBusinessIds.includes(
    business.id as (typeof flagshipBusinessIds)[number],
  );
  return (
    <div
      className={`studio-preview is-${profile.composition} is-${profile.surface} type-${profile.typeScale} motion-${profile.motion}`}
      data-testid="studio-preview"
      data-business={business.id}
      data-direction={direction.id}
      data-personalized={personalization ? "true" : "false"}
      style={
        {
          "--studio-business-accent": business.accent,
          "--studio-business-accent-soft": business.accentSoft,
        } as React.CSSProperties
      }
    >
      <div className="studio-browser-bar" aria-hidden="true">
        <span />
        <span />
        <span />
        <i>yourbusiness.com</i>
      </div>
      {isFlagship ? (
        <FlagshipPreview
          business={personalizedBusiness}
          direction={direction}
        />
      ) : (
        <>
          <div className="studio-preview-nav">
            <strong>{personalizedBusiness.sampleName}</strong>
            <span>Explore</span>
            <i aria-hidden="true" />
          </div>
          <div className="studio-preview-stage">
            <div className="studio-preview-message">
              <p>{personalizedBusiness.sampleEyebrow}</p>
              <h2>{personalizedBusiness.sampleHeadline}</h2>
              <span>{personalizedBusiness.sampleCopy}</span>
              <div className="studio-preview-actions" aria-hidden="true">
                <b>{personalizedBusiness.primaryAction}</b>
                <em>{personalizedBusiness.secondaryAction}</em>
              </div>
            </div>
            <PreviewArtwork business={personalizedBusiness} profile={profile} />
          </div>
        </>
      )}
      <div className="studio-preview-footer" aria-hidden="true">
        <span>{direction.name} direction</span>
        <i />
        <span>{business.shortName} experience</span>
      </div>
    </div>
  );
}

function BusinessSystem({
  business,
  personalization,
}: {
  business: StudioBusiness;
  personalization: AppliedPersonalization | null;
}) {
  const module = studioExperienceModules[business.id];
  return (
    <section className="studio-system" aria-labelledby="studio-system-title">
      <div className="studio-section-heading">
        <p>What the website could do</p>
        <h2 id="studio-system-title">{module.sectionLabel}</h2>
      </div>
      <ol className="studio-system-flow">
        {module.sections.map((section, index) => {
          const emphasis =
            personalization?.content.featuredModule === section.id
              ? "featured"
              : personalization?.content.secondaryModule === section.id
                ? "secondary"
                : undefined;

          return (
            <li
              key={section.id}
              className={emphasis ? `is-${emphasis}` : undefined}
              data-module={section.id}
              data-emphasis={emphasis}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{section.label}</strong>
              {index < module.sections.length - 1 && (
                <ArrowRight size={14} aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
      <div className="studio-proof-points">
        {module.proofPoints.map((point) => (
          <span key={point}>
            <Check size={14} aria-hidden="true" /> {point}
          </span>
        ))}
      </div>
    </section>
  );
}

export function StudioExperience() {
  const [state, dispatch] = useReducer(studioReducer, initialStudioState);
  const [personalization, setPersonalization] =
    useState<AppliedPersonalization | null>(null);
  const reducedMotion = useReducedMotion();
  const stepHeadingRef = useRef<HTMLHeadingElement>(null);
  const hasInteracted = useRef(false);

  const selectedBusiness = state.businessId
    ? getStudioBusiness(state.businessId)
    : null;
  const selectedDirection = state.directionId
    ? getStudioDirection(state.directionId)
    : null;

  const visibleBusinesses = useMemo(() => {
    if (state.expandedBusinesses) return studioBusinesses;
    return studioBusinesses.filter((business) =>
      featuredStudioBusinessIds.includes(business.id),
    );
  }, [state.expandedBusinesses]);

  useEffect(() => {
    if (!hasInteracted.current) return;
    stepHeadingRef.current?.focus({ preventScroll: true });
    stepHeadingRef.current?.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "center",
    });
  }, [state.step, reducedMotion]);

  const dispatchInteraction = (action: Parameters<typeof dispatch>[0]) => {
    hasInteracted.current = true;
    if (action.type !== "showMoreBusinesses") setPersonalization(null);
    dispatch(action);
  };

  return (
    <div className="studio-shell" data-studio-step={state.step}>
      <header className="studio-hero">
        <div className="studio-ambient" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <div className="site-container studio-hero-inner">
          <ScrollReveal variant="fadeInUp">
            <p className="studio-kicker">
              <Sparkles size={15} aria-hidden="true" /> GSTPIXEL Website Studio
            </p>
          </ScrollReveal>
          <ScrollReveal variant="maskIn" delay={0.08}>
            <h1>Choose your business. See what your website could become.</h1>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.16}>
            <p className="studio-intro">
              Pick a business and a creative direction. The experience appears
              immediately — no prompt, no waiting, no technical decisions.
            </p>
          </ScrollReveal>
          <ScrollReveal variant="fadeInUp" delay={0.22}>
            <StudioProgress step={state.step} />
          </ScrollReveal>
        </div>
      </header>

      <main className="studio-workspace">
        <div className="site-container">
          {state.step === "business" && (
            <section
              className="studio-step"
              aria-labelledby="studio-business-title"
            >
              <div className="studio-step-heading">
                <p>Start here</p>
                <h2
                  id="studio-business-title"
                  ref={stepHeadingRef}
                  tabIndex={-1}
                >
                  What kind of business are we imagining?
                </h2>
                <span>
                  Choose the closest fit. You can change it at any time.
                </span>
              </div>
              <div className="studio-business-list">
                {visibleBusinesses.map((business) => (
                  <BusinessCard
                    key={business.id}
                    business={business}
                    selected={state.businessId === business.id}
                    onSelect={() =>
                      dispatchInteraction({
                        type: "selectBusiness",
                        businessId: business.id,
                      })
                    }
                  />
                ))}
              </div>
              {!state.expandedBusinesses && (
                <Button
                  type="button"
                  variant="quiet"
                  className="studio-more-button"
                  onClick={() => dispatch({ type: "showMoreBusinesses" })}
                >
                  Show more business types{" "}
                  <ChevronRight size={17} aria-hidden="true" />
                </Button>
              )}
            </section>
          )}

          {state.step === "direction" && selectedBusiness && (
            <section
              className="studio-step"
              aria-labelledby="studio-direction-title"
            >
              <button
                type="button"
                className="studio-back"
                onClick={() => dispatchInteraction({ type: "backToBusiness" })}
              >
                <ArrowLeft size={16} aria-hidden="true" /> Change business
              </button>
              <div className="studio-step-heading">
                <p>{selectedBusiness.name}</p>
                <h2
                  id="studio-direction-title"
                  ref={stepHeadingRef}
                  tabIndex={-1}
                >
                  Choose how it should feel.
                </h2>
                <span>
                  Three distinct creative directions. Same business goal,
                  different presence.
                </span>
              </div>
              <div className="studio-direction-list">
                {studioDirections.map((direction) => (
                  <DirectionCard
                    key={direction.id}
                    direction={direction}
                    business={selectedBusiness}
                    selected={state.directionId === direction.id}
                    onSelect={() =>
                      dispatchInteraction({
                        type: "selectDirection",
                        directionId: direction.id,
                      })
                    }
                  />
                ))}
              </div>
            </section>
          )}

          {state.step === "preview" &&
            selectedBusiness &&
            selectedDirection && (
              <div className="studio-result">
                <section
                  className="studio-step studio-preview-section"
                  aria-labelledby="studio-preview-title"
                >
                  <div className="studio-result-tools">
                    <button
                      type="button"
                      className="studio-back"
                      onClick={() =>
                        dispatchInteraction({ type: "backToDirection" })
                      }
                    >
                      <ArrowLeft size={16} aria-hidden="true" /> Change
                      direction
                    </button>
                    <button
                      type="button"
                      className="studio-restart"
                      onClick={() => dispatchInteraction({ type: "restart" })}
                    >
                      <RotateCcw size={15} aria-hidden="true" /> Start again
                    </button>
                  </div>
                  <div className="studio-step-heading is-result">
                    <p>
                      {selectedBusiness.name} · {selectedDirection.name}
                    </p>
                    <h2
                      id="studio-preview-title"
                      ref={stepHeadingRef}
                      tabIndex={-1}
                    >
                      Your direction is ready to experience.
                    </h2>
                    <span>{selectedBusiness.outcome}</span>
                  </div>
                  <PersonalizationPanel
                    key={`${selectedBusiness.id}-${selectedDirection.id}`}
                    business={selectedBusiness}
                    direction={selectedDirection}
                    applied={personalization}
                    onApply={(nextPersonalization) => {
                      if (
                        nextPersonalization.category === selectedBusiness.id &&
                        nextPersonalization.direction === selectedDirection.id
                      ) {
                        setPersonalization(nextPersonalization);
                      }
                    }}
                    onReset={() => setPersonalization(null)}
                  />
                  <ExperiencePreview
                    business={selectedBusiness}
                    direction={selectedDirection}
                    personalization={personalization}
                  />
                  {personalization && (
                    <aside
                      className="studio-personalized-notes"
                      aria-label="Personalized business highlights"
                      data-testid="studio-personalized-notes"
                    >
                      <p>Personalized emphasis</p>
                      <ul>
                        {personalization.content.highlights.map((highlight) => (
                          <li key={highlight}>{highlight}</li>
                        ))}
                      </ul>
                    </aside>
                  )}
                </section>
                <BusinessSystem
                  business={selectedBusiness}
                  personalization={personalization}
                />
                <section
                  className="studio-contact"
                  aria-labelledby="studio-contact-title"
                >
                  <div>
                    <p>Ready to make it yours?</p>
                    <h2 id="studio-contact-title">
                      Build this for my business.
                    </h2>
                    <span>
                      {personalization?.content.ctaSupport ??
                        "Talk directly with GSTPIXEL about your website."}{" "}
                      Your Studio choices and personalization are not added to
                      the message.
                    </span>
                  </div>
                  <a
                    className="studio-whatsapp tactile luminous-edge"
                    href={buildStudioWhatsappHref()}
                    target="_blank"
                    rel="noreferrer"
                    data-testid="studio-whatsapp"
                  >
                    <MessageCircle size={19} aria-hidden="true" />
                    Open WhatsApp
                    <ArrowRight size={17} aria-hidden="true" />
                  </a>
                </section>
              </div>
            )}
        </div>
      </main>
    </div>
  );
}
