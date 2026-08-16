import type {
  SemanticSchema,
} from "../../types.js";

export const visualTestimonySchema:
  SemanticSchema = {
  id: "visual-testimony",
  version: "0.1.0",
  domain: "visual_testimony",

  fields: [
    {
      id: "character_impression",
      category: "character_impression",
      cardinality: "multiple",
      unknownAllowed: true,
    },
    {
      id: "facial_impression",
      category: "facial_impression",
      cardinality: "multiple",
      unknownAllowed: true,
    },
    {
      id: "age_appearance",
      category: "age_appearance",
      cardinality: "single",
      unknownAllowed: true,
    },
    {
      id: "expression",
      category: "expression",
      cardinality: "single",
      unknownAllowed: true,
    },
    {
      id: "clothing",
      category: "clothing",
      cardinality: "multiple",
      unknownAllowed: true,
    },
    {
      id: "hair",
      category: "hair",
      cardinality: "multiple",
      unknownAllowed: true,
    },
    {
      id: "environment",
      category: "environment",
      cardinality: "multiple",
      unknownAllowed: true,
    },
    {
      id: "spatial_relationship",
      category: "spatial_relationship",
      cardinality: "multiple",
      unknownAllowed: true,
    },
    {
      id: "weather",
      category: "weather",
      cardinality: "single",
      unknownAllowed: true,
    },
  ],
};
