import type {
  CanonicalSemanticState,
  SemanticState,
  SemanticUnknown,
} from "./types.js";

function uniqueSorted(
  values: string[]
): string[] {
  return [
    ...new Set(values),
  ].sort((left, right) =>
    left.localeCompare(right)
  );
}

function canonicalizeUnknowns(
  unknowns: SemanticUnknown[]
): SemanticUnknown[] {
  const map =
    new Map<string, SemanticUnknown>();

  for (const unknown of unknowns) {
    const key =
      `${unknown.field}\u0000${unknown.reason}`;

    if (!map.has(key)) {
      map.set(
        key,
        {
          field: unknown.field,
          reason: unknown.reason,
        }
      );
    }
  }

  return [
    ...map.values(),
  ].sort((left, right) => {
    const fieldComparison =
      left.field.localeCompare(
        right.field
      );

    if (fieldComparison !== 0) {
      return fieldComparison;
    }

    return left.reason.localeCompare(
      right.reason
    );
  });
}

export function canonicalizeSemanticState(
  state: SemanticState
): CanonicalSemanticState {
  const values:
    Record<string, string[]> = {};

  const categories =
    Object.keys(
      state.values
    ).sort((left, right) =>
      left.localeCompare(right)
    );

  for (const category of categories) {
    values[category] =
      uniqueSorted(
        state.values[category] ?? []
      );
  }

  return {
    domain: state.domain,
    values,
    unknowns:
      canonicalizeUnknowns(
        state.unknowns
      ),
  };
}

export function serializeCanonicalState(
  state: SemanticState
): string {
  return JSON.stringify(
    canonicalizeSemanticState(
      state
    )
  );
}
