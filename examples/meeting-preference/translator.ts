import type {
  PromptIR,
  SpaTranslator,
} from "../../src/index.js";

const wording:
  Record<string, Record<string, string>> = {
    meeting_style: {
      structured:
        "Use a structured meeting flow.",
      open:
        "Allow an open meeting flow.",
    },

    response_preference: {
      concise:
        "Keep responses concise.",
      detailed:
        "Provide detailed responses.",
    },
  };

export const meetingPreferenceTranslator:
  SpaTranslator = {
    id: "meeting-preference-translator",
    version: "1.0.0",

    translate(state): PromptIR {
      const instructions =
        Object.entries(state.values)
          .flatMap(
            ([field, values]) =>
              values.map((value) => ({
                field,
                value:
                  wording[field]?.[value]
                  ?? value,
              }))
          );

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
