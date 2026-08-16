import type {
  SemanticSchema,
} from "../../types.js";

export const researchEvidenceSchema:
  SemanticSchema = {
  id: "research-evidence-schema",
  version: "0.1.0",
  domain: "research_evidence",

  fields: [
    {
      id: "evidence_strength",
      category: "evidence_strength",
      cardinality: "single",
      unknownAllowed: true,
    },
    {
      id: "source_type",
      category: "source_type",
      cardinality: "multiple",
      unknownAllowed: true,
    },
    {
      id: "claim_status",
      category: "claim_status",
      cardinality: "single",
      unknownAllowed: true,
    },
    {
      id: "uncertainty",
      category: "uncertainty",
      cardinality: "single",
      unknownAllowed: true,
    },
    {
      id: "citation_preference",
      category: "citation_preference",
      cardinality: "multiple",
      unknownAllowed: true,
    },
  ],
};
