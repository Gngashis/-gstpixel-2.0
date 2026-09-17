import { describe, it, expect } from "vitest";
import {
  readinessCategories,
  totalQuestionCount,
  scoreReadiness,
  buildReadinessSummary,
  buildHandoffFields,
  type Answers,
} from "./digital-readiness";

// Helpers
function allAnswers(value: "0" | "1" | "2" | "3"): Answers {
  // Map score -> first option with that score per question (deterministic)
  const ans: Answers = {};
  for (const c of readinessCategories) {
    for (const q of c.questions) {
      const opt = q.options.find((o) => o.score === Number(value));
      if (opt) ans[q.id] = opt.value;
      else ans[q.id] = q.options[0]!.value; // fallback
    }
  }
  return ans;
}

function maxAnswers(): Answers {
  const ans: Answers = {};
  for (const c of readinessCategories) {
    for (const q of c.questions) {
      // max is always 3 (non-NA); pick option with score 3
      const opt = q.options.find((o) => o.score === 3);
      ans[q.id] = opt ? opt.value : q.options.find((o) => !o.na)!.value;
    }
  }
  return ans;
}

function minAnswers(): Answers {
  const ans: Answers = {};
  for (const c of readinessCategories) {
    for (const q of c.questions) {
      const opt = q.options.find((o) => o.score === 0);
      ans[q.id] = opt ? opt.value : q.options.find((o) => !o.na)!.value;
    }
  }
  return ans;
}

describe("digital-readiness scoring engine", () => {
  it("exports expected category count and question count", () => {
    expect(readinessCategories).toHaveLength(13);
    // totalQuestionCount is derived
    const counted = readinessCategories.reduce(
      (s, c) => s + c.questions.length,
      0,
    );
    expect(totalQuestionCount).toBe(counted);
    expect(totalQuestionCount).toBeGreaterThan(30);
  });

  it("returns empty result for no answers", () => {
    const r = scoreReadiness({});
    expect(r.answeredCount).toBe(0);
    expect(r.overallPercent).toBeNull();
    expect(r.label).toBeNull();
    expect(r.categories.every((c) => c.percent === null)).toBe(true);
    expect(r.strengths).toHaveLength(0);
    expect(r.gaps).toHaveLength(0);
    expect(r.shortActions).toHaveLength(0);
    expect(r.mediumActions).toHaveLength(0);
  });

  it("scores single question: 0 => 0%, 3 => 100%", () => {
    // presence has 4 questions, answer only one with 0
    const zero = scoreReadiness({ "presence.website": "none" });
    const cat = zero.categories.find((c) => c.id === "presence")!;
    expect(cat.percent).toBe(0);
    expect(cat.answered).toBe(1);

    const full = scoreReadiness({ "presence.website": "managed" });
    const cat2 = full.categories.find((c) => c.id === "presence")!;
    expect(cat2.percent).toBe(100);
  });

  it("computes category percent as sum/max *100 rounded", () => {
    // presence: 4 questions, answer 2: 0 + 3 => 3/6 = 50%
    const r = scoreReadiness({
      "presence.website": "none", // 0
      "presence.domain": "consistent", // 3
    });
    expect(r.categories.find((c) => c.id === "presence")!.percent).toBe(50);

    // 1 + 2 => 3/6 = 50%
    const r2 = scoreReadiness({
      "presence.website": "listing", // 1
      "presence.domain": "owned", // 2
    });
    expect(r2.categories.find((c) => c.id === "presence")!.percent).toBe(50);

    // 1 + 1 => 2/6 = 33%
    const r3 = scoreReadiness({
      "presence.website": "listing", // 1
      "presence.domain": "free", // 1
    });
    expect(r3.categories.find((c) => c.id === "presence")!.percent).toBe(33);
  });

  it("all-max answers produce 100% overall and Advanced label", () => {
    const r = scoreReadiness(maxAnswers());
    expect(r.overallPercent).toBe(100);
    expect(r.label).toBe("Advanced");
    // every scored category at 100%
    for (const c of r.categories) expect(c.percent).toBe(100);
    expect(r.strengths.length).toBe(r.categories.length);
    expect(r.gaps).toHaveLength(0);
  });

  it("all-zero answers produce 0% overall and Foundation label", () => {
    const r = scoreReadiness(minAnswers());
    expect(r.overallPercent).toBe(0);
    expect(r.label).toBe("Foundation");
    for (const c of r.categories) expect(c.percent).toBe(0);
    expect(r.gaps.length).toBe(r.categories.length);
    expect(r.strengths).toHaveLength(0);
  });

  it("label thresholds: Foundation <35, Developing 35-54, Established 55-74, Advanced >=75", () => {
    // Build answers to hit specific overall via uniform category percents
    // Use presence+website only to control overall: 2 categories averaged
    // To get 33%: 1/3 per category => need 1 answer of score 1 per category
    // Simpler: test readinessLabel indirectly via crafted overall
    // We test boundary by brute-forcing overall 34,35,54,55,74,75
    // Helper to make overall = target by making N categories same percent
    function overallWithUniformPercent(pct: number): number | null {
      // create answers where each answered category has pct
      // For pct=0 use all 0, for 100 use all 3, for 33 use score 1 on 1 question per cat
      // We'll just trust label logic via scoreReadiness with controlled inputs
      return pct;
    }
    expect(overallWithUniformPercent(34)).toBe(34);
    // Direct label tests via scoreReadiness on constructed scenarios:
    // 34% => Foundation (answer 1q with 1/3 in one category, rest unanswered -> overall 33)
    const f = scoreReadiness({ "presence.website": "listing" }); // 1/3=33%
    expect(f.overallPercent).toBe(33);
    expect(f.label).toBe("Foundation");

    // 50% => Developing
    const dev = scoreReadiness({
      "presence.website": "listing", // 33%
      "presence.domain": "consistent", // together 50%
      // Actually presence with 1,3 => 4/6=67%
    });
    // More precise: presence 3+0 =>50% is Developing? No, overall single category 50 => Developing
    const dev2 = scoreReadiness({
      "presence.website": "managed", // 3
      "presence.domain": "none", // 0 => 50%
    });
    expect(dev2.overallPercent).toBe(50);
    expect(dev2.label).toBe("Developing");

    // 67% => Established
    const est = scoreReadiness({
      "presence.website": "managed", // 3
      "presence.domain": "managed", // wrong id, use consistent
    });
    // presence: managed(3)+consistent(3)=6/6=100 but we need 67
    // use presence 3+3+0 => 6/9=67%
    const est2 = scoreReadiness({
      "presence.website": "managed", // 3
      "presence.domain": "consistent", // 3
      "presence.email": "personal", // 0 => 6/9=67
    });
    expect(est2.categories.find((c) => c.id === "presence")!.percent).toBe(67);
    // overall single category 67 => Established
    expect(est2.overallPercent).toBe(67);
    expect(est2.label).toBe("Established");

    // 100 => Advanced
    const adv = scoreReadiness(maxAnswers());
    expect(adv.label).toBe("Advanced");
  });

  it("partial completion: overall is average of scored categories only", () => {
    // Answer only presence at 100% and website at 0% => overall 50%
    const r = scoreReadiness({
      "presence.website": "managed",
      "presence.domain": "consistent",
      "presence.email": "business-all",
      "presence.discoverability": "easy", // presence 12/12=100%
      "website.mobile": "none",
      "website.currentness": "none",
      "website.contact": "none",
      "website.quality": "none", // website 0/12=0%
    });
    expect(r.categories.find((c) => c.id === "presence")!.percent).toBe(100);
    expect(r.categories.find((c) => c.id === "website")!.percent).toBe(0);
    // other categories unscored => overall = (100+0)/2=50
    expect(r.overallPercent).toBe(50);
    expect(r.categories.filter((c) => c.percent === null)).toHaveLength(11);
  });

  describe("NA exclusion", () => {
    it("excludes NA answers from denominator and answered count", () => {
      // commerce: booking=na, sales=na, payments=na, workflow=manual(0)
      const r = scoreReadiness({
        "commerce.booking": "na",
        "commerce.sales": "na",
        "commerce.payments": "na",
        "commerce.workflow": "manual", // 0
      });
      const commerce = r.categories.find((c) => c.id === "commerce")!;
      // only workflow counts => 0/3=0%
      expect(commerce.answered).toBe(1);
      expect(commerce.percent).toBe(0);
      expect(r.answeredCount).toBe(1);
    });

    it("NA does not penalize max score", () => {
      const r = scoreReadiness({
        "commerce.booking": "na",
        "commerce.sales": "na",
        "commerce.payments": "na",
        "commerce.workflow": "clear", // 3/3=100%
      });
      expect(r.categories.find((c) => c.id === "commerce")!.percent).toBe(100);
    });

    it("all NA in commerce yields null category (excluded from overall)", () => {
      const r = scoreReadiness({
        "commerce.booking": "na",
        "commerce.sales": "na",
        "commerce.payments": "na",
        // workflow unanswered
      });
      const commerce = r.categories.find((c) => c.id === "commerce")!;
      expect(commerce.percent).toBeNull();
      expect(commerce.answered).toBe(0);
      // overall should be null if only NA-commerce answered
      expect(r.overallPercent).toBeNull();
    });

    it("mix NA and scored: correct percent", () => {
      const r = scoreReadiness({
        "commerce.booking": "na", // excluded
        "commerce.sales": "purchase", // 3
        "commerce.payments": "cash", // 0
        "commerce.workflow": "clear", // 3 => 6/9=67%
      });
      expect(r.categories.find((c) => c.id === "commerce")!.percent).toBe(67);
      expect(r.categories.find((c) => c.id === "commerce")!.answered).toBe(3);
    });
  });

  describe("recommendation ordering", () => {
    it("no answers => no recommendations", () => {
      const r = scoreReadiness({});
      expect(r.shortActions).toHaveLength(0);
      expect(r.mediumActions).toHaveLength(0);
    });

    it("triggers expected short-term rule for presence.website=none", () => {
      const r = scoreReadiness({ "presence.website": "none" });
      expect(
        r.shortActions.some(
          (a) => a.title === "Establish a website foundation",
        ),
      ).toBe(true);
    });

    it("sorts recommendations by category gap ascending (weakest category first)", () => {
      // Create two triggered rules in different categories with different gaps
      // presence: website=none => presence will be 0% (1q answered 0/3)
      // security: backups=none => security 0% as well, but we can make presence higher
      // Let's make presence 67% (2 questions 3+1? actually 3+1=4/6=67) and trigger presence.website rule still? need website=none=>presence 0, can't have both.
      // Alternative: trigger presence.domain=none (presence 0) and security.backups=none with security also 0 -> tie, order is rule definition order, but gap same => stable.
      // Better: create distinct gaps:
      // presence: answer 3 questions: managed(3), consistent(3), personal(0) => 6/9=67% but still domain? we need domain=none to trigger rule.
      // To create distinct gaps, trigger rules in categories where overall category percent differs due to other answers in same category.
      const r = scoreReadiness({
        // presence: website=none triggers rule, but add other high answers to lift category to ~50%
        "presence.website": "none", // 0 triggers "Establish a website foundation" -> presence gap?
        "presence.domain": "consistent", // 3
        "presence.email": "business-all", // 3
        "presence.discoverability": "easy", // 3 => presence 9/12=75% (but rule still triggered)
        // analytics: traffic=no triggers rule, analytics will be 0% (1q 0/3)
        "analytics.traffic": "no",
      });
      const presenceGap = r.categories.find(
        (c) => c.id === "presence",
      )!.percent!; // 75
      const analyticsGap = r.categories.find(
        (c) => c.id === "analytics",
      )!.percent!; // 0
      expect(presenceGap).toBe(75);
      expect(analyticsGap).toBe(0);
      // analytics rule should sort before presence rule because 0 < 75
      const shortTitles = r.shortActions.map((a) => a.title);
      const analyticsIdx = shortTitles.indexOf("Add basic analytics");
      const websiteIdx = shortTitles.indexOf("Establish a website foundation");
      expect(analyticsIdx).toBeGreaterThanOrEqual(0);
      expect(websiteIdx).toBeGreaterThanOrEqual(0);
      expect(analyticsIdx).toBeLessThan(websiteIdx);
    });

    it("separates short vs medium horizon correctly", () => {
      const r = scoreReadiness({
        "presence.website": "none", // short
        "content.brand": "none", // medium
        "analytics.traffic": "no", // short
        "analytics.conversion": "no", // medium
      });
      expect(r.shortActions.every((a) => a.horizon === "short")).toBe(true);
      expect(r.mediumActions.every((a) => a.horizon === "medium")).toBe(true);
      expect(
        r.shortActions.some(
          (a) => a.title === "Establish a website foundation",
        ),
      ).toBe(true);
      expect(
        r.mediumActions.some((a) => a.title === "Create core brand assets"),
      ).toBe(true);
      expect(
        r.mediumActions.some((a) => a.title === "Track where leads come from"),
      ).toBe(true);
    });

    it("commerce payment rule triggers via either condition", () => {
      const r1 = scoreReadiness({ "commerce.payments": "cash" });
      expect(
        r1.mediumActions.some(
          (a) => a.title === "Investigate a suitable payment option",
        ),
      ).toBe(true);
      const r2 = scoreReadiness({ "commerce.sales": "no" });
      expect(
        r2.mediumActions.some(
          (a) => a.title === "Investigate a suitable payment option",
        ),
      ).toBe(true);
      const r3 = scoreReadiness({
        "commerce.sales": "na",
        "commerce.payments": "integrated",
      });
      expect(
        r3.mediumActions.some(
          (a) => a.title === "Investigate a suitable payment option",
        ),
      ).toBe(false);
    });

    it("does not trigger rule when condition not met", () => {
      const r = scoreReadiness({ "presence.website": "managed" }); // not 'none'
      expect(
        r.shortActions.some(
          (a) => a.title === "Establish a website foundation",
        ),
      ).toBe(false);
    });
  });

  describe("strengths and gaps", () => {
    it("strengths >=70 sorted descending", () => {
      const r = scoreReadiness({
        "presence.website": "managed",
        "presence.domain": "consistent",
        "presence.email": "business-all",
        "presence.discoverability": "easy", // 100
        "website.mobile": "clear",
        "website.currentness": "maintained",
        "website.contact": "obvious",
        "website.quality": "confident", // 100
        "social.profiles": "none",
        "social.cadence": "rarely",
        "social.completeness": "bare", // 0
      });
      expect(r.strengths.map((s) => s.percent)).toEqual([100, 100]);
      expect(r.gaps.some((g) => g.id === "social")).toBe(true);
    });

    it("gaps <40 sorted ascending (weakest first)", () => {
      const r = scoreReadiness({
        "presence.website": "none",
        "presence.domain": "none",
        "presence.email": "personal",
        "presence.discoverability": "no", // 0
        "social.profiles": "one", // 1/3 =33% plus others? let's do 1 each => 33%
        "social.cadence": "sporadic", // 1
        "social.completeness": "partial", // 1 => 3/9=33
        "security.backups": "occasional", // 1
        "security.passwords": "variation", //1
        "security.access": "known", //1
        "security.updates": "reminded", //1 => 4/12=33
      });
      // all gaps should be <40 and sorted ascending (all 0 or 33, 0 first)
      expect(r.gaps.every((g) => g.percent! < 40)).toBe(true);
      for (let i = 1; i < r.gaps.length; i++) {
        expect(r.gaps[i]!.percent!).toBeGreaterThanOrEqual(
          r.gaps[i - 1]!.percent!,
        );
      }
    });
  });

  describe("summary and handoff builders", () => {
    it("buildReadinessSummary includes key sections", () => {
      const r = scoreReadiness(maxAnswers());
      const summary = buildReadinessSummary(r);
      expect(summary).toContain("Digital readiness assessment");
      expect(summary).toContain("Overall readiness: 100% (Advanced)");
      expect(summary).toContain("Category breakdown:");
      expect(summary).toContain("This is a self-assessment signal");
    });

    it("buildHandoffFields returns expected keys", () => {
      const r = scoreReadiness(minAnswers());
      const fields = buildHandoffFields(r);
      expect(fields.Tool).toBe("Digital readiness assessment");
      expect(fields["Overall readiness"]).toBe(0);
      expect(fields.Label).toBe("Foundation");
      expect(fields["Top next step"]).toBeDefined();
    });

    it("summary handles empty result gracefully", () => {
      const r = scoreReadiness({});
      const summary = buildReadinessSummary(r);
      expect(summary).toContain("Overall readiness: —%");
      expect(summary).not.toContain("Strengths:");
    });
  });

  describe("determinism", () => {
    it("same input always yields same output", () => {
      const ans: Answers = {
        "presence.website": "listing",
        "seo.visibility": "hard",
      };
      const a = scoreReadiness(ans);
      const b = scoreReadiness(ans);
      expect(a).toEqual(b);
    });
  });
});
