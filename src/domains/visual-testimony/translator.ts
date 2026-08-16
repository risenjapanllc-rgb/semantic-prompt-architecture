import type {
  CanonicalSemanticState,
  PromptIR,
  PromptInstruction,
  SpaTranslator,
} from "../../types.js";

const visualValueMap:
  Record<string, Record<string, string>> = {
  character_impression: {
    refined: "refined appearance",
    friendly: "friendly impression",
    calm: "calm impression",
    simple: "simple and unpretentious impression",
  },

  facial_impression: {
    soft: "soft facial impression",
    dignified: "dignified facial impression",
    gentle: "gentle facial impression",
  },

  age_appearance: {
    young_adult: "appears to be a young adult",
    middle_aged: "appears to be middle-aged",
    older_adult: "appears to be an older adult",
  },

  expression: {
    calm: "calm expression",
    smiling: "smiling expression",
    expressionless: "neutral expression",
    sad: "sad expression",
  },

  clothing: {
    casual: "casual clothing",
    formal: "formal clothing",
    simple: "simple clothing",
  },

  hair: {
    short: "short hair",
    medium: "medium-length hair",
    long: "long hair",
  },

  environment: {
    indoor: "indoor environment",
    outdoor: "outdoor environment",
  },

  spatial_relationship: {
    near: "positioned nearby",
    far: "positioned farther away",
  },

  weather: {
    sunny: "sunny weather",
    cloudy: "cloudy weather",
    rainy: "rainy weather",
  },
};

export function translateVisualValue(
  field: string,
  semanticValue: string
): string {
  return (
    visualValueMap[field]?.[
      semanticValue
    ] ??
    semanticValue
  );
}

export function createVisualTestimonyTranslator():
  SpaTranslator {
  return {
    id: "visual-testimony-translator",
    version: "0.1.0",

    translate(
      state: CanonicalSemanticState
    ): PromptIR {
      const instructions:
        PromptInstruction[] = [];

      for (
        const [
          field,
          values,
        ] of Object.entries(
          state.values
        )
      ) {
        for (const value of values) {
          instructions.push({
            field,
            value:
              translateVisualValue(
                field,
                value
              ),
          });
        }
      }

      const constraints =
        state.unknowns.map(
          (unknown) => ({
            field: unknown.field,
            kind: "preserve_unknown" as const,
            reason: unknown.reason,
          })
        );

      return {
        domain: state.domain,
        instructions,
        constraints,
      };
    },
  };
}
