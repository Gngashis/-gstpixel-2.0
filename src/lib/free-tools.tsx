import { useEffect, useRef, useState } from "react";
import { AlertCircle, ArrowRight, Check, Copy, RefreshCw } from "lucide-react";
import { Button, ButtonLink } from "@/components/ui/button";
import {
  SectionHeader,
  ScrollReveal,
  StaggeredReveal,
} from "@/components/page";

export type HandoffNeed =
  | "website"
  | "application"
  | "ai"
  | "compliance"
  | "registration"
  | "consultancy"
  | "growth"
  | "unsure";

type ContextValue = string | number | boolean | undefined;

export function buildContext(
  source: string,
  fields: Record<string, ContextValue>,
) {
  return Object.entries(fields)
    .filter(([, value]) => value !== undefined && value !== "")
    .map(([key, value]) => {
      const safeValue = String(value)
        .replace(/[\r\n;]+/g, " ")
        .trim();
      return `${key}=${safeValue}`;
    })
    .join("; ");
}

export function CopyButton({
  text,
  label = "Copy summary",
}: {
  text: string;
  label?: string;
}) {
  const [status, setStatus] = useState<"default" | "success" | "error">(
    "default",
  );
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copy = async () => {
    if (!text.trim()) {
      setStatus("error");
      return;
    }

    try {
      if (!navigator.clipboard?.writeText)
        throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setStatus("default"), 2400);
    }
  };

  return (
    <Button
      type="button"
      variant="secondary"
      state={status}
      successText="Copied"
      errorText="Copy unavailable"
      onClick={copy}
      aria-live="polite"
    >
      {status === "default" && (
        <>
          <Copy size={16} aria-hidden="true" /> {label}
        </>
      )}
    </Button>
  );
}

export function ToolStartOver({
  onReset,
  label = "Start over",
}: {
  onReset: () => void;
  label?: string;
}) {
  return (
    <Button type="button" variant="quiet" onClick={onReset}>
      <RefreshCw size={15} aria-hidden="true" /> {label}
    </Button>
  );
}

export function ToolHandoff({
  interest,
  source,
  fields,
  label = "Continue to enquiry",
}: {
  interest: HandoffNeed;
  source: string;
  fields: Record<string, ContextValue>;
  label?: string;
}) {
  return (
    <ButtonLink
      to="/start-your-project"
      className="w-full"
      search={{
        interest,
        context: buildContext(source, fields),
      }}
    >
      {label} <ArrowRight size={16} aria-hidden="true" />
    </ButtonLink>
  );
}

export function ToolEmptyState({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="tool-empty-state" aria-live="polite">
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}

export function ToolMethodology({
  label = "Methodology",
  title,
  items,
}: {
  label?: string;
  title: string;
  items: ReadonlyArray<{
    strong: string;
    p: string;
  }>;
}) {
  return (
    <section className="content-band bg-secondary">
      <div className="site-container">
        <SectionHeader label={label} title={title} />
        <StaggeredReveal
          baseDelay={0.08}
          variant="fadeInUp"
          className="methodology-grid"
        >
          {items.map((item) => (
            <div
              key={item.strong}
              className="methodology-card glass-light luminous-edge"
            >
              <Check size={20} aria-hidden="true" />
              <div>
                <strong>{item.strong}</strong>
                <p>{item.p}</p>
              </div>
            </div>
          ))}
        </StaggeredReveal>
        <ScrollReveal variant="fadeInUp" delay={0.2}>
          <p className="methodology-boundary">
            <AlertCircle size={15} aria-hidden="true" /> This is deterministic
            guidance generated from your answers. It is not a guarantee,
            professional advice, or a substitute for validation with the right
            person or source.
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
}

export function ToolResultHeader({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <>
      <p className="label text-primary">{eyebrow}</p>
      <h2>{title}</h2>
    </>
  );
}
