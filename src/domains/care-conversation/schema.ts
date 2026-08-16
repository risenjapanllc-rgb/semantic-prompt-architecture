import type {
  SemanticSchema,
} from "../../types.js";

export const careConversationSchema:
  SemanticSchema = {
  id: "care-conversation-schema",
  version: "0.1.0",
  domain: "care_conversation",

  fields: [
    {
      id: "emotional_state",
      category: "emotional_state",
      cardinality: "multiple",
      unknownAllowed: true,
    },
    {
      id: "support_preference",
      category: "support_preference",
      cardinality: "multiple",
      unknownAllowed: true,
    },
    {
      id: "communication_style",
      category: "communication_style",
      cardinality: "multiple",
      unknownAllowed: true,
    },
    {
      id: "conversation_intention",
      category: "conversation_intention",
      cardinality: "multiple",
      unknownAllowed: true,
    },
  ],
};
