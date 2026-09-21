import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Filter, X } from "lucide-react";
import type { DesignSection } from "./domain";

/**
 * Safe interactive component families.
 *
 * Every component here is a *concept* interaction: it demonstrates how the
 * finished website would behave without pretending to be a real system. There
 * is no network access, no storage, no backend call and no executable visitor
 * content — state lives in React for as long as the visitor is looking at the
 * section.
 *
 * The families cover the interactions a real business site needs: category
 * filtering, product comparison, gallery preview, process stepping, FAQ
 * accordion and an enquiry module that states plainly that it is a preview.
 */

export type ConceptItem = DesignSection["content"]["items"][number];

/* ------------------------------------------------------------------ *
 * Commerce — category filter over a product or collection grid
 * ------------------------------------------------------------------ */

function categoriesFrom(items: readonly ConceptItem[]): string[] {
  const seen: string[] = [];
  for (const item of items) {
    const value = item.meta.trim();
    if (!value || value.length > 22) continue;
    if (seen.some((entry) => entry.toLowerCase() === value.toLowerCase()))
      continue;
    seen.push(value);
    if (seen.length === 5) break;
  }
  return seen;
}

export function FilterableGrid({
  items,
  layout,
}: {
  items: readonly ConceptItem[];
  layout: "product" | "card" | "rail";
}) {
  const categories = useMemo(() => categoriesFrom(items), [items]);
  const [active, setActive] = useState("All");
  const visible =
    active === "All" ? items : items.filter((item) => item.meta === active);

  const figure = (item: ConceptItem, position: number) => {
    if (layout === "rail") {
      return (
        <li key={`${item.title}-${position}`}>
          <div className="studio-v2-site-rail-art" aria-hidden="true">
            <span />
          </div>
          <small className="studio-v2-site-item-meta">
            {item.accent && <i>{item.accent}</i>}
            {item.meta}
          </small>
          <h3>{item.title}</h3>
          {item.body && <p>{item.body}</p>}
        </li>
      );
    }
    return (
      <article key={`${item.title}-${position}`}>
        {layout === "product" ? (
          <div className="studio-v2-site-product-art" aria-hidden="true">
            <span />
          </div>
        ) : (
          <span className="studio-v2-site-card-index">
            {item.accent || String(position + 1).padStart(2, "0")}
          </span>
        )}
        <small className="studio-v2-site-item-meta">
          {item.accent && <i>{item.accent}</i>}
          {item.meta}
        </small>
        <h3>{item.title}</h3>
        {item.body && <p>{item.body}</p>}
      </article>
    );
  };

  return (
    <div className="studio-v2-interactive is-filterable">
      {categories.length > 1 && (
        <div
          className="studio-v2-site-filters"
          role="group"
          aria-label="Filter by category"
        >
          <span className="studio-v2-site-filters-label" aria-hidden="true">
            <Filter size={13} /> Filter
          </span>
          {["All", ...categories].map((category) => (
            <button
              key={category}
              type="button"
              className={active === category ? "is-active" : undefined}
              aria-pressed={active === category}
              onClick={() => setActive(category)}
            >
              {category}
            </button>
          ))}
        </div>
      )}
      {layout === "rail" ? (
        <ul className="studio-v2-site-rail">
          {visible.map((item, position) => figure(item, position))}
        </ul>
      ) : (
        <div
          className={
            layout === "product"
              ? "studio-v2-site-products"
              : "studio-v2-site-card-grid"
          }
        >
          {visible.map((item, position) => figure(item, position))}
        </div>
      )}
      {visible.length === 0 && (
        <p className="studio-v2-interactive-empty">
          Nothing in this category yet.
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Commerce — compare two options side by side
 * ------------------------------------------------------------------ */

export function ComparisonTable({
  items,
  label,
}: {
  items: readonly ConceptItem[];
  label: string;
}) {
  const options = items.slice(0, 6);
  const [leftIndex, setLeftIndex] = useState(0);
  const [rightIndex, setRightIndex] = useState(options.length > 1 ? 1 : 0);
  const left = options[leftIndex];
  const right = options[rightIndex];

  if (options.length < 2 || !left || !right) {
    return (
      <table className="studio-v2-site-table">
        <caption className="studio-v2-site-visually-hidden">{label}</caption>
        <tbody>
          {options.map((item, position) => (
            <tr key={`${item.title}-${position}`}>
              <th scope="row">{item.title}</th>
              <td>{item.body}</td>
              <td>{item.meta}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  const selector = (
    value: number,
    onChange: (next: number) => void,
    ariaLabel: string,
  ) => (
    <select
      value={value}
      aria-label={ariaLabel}
      onChange={(event) => onChange(Number(event.target.value))}
    >
      {options.map((item, position) => (
        <option key={`${item.title}-${position}`} value={position}>
          {item.title}
        </option>
      ))}
    </select>
  );

  const rows: Array<[string, string, string]> = [
    ["Option", left.title, right.title],
    ["Detail", left.body, right.body],
    ["Position", left.meta, right.meta],
  ];

  return (
    <div className="studio-v2-interactive is-comparison">
      <div className="studio-v2-site-compare-pickers">
        {selector(leftIndex, setLeftIndex, "First option to compare")}
        <span aria-hidden="true">vs</span>
        {selector(rightIndex, setRightIndex, "Second option to compare")}
      </div>
      <table className="studio-v2-site-table">
        <caption className="studio-v2-site-visually-hidden">
          {label} comparison
        </caption>
        <tbody>
          {rows.map(([key, first, second]) => (
            <tr key={key}>
              <th scope="row">{key}</th>
              <td>{first}</td>
              <td>{second}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Portfolio — gallery with a larger concept preview
 * ------------------------------------------------------------------ */

export function GalleryPreview({
  items,
  layout,
}: {
  items: readonly ConceptItem[];
  layout: "grid" | "mosaic" | "framed" | "strip";
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const active = openIndex === null ? null : items[openIndex];

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenIndex(null);
      if (event.key === "ArrowRight")
        setOpenIndex((index) =>
          index === null ? index : (index + 1) % items.length,
        );
      if (event.key === "ArrowLeft")
        setOpenIndex((index) =>
          index === null ? index : (index - 1 + items.length) % items.length,
        );
    };
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus({ preventScroll: true });
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, items.length]);

  if (layout === "strip") {
    return (
      <ul className="studio-v2-site-strip">
        {items.map((item, position) => (
          <li key={`${item.title}-${position}`}>
            <button
              type="button"
              className="studio-v2-interactive-figure"
              onClick={() => setOpenIndex(position)}
            >
              <span aria-hidden="true" />
              <strong>{item.title}</strong>
            </button>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="studio-v2-interactive is-gallery">
      <div
        className={
          layout === "mosaic"
            ? "studio-v2-site-gallery-grid"
            : layout === "framed"
              ? "studio-v2-site-framed"
              : "studio-v2-site-gallery-grid"
        }
      >
        {items.map((item, position) => (
          <figure
            key={`${item.title}-${position}`}
            className={layout === "mosaic" ? `is-${(position % 5) + 1}` : ""}
          >
            <button
              type="button"
              className="studio-v2-interactive-figure"
              aria-label={`Open a larger view of ${item.title}`}
              onClick={() => setOpenIndex(position)}
            >
              <span aria-hidden="true">
                <i />
              </span>
            </button>
            <figcaption>
              {item.meta && <small>{item.meta}</small>}
              <strong>{item.title}</strong>
            </figcaption>
          </figure>
        ))}
      </div>
      {active && (
        <div
          className="studio-v2-interactive-lightbox"
          role="dialog"
          aria-modal="false"
          aria-label={active.title}
        >
          <div
            className="studio-v2-interactive-lightbox-art"
            aria-hidden="true"
          >
            <span />
          </div>
          <div className="studio-v2-interactive-lightbox-body">
            <small>{active.meta || "Concept image"}</small>
            <strong>{active.title}</strong>
            {active.body && <p>{active.body}</p>}
            <div className="studio-v2-interactive-lightbox-controls">
              <button
                type="button"
                aria-label="Previous image"
                onClick={() =>
                  setOpenIndex(
                    (index) => (index! - 1 + items.length) % items.length,
                  )
                }
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={() =>
                  setOpenIndex((index) => (index! + 1) % items.length)
                }
              >
                <ChevronRight size={16} />
              </button>
              <button
                type="button"
                ref={closeRef}
                aria-label="Close the larger view"
                onClick={() => setOpenIndex(null)}
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Services — process timeline the visitor can step through
 * ------------------------------------------------------------------ */

export function TimelineStepper({ items }: { items: readonly ConceptItem[] }) {
  const [active, setActive] = useState(0);
  const current = items[Math.min(active, items.length - 1)];
  return (
    <div className="studio-v2-interactive is-stepper">
      <ol className="studio-v2-site-timeline is-stepper">
        {items.map((item, position) => (
          <li key={`${item.title}-${position}`}>
            <button
              type="button"
              aria-current={position === active}
              className={position === active ? "is-active" : undefined}
              onClick={() => setActive(position)}
            >
              <span
                className="studio-v2-site-timeline-dot"
                aria-hidden="true"
              />
              <small>{item.meta || `Step ${position + 1}`}</small>
              <strong>{item.title}</strong>
            </button>
          </li>
        ))}
      </ol>
      {current && (
        <div className="studio-v2-interactive-step-detail" aria-live="polite">
          <small>
            {current.meta || `Step ${active + 1} of ${items.length}`}
          </small>
          <strong>{current.title}</strong>
          {current.body && <p>{current.body}</p>}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Content — FAQ accordion
 * ------------------------------------------------------------------ */

export function FaqAccordion({
  items,
  label,
}: {
  items: readonly ConceptItem[];
  label: string;
}) {
  const [open, setOpen] = useState<number | null>(0);
  const baseId = useId();
  return (
    <div className="studio-v2-site-faq is-accordion" aria-label={label}>
      {items.map((item, position) => {
        const expanded = open === position;
        const panelId = `${baseId}-panel-${position}`;
        const buttonId = `${baseId}-button-${position}`;
        return (
          <div
            key={`${item.title}-${position}`}
            className={expanded ? "is-open" : undefined}
          >
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpen(expanded ? null : position)}
              >
                <span>{item.title}</span>
                <i aria-hidden="true">{expanded ? "−" : "+"}</i>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!expanded}
            >
              {item.body && <p>{item.body}</p>}
              {item.meta && <small>{item.meta}</small>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Lead generation — a concept enquiry module
 * ------------------------------------------------------------------ */

export function EnquiryModule({
  businessName,
  primaryCta,
  secondaryCta,
  body,
}: {
  businessName: string;
  primaryCta: string;
  secondaryCta: string;
  body: string;
}) {
  const [sent, setSent] = useState(false);
  const fields = [
    { name: "name", label: "Your name", type: "text" },
    { name: "contact", label: "Email or phone", type: "text" },
    { name: "detail", label: "What do you need?", type: "textarea" },
  ] as const;

  return (
    <div className="studio-v2-interactive is-enquiry">
      <small>Enquiry preview</small>
      <strong>{primaryCta || `Contact ${businessName}`}</strong>
      {body && <p>{body}</p>}
      <form
        onSubmit={(event) => {
          // Concept only: nothing leaves the browser.
          event.preventDefault();
          setSent(true);
        }}
      >
        {fields.map((field) => (
          <label key={field.name}>
            <span>{field.label}</span>
            {field.type === "textarea" ? (
              <textarea rows={3} name={field.name} />
            ) : (
              <input type="text" name={field.name} />
            )}
          </label>
        ))}
        <div className="studio-v2-interactive-enquiry-actions">
          <button type="submit">{primaryCta || "Send enquiry"}</button>
          {secondaryCta && (
            <span className="studio-v2-interactive-secondary">
              {secondaryCta}
            </span>
          )}
        </div>
      </form>
      <p className="studio-v2-interactive-empty" aria-live="polite">
        {sent
          ? "Concept preview only — nothing was sent. Your finished website would deliver this enquiry to your inbox or CRM."
          : "This is a working preview of the enquiry step. No data leaves your browser."}
      </p>
    </div>
  );
}
