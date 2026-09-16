import { useMemo, useState } from "react";
import { ArrowRight, Check, ClipboardList, RotateCcw } from "lucide-react";
import { PageIntro, SectionHeader, StaggeredReveal } from "@/components/page";
import { Button, ButtonLink } from "@/components/ui/button";
import { CopyButton, ToolEmptyState, ToolMethodology } from "@/lib/free-tools";

type Kind =
  "roadmap" | "requirements" | "readiness" | "improvement" | "planning";
type Value = string | string[];
type Option = { value: string; label: string; desc?: string };
type Field = {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "radio" | "checkbox";
  required?: boolean;
  options?: readonly Option[];
  placeholder?: string;
};

const scoreOptions = [
  { value: "0", label: "Not started" },
  { value: "1", label: "Some pieces exist" },
  { value: "2", label: "Mostly ready" },
  { value: "3", label: "Clear and maintained" },
] as const;

const common = {
  roadmap: {
    label: "Tool 05",
    title: "Business idea to digital roadmap",
    description:
      "Turn a business idea into a practical sequence of digital decisions. This is structured planning, not an AI-generated business plan.",
    fields: [
      {
        id: "idea",
        label: "What is the business idea?",
        type: "textarea",
        required: true,
        placeholder:
          "A short description of the offer and the problem it solves.",
      },
      {
        id: "audience",
        label: "Who is it for?",
        type: "text",
        required: true,
        placeholder: "Customers, members, local businesses...",
      },
      {
        id: "stage",
        label: "Where are you now?",
        type: "select",
        required: true,
        options: [
          { value: "idea", label: "Exploring the idea" },
          { value: "early", label: "Early customers or validation" },
          { value: "operating", label: "Already operating" },
        ],
      },
      {
        id: "priority",
        label: "Your first digital priority",
        type: "select",
        required: true,
        options: [
          { value: "presence", label: "Be discoverable and explain the offer" },
          { value: "sell", label: "Sell or accept enquiries online" },
          { value: "operations", label: "Reduce repeated operational work" },
        ],
      },
    ] as const,
    methodology:
      "Maps stage, audience, and first priority to a fixed sequence of discovery, minimum digital foundation, launch, and measurement steps.",
  },
  requirements: {
    label: "Tool 06",
    title: "Website requirement generator",
    description:
      "Create a clear starting brief for a website conversation from the content, audience, and actions you select.",
    fields: [
      {
        id: "siteType",
        label: "What kind of website is this?",
        type: "select",
        required: true,
        options: [
          { value: "brand", label: "Business / brand website" },
          { value: "commerce", label: "Selling products or services" },
          { value: "portal", label: "Portal or member experience" },
        ],
      },
      {
        id: "audience",
        label: "Primary audience",
        type: "text",
        required: true,
        placeholder: "Who should understand or use it?",
      },
      {
        id: "goals",
        label: "What should the website help people do?",
        type: "checkbox",
        required: true,
        options: [
          { value: "understand", label: "Understand the offer" },
          { value: "enquire", label: "Send an enquiry" },
          { value: "book", label: "Book or request a service" },
          { value: "buy", label: "Buy online" },
        ],
      },
      {
        id: "content",
        label: "Known content, constraints, or integrations",
        type: "textarea",
        placeholder:
          "Existing brand assets, pages, forms, systems, deadlines...",
      },
    ] as const,
    methodology:
      "Creates requirements from your selected goals. It does not inspect an existing site, verify integrations, or estimate price.",
  },
  readiness: {
    label: "Tool 07",
    title: "Digital readiness assessment",
    description:
      "Score the practical foundations behind a digital project and get a focused next-step list.",
    fields: [
      {
        id: "presence",
        label: "How clear is your current digital presence?",
        type: "radio",
        required: true,
        options: scoreOptions,
      },
      {
        id: "content",
        label: "How ready is your content and offer information?",
        type: "radio",
        required: true,
        options: scoreOptions,
      },
      {
        id: "process",
        label: "How defined is the process after an enquiry or sale?",
        type: "radio",
        required: true,
        options: scoreOptions,
      },
      {
        id: "ownership",
        label: "Is someone responsible for ongoing updates?",
        type: "radio",
        required: true,
        options: scoreOptions,
      },
      {
        id: "measurement",
        label: "Can you name the outcome you want to measure?",
        type: "radio",
        required: true,
        options: scoreOptions,
      },
    ] as const,
    methodology:
      "Each answer contributes 0–3 points. The band is a planning signal, not an audit, benchmark, or certification.",
  },
  improvement: {
    label: "Tool 08",
    title: "Website improvement analyzer",
    description:
      "A guided self-assessment for deciding what to improve next. It does not scan or claim to have visited a website.",
    fields: [
      {
        id: "goal",
        label: "What should improve first?",
        type: "select",
        required: true,
        options: [
          { value: "clarity", label: "Clarity and trust" },
          { value: "conversion", label: "Enquiries or conversion" },
          { value: "performance", label: "Speed and usability" },
          { value: "maintenance", label: "Content and maintenance" },
        ],
      },
      {
        id: "audience",
        label: "Who is the primary visitor?",
        type: "text",
        required: true,
        placeholder: "A specific customer or user group",
      },
      {
        id: "issues",
        label: "What have you noticed?",
        type: "checkbox",
        required: true,
        options: [
          {
            value: "unclear",
            label: "People do not understand the offer quickly",
          },
          { value: "action", label: "The next action is easy to miss" },
          { value: "mobile", label: "Mobile experience feels difficult" },
          { value: "stale", label: "Content or proof is out of date" },
          { value: "slow", label: "Pages feel slow or heavy" },
        ],
      },
      {
        id: "evidence",
        label: "What information are you basing this on?",
        type: "textarea",
        placeholder:
          "Your observations, support questions, analytics notes, or user feedback.",
      },
    ] as const,
    methodology:
      "Prioritises supplied observations using fixed rules. No URL is fetched, no arbitrary site is scraped, and no technical finding is asserted without evidence.",
  },
  planning: {
    label: "Tool 09",
    title: "Project planning assistant",
    description:
      "Shape an actionable first plan with phases, decisions, and dependencies. It does not promise delivery dates or staffing.",
    fields: [
      {
        id: "objective",
        label: "What outcome are you planning?",
        type: "textarea",
        required: true,
        placeholder: "Describe the outcome in one or two sentences.",
      },
      {
        id: "timeframe",
        label: "Planning horizon",
        type: "select",
        required: true,
        options: [
          { value: "explore", label: "Explore and define" },
          { value: "quarter", label: "Plan for the next quarter" },
          { value: "launch", label: "Prepare for a launch" },
          { value: "improve", label: "Improve an existing product" },
        ],
      },
      {
        id: "team",
        label: "Who needs to contribute?",
        type: "text",
        required: true,
        placeholder: "Founder, marketing, operations, developer...",
      },
      {
        id: "dependencies",
        label: "Known constraints or dependencies",
        type: "textarea",
        placeholder:
          "Approvals, content, systems, legal review, budget decisions...",
      },
    ] as const,
    methodology:
      "Uses the selected horizon to arrange a fixed planning sequence. It is not a project-management system and does not infer unknown dependencies.",
  },
} satisfies Record<
  Kind,
  {
    label: string;
    title: string;
    description: string;
    fields: readonly Field[];
    methodology: string;
  }
>;

const labels: Record<string, string> = Object.fromEntries(
  Object.values(common).flatMap((tool) =>
    tool.fields.map((field) => [field.id, field.label]),
  ),
);

function outputFor(kind: Kind, values: Record<string, Value>) {
  const get = (id: string) => values[id];
  if (kind === "readiness") {
    const score = [
      "presence",
      "content",
      "process",
      "ownership",
      "measurement",
    ].reduce((sum, id) => sum + Number(get(id) || 0), 0);
    const band =
      score <= 5
        ? "Foundation first"
        : score <= 10
          ? "Prepare and prioritise"
          : "Ready for focused improvement";
    const steps =
      score <= 5
        ? [
            "Clarify the offer and audience",
            "Document the process behind the digital experience",
            "Assign an owner for updates",
          ]
        : score <= 10
          ? [
              "Choose one measurable outcome",
              "Prioritise the highest-friction journey",
              "Prepare content and implementation decisions",
            ]
          : [
              "Define the first release or improvement scope",
              "Set a simple measurement baseline",
              "Schedule a review after launch or change",
            ];
    return { title: band, summary: `Readiness signal: ${score}/15`, steps };
  }
  if (kind === "roadmap") {
    const priority = String(get("priority") || "");
    const first =
      priority === "sell"
        ? "Define the buying or enquiry journey"
        : priority === "operations"
          ? "Map the repeated workflow and handoffs"
          : "Clarify the offer, audience, and trust signals";
    return {
      title: "A practical digital sequence",
      summary: `Start with ${first.toLowerCase()}.`,
      steps: [
        "Validate the audience, offer, and desired outcome",
        first,
        "Build the smallest useful digital foundation",
        "Launch with a feedback and measurement loop",
      ],
    };
  }
  if (kind === "requirements") {
    const goals = (get("goals") as string[] | undefined) ?? [];
    const goalText = goals.length
      ? goals
          .map((goal) =>
            goal === "understand"
              ? "clear positioning"
              : goal === "enquire"
                ? "an enquiry path"
                : goal === "book"
                  ? "booking or service request flow"
                  : "a purchase flow",
          )
          .join(", ")
      : "a defined primary action";
    return {
      title: "Website brief starter",
      summary: `Primary outcome: ${goalText}.`,
      steps: [
        "Define the audience and success action",
        `Plan content for ${goalText}`,
        "Confirm integrations, ownership, and accessibility needs",
        "Review scope before design and build",
      ],
    };
  }
  if (kind === "improvement") {
    const issues = (get("issues") as string[] | undefined) ?? [];
    const order = ["unclear", "action", "mobile", "stale", "slow"].filter(
      (issue) => issues.includes(issue),
    );
    const issueNames: Record<string, string> = {
      unclear: "message clarity",
      action: "primary action visibility",
      mobile: "mobile usability",
      stale: "content freshness",
      slow: "performance evidence",
    };
    return {
      title: "Evidence-led improvement queue",
      summary: order.length
        ? `Review ${order.map((issue) => issueNames[issue]).join(", ")}.`
        : "Start by recording one observed friction.",
      steps: (order.length ? order : ["unclear", "action", "mobile"]).map(
        (issue) =>
          `Check ${issueNames[issue]} using supplied observations before changing it`,
      ),
    };
  }
  const horizon = String(get("timeframe") || "");
  const phases =
    horizon === "launch"
      ? [
          "Define launch scope and owner",
          "Prepare content, build, and review",
          "Test the key journey",
          "Launch with a support and measurement plan",
        ]
      : horizon === "improve"
        ? [
            "Capture the current friction",
            "Prioritise one improvement",
            "Implement and test the change",
            "Review evidence and iterate",
          ]
        : [
            "Clarify the outcome and constraints",
            "Break the work into decisions and deliverables",
            "Choose a first small milestone",
            "Review progress and update the plan",
          ];
  return {
    title: "A workable first plan",
    summary: "Sequence decisions before committing to delivery.",
    steps: phases,
  };
}

export function FreeToolPage({ kind }: { kind: Kind }) {
  const config: {
    label: string;
    title: string;
    description: string;
    fields: readonly Field[];
    methodology: string;
  } = common[kind];
  const [values, setValues] = useState<Record<string, Value>>({});
  const [generated, setGenerated] = useState(false);
  const output = useMemo(() => outputFor(kind, values), [kind, values]);
  const requiredReady = config.fields
    .filter((field) => field.required)
    .every((field) => {
      const value = values[field.id];
      return Array.isArray(value) ? value.length > 0 : Boolean(value?.trim());
    });
  const setValue = (id: string, value: Value) =>
    setValues((current) => ({ ...current, [id]: value }));
  const reset = () => {
    setValues({});
    setGenerated(false);
  };
  const summary = `${config.title}\n${output.title}\n${output.summary}\n\n${output.steps.map((step, index) => `${index + 1}. ${step}`).join("\n")}`;

  return (
    <>
      <PageIntro
        label={config.label}
        title={config.title}
        description={config.description}
      />
      <section className="content-band">
        <div className="site-container tool-layout">
          <form
            className="tool-input-panel"
            onSubmit={(event) => {
              event.preventDefault();
              if (requiredReady) setGenerated(true);
            }}
          >
            <p className="label text-primary">Your inputs</p>
            {config.fields.map((field) => (
              <FieldControl
                key={field.id}
                field={field}
                value={values[field.id]}
                onChange={(value) => setValue(field.id, value)}
              />
            ))}
            <div className="enquiry-actions">
              <Button type="submit" disabled={!requiredReady}>
                <ClipboardList size={16} aria-hidden="true" /> Generate guidance
              </Button>
              <Button type="button" variant="quiet" onClick={reset}>
                <RotateCcw size={15} aria-hidden="true" /> Start over
              </Button>
            </div>
            {!requiredReady && (
              <p className="field-note" role="status">
                Complete the marked questions to generate a result.
              </p>
            )}
          </form>
          <aside
            className="result-panel"
            aria-live="polite"
            aria-label="Generated guidance"
          >
            {generated ? (
              <>
                <p className="label text-primary">Your result</p>
                <h2>{output.title}</h2>
                <p>{output.summary}</p>
                <ol className="tool-result-list">
                  {output.steps.map((step) => (
                    <li key={step}>
                      <Check size={16} aria-hidden="true" /> <span>{step}</span>
                    </li>
                  ))}
                </ol>
                <div className="tool-result-actions">
                  <CopyButton text={summary} label="Copy summary" />
                  <ButtonLink
                    to="/start-your-project"
                    search={{
                      interest:
                        kind === "readiness"
                          ? "consultancy"
                          : kind === "requirements" || kind === "improvement"
                            ? "website"
                            : "consultancy",
                      context: summary,
                    }}
                  >
                    {"Continue to enquiry"}{" "}
                    <ArrowRight size={16} aria-hidden="true" />
                  </ButtonLink>
                </div>
              </>
            ) : (
              <ToolEmptyState title="Your guidance will appear here">
                Answer the required questions, then generate an editable
                summary. Nothing is sent or scanned.
              </ToolEmptyState>
            )}
          </aside>
        </div>
      </section>
      <ToolMethodology
        title="Useful structure, not a black box"
        items={[
          {
            strong: "Browser-side only",
            p: "Your answers are used in this page and are not sent to an API.",
          },
          { strong: "Fixed mappings", p: config.methodology },
          {
            strong: "You verify the result",
            p: "Use this as a starting brief and confirm project, legal, technical, or accessibility details before acting.",
          },
        ]}
      />
      <section className="content-band">
        <div className="site-container">
          <SectionHeader
            label="Next step"
            title="Turn the outline into a conversation."
          />
          <p className="field-note">
            The enquiry handoff carries the selected tool context. It does not
            submit an enquiry or promise a response.
          </p>
        </div>
      </section>
    </>
  );
}

function FieldControl({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: Value | undefined;
  onChange: (value: Value) => void;
}) {
  const inputValue = typeof value === "string" ? value : "";
  if (field.type === "checkbox")
    return (
      <fieldset className="mt-6">
        <legend className="form-label">
          {field.label}
          {field.required && " *"}
        </legend>
        <div className="capability-grid">
          {field.options?.map((option) => {
            const checked =
              Array.isArray(value) && value.includes(option.value);
            return (
              <label
                key={option.value}
                className={`capability-chip ${checked ? "selected" : ""}`}
              >
                <input
                  className="sr-only"
                  type="checkbox"
                  checked={checked}
                  onChange={() =>
                    onChange(
                      checked
                        ? (value as string[]).filter(
                            (item) => item !== option.value,
                          )
                        : [
                            ...(Array.isArray(value) ? value : []),
                            option.value,
                          ],
                    )
                  }
                />
                <span className="chip-label">{option.label}</span>
                {checked && <Check size={14} aria-hidden="true" />}
              </label>
            );
          })}
        </div>
      </fieldset>
    );
  return (
    <div className="mt-6">
      <label className="form-label" htmlFor={field.id}>
        {field.label}
        {field.required && " *"}
      </label>
      {field.type === "textarea" ? (
        <textarea
          id={field.id}
          className="form-control min-h-[120px]"
          value={inputValue}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          required={field.required}
        />
      ) : field.type === "text" ? (
        <input
          id={field.id}
          className="form-control"
          value={inputValue}
          onChange={(event) => onChange(event.target.value)}
          placeholder={field.placeholder}
          required={field.required}
        />
      ) : field.type === "radio" ? (
        <div
          className="segmented-grid"
          role="radiogroup"
          aria-label={field.label}
        >
          {field.options?.map((option) => (
            <label
              key={option.value}
              className={`segmented-option ${inputValue === option.value ? "selected" : ""}`}
            >
              <input
                className="sr-only"
                type="radio"
                name={field.id}
                value={option.value}
                checked={inputValue === option.value}
                onChange={() => onChange(option.value)}
              />
              <span className="option-content">
                <strong>{option.label}</strong>
              </span>
            </label>
          ))}
        </div>
      ) : (
        <select
          id={field.id}
          className="form-control"
          value={inputValue}
          onChange={(event) => onChange(event.target.value)}
          required={field.required}
        >
          <option value="">Choose one</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export const toolLabels = labels;
