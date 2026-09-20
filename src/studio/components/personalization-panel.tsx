import { RotateCcw } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { STUDIO_PERSONALIZATION_API_PATH } from "../personalization/config";
import {
  formatPersonalizationValidationError,
  parseStudioPersonalization,
  STUDIO_PERSONALIZATION_CLIENT_TIMEOUT_MS,
  STUDIO_PERSONALIZATION_CLIENT_COOLDOWN_MS,
  studioPersonalizationRequestSchema,
  type StudioPersonalization,
} from "../personalization/schema";
import type { StudioBusiness, StudioDirection } from "../types";

type AppliedPersonalization = {
  category: StudioBusiness["id"];
  direction: StudioDirection["id"];
  businessName: string;
  content: StudioPersonalization;
};

type PersonalizationPanelProps = {
  business: StudioBusiness;
  direction: StudioDirection;
  applied: AppliedPersonalization | null;
  onApply: (personalization: AppliedPersonalization) => void;
  onReset: () => void;
};

class UserFacingPersonalizationError extends Error {}

export function PersonalizationPanel({
  business,
  direction,
  applied,
  onApply,
  onReset,
}: PersonalizationPanelProps) {
  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [coolingDown, setCoolingDown] = useState(false);
  const cooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestControllerRef = useRef<AbortController | null>(null);
  const requestSequenceRef = useRef(0);

  useEffect(() => {
    return () => {
      requestSequenceRef.current += 1;
      requestControllerRef.current?.abort();
      if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    };
  }, []);

  const startCooldown = () => {
    setCoolingDown(true);
    if (cooldownTimerRef.current) clearTimeout(cooldownTimerRef.current);
    cooldownTimerRef.current = setTimeout(() => {
      setCoolingDown(false);
      cooldownTimerRef.current = null;
    }, STUDIO_PERSONALIZATION_CLIENT_COOLDOWN_MS);
  };

  const handleReset = () => {
    setBusinessName("");
    setDescription("");
    setStatus("idle");
    setErrorMessage("");
    onReset();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "loading" || coolingDown) return;

    const parsedInput = studioPersonalizationRequestSchema.safeParse({
      category: business.id,
      direction: direction.id,
      businessName,
      description,
    });

    if (!parsedInput.success) {
      setStatus("error");
      setErrorMessage(formatPersonalizationValidationError(parsedInput.error));
      return;
    }

    setStatus("loading");
    setErrorMessage("");
    requestControllerRef.current?.abort();
    const controller = new AbortController();
    requestControllerRef.current = controller;
    const requestSequence = requestSequenceRef.current + 1;
    requestSequenceRef.current = requestSequence;
    let timedOut = false;
    const timeoutId = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, STUDIO_PERSONALIZATION_CLIENT_TIMEOUT_MS);

    try {
      const requestBody = {
        category: parsedInput.data.category,
        direction: parsedInput.data.direction,
        description: parsedInput.data.description,
        ...(parsedInput.data.businessName
          ? { businessName: parsedInput.data.businessName }
          : {}),
      };

      const response = await fetch(STUDIO_PERSONALIZATION_API_PATH, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      if (requestSequence !== requestSequenceRef.current) return;

      const payload = (await response.json().catch(() => null)) as {
        personalization?: unknown;
        error?: unknown;
      } | null;

      if (!response.ok) {
        throw new UserFacingPersonalizationError(
          typeof payload?.error === "string" ? payload.error : undefined,
        );
      }

      let content: StudioPersonalization;
      try {
        content = parseStudioPersonalization(
          business.id,
          payload?.personalization,
        );
      } catch {
        throw new UserFacingPersonalizationError(
          "Personalization isn't available right now. Your selected concept is still ready.",
        );
      }

      onApply({
        category: parsedInput.data.category,
        direction: parsedInput.data.direction,
        businessName: parsedInput.data.businessName ?? "",
        content,
      });
      setStatus("idle");
    } catch (error) {
      if (
        controller.signal.aborted &&
        !timedOut &&
        requestSequence !== requestSequenceRef.current
      ) {
        return;
      }
      setStatus("error");
      setErrorMessage(
        error instanceof UserFacingPersonalizationError && error.message
          ? error.message
          : "Personalization isn't available right now. Your selected concept is still ready.",
      );
    } finally {
      clearTimeout(timeoutId);
      if (requestControllerRef.current === controller) {
        requestControllerRef.current = null;
      }
      if (requestSequence === requestSequenceRef.current) startCooldown();
    }
  };

  const descriptionLength = description.length;
  const isBusy = status === "loading";

  return (
    <section
      className={`studio-personalization${applied ? " is-applied" : ""}`}
      aria-labelledby="studio-personalization-title"
      data-testid="studio-personalization"
      style={
        {
          "--studio-business-accent": business.accent,
          "--studio-business-accent-soft": business.accentSoft,
        } as React.CSSProperties
      }
    >
      <div className="studio-personalization-intro">
        <p>Optional refinement</p>
        <h2 id="studio-personalization-title">Personalize this concept.</h2>
        <span>
          Add only the details you want to share. Nothing is sent while you
          type, and the original {business.name} · {direction.name} concept
          remains available without AI.
        </span>
      </div>

      <form
        className="studio-personalization-form"
        onSubmit={handleSubmit}
        aria-busy={isBusy}
      >
        <div className="studio-personalization-field">
          <label htmlFor="studio-business-name">Business name (optional)</label>
          <input
            id="studio-business-name"
            name="businessName"
            type="text"
            autoComplete="organization"
            maxLength={80}
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value)}
            disabled={isBusy}
          />
        </div>

        <div className="studio-personalization-field">
          <div className="studio-personalization-label-row">
            <label htmlFor="studio-business-description">
              Describe your business
            </label>
            <span aria-hidden="true">{descriptionLength}/600</span>
          </div>
          <textarea
            id="studio-business-description"
            name="description"
            rows={5}
            minLength={20}
            maxLength={600}
            required
            aria-describedby="studio-personalization-example studio-personalization-privacy"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            disabled={isBusy}
          />
          <p
            id="studio-personalization-example"
            className="studio-example-copy"
          >
            Example: Family-run boutique resort near the India–Bhutan border
            focused on couples, mountain views and private stays.
          </p>
        </div>

        <p id="studio-personalization-privacy" className="studio-privacy-copy">
          Only the category, direction, business name, and description you
          submit are sent for this request. Avoid sensitive, confidential,
          financial, or private information. The text is not saved by Website
          Studio.
        </p>

        <div className="studio-personalization-actions">
          <button
            type="submit"
            className="studio-personalize-button tactile"
            disabled={isBusy || coolingDown}
            aria-disabled={isBusy || coolingDown}
          >
            {isBusy
              ? "Personalizing concept…"
              : status === "error"
                ? "Try again"
                : applied
                  ? "Update personalization"
                  : "Personalize this concept"}
          </button>
          {applied && (
            <button
              type="button"
              className="studio-reset-personalization"
              onClick={handleReset}
              disabled={isBusy}
            >
              <RotateCcw size={15} aria-hidden="true" /> Reset personalization
            </button>
          )}
        </div>

        <div className="studio-personalization-status" aria-live="polite">
          {isBusy && (
            <p role="status">
              Refining the existing concept. The original preview stays ready.
            </p>
          )}
          {status === "error" && <p role="alert">{errorMessage}</p>}
          {applied && status !== "error" && !isBusy && (
            <p role="status">Personalized refinement applied.</p>
          )}
        </div>
      </form>
    </section>
  );
}

export type { AppliedPersonalization };
