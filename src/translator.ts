import type {
  CanonicalSemanticState,
  PromptConstraint,
  PromptIR,
  PromptInstruction,
  SpaTranslator,
} from "./types.js";

export function translateCanonicalState(
  state: CanonicalSemanticState
): PromptIR {
  const instructions:
    PromptInstruction[] = [];

  const constraints:
    PromptConstraint[] = [];

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
        value,
      });
    }
  }

  for (const unknown of state.unknowns) {
    constraints.push({
      field: unknown.field,
      kind: "preserve_unknown",
      reason: unknown.reason,
    });
  }

  return {
    domain: state.domain,
    instructions,
    constraints,
  };
}

export function createDefaultTranslator():
  SpaTranslator {
  return {
    id: "spa-default-translator",
    version: "1.0.0",

    translate(
      state: CanonicalSemanticState
    ): PromptIR {
      return translateCanonicalState(
        state
      );
    },
  };
}
