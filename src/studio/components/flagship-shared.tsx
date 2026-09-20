import { ArrowUpRight } from "lucide-react";
import type { StudioBusiness, StudioDirection } from "../types";

export type FlagshipPreviewProps = {
  business: StudioBusiness;
  direction: StudioDirection;
};

export function FlagshipAction({ children }: { children: React.ReactNode }) {
  return (
    <span className="studio-flagship-action">
      {children}
      <ArrowUpRight size={13} aria-hidden="true" />
    </span>
  );
}
