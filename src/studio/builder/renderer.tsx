import {
  ArrowRight,
  BedDouble,
  CalendarDays,
  Check,
  ChevronRight,
  Coffee,
  Compass,
  Dumbbell,
  Leaf,
  MapPin,
  Mountain,
  ShoppingBag,
  Sparkles,
  Utensils,
} from "lucide-react";
import type { ComponentType, CSSProperties, KeyboardEvent } from "react";
import type { DesignSection, DesignSpec, SectionType } from "./domain";
import { getHomePage } from "./domain";

type RendererProps = {
  pageSlug?: string;
  spec: DesignSpec;
  selectedSectionId?: string | null;
  onSelectSection?: (sectionId: string) => void;
};

type SectionProps = {
  section: DesignSection;
  businessKind: DesignSpec["site"]["businessKind"];
};

const kindIcons = {
  hotel: Mountain,
  travel: Compass,
  restaurant: Coffee,
  retail: ShoppingBag,
  professional: Sparkles,
  fitness: Dumbbell,
  generic: Sparkles,
} satisfies Record<
  DesignSpec["site"]["businessKind"],
  ComponentType<{ size?: number }>
>;

function Actions({ section }: { section: DesignSection }) {
  if (!section.content.primaryCta && !section.content.secondaryCta) return null;
  return (
    <div className="studio-v2-site-actions">
      {section.content.primaryCta && (
        <span className="studio-v2-site-button is-primary">
          {section.content.primaryCta}{" "}
          <ArrowRight size={14} aria-hidden="true" />
        </span>
      )}
      {section.content.secondaryCta && (
        <span className="studio-v2-site-button is-secondary">
          {section.content.secondaryCta}
        </span>
      )}
    </div>
  );
}

function Visual({
  section,
  kind,
}: {
  section: DesignSection;
  kind: DesignSpec["site"]["businessKind"];
}) {
  const Icon = kindIcons[kind];
  return (
    <div
      className={`studio-v2-site-visual is-${section.visualTreatment.media}`}
      aria-hidden="true"
    >
      <span className="studio-v2-site-orb" />
      <span className="studio-v2-site-landscape is-far" />
      <span className="studio-v2-site-landscape is-near" />
      <span className="studio-v2-site-visual-mark">
        <Icon size={24} />
      </span>
      <small>
        {section.content.note || section.content.eyebrow || "Website concept"}
      </small>
    </div>
  );
}

function HeroSection({ section, businessKind }: SectionProps) {
  return (
    <section
      className={`studio-v2-section studio-v2-site-hero variant-${section.variant} density-${section.layout.density} height-${section.layout.height} text-${section.layout.textScale} tone-${section.tone} motion-${section.motion} contrast-${section.visualTreatment.contrast} surface-${section.visualTreatment.surface}`}
      id={section.id}
    >
      <div className="studio-v2-site-hero-copy">
        {section.content.eyebrow && <p>{section.content.eyebrow}</p>}
        <h1>{section.content.title}</h1>
        {section.content.body && <span>{section.content.body}</span>}
        <Actions section={section} />
        {section.content.stats.length > 0 && (
          <dl className="studio-v2-site-stats">
            {section.content.stats.map((stat) => (
              <div key={`${stat.value}-${stat.label}`}>
                <dt>{stat.value}</dt>
                <dd>{stat.label}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
      <Visual section={section} kind={businessKind} />
    </section>
  );
}

function SectionHeading({ section }: { section: DesignSection }) {
  return (
    <div className="studio-v2-site-heading">
      {section.content.eyebrow && <p>{section.content.eyebrow}</p>}
      <h2>{section.content.title}</h2>
      {section.content.body && <span>{section.content.body}</span>}
    </div>
  );
}

function AboutSection({ section, businessKind }: SectionProps) {
  return (
    <section
      className={`studio-v2-section studio-v2-site-about variant-${section.variant} density-${section.layout.density} height-${section.layout.height} text-${section.layout.textScale} tone-${section.tone} motion-${section.motion} contrast-${section.visualTreatment.contrast} surface-${section.visualTreatment.surface}`}
      id={section.id}
    >
      <SectionHeading section={section} />
      <Visual section={section} kind={businessKind} />
      {section.content.items.length > 0 && (
        <ol className="studio-v2-site-story-list">
          {section.content.items.map((item) => (
            <li key={item.title}>
              <small>{item.accent}</small>
              <strong>{item.title}</strong>
              <span>{item.body}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function CardsSection({ section }: SectionProps) {
  return (
    <section
      className={`studio-v2-section studio-v2-site-cards type-${section.type} variant-${section.variant} density-${section.layout.density} height-${section.layout.height} text-${section.layout.textScale} tone-${section.tone} motion-${section.motion} contrast-${section.visualTreatment.contrast} surface-${section.visualTreatment.surface}`}
      id={section.id}
    >
      <SectionHeading section={section} />
      <div className="studio-v2-site-card-grid">
        {section.content.items.map((item, index) => (
          <article key={`${item.title}-${index}`}>
            <span className="studio-v2-site-card-index">
              {item.accent || String(index + 1).padStart(2, "0")}
            </span>
            {section.type === "features" && (
              <Check size={17} aria-hidden="true" />
            )}
            {section.type === "services" && index === 0 && (
              <Utensils size={17} aria-hidden="true" />
            )}
            {section.type === "listings" && (
              <BedDouble size={17} aria-hidden="true" />
            )}
            <small>{item.meta}</small>
            <h3>{item.title}</h3>
            {item.body && <p>{item.body}</p>}
            <i>
              <ChevronRight size={14} aria-hidden="true" />
            </i>
          </article>
        ))}
      </div>
    </section>
  );
}

function GallerySection({ section }: SectionProps) {
  return (
    <section
      className={`studio-v2-section studio-v2-site-gallery variant-${section.variant} density-${section.layout.density} height-${section.layout.height} text-${section.layout.textScale} tone-${section.tone} motion-${section.motion} contrast-${section.visualTreatment.contrast} surface-${section.visualTreatment.surface}`}
      id={section.id}
    >
      <SectionHeading section={section} />
      <div className="studio-v2-site-gallery-grid">
        {section.content.items.map((item, index) => (
          <figure key={`${item.title}-${index}`} className={`is-${index + 1}`}>
            <div aria-hidden="true">
              <span />
              <i />
            </div>
            <figcaption>
              <small>{item.meta}</small>
              <strong>{item.title}</strong>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function TestimonialsSection({ section }: SectionProps) {
  return (
    <section
      className={`studio-v2-section studio-v2-site-quotes variant-${section.variant} density-${section.layout.density} height-${section.layout.height} text-${section.layout.textScale} tone-${section.tone} motion-${section.motion} contrast-${section.visualTreatment.contrast} surface-${section.visualTreatment.surface}`}
      id={section.id}
    >
      <SectionHeading section={section} />
      {section.content.items.map((item) => (
        <blockquote key={item.title}>
          <p>“{item.body}”</p>
          <footer>
            {item.title}
            <small>{item.meta}</small>
          </footer>
        </blockquote>
      ))}
    </section>
  );
}

function CtaSection({ section }: SectionProps) {
  return (
    <section
      className={`studio-v2-section studio-v2-site-cta variant-${section.variant} density-${section.layout.density} height-${section.layout.height} text-${section.layout.textScale} tone-${section.tone} motion-${section.motion} contrast-${section.visualTreatment.contrast} surface-${section.visualTreatment.surface}`}
      id={section.id}
    >
      <SectionHeading section={section} />
      <Actions section={section} />
    </section>
  );
}

function ContactSection({ section }: SectionProps) {
  return (
    <section
      className={`studio-v2-section studio-v2-site-contact variant-${section.variant} density-${section.layout.density} height-${section.layout.height} text-${section.layout.textScale} tone-${section.tone} motion-${section.motion} contrast-${section.visualTreatment.contrast} surface-${section.visualTreatment.surface}`}
      id={section.id}
    >
      <SectionHeading section={section} />
      <div className="studio-v2-site-contact-detail">
        {section.content.items.map((item, index) => (
          <div key={item.title}>
            {index === 0 ? <CalendarDays size={17} /> : <MapPin size={17} />}
            <small>{item.meta}</small>
            <strong>{item.title}</strong>
            <span>{item.body}</span>
          </div>
        ))}
      </div>
      <Actions section={section} />
    </section>
  );
}

const sectionRegistry: Record<SectionType, ComponentType<SectionProps>> = {
  hero: HeroSection,
  about: AboutSection,
  services: CardsSection,
  gallery: GallerySection,
  listings: CardsSection,
  testimonials: TestimonialsSection,
  features: CardsSection,
  cta: CtaSection,
  contact: ContactSection,
};

export function WebsiteRenderer({
  spec,
  pageSlug = "/",
  selectedSectionId,
  onSelectSection,
}: RendererProps) {
  const page =
    spec.pages.find((entry) => entry.slug === pageSlug) ?? getHomePage(spec);
  const style = {
    "--preview-density":
      spec.theme.spacing === "expansive"
        ? "1.25"
        : spec.theme.spacing === "compact"
          ? "0.82"
          : "1",
  } as CSSProperties;
  return (
    <article
      className={`studio-v2-site palette-${spec.theme.palette} mood-${spec.theme.mood} type-${spec.theme.typography} radius-${spec.theme.radius} surface-${spec.theme.surface} heading-${spec.theme.headingScale} body-${spec.theme.bodyScale} buttons-${spec.theme.buttonStyle} mobile-density-${spec.responsive.mobileDensity}${spec.responsive.overrides.simplified ? " mobile-simplified" : ""} mobile-hero-${spec.responsive.overrides.heroHeight} mobile-heading-${spec.responsive.overrides.headingScale} mobile-nav-${spec.responsive.overrides.navigation}`}
      data-testid="studio-preview"
      data-palette={spec.theme.palette}
      data-mood={spec.theme.mood}
      style={style}
      aria-label={`${spec.site.name} generated website preview`}
    >
      <header className={`studio-v2-site-nav nav-${spec.navigation.style}`}>
        <strong>{spec.site.name}</strong>
        <nav aria-label="Generated website navigation">
          {spec.navigation.items.map((item) => (
            <span key={`${item.label}-${item.target}`}>{item.label}</span>
          ))}
        </nav>
        <b>{spec.navigation.ctaLabel}</b>
      </header>
      <main>
        {page.sections.map((section) => {
          const Section = sectionRegistry[section.type];
          return (
            <div
              key={section.id}
              className={`studio-v2-site-selectable${selectedSectionId === section.id ? " is-selected" : ""}`}
              data-section-id={section.id}
              data-section-type={section.type}
              role={onSelectSection ? "button" : undefined}
              tabIndex={onSelectSection ? 0 : undefined}
              aria-label={
                onSelectSection
                  ? `Select ${section.content.eyebrow || section.type} section`
                  : undefined
              }
              onClick={(event) => {
                event.stopPropagation();
                onSelectSection?.(section.id);
              }}
              onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelectSection?.(section.id);
                }
              }}
            >
              <Section
                section={section}
                businessKind={spec.site.businessKind}
              />
            </div>
          );
        })}
      </main>
      <footer
        className={`studio-v2-site-footer variant-${spec.footer.variant}`}
      >
        <div>
          <strong>{spec.site.name}</strong>
          <p>{spec.footer.statement}</p>
        </div>
        <span>{spec.site.location || spec.site.descriptor}</span>
        <small>Concept website generated in GSTPIXEL Website Studio</small>
      </footer>
    </article>
  );
}
