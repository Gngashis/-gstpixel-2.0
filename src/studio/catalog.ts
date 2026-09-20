import {
  BriefcaseBusiness,
  Dumbbell,
  Hotel,
  MapPinned,
  ShoppingBag,
  UtensilsCrossed,
} from "lucide-react";
import type {
  StudioBusiness,
  StudioBusinessId,
  StudioDirection,
  StudioDirectionId,
  StudioExperienceModule,
  StudioVisualProfile,
} from "./types";

export const studioBusinesses: readonly StudioBusiness[] = [
  {
    id: "hotel",
    name: "Hotel / Resort",
    shortName: "Hotel",
    prompt: "Turn a stay into a feeling before guests arrive.",
    outcome: "Build desire, answer questions, and make enquiry effortless.",
    sampleName: "NORTHSTAR RETREAT",
    sampleEyebrow: "A quieter side of the mountains",
    sampleHeadline: "Stay where the horizon slows down.",
    sampleCopy:
      "A warm, visual path from first impression to rooms, experiences, location, and direct enquiry.",
    primaryAction: "Explore the stay",
    secondaryAction: "View rooms",
    accent: "oklch(0.79 0.142 197)",
    accentSoft: "oklch(0.73 0.08 210 / 0.2)",
    icon: Hotel,
  },
  {
    id: "tours",
    name: "Tours & Travel",
    shortName: "Tours",
    prompt: "Make the next journey feel possible now.",
    outcome: "Reveal destinations, packages, and the shape of each journey.",
    sampleName: "FARTHER NORTH",
    sampleEyebrow: "Curated journeys from the eastern gateway",
    sampleHeadline: "Follow the road into something unforgettable.",
    sampleCopy:
      "A clear route through destinations, handpicked packages, itinerary highlights, and direct enquiry.",
    primaryAction: "Find a journey",
    secondaryAction: "See destinations",
    accent: "oklch(0.75 0.13 155)",
    accentSoft: "oklch(0.7 0.1 155 / 0.2)",
    icon: MapPinned,
  },
  {
    id: "restaurant",
    name: "Restaurant / Café",
    shortName: "Restaurant",
    prompt: "Let people taste the atmosphere before they visit.",
    outcome: "Show the menu, story, setting, and simplest next action.",
    sampleName: "EMBER & GRAIN",
    sampleEyebrow: "Seasonal plates · Slow evenings",
    sampleHeadline: "A table worth making time for.",
    sampleCopy:
      "A sensory introduction to the menu, the people behind it, the room, and how to reserve or order.",
    primaryAction: "See the menu",
    secondaryAction: "Reserve a table",
    accent: "oklch(0.72 0.14 55)",
    accentSoft: "oklch(0.68 0.12 55 / 0.22)",
    icon: UtensilsCrossed,
  },
  {
    id: "retail",
    name: "Retail / Commerce",
    shortName: "Retail",
    prompt: "Make every collection easy to discover and want.",
    outcome: "Lead shoppers from a strong point of view to useful products.",
    sampleName: "FIELD OBJECTS",
    sampleEyebrow: "Useful things, considered well",
    sampleHeadline: "Objects with a reason to stay.",
    sampleCopy:
      "A merchandise-led experience for collections, products, offers, trust, and easy contact.",
    primaryAction: "Shop the collection",
    secondaryAction: "Discover the story",
    accent: "oklch(0.78 0.11 95)",
    accentSoft: "oklch(0.72 0.1 95 / 0.2)",
    icon: ShoppingBag,
  },
  {
    id: "professional",
    name: "Professional / Corporate",
    shortName: "Professional",
    prompt: "Turn expertise into immediate confidence.",
    outcome: "Clarify services, demonstrate capability, and invite contact.",
    sampleName: "MERIDIAN ADVISORY",
    sampleEyebrow: "Clarity for consequential decisions",
    sampleHeadline: "Expertise people can understand and trust.",
    sampleCopy:
      "A precise path through services, specialist knowledge, proof, people, and the next conversation.",
    primaryAction: "View expertise",
    secondaryAction: "Meet the team",
    accent: "oklch(0.7 0.1 245)",
    accentSoft: "oklch(0.65 0.08 245 / 0.2)",
    icon: BriefcaseBusiness,
  },
  {
    id: "gym",
    name: "Gym / Fitness",
    shortName: "Fitness",
    prompt: "Make progress feel real before the first session.",
    outcome: "Show programs, coaches, results, and a clear way to join.",
    sampleName: "FORGE METHOD",
    sampleEyebrow: "Train with intent",
    sampleHeadline: "Stronger starts with showing up.",
    sampleCopy:
      "An energetic path through programs, trainers, transformations, memberships, and direct contact.",
    primaryAction: "Find a program",
    secondaryAction: "Meet the trainers",
    accent: "oklch(0.74 0.17 30)",
    accentSoft: "oklch(0.68 0.14 30 / 0.22)",
    icon: Dumbbell,
  },
] as const;

export const studioDirections: readonly StudioDirection[] = [
  {
    id: "cinematic",
    name: "Cinematic",
    character: "Immersive · Atmospheric · Spacious",
    cue: "Feel it first",
    description:
      "A dramatic first impression with layered depth, expansive imagery, and deliberate movement.",
  },
  {
    id: "refined",
    name: "Refined",
    character: "Editorial · Calm · Assured",
    cue: "Clarity with presence",
    description:
      "A composed story with elegant rhythm, framed details, and confident restraint.",
  },
  {
    id: "bold",
    name: "Bold",
    character: "Graphic · Direct · Energetic",
    cue: "Make the message move",
    description:
      "A high-impact system with assertive type, modular composition, and decisive actions.",
  },
] as const;

export const studioVisualProfiles: Record<
  StudioDirectionId,
  StudioVisualProfile
> = {
  cinematic: {
    directionId: "cinematic",
    composition: "immersive",
    surface: "atmospheric",
    typeScale: "cinematic",
    imageTreatment: "panoramic",
    motion: "drift",
  },
  refined: {
    directionId: "refined",
    composition: "editorial",
    surface: "quiet",
    typeScale: "measured",
    imageTreatment: "framed",
    motion: "reveal",
  },
  bold: {
    directionId: "bold",
    composition: "graphic",
    surface: "solid",
    typeScale: "impact",
    imageTreatment: "collage",
    motion: "snap",
  },
};

export const studioExperienceModules: Record<
  StudioBusinessId,
  StudioExperienceModule
> = {
  hotel: {
    businessId: "hotel",
    sectionLabel: "A guest journey that leads somewhere",
    sections: [
      { id: "home", label: "Home" },
      { id: "rooms", label: "Rooms" },
      { id: "experiences", label: "Experiences" },
      { id: "gallery", label: "Gallery" },
      { id: "location", label: "Location" },
      { id: "enquiry", label: "Book / Enquire" },
    ],
    proofPoints: ["Set the mood", "Show the stay", "Make enquiry simple"],
  },
  tours: {
    businessId: "tours",
    sectionLabel: "A journey people can understand at a glance",
    sections: [
      { id: "home", label: "Home" },
      { id: "destinations", label: "Destinations" },
      { id: "packages", label: "Packages" },
      { id: "itinerary", label: "Itinerary" },
      { id: "gallery", label: "Gallery" },
      { id: "enquiry", label: "Enquire" },
    ],
    proofPoints: ["Create excitement", "Explain the journey", "Invite enquiry"],
  },
  restaurant: {
    businessId: "restaurant",
    sectionLabel: "From first appetite to the next visit",
    sections: [
      { id: "home", label: "Home" },
      { id: "menu", label: "Menu" },
      { id: "story", label: "Story" },
      { id: "gallery", label: "Gallery" },
      { id: "reservation", label: "Reservation / Order" },
      { id: "location", label: "Location" },
    ],
    proofPoints: [
      "Show the atmosphere",
      "Make the menu clear",
      "Enable action",
    ],
  },
  retail: {
    businessId: "retail",
    sectionLabel: "A storefront with a clear point of view",
    sections: [
      { id: "home", label: "Home" },
      { id: "collections", label: "Collections" },
      { id: "products", label: "Products" },
      { id: "offers", label: "Offers" },
      { id: "contact", label: "Contact" },
    ],
    proofPoints: [
      "Lead with products",
      "Build confidence",
      "Make discovery easy",
    ],
  },
  professional: {
    businessId: "professional",
    sectionLabel: "A clear path from expertise to confidence",
    sections: [
      { id: "home", label: "Home" },
      { id: "services", label: "Services" },
      { id: "expertise", label: "Expertise" },
      { id: "proof", label: "Proof" },
      { id: "about", label: "About" },
      { id: "contact", label: "Contact" },
    ],
    proofPoints: [
      "Clarify the offer",
      "Demonstrate expertise",
      "Start a conversation",
    ],
  },
  gym: {
    businessId: "gym",
    sectionLabel: "A motivating path from interest to membership",
    sections: [
      { id: "home", label: "Home" },
      { id: "programs", label: "Programs" },
      { id: "trainers", label: "Trainers" },
      { id: "transformations", label: "Transformations" },
      { id: "memberships", label: "Memberships" },
      { id: "contact", label: "Contact" },
    ],
    proofPoints: [
      "Show the method",
      "Make progress visible",
      "Make joining easy",
    ],
  },
};

export const featuredStudioBusinessIds: readonly StudioBusinessId[] = [
  "hotel",
  "tours",
  "restaurant",
];

export function getStudioBusiness(id: StudioBusinessId): StudioBusiness {
  return studioBusinesses.find((business) => business.id === id)!;
}

export function getStudioDirection(id: StudioDirectionId): StudioDirection {
  return studioDirections.find((direction) => direction.id === id)!;
}
