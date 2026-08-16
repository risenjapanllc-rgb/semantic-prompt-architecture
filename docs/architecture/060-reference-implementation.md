# SPA Reference Implementation

## Purpose

This document defines a minimal reference implementation of Semantic Prompt Architecture.

The reference implementation demonstrates how semantic meaning can move through SPA without depending on a specific AI model.

The initial implementation covers:

Option Library
↓
Selection
↓
Selection Resolver
↓
Semantic State

Model-specific translation is intentionally kept outside this first implementation boundary.

---

## Design Goals

The reference implementation should be:

- deterministic
- model-independent
- domain-extensible
- testable
- explicit about Unknown
- resistant to silent semantic expansion

The implementation should preserve meaning before optimizing prompts.

---

## Core Types

~~~ts
export type SpaOption = {
  id: string;
  domain: string;
  category: string;
  label: string;
  semanticValue: string;
  description?: string;
  incompatibleWith?: string[];
  requires?: string[];
};

export type SpaSelection = {
  optionId: string;
  selected: boolean;
};

export type UnknownReason =
  | "unknown"
  | "not_remembered"
  | "not_observed"
  | "not_applicable"
  | "intentionally_unspecified";

export type SemanticUnknown = {
  field: string;
  reason: UnknownReason;
};

export type SemanticState = {
  domain: string;
  values: Record<string, string[]>;
  unknowns: SemanticUnknown[];
};
~~~

---

## Resolution Types

~~~ts
export type ResolutionIssueType =
  | "unknown_option"
  | "incompatible_selection"
  | "missing_requirement"
  | "unknown_conflict"
  | "ambiguous_selection";

export type ResolutionIssue = {
  type: ResolutionIssueType;
  optionIds: string[];
  category?: string;
  message: string;
};

export type SelectionResolutionResult = {
  validSelections: SpaSelection[];
  issues: ResolutionIssue[];
  requiresConfirmation: boolean;
};
~~~

---

## Option Lookup

The Resolver should first create a deterministic lookup table.

~~~ts
export function buildOptionMap(
  options: SpaOption[]
): Map<string, SpaOption> {
  return new Map(
    options.map(
      (option) => [
        option.id,
        option
      ]
    )
  );
}
~~~

Option IDs should be unique within the effective Option Library.

Duplicate IDs should be treated as a configuration error.

---

## Selected Options

Only explicitly selected values proceed into semantic resolution.

~~~ts
export function getSelectedOptions(
  selections: SpaSelection[],
  optionMap: Map<string, SpaOption>
): SpaOption[] {
  return selections
    .filter(
      (selection) =>
        selection.selected
    )
    .map(
      (selection) =>
        optionMap.get(
          selection.optionId
        )
    )
    .filter(
      (option): option is SpaOption =>
        option !== undefined
    );
}
~~~

An unknown Option ID must also produce a Resolution Issue.

It must not silently disappear in a production implementation.

---

## Incompatibility Detection

~~~ts
export function areIncompatible(
  left: SpaOption,
  right: SpaOption
): boolean {
  return (
    left.incompatibleWith?.includes(
      right.id
    ) === true ||
    right.incompatibleWith?.includes(
      left.id
    ) === true
  );
}
~~~

Incompatibility is explicit.

Semantic difference alone does not imply incompatibility.

---

## Selection Resolution

A minimal Resolver may follow this structure:

~~~ts
export function resolveSelections(
  options: SpaOption[],
  selections: SpaSelection[]
): SelectionResolutionResult {
  const optionMap =
    buildOptionMap(options);

  const issues: ResolutionIssue[] = [];

  const selected =
    selections.filter(
      (selection) =>
        selection.selected
    );

  for (const selection of selected) {
    if (
      !optionMap.has(
        selection.optionId
      )
    ) {
      issues.push({
        type: "unknown_option",
        optionIds: [
          selection.optionId
        ],
        message:
          "Selected option does not exist."
      });
    }
  }

  const selectedOptions =
    getSelectedOptions(
      selections,
      optionMap
    );

  for (
    let i = 0;
    i < selectedOptions.length;
    i += 1
  ) {
    for (
      let j = i + 1;
      j < selectedOptions.length;
      j += 1
    ) {
      const left =
        selectedOptions[i];

      const right =
        selectedOptions[j];

      if (
        areIncompatible(
          left,
          right
        )
      ) {
        issues.push({
          type:
            "incompatible_selection",

          optionIds: [
            left.id,
            right.id
          ],

          category:
            left.category ===
            right.category
              ? left.category
              : undefined,

          message:
            "Selected options are incompatible."
        });
      }
    }
  }

  return {
    validSelections:
      selected.filter(
        (selection) =>
          optionMap.has(
            selection.optionId
          )
      ),

    issues,

    requiresConfirmation:
      issues.length > 0
  };
}
~~~

This is intentionally minimal.

Domain-specific ambiguity and Unknown rules may extend the Resolver without changing the core architecture.

---

## Semantic State Construction

Validated selections can then be converted into Semantic State.

~~~ts
export function buildSemanticState(
  domain: string,
  options: SpaOption[],
  selections: SpaSelection[],
  unknowns: SemanticUnknown[] = []
): SemanticState {
  const optionMap =
    buildOptionMap(options);

  const values:
    Record<string, string[]> = {};

  for (
    const selection of selections
  ) {
    if (!selection.selected) {
      continue;
    }

    const option =
      optionMap.get(
        selection.optionId
      );

    if (!option) {
      continue;
    }

    if (!values[option.category]) {
      values[option.category] = [];
    }

    if (
      !values[
        option.category
      ].includes(
        option.semanticValue
      )
    ) {
      values[
        option.category
      ].push(
        option.semanticValue
      );
    }
  }

  return {
    domain,
    values,
    unknowns
  };
}
~~~

---

## Example

Option Library:

~~~ts
const options: SpaOption[] = [
  {
    id:
      "character-impression-refined",

    domain:
      "visual_character",

    category:
      "character_impression",

    label:
      "上品",

    semanticValue:
      "refined"
  },

  {
    id:
      "character-impression-friendly",

    domain:
      "visual_character",

    category:
      "character_impression",

    label:
      "親しみやすい",

    semanticValue:
      "friendly"
  }
];
~~~

Selections:

~~~ts
const selections: SpaSelection[] = [
  {
    optionId:
      "character-impression-refined",

    selected:
      true
  },

  {
    optionId:
      "character-impression-friendly",

    selected:
      true
  }
];
~~~

Semantic State:

~~~ts
{
  domain:
    "visual_character",

  values: {
    character_impression: [
      "refined",
      "friendly"
    ]
  },

  unknowns: []
}
~~~

No prompt text has been created yet.

The meaning remains independent from the target AI model.

---

## Implementation Boundary

The reference implementation should preserve this boundary:

~~~text
Human Input
↓
Option Library
↓
Selection
↓
Selection Resolver
↓
Semantic State
========================
MODEL-INDEPENDENT BOUNDARY
========================
Canonical State
↓
Translator
↓
Prompt Renderer
↓
AI Model
~~~

The upper portion should remain reusable across applications and AI providers.

---

## Testing Principle

Tests should verify semantic behavior rather than prompt wording.

Examples:

~~~text
Selecting 上品
→ Semantic State contains refined

Selecting 上品 + 親しみやすい
→ both semantic values are preserved

Selecting incompatible Options
→ Resolution Issue is produced

Selecting an unknown Option ID
→ unknown_option is produced

Changing target AI model
→ Semantic State remains unchanged
~~~

Prompt snapshots may be tested separately at the Translator or Renderer layer.

---

## Core Principle

The reference implementation is not designed to generate clever prompts.

It is designed to preserve reliable meaning.

Reliable meaning becomes the input to prompt generation.

Meaning first.

Translation second.

Generation third.
