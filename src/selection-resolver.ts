import type {
  SpaOption,
  SpaSelection,
  SelectionResolutionResult,
} from "./types.js";

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
  selections: SpaSelection[]
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

  return {
    validSelections:
      selected.filter((selection) =>
        optionMap.has(selection.optionId)
      ),
    issues,
    requiresConfirmation: issues.length > 0,
  };
}
