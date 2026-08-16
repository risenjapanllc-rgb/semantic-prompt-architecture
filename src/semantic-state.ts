import type {
  SemanticState,
  SemanticUnknown,
  SpaOption,
  SpaSelection,
} from "./types.js";

import {
  buildOptionMap,
} from "./selection-resolver.js";

export function buildSemanticState(
  domain: string,
  options: SpaOption[],
  selections: SpaSelection[],
  unknowns: SemanticUnknown[] = []
): SemanticState {
  const optionMap = buildOptionMap(options);

  const values: Record<string, string[]> = {};

  for (const selection of selections) {
    if (!selection.selected) {
      continue;
    }

    const option =
      optionMap.get(selection.optionId);

    if (!option) {
      continue;
    }

    values[option.category] ??= [];

    if (
      !values[option.category].includes(
        option.semanticValue
      )
    ) {
      values[option.category].push(
        option.semanticValue
      );
    }
  }

  return {
    domain,
    values,
    unknowns,
  };
}
