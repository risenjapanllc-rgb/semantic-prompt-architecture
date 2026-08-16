import type {
  CanonicalSemanticState,
  PromptIR,
  PromptInstruction,
  SpaTranslator,
} from "../../types.js";

const careValueMap:
  Record<string, Record<string, string>> = {
  emotional_state: {
    calm: "the person describes feeling calm",
    anxious: "the person describes feeling anxious",
    sad: "the person describes feeling sad",
    confused: "the person describes feeling confused",
  },

  support_preference: {
    listening:
      "prioritize listening before offering solutions",
    practical_support:
      "help explore practical next steps together",
    reflection:
      "help the person reflect on and organize their feelings",
  },

  communication_style: {
    gentle:
      "use a gentle communication style",
    direct:
      "use a direct communication style",
    concise:
      "keep the response concise",
  },

  conversation_intention: {
    express_feelings:
      "support the person in putting current feelings into words",
    understand_situation:
      "help the person understand the situation more clearly",
    consider_next_step:
      "help the person consider possible next steps",
  },
};

export function translateCareValue(
  field: string,
  semanticValue: string
): string {
  return (
    careValueMap[field]?.[
      semanticValue
    ] ??
    semanticValue
  );
}

export function createCareConversationTranslator():
  SpaTranslator {
  return {
    id: "care-conversation-translator",
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
              translateCareValue(
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
