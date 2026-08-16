import type {
  SemanticSchema,
} from "../../src/index.js";

export const meetingPreferenceSchema:
  SemanticSchema = {
    id: "meeting-preference-schema",
    version: "1.0.0",
    domain: "meeting_preference",

    fields: [
      {
        id: "meeting_style",
        category: "meeting_style",
        cardinality: "single",
        unknownAllowed: true,
      },
      {
        id: "response_preference",
        category: "response_preference",
        cardinality: "single",
        unknownAllowed: true,
      },
    ],
  };
