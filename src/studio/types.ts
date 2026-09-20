import type { LucideIcon } from "lucide-react";

export type StudioBusinessId =
  "hotel" | "tours" | "restaurant" | "retail" | "professional" | "gym";

export type StudioDirectionId = "cinematic" | "refined" | "bold";

export type StudioStep = "business" | "direction" | "preview";

export type StudioBusiness = {
  id: StudioBusinessId;
  name: string;
  shortName: string;
  prompt: string;
  outcome: string;
  sampleName: string;
  sampleEyebrow: string;
  sampleHeadline: string;
  sampleCopy: string;
  primaryAction: string;
  secondaryAction: string;
  accent: string;
  accentSoft: string;
  icon: LucideIcon;
};

export type StudioDirection = {
  id: StudioDirectionId;
  name: string;
  character: string;
  cue: string;
  description: string;
};

export type StudioVisualProfile = {
  directionId: StudioDirectionId;
  composition: "immersive" | "editorial" | "graphic";
  surface: "atmospheric" | "quiet" | "solid";
  typeScale: "cinematic" | "measured" | "impact";
  imageTreatment: "panoramic" | "framed" | "collage";
  motion: "drift" | "reveal" | "snap";
};

export type StudioExperienceModule = {
  businessId: StudioBusinessId;
  sectionLabel: string;
  sections: readonly {
    id: string;
    label: string;
  }[];
  proofPoints: readonly string[];
};

export type StudioState = {
  step: StudioStep;
  businessId: StudioBusinessId | null;
  directionId: StudioDirectionId | null;
  expandedBusinesses: boolean;
};

export type StudioAction =
  | { type: "selectBusiness"; businessId: StudioBusinessId }
  | { type: "selectDirection"; directionId: StudioDirectionId }
  | { type: "showMoreBusinesses" }
  | { type: "backToBusiness" }
  | { type: "backToDirection" }
  | { type: "restart" };
