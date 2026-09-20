import {
  parseStudioPersonalization,
  type StudioPersonalization,
  type StudioPersonalizationInput,
} from "./schema";

export interface StudioPersonalizationProvider {
  personalize(input: StudioPersonalizationInput): Promise<unknown>;
}

export async function personalizeStudioConcept(
  provider: StudioPersonalizationProvider,
  input: StudioPersonalizationInput,
): Promise<StudioPersonalization> {
  const untrustedResult = await provider.personalize(input);
  return parseStudioPersonalization(input.category, untrustedResult);
}
