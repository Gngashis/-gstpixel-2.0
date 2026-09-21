/**
 * In-memory handoff for the homepage Studio quick-start.
 *
 * The description lives only in this module's memory: it is never written to
 * the URL, localStorage, sessionStorage, cookies, or history state. It is
 * consumed exactly once (on Studio mount) and is lost on a full page load,
 * which preserves the existing Website Studio privacy model.
 */

let pendingPrompt: string | null = null;

export function setStudioIntakePrompt(prompt: string): void {
  const value = prompt.replace(/\s+/g, " ").trim();
  pendingPrompt = value.length ? value : null;
}

export function consumeStudioIntakePrompt(): string | null {
  const value = pendingPrompt;
  pendingPrompt = null;
  return value;
}
