import type { StudioAction, StudioState } from "./types";

export const initialStudioState: StudioState = {
  step: "business",
  businessId: null,
  directionId: null,
  expandedBusinesses: false,
};

export function studioReducer(
  state: StudioState,
  action: StudioAction,
): StudioState {
  switch (action.type) {
    case "selectBusiness":
      return {
        ...state,
        step: "direction",
        businessId: action.businessId,
        directionId: null,
      };
    case "selectDirection":
      return {
        ...state,
        step: "preview",
        directionId: action.directionId,
      };
    case "showMoreBusinesses":
      return { ...state, expandedBusinesses: true };
    case "backToBusiness":
      return { ...state, step: "business", directionId: null };
    case "backToDirection":
      return { ...state, step: "direction", directionId: null };
    case "restart":
      return initialStudioState;
    default:
      return state;
  }
}
