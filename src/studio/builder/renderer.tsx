import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Car,
  Coffee,
  Compass,
  Cpu,
  Dumbbell,
  Flower2,
  GraduationCap,
  HeartPulse,
  Leaf,
  Mountain,
  Palette,
  Scissors,
  Shirt,
  ShoppingBag,
  Sparkles,
  Sprout,
  Truck,
  User,
  Users,
} from "lucide-react";
import type { ComponentType, CSSProperties, KeyboardEvent } from "react";
import type { ArtDirection } from "./blueprint";
import type { DesignSection, DesignSpec } from "./domain";
import { getHomePage } from "./domain";
import {
  designDnaClasses,
  designDnaVariables,
  readDesignDna,
} from "./design-dna";
import {
  ComparisonTable,
  EnquiryModule,
  FaqAccordion,
  FilterableGrid,
  GalleryPreview,
  TimelineStepper,
} from "./interactions";

/**
 * Deterministic React renderer.
 *
 * The blueprint decides a composition family per section; this file turns that
 * decision into genuinely different structure — not the same grid with new
 * colours. Every composition is composed from allowlisted React, receives only
 * schema-validated data, and never executes visitor content.
 */

type BusinessKind = DesignSpec["site"]["businessKind"];

type SectionProps = {
  section: DesignSection;
  businessKind: BusinessKind;
  index: number;
  art: ArtDirection;
  composition: string;
  /** Object URLs of any images the visitor added for this session. */
  media?: RenderMedia | undefined;
};

/**
 * Session-only media.
 *
 * Optional by design: when a visitor adds a logo or an image the design uses
 * it, and when they do not the existing art direction carries the concept.
 */
export type RenderMedia = {
  logoUrl?: string | null;
  heroUrl?: string | null;
  galleryUrls?: readonly string[];
};

const kindIcons = {
  hotel: Mountain,
  travel: Compass,
  restaurant: Coffee,
  retail: ShoppingBag,
  professional: Sparkles,
  fitness: Dumbbell,
  generic: Sparkles,
  technology: Cpu,
  creative: Palette,
  wellness: Flower2,
  healthcare: HeartPulse,
  education: GraduationCap,
  fashion: Shirt,
  realestate: Building2,
  automotive: Car,
  beauty: Scissors,
  events: Users,
  logistics: Truck,
  nonprofit: Leaf,
  agriculture: Sprout,
  personal: User,
} satisfies Record<BusinessKind, ComponentType<{ size?: number }>>;

const heroAliases: Record<string, string> = {
  "cinematic-editorial": "editorial-typography",
  "immersive-image": "immersive-viewport",
  "minimal-luxury": "centered-luxury",
  "bold-typographic": "poster-brutalist",
  "product-focused": "commerce-product",
  "hospitality-focused": "hospitality-image-led",
};

const complementaryArt: Record<ArtDirection, ArtDirection> = {
  "gradient-field": "organic-halo",
  "organic-halo": "gradient-field",
  "geometric-composition": "typographic-art",
  "typographic-art": "geometric-composition",
  "layered-surfaces": "framed-print",
  "framed-print": "layered-surfaces",
  "grid-technical": "monolith",
  monolith: "grid-technical",
  "grain-field": "light-shafts",
  "light-shafts": "grain-field",
  "editorial-rule": "monolith",
};

const sectionCompositions: Record<string, Record<string, string>> = {
  about: {
    "editorial-story": "narrative",
    "editorial-narrative": "narrative-long",
    "asymmetric-media": "split",
    "split-media-story": "split",
    "image-led-story": "media-lead",
    "founder-profile": "profile",
    "founder-story": "profile",
    values: "value-rows",
    "values-grid": "value-rows",
    "minimal-intro": "statement",
    "manifesto-statement": "statement",
    "immersive-feature": "panels",
    "story-timeline": "timeline",
  },
  services: {
    "editorial-list": "index-rows",
    "service-index": "index-rows",
    "numbered-narrative": "numbered",
    "visual-grid": "card-grid",
    "compact-cards": "card-grid",
    "horizontal-showcase": "rail",
    "immersive-panels": "panels",
    "catalogue-list": "catalogue",
    "process-steps": "timeline",
    "bento-grid": "bento",
    "split-offerings": "split",
    "capability-columns": "capability",
  },
  gallery: {
    "cinematic-mosaic": "mosaic",
    "full-bleed": "full-bleed",
    "editorial-grid": "gallery-grid",
    "horizontal-gallery": "rail",
    "gallery-strip": "strip",
    "art-collage": "mosaic",
    "bento-mosaic": "bento",
    "framed-print-series": "framed-series",
  },
  listings: {
    "premium-listing": "card-grid",
    comparison: "table",
    "image-showcase": "product-grid",
    "featured-item": "feature-split",
    "product-grid": "product-grid",
    "room-collection": "card-grid",
    "package-cards": "card-grid",
    "collection-rail": "rail",
    "index-list": "index-rows",
  },
  testimonials: {
    "minimal-quote": "quote",
    "editorial-quotes": "quote",
    "statement-quote": "statement",
  },
  features: {
    "icon-list": "icon-list",
    "structured-editorial": "columns",
    "visual-blocks": "card-grid",
    "stats-band": "stats-band",
    "process-timeline": "timeline",
    manifesto: "statement",
    "comparison-table": "table",
    "bento-grid": "bento",
    "trust-band": "trust-band",
    "faq-list": "faq",
    "capability-grid": "capability",
    "numbered-features": "numbered",
  },
  cta: {
    minimal: "cta-minimal",
    cinematic: "cta-cinematic",
    split: "cta-split",
    "contact-focused": "cta-contact",
    "conversion-band": "cta-band",
    "concierge-teaser": "cta-concierge",
    "booking-band": "cta-booking",
    "statement-cta": "cta-statement",
  },
  contact: {
    concise: "contact-rows",
    detailed: "contact-detail",
    "location-composition": "contact-location",
    "booking-enquiry": "contact-booking",
    "concierge-panel": "contact-concierge",
    "map-led": "contact-map",
  },
};

function heroComposition(variant: string): string {
  const family = heroAliases[variant] ?? variant;
  return `hero-${family}`;
}

function compositionFor(section: DesignSection): string {
  if (section.type === "hero") return heroComposition(section.variant);
  return (
    sectionCompositions[section.type]?.[section.variant] ??
    Object.values(sectionCompositions[section.type] ?? {})[0] ??
    "card-grid"
  );
}

function readArtDirection(spec: DesignSpec): ArtDirection {
  const blueprint = spec.metadata.blueprint as
    { hero?: { artDirection?: unknown } } | undefined;
  const value = blueprint?.hero?.artDirection;
  if (typeof value !== "string") return "editorial-rule";
  return value as ArtDirection;
}

function artForSection(base: ArtDirection, index: number): ArtDirection {
  if (index % 4 === 1) return complementaryArt[base] ?? base;
  if (index % 4 === 2) return "editorial-rule";
  if (index % 4 === 3)
    return complementaryArt[complementaryArt[base] ?? base] ?? base;
  return base;
}

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

function Artwork({
  section,
  art,
  index,
  kind,
  image,
}: {
  section: DesignSection;
  art: ArtDirection;
  index: number;
  kind: BusinessKind;
  /** A visitor-provided image, when the section has one to use. */
  image?: string | null | undefined;
}) {
  const Icon = kindIcons[kind] ?? Sparkles;
  const label =
    section.content.note || section.content.eyebrow || "Website concept";
  /* A supplied image becomes the artwork frame; the deterministic art
     direction stays underneath as the treatment around it. */
  if (image) {
    return (
      <div
        className={`studio-v2-site-visual is-${section.visualTreatment.media} art-${art} art-shift-${index % 4} has-media`}
      >
        <img src={image} alt={label} />
        <small className="studio-v2-site-visual-note">{label}</small>
      </div>
    );
  }
  return (
    <div
      className={`studio-v2-site-visual is-${section.visualTreatment.media} art-${art} art-shift-${index % 4}`}
      aria-hidden="true"
    >
      {art === "gradient-field" && (
        <>
          <span className="art-blob is-one" />
          <span className="art-blob is-two" />
          <span className="art-blob is-three" />
        </>
      )}
      {art === "organic-halo" && (
        <>
          <span className="art-halo is-outer" />
          <span className="art-halo is-inner" />
          <span className="art-seed" />
        </>
      )}
      {art === "geometric-composition" && (
        <>
          <span className="art-circle" />
          <span className="art-quarter" />
          <span className="art-bar" />
          <span className="art-dot" />
        </>
      )}
      {art === "typographic-art" && (
        <>
          <span className="art-glyph">A</span>
          <span className="art-glyph is-mirrored">A</span>
          <span className="art-rule" />
        </>
      )}
      {art === "layered-surfaces" && (
        <>
          <span className="art-pane is-back" />
          <span className="art-pane is-mid" />
          <span className="art-pane is-front" />
        </>
      )}
      {art === "framed-print" && (
        <>
          <span className="art-mat" />
          <span className="art-print" />
          <span className="art-plate" />
        </>
      )}
      {art === "grid-technical" && (
        <>
          <span className="art-gridline is-h" />
          <span className="art-gridline is-v" />
          <span className="art-crosshair" />
          <span className="art-node" />
        </>
      )}
      {art === "monolith" && (
        <>
          <span className="art-slab is-tall" />
          <span className="art-slab is-short" />
          <span className="art-plinth" />
        </>
      )}
      {art === "grain-field" && (
        <>
          <span className="art-grain" />
          <span className="art-dune is-far" />
          <span className="art-dune is-near" />
        </>
      )}
      {art === "light-shafts" && (
        <>
          <span className="art-shaft is-one" />
          <span className="art-shaft is-two" />
          <span className="art-shaft is-three" />
        </>
      )}
      {art === "editorial-rule" && (
        <>
          <span className="art-rule is-top" />
          <span className="art-rule is-mid" />
          <span className="art-rule is-bottom" />
          <small className="art-caption">
            {section.content.eyebrow || "Concept"}
          </small>
        </>
      )}
      <span className="studio-v2-site-visual-mark">
        <Icon size={22} />
      </span>
      <small className="studio-v2-site-visual-note">{label}</small>
    </div>
  );
}

function Heading({ section }: { section: DesignSection }) {
  return (
    <div className="studio-v2-site-heading">
      {section.content.eyebrow && <p>{section.content.eyebrow}</p>}
      <h2>{section.content.title}</h2>
      {section.content.body && <span>{section.content.body}</span>}
    </div>
  );
}

function ItemMeta({
  item,
}: {
  item: DesignSection["content"]["items"][number];
}) {
  return (
    <small className="studio-v2-site-item-meta">
      {item.accent && <i>{item.accent}</i>}
      {item.meta}
    </small>
  );
}

function Stats({ section }: { section: DesignSection }) {
  if (!section.content.stats.length) return null;
  return (
    <dl className="studio-v2-site-stats">
      {section.content.stats.map((stat) => (
        <div key={`${stat.value}-${stat.label}`}>
          <dt>{stat.value}</dt>
          <dd>{stat.label}</dd>
        </div>
      ))}
    </dl>
  );
}

function HeroBody({
  section,
  businessKind,
  composition,
  art,
  index,
  media,
}: SectionProps) {
  const showArt = section.visualTreatment.media !== "none";
  const artNode = showArt ? (
    <Artwork
      section={section}
      art={art}
      index={index}
      kind={businessKind}
      image={media?.heroUrl ?? null}
    />
  ) : null;

  switch (composition) {
    case "hero-editorial-typography":
      return (
        <>
          <div className="studio-v2-site-hero-copy">
            {section.content.eyebrow && <p>{section.content.eyebrow}</p>}
            <h1>{section.content.title}</h1>
            {section.content.body && <span>{section.content.body}</span>}
            <Actions section={section} />
          </div>
          <p className="studio-v2-site-hero-marker" aria-hidden="true">
            {section.content.eyebrow || "Concept"}
          </p>
          {artNode && !section.layout.fullBleed ? (
            <div className="studio-v2-site-hero-band">{artNode}</div>
          ) : null}
          <Stats section={section} />
        </>
      );
    case "hero-cinematic-media":
      return (
        <>
          {artNode}
          <div className="studio-v2-site-hero-overlay">
            <div className="studio-v2-site-hero-copy">
              {section.content.eyebrow && <p>{section.content.eyebrow}</p>}
              <h1>{section.content.title}</h1>
              {section.content.body && <span>{section.content.body}</span>}
              <Actions section={section} />
            </div>
            <Stats section={section} />
          </div>
        </>
      );
    case "hero-split-composition":
      return (
        <>
          <div className="studio-v2-site-hero-copy">
            {section.content.eyebrow && <p>{section.content.eyebrow}</p>}
            <h1>{section.content.title}</h1>
            {section.content.body && <span>{section.content.body}</span>}
            <Actions section={section} />
            <Stats section={section} />
          </div>
          {artNode}
        </>
      );
    case "hero-asymmetric-story":
      return (
        <>
          <div className="studio-v2-site-hero-copy">
            {section.content.eyebrow && <p>{section.content.eyebrow}</p>}
            <h1>{section.content.title}</h1>
          </div>
          {artNode}
          <div className="studio-v2-site-hero-foot">
            {section.content.body && <span>{section.content.body}</span>}
            <div>
              <Actions section={section} />
              <Stats section={section} />
            </div>
          </div>
        </>
      );
    case "hero-centered-luxury":
      return (
        <>
          <div className="studio-v2-site-hero-copy">
            {section.content.eyebrow && <p>{section.content.eyebrow}</p>}
            <h1>{section.content.title}</h1>
            {section.content.body && <span>{section.content.body}</span>}
            <Actions section={section} />
          </div>
          <Stats section={section} />
          {artNode ? (
            <div className="studio-v2-site-hero-band is-wide">{artNode}</div>
          ) : null}
        </>
      );
    case "hero-immersive-viewport":
      return (
        <>
          {artNode}
          <div className="studio-v2-site-hero-overlay is-bottom">
            <div className="studio-v2-site-hero-copy">
              {section.content.eyebrow && <p>{section.content.eyebrow}</p>}
              <h1>{section.content.title}</h1>
              {section.content.body && <span>{section.content.body}</span>}
              <Actions section={section} />
            </div>
            <span className="studio-v2-site-scroll-cue" aria-hidden="true">
              Scroll
            </span>
          </div>
        </>
      );
    case "hero-technical-grid":
      return (
        <>
          <div className="studio-v2-site-hero-copy">
            {section.content.eyebrow && <p>{section.content.eyebrow}</p>}
            <h1>{section.content.title}</h1>
            {section.content.body && <span>{section.content.body}</span>}
            <Actions section={section} />
          </div>
          <div className="studio-v2-site-hero-panel">
            {artNode}
            <Stats section={section} />
          </div>
        </>
      );
    case "hero-poster-brutalist":
      return (
        <>
          <h1 className="studio-v2-site-hero-poster">
            {section.content.title}
          </h1>
          <div className="studio-v2-site-hero-foot">
            {section.content.body && <span>{section.content.body}</span>}
            <div className="studio-v2-site-hero-copy">
              {section.content.eyebrow && <p>{section.content.eyebrow}</p>}
              <Actions section={section} />
            </div>
          </div>
          {artNode}
        </>
      );
    case "hero-hospitality-image-led":
      return (
        <>
          {artNode}
          <div className="studio-v2-site-hero-overlay is-corner">
            <div className="studio-v2-site-hero-copy">
              {section.content.eyebrow && <p>{section.content.eyebrow}</p>}
              <h1>{section.content.title}</h1>
              {section.content.body && <span>{section.content.body}</span>}
              <Actions section={section} />
            </div>
          </div>
          <Stats section={section} />
        </>
      );
    case "hero-commerce-product":
      return (
        <>
          <div className="studio-v2-site-hero-copy">
            {section.content.eyebrow && <p>{section.content.eyebrow}</p>}
            <h1>{section.content.title}</h1>
            {section.content.body && <span>{section.content.body}</span>}
            <Actions section={section} />
          </div>
          <div className="studio-v2-site-hero-product">
            {artNode}
            <Stats section={section} />
          </div>
        </>
      );
    case "hero-minimal-professional":
      return (
        <>
          <div className="studio-v2-site-hero-copy is-quiet">
            {section.content.eyebrow && <p>{section.content.eyebrow}</p>}
            <h1>{section.content.title}</h1>
            {section.content.body && <span>{section.content.body}</span>}
            <Actions section={section} />
          </div>
          {section.content.stats.length > 0 ? (
            <Stats section={section} />
          ) : null}
        </>
      );
    default:
      return (
        <>
          <div className="studio-v2-site-hero-layers">
            {artNode}
            <div className="studio-v2-site-hero-copy">
              {section.content.eyebrow && <p>{section.content.eyebrow}</p>}
              <h1>{section.content.title}</h1>
            </div>
          </div>
          <div className="studio-v2-site-hero-foot">
            {section.content.body && <span>{section.content.body}</span>}
            <div>
              <Actions section={section} />
              <Stats section={section} />
            </div>
          </div>
        </>
      );
  }
}

function SectionBody(props: SectionProps) {
  const { section, businessKind, composition, art, index, media } = props;
  const items = section.content.items;
  /* Visitor-supplied images are placed where they belong: gallery imagery in
     gallery sections, a hero image in the opening content section. */
  const galleryImages = media?.galleryUrls ?? [];
  const sectionImage =
    section.type === "gallery" && galleryImages.length > 0
      ? galleryImages[index % galleryImages.length]
      : index <= 1 && section.type !== "gallery"
        ? (media?.heroUrl ?? null)
        : null;
  const artNode = (
    <Artwork
      section={section}
      art={art}
      index={index}
      kind={businessKind}
      image={sectionImage}
    />
  );

  const interaction = (() => {
    switch (composition) {
      case "product-grid":
        return <FilterableGrid items={items} layout="product" />;
      case "card-grid":
        return <FilterableGrid items={items} layout="card" />;
      case "rail":
        return <FilterableGrid items={items} layout="rail" />;
      case "table":
        return <ComparisonTable items={items} label={section.content.title} />;
      case "faq":
        return <FaqAccordion items={items} label={section.content.title} />;
      case "timeline":
        return <TimelineStepper items={items} />;
      case "mosaic":
        return <GalleryPreview items={items} layout="mosaic" />;
      case "gallery-grid":
        return <GalleryPreview items={items} layout="grid" />;
      case "framed-series":
        return <GalleryPreview items={items} layout="framed" />;
      case "strip":
        return <GalleryPreview items={items} layout="strip" />;
      default:
        return null;
    }
  })();
  if (interaction) {
    return (
      <>
        <Heading section={section} />
        {interaction}
      </>
    );
  }

  switch (composition) {
    case "narrative":
    case "narrative-long":
      return (
        <>
          <Heading section={section} />
          {artNode}
          {items.length > 0 && (
            <ol className="studio-v2-site-story-list">
              {items.map((item, position) => (
                <li key={`${item.title}-${position}`}>
                  <ItemMeta item={item} />
                  <strong>{item.title}</strong>
                  {item.body && <span>{item.body}</span>}
                </li>
              ))}
            </ol>
          )}
        </>
      );
    case "split":
      return (
        <>
          <div className="studio-v2-site-split-copy">
            <Heading section={section} />
          </div>
          {artNode}
          {items.length > 0 && (
            <ul className="studio-v2-site-split-list">
              {items.map((item, position) => (
                <li key={`${item.title}-${position}`}>
                  <ItemMeta item={item} />
                  <strong>{item.title}</strong>
                  {item.body && <span>{item.body}</span>}
                </li>
              ))}
            </ul>
          )}
        </>
      );
    case "media-lead":
      return (
        <>
          {artNode}
          <div className="studio-v2-site-media-lead-copy">
            <Heading section={section} />
            {items.length > 0 && (
              <ul className="studio-v2-site-value-list">
                {items.map((item, position) => (
                  <li key={`${item.title}-${position}`}>
                    <ItemMeta item={item} />
                    <strong>{item.title}</strong>
                    {item.body && <span>{item.body}</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      );
    case "profile":
      return (
        <>
          {artNode}
          <div className="studio-v2-site-profile-copy">
            <Heading section={section} />
            {section.content.note && (
              <p className="studio-v2-site-note">{section.content.note}</p>
            )}
          </div>
        </>
      );
    case "value-rows":
      return (
        <>
          <Heading section={section} />
          <ol className="studio-v2-site-value-rows">
            {items.map((item, position) => (
              <li key={`${item.title}-${position}`}>
                <span className="studio-v2-site-value-index">
                  {item.accent || String(position + 1).padStart(2, "0")}
                </span>
                <strong>{item.title}</strong>
                {item.body && <span>{item.body}</span>}
              </li>
            ))}
          </ol>
        </>
      );
    case "statement":
      return (
        <>
          <blockquote className="studio-v2-site-statement">
            <p>{section.content.title}</p>
            {section.content.body && <footer>{section.content.body}</footer>}
          </blockquote>
          {artNode}
        </>
      );
    case "panels":
      return (
        <>
          <Heading section={section} />
          <div className="studio-v2-site-panels">
            {items.map((item, position) => (
              <article key={`${item.title}-${position}`}>
                <span className="studio-v2-site-panel-index">
                  {item.accent || String(position + 1).padStart(2, "0")}
                </span>
                <h3>{item.title}</h3>
                {item.body && <p>{item.body}</p>}
                {item.meta && <small>{item.meta}</small>}
              </article>
            ))}
          </div>
        </>
      );
    case "timeline":
      return (
        <>
          <Heading section={section} />
          <ol className="studio-v2-site-timeline">
            {items.map((item, position) => (
              <li key={`${item.title}-${position}`}>
                <span
                  className="studio-v2-site-timeline-dot"
                  aria-hidden="true"
                />
                <small>{item.meta || `Step ${position + 1}`}</small>
                <h3>{item.title}</h3>
                {item.body && <p>{item.body}</p>}
              </li>
            ))}
          </ol>
        </>
      );
    case "index-rows":
      return (
        <>
          <div className="studio-v2-site-index-head">
            <Heading section={section} />
          </div>
          <ul className="studio-v2-site-index-rows">
            {items.map((item, position) => (
              <li key={`${item.title}-${position}`}>
                <span className="studio-v2-site-index-number">
                  {item.accent || String(position + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{item.title}</h3>
                  {item.body && <p>{item.body}</p>}
                </div>
                <small>{item.meta}</small>
                <ArrowUpRight size={16} aria-hidden="true" />
              </li>
            ))}
          </ul>
        </>
      );
    case "numbered":
      return (
        <>
          <Heading section={section} />
          <ol className="studio-v2-site-numbered">
            {items.map((item, position) => (
              <li key={`${item.title}-${position}`}>
                <span aria-hidden="true">
                  {String(position + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{item.title}</h3>
                  {item.body && <p>{item.body}</p>}
                  {item.meta && <small>{item.meta}</small>}
                </div>
              </li>
            ))}
          </ol>
        </>
      );
    case "card-grid":
      return (
        <>
          <Heading section={section} />
          <div className="studio-v2-site-card-grid">
            {items.map((item, position) => (
              <article key={`${item.title}-${position}`}>
                <span className="studio-v2-site-card-index">
                  {item.accent || String(position + 1).padStart(2, "0")}
                </span>
                <ItemMeta item={item} />
                <h3>{item.title}</h3>
                {item.body && <p>{item.body}</p>}
              </article>
            ))}
          </div>
        </>
      );
    case "rail":
      return (
        <>
          <Heading section={section} />
          <ul className="studio-v2-site-rail">
            {items.map((item, position) => (
              <li key={`${item.title}-${position}`}>
                <div className="studio-v2-site-rail-art" aria-hidden="true">
                  <span />
                </div>
                <ItemMeta item={item} />
                <h3>{item.title}</h3>
                {item.body && <p>{item.body}</p>}
              </li>
            ))}
          </ul>
        </>
      );
    case "bento":
      return (
        <>
          <Heading section={section} />
          <div className="studio-v2-site-bento">
            {items.map((item, position) => (
              <article
                key={`${item.title}-${position}`}
                className={`is-cell-${(position % 5) + 1}`}
              >
                <ItemMeta item={item} />
                <h3>{item.title}</h3>
                {item.body && <p>{item.body}</p>}
              </article>
            ))}
          </div>
        </>
      );
    case "catalogue":
      return (
        <>
          <Heading section={section} />
          <dl className="studio-v2-site-catalogue">
            {items.map((item, position) => (
              <div key={`${item.title}-${position}`}>
                <dt>
                  <span>{item.title}</span>
                  {item.meta && <i>{item.meta}</i>}
                </dt>
                <dd>{item.body}</dd>
              </div>
            ))}
          </dl>
        </>
      );
    case "capability":
      return (
        <>
          <Heading section={section} />
          <div className="studio-v2-site-capabilities">
            {items.map((item, position) => (
              <article key={`${item.title}-${position}`}>
                <h3>{item.title}</h3>
                {item.body && <p>{item.body}</p>}
                {item.meta && <small>{item.meta}</small>}
              </article>
            ))}
          </div>
        </>
      );
    case "icon-list":
      return (
        <>
          <Heading section={section} />
          <ul className="studio-v2-site-icon-list">
            {items.map((item, position) => (
              <li key={`${item.title}-${position}`}>
                <span aria-hidden="true">✓</span>
                <div>
                  <h3>{item.title}</h3>
                  {item.body && <p>{item.body}</p>}
                </div>
              </li>
            ))}
          </ul>
        </>
      );
    case "columns":
      return (
        <>
          <Heading section={section} />
          <div className="studio-v2-site-columns">
            {items.map((item, position) => (
              <article key={`${item.title}-${position}`}>
                <small>{item.meta || `0${position + 1}`.slice(-2)}</small>
                <h3>{item.title}</h3>
                {item.body && <p>{item.body}</p>}
              </article>
            ))}
          </div>
        </>
      );
    case "stats-band":
      return (
        <>
          <Heading section={section} />
          <dl className="studio-v2-site-stats-band">
            {section.content.stats.map((stat, position) => (
              <div key={`${stat.value}-${position}`}>
                <dt>{stat.value}</dt>
                <dd>{stat.label}</dd>
              </div>
            ))}
          </dl>
        </>
      );
    case "trust-band":
      return (
        <>
          <Heading section={section} />
          <ul className="studio-v2-site-trust">
            {items.map((item, position) => (
              <li key={`${item.title}-${position}`}>
                <h3>{item.title}</h3>
                {item.body && <p>{item.body}</p>}
                {item.meta && <small>{item.meta}</small>}
              </li>
            ))}
          </ul>
        </>
      );
    case "faq":
      return (
        <>
          <Heading section={section} />
          <div className="studio-v2-site-faq">
            {items.map((item, position) => (
              <details key={`${item.title}-${position}`}>
                <summary>{item.title}</summary>
                {item.body && <p>{item.body}</p>}
              </details>
            ))}
          </div>
        </>
      );
    case "table":
      return (
        <>
          <Heading section={section} />
          <div className="studio-v2-site-table-wrap">
            <table className="studio-v2-site-table">
              <caption className="studio-v2-site-visually-hidden">
                {section.content.title}
              </caption>
              <thead>
                <tr>
                  <th scope="col">Option</th>
                  <th scope="col">Detail</th>
                  <th scope="col">Position</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, position) => (
                  <tr key={`${item.title}-${position}`}>
                    <th scope="row">{item.title}</th>
                    <td>{item.body}</td>
                    <td>{item.meta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      );
    case "gallery-grid":
    case "mosaic":
      return (
        <>
          <Heading section={section} />
          <div className="studio-v2-site-gallery-grid">
            {items.map((item, position) => (
              <figure
                key={`${item.title}-${position}`}
                className={`is-${(position % 5) + 1}`}
              >
                <div aria-hidden="true">
                  <span />
                  <i />
                </div>
                <figcaption>
                  {item.meta && <small>{item.meta}</small>}
                  <strong>{item.title}</strong>
                </figcaption>
              </figure>
            ))}
          </div>
        </>
      );
    case "strip":
      return (
        <>
          <Heading section={section} />
          <ul className="studio-v2-site-strip">
            {items.map((item, position) => (
              <li key={`${item.title}-${position}`}>
                <div aria-hidden="true" />
                <span>{item.title}</span>
              </li>
            ))}
          </ul>
        </>
      );
    case "full-bleed":
      return (
        <>
          <Heading section={section} />
          <div className="studio-v2-site-full-bleed">
            {items.map((item, position) => (
              <figure key={`${item.title}-${position}`}>
                <div aria-hidden="true" />
                <figcaption>{item.title}</figcaption>
              </figure>
            ))}
          </div>
        </>
      );
    case "framed-series":
      return (
        <>
          <Heading section={section} />
          <div className="studio-v2-site-framed">
            {items.map((item, position) => (
              <figure key={`${item.title}-${position}`}>
                <span className="studio-v2-site-frame-mat" aria-hidden="true" />
                <figcaption>
                  {item.meta && <small>{item.meta}</small>}
                  <strong>{item.title}</strong>
                </figcaption>
              </figure>
            ))}
          </div>
        </>
      );
    case "product-grid":
      return (
        <>
          <Heading section={section} />
          <div className="studio-v2-site-products">
            {items.map((item, position) => (
              <article key={`${item.title}-${position}`}>
                <div className="studio-v2-site-product-art" aria-hidden="true">
                  <span />
                </div>
                <ItemMeta item={item} />
                <h3>{item.title}</h3>
                {item.body && <p>{item.body}</p>}
              </article>
            ))}
          </div>
        </>
      );
    case "feature-split":
      return (
        <>
          <div className="studio-v2-site-feature-split">
            <Heading section={section} />
            {artNode}
          </div>
          <ul className="studio-v2-site-value-list">
            {items.map((item, position) => (
              <li key={`${item.title}-${position}`}>
                <ItemMeta item={item} />
                <strong>{item.title}</strong>
                {item.body && <span>{item.body}</span>}
              </li>
            ))}
          </ul>
        </>
      );
    case "quote":
      return (
        <>
          <Heading section={section} />
          <div className="studio-v2-site-quotes">
            {items.map((item, position) => (
              <blockquote key={`${item.title}-${position}`}>
                <p>“{item.body}”</p>
                <footer>
                  {item.title}
                  <small>{item.meta}</small>
                </footer>
              </blockquote>
            ))}
          </div>
        </>
      );
    case "cta-minimal":
    case "cta-statement":
      return (
        <>
          <Heading section={section} />
          <Actions section={section} />
        </>
      );
    case "cta-cinematic":
      return (
        <>
          {artNode}
          <div className="studio-v2-site-cta-overlay">
            <Heading section={section} />
            <Actions section={section} />
          </div>
        </>
      );
    case "cta-split":
      return (
        <>
          <div className="studio-v2-site-cta-split">
            <Heading section={section} />
            <Actions section={section} />
          </div>
        </>
      );
    case "cta-contact":
      return (
        <>
          <div className="studio-v2-site-cta-contact">
            <Heading section={section} />
            <div className="studio-v2-site-contact-mini">
              {items.slice(0, 2).map((item, position) => (
                <div key={`${item.title}-${position}`}>
                  <small>{item.meta}</small>
                  <strong>{item.title}</strong>
                  <span>{item.body}</span>
                </div>
              ))}
            </div>
            <Actions section={section} />
          </div>
          <EnquiryModule
            businessName={section.content.eyebrow || "our team"}
            primaryCta={section.content.primaryCta}
            secondaryCta={section.content.secondaryCta}
            body=""
          />
        </>
      );
    case "cta-band":
      return (
        <>
          <div className="studio-v2-site-cta-band">
            <Heading section={section} />
            <Actions section={section} />
          </div>
        </>
      );
    case "cta-concierge":
      return (
        <>
          <div className="studio-v2-site-cta-concierge">
            <small>{section.content.eyebrow}</small>
            <h2>{section.content.title}</h2>
            {section.content.body && <p>{section.content.body}</p>}
            <Actions section={section} />
          </div>
        </>
      );
    case "cta-booking":
      return (
        <>
          <div className="studio-v2-site-cta-booking">
            <Heading section={section} />
            <ul className="studio-v2-site-booking-steps">
              {["Share the brief", "Confirm the details", "Move ahead"].map(
                (step, position) => (
                  <li key={step}>
                    <span>{String(position + 1).padStart(2, "0")}</span>
                    {step}
                  </li>
                ),
              )}
            </ul>
            <Actions section={section} />
          </div>
        </>
      );
    case "contact-rows":
    case "contact-detail":
      return (
        <>
          <div className="studio-v2-site-contact-split">
            <Heading section={section} />
            <div className="studio-v2-site-contact-detail">
              {items.map((item, position) => (
                <div key={`${item.title}-${position}`}>
                  <ItemMeta item={item} />
                  <strong>{item.title}</strong>
                  {item.body && <span>{item.body}</span>}
                </div>
              ))}
            </div>
          </div>
          <Actions section={section} />
          <EnquiryModule
            businessName={section.content.eyebrow || "our team"}
            primaryCta={section.content.primaryCta}
            secondaryCta={section.content.secondaryCta}
            body=""
          />
        </>
      );
    case "contact-location":
    case "contact-map":
      return (
        <>
          <Heading section={section} />
          <div className="studio-v2-site-location">
            <div className="studio-v2-site-map" aria-hidden="true">
              <span className="studio-v2-site-map-pin" />
            </div>
            <div className="studio-v2-site-contact-detail">
              {items.map((item, position) => (
                <div key={`${item.title}-${position}`}>
                  <ItemMeta item={item} />
                  <strong>{item.title}</strong>
                  {item.body && <span>{item.body}</span>}
                </div>
              ))}
            </div>
          </div>
          <Actions section={section} />
        </>
      );
    case "contact-booking":
      return (
        <>
          <div className="studio-v2-site-contact-split">
            <Heading section={section} />
            <div className="studio-v2-site-booking-panel">
              <small>Enquiry</small>
              <strong>{section.content.primaryCta || "Get in touch"}</strong>
              {section.content.body && <span>{section.content.body}</span>}
              <Actions section={section} />
            </div>
          </div>
          <EnquiryModule
            businessName={section.content.eyebrow || "our team"}
            primaryCta={section.content.primaryCta}
            secondaryCta={section.content.secondaryCta}
            body=""
          />
        </>
      );
    default:
      return (
        <>
          <Heading section={section} />
          <div className="studio-v2-site-contact-detail">
            {items.map((item, position) => (
              <div key={`${item.title}-${position}`}>
                <ItemMeta item={item} />
                <strong>{item.title}</strong>
                {item.body && <span>{item.body}</span>}
              </div>
            ))}
          </div>
          <Actions section={section} />
        </>
      );
  }
}

const sectionRegistry: Record<string, string> = {
  hero: "hero",
};

function SectionShell({
  section,
  props,
}: {
  section: DesignSection;
  props: Omit<SectionProps, "section">;
}) {
  /* Long headings get their own class so the type guards can scale them down
     instead of letting a 100-character headline fill the whole frame. */
  const titleLength = section.content.title.length;
  const headlineClass =
    titleLength > 64
      ? " headline-long"
      : titleLength > 42
        ? " headline-considered"
        : "";
  return (
    <section
      className={`studio-v2-section studio-v2-site-${section.type} composition-${props.composition} variant-${section.variant} density-${section.layout.density} height-${section.layout.height} text-${section.layout.textScale} tone-${section.tone} motion-${section.motion} contrast-${section.visualTreatment.contrast} surface-${section.visualTreatment.surface}${headlineClass}`}
      id={section.id}
      data-composition={props.composition}
    >
      {sectionRegistry[section.type] === "hero" ? (
        <HeroBody section={section} {...props} />
      ) : (
        <SectionBody section={section} {...props} />
      )}
    </section>
  );
}

export function WebsiteRenderer({
  spec,
  pageSlug = "/",
  selectedSectionId,
  onSelectSection,
  onNavigatePage,
  media,
}: {
  pageSlug?: string;
  spec: DesignSpec;
  selectedSectionId?: string | null;
  onSelectSection?: ((sectionId: string) => void) | undefined;
  /** Lets the visitor move between generated pages inside the Studio. */
  onNavigatePage?: ((pageSlug: string) => void) | undefined;
  media?: RenderMedia | undefined;
}) {
  const page =
    spec.pages.find((entry) => entry.slug === pageSlug) ?? getHomePage(spec);
  const baseArt = readArtDirection(spec);
  /* The DesignDNA is read back from the concept, so every page and every
     preview viewport renders from one identity. */
  const dna = readDesignDna(spec);
  const style = {
    "--preview-density":
      spec.theme.spacing === "expansive"
        ? "1.25"
        : spec.theme.spacing === "compact"
          ? "0.82"
          : "1",
    ...designDnaVariables(dna),
  } as CSSProperties;

  return (
    <article
      className={`studio-v2-site palette-${spec.theme.palette} mood-${spec.theme.mood} type-${spec.theme.typography} radius-${spec.theme.radius} surface-${spec.theme.surface} heading-${spec.theme.headingScale} body-${spec.theme.bodyScale} buttons-${spec.theme.buttonStyle} rhythm-${spec.theme.rhythm} composition-${spec.theme.composition} mobile-density-${spec.responsive.mobileDensity}${spec.responsive.overrides.simplified ? " mobile-simplified" : ""} mobile-hero-${spec.responsive.overrides.heroHeight} mobile-heading-${spec.responsive.overrides.headingScale} mobile-nav-${spec.responsive.overrides.navigation} mobile-decor-${spec.responsive.overrides.decoration ?? "keep"} ${designDnaClasses(dna)}`}
      data-testid="studio-preview"
      data-palette={spec.theme.palette}
      data-mood={spec.theme.mood}
      data-composition={spec.theme.composition}
      data-fingerprint={spec.metadata.fingerprint}
      data-motion-level={dna.motion.level}
      data-page={page.slug}
      style={style}
      aria-label={`${spec.site.name} generated website preview`}
    >
      <header className={`studio-v2-site-nav nav-${spec.navigation.style}`}>
        <strong>
          {media?.logoUrl && (
            <img
              className="studio-v2-site-logo"
              src={media.logoUrl}
              alt=""
              aria-hidden="true"
            />
          )}
          {spec.site.name}
        </strong>
        <nav aria-label="Generated website navigation">
          {spec.navigation.items.map((item) =>
            onNavigatePage && item.target.startsWith("/") ? (
              <button
                key={`${item.label}-${item.target}`}
                type="button"
                className={item.target === page.slug ? "is-active" : undefined}
                aria-current={item.target === page.slug ? "page" : undefined}
                onClick={() => onNavigatePage(item.target)}
              >
                {item.label}
              </button>
            ) : (
              <span key={`${item.label}-${item.target}`}>{item.label}</span>
            ),
          )}
        </nav>
        <b>{spec.navigation.ctaLabel}</b>
      </header>
      <main>
        {page.sections.map((section, index) => {
          const props = {
            businessKind: spec.site.businessKind,
            index,
            art: artForSection(baseArt, index),
            composition: compositionFor(section),
            media,
          };
          return (
            <div
              key={section.id}
              className={`studio-v2-site-selectable${selectedSectionId === section.id ? " is-selected" : ""}`}
              data-section-id={section.id}
              data-section-type={section.type}
              data-composition={props.composition}
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
              <SectionShell section={section} props={props} />
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
