import type {
  PromptConstraint,
  PromptIR,
  PromptInstruction,
  RenderedPrompt,
  SpaPromptRenderer,
} from "./types.js";

function sortInstructions(
  instructions: PromptInstruction[]
): PromptInstruction[] {
  return [
    ...instructions,
  ].sort((left, right) => {
    const fieldComparison =
      left.field.localeCompare(
        right.field
      );

    if (fieldComparison !== 0) {
      return fieldComparison;
    }

    return left.value.localeCompare(
      right.value
    );
  });
}

function sortConstraints(
  constraints: PromptConstraint[]
): PromptConstraint[] {
  return [
    ...constraints,
  ].sort((left, right) => {
    const fieldComparison =
      left.field.localeCompare(
        right.field
      );

    if (fieldComparison !== 0) {
      return fieldComparison;
    }

    const kindComparison =
      left.kind.localeCompare(
        right.kind
      );

    if (kindComparison !== 0) {
      return kindComparison;
    }

    return left.reason.localeCompare(
      right.reason
    );
  });
}

export function renderPromptIR(
  ir: PromptIR
): string {
  const instructions =
    sortInstructions(
      ir.instructions
    );

  const constraints =
    sortConstraints(
      ir.constraints
    );

  const lines: string[] = [
    `Domain: ${ir.domain}`,
  ];

  if (instructions.length > 0) {
    lines.push(
      "",
      "Instructions:"
    );

    for (
      const instruction
      of instructions
    ) {
      lines.push(
        `- ${instruction.field}: ${instruction.value}`
      );
    }
  }

  if (constraints.length > 0) {
    lines.push(
      "",
      "Constraints:"
    );

    for (
      const constraint
      of constraints
    ) {
      lines.push(
        `- ${constraint.field}: ${constraint.kind} (${constraint.reason})`
      );
    }
  }

  return lines.join("\n");
}

export function createGenericPromptRenderer():
  SpaPromptRenderer {
  return {
    id: "spa-generic-renderer",
    version: "1.0.0",

    render(
      ir: PromptIR
    ): RenderedPrompt {
      return {
        rendererId:
          "spa-generic-renderer",

        rendererVersion:
          "1.0.0",

        text:
          renderPromptIR(ir),
      };
    },
  };
}
