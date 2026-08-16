import type {
  CanonicalSemanticState,
  PromptIR,
  SpaTranslator,
} from "../../types.js";

const translations:
  Record<string, Record<string, string>> = {
  evidence_strength: {
    strong:
      "treat the available evidence as strong",
    moderate:
      "treat the available evidence as moderate",
    limited:
      "treat the available evidence as limited",
  },

  source_type: {
    peer_reviewed:
      "use peer-reviewed research as a source type",
    primary_source:
      "use primary sources as a source type",
    systematic_review:
      "use systematic reviews as a source type",
  },

  claim_status: {
    supported:
      "treat the claim as supported by the represented evidence",
    contested:
      "treat the claim as contested",
    unresolved:
      "treat the claim as unresolved",
  },

  uncertainty: {
    low:
      "represent the uncertainty as low",
    moderate:
      "represent the uncertainty as moderate",
    high:
      "represent the uncertainty as high",
  },

  citation_preference: {
    prefer_primary_sources:
      "prefer primary sources when citing evidence",
    prefer_peer_reviewed:
      "prefer peer-reviewed sources when citing evidence",
  },
};

export function createResearchEvidenceTranslator():
  SpaTranslator {
  return {
    id: "research-evidence-translator",
    version: "0.1.0",

    translate(
      state: CanonicalSemanticState
    ): PromptIR {
      const instructions =
        Object.entries(state.values)
          .flatMap(
            ([field, values]) =>
              values.map(
                (value) => ({
                  field,
                  value:
                    translations[field]?.[value]
                    ?? value,
                })
              )
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
}
