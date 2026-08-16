import type {
  SemanticSchema,
  SemanticUnknown,
  SpaOption,
  SpaSelection,
  SelectionResolutionResult,
} from "./types.js";

import {
  getSemanticFieldByCategory,
  validateOptionAgainstSchema,
} from "./semantic-schema.js";

export function buildOptionMap(
  options: SpaOption[]
): Map<string, SpaOption> {
  return new Map(
    options.map((option) => [
      option.id,
      option,
    ])
  );
}

export function areIncompatible(
  left: SpaOption,
  right: SpaOption
): boolean {
  return (
    left.incompatibleWith?.includes(right.id) === true ||
    right.incompatibleWith?.includes(left.id) === true
  );
}

export function resolveSelections(
  options: SpaOption[],
  selections: SpaSelection[],
  schema?: SemanticSchema,
  unknowns: SemanticUnknown[] = []
): SelectionResolutionResult {
  const optionMap = buildOptionMap(options);
  const issues: SelectionResolutionResult["issues"] = [];

  const selected =
    selections.filter(
      (selection) => selection.selected
    );

  for (const selection of selected) {
    if (!optionMap.has(selection.optionId)) {
      issues.push({
        type: "unknown_option",
        optionIds: [selection.optionId],
        message: "Selected option does not exist.",
      });
    }
  }

  const selectedOptions =
    selected
      .map((selection) =>
        optionMap.get(selection.optionId)
      )
      .filter(
        (option): option is SpaOption =>
          option !== undefined
      );

  if (schema) {
    for (const option of selectedOptions) {
      if (
        !validateOptionAgainstSchema(
          schema,
          option
        )
      ) {
        issues.push({
          type: "invalid_schema_option",
          optionIds: [option.id],
          category: option.category,
          message:
            "Selected option does not belong to the active Semantic Schema.",
        });
      }
    }

    const optionsByCategory =
      new Map<string, SpaOption[]>();

    for (const option of selectedOptions) {
      if (
        !validateOptionAgainstSchema(
          schema,
          option
        )
      ) {
        continue;
      }

      const current =
        optionsByCategory.get(
          option.category
        ) ?? [];

      current.push(option);

      optionsByCategory.set(
        option.category,
        current
      );
    }

    for (
      const [
        category,
        categoryOptions,
      ] of optionsByCategory
    ) {
      const field =
        getSemanticFieldByCategory(
          schema,
          category
        );

      if (!field) {
        continue;
      }

      if (
        field.cardinality === "single"
      ) {
        const semanticValues =
          new Set(
            categoryOptions.map(
              (option) =>
                option.semanticValue
            )
          );

        if (semanticValues.size > 1) {
          issues.push({
            type: "cardinality_conflict",
            optionIds:
              categoryOptions.map(
                (option) =>
                  option.id
              ),
            category,
            message:
              "Multiple semantic values were selected for a single-value field.",
          });
        }
      }
    }
  }

  for (let i = 0; i < selectedOptions.length; i += 1) {
    for (let j = i + 1; j < selectedOptions.length; j += 1) {
      const left = selectedOptions[i];
      const right = selectedOptions[j];

      if (areIncompatible(left, right)) {
        issues.push({
          type: "incompatible_selection",
          optionIds: [left.id, right.id],
          category:
            left.category === right.category
              ? left.category
              : undefined,
          message: "Selected options are incompatible.",
        });
      }
    }
  }

  if (schema) {
    const fieldsById =
      new Map(
        schema.fields.map(
          (field) => [
            field.id,
            field,
          ]
        )
      );

    for (const unknown of unknowns) {
      const field =
        fieldsById.get(
          unknown.field
        );

      if (!field) {
        issues.push({
          type: "unknown_field",
          optionIds: [],
          category: unknown.field,
          message:
            "Unknown state references a field that does not exist in the active Semantic Schema.",
        });

        continue;
      }

      if (!field.unknownAllowed) {
        issues.push({
          type: "unknown_not_allowed",
          optionIds: [],
          category: field.category,
          message:
            "Unknown is not allowed for this semantic field.",
        });
      }

      const conflictingOptions =
        selectedOptions.filter(
          (option) =>
            validateOptionAgainstSchema(
              schema,
              option
            ) &&
            option.category ===
              field.category
        );

      if (conflictingOptions.length > 0) {
        issues.push({
          type: "unknown_conflict",
          optionIds:
            conflictingOptions.map(
              (option) =>
                option.id
            ),
          category: field.category,
          message:
            "A semantic field cannot contain both a confirmed value and an Unknown state.",
        });
      }
    }
  }

  const selectedOptionIds =
    new Set(
      selectedOptions.map(
        (option) => option.id
      )
    );

  for (const option of selectedOptions) {
    for (const requiredId of option.requires ?? []) {
      if (!selectedOptionIds.has(requiredId)) {
        issues.push({
          type: "missing_requirement",
          optionIds: [
            option.id,
            requiredId,
          ],
          category: option.category,
          message:
            "Selected option is missing a required semantic option.",
        });
      }
    }
  }

  return {
    validSelections:
      selected.filter((selection) =>
        optionMap.has(selection.optionId)
      ),
    issues,
    requiresConfirmation: issues.length > 0,
  };
}
