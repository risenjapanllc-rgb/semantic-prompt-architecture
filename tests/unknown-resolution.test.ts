import test from "node:test";
import assert from "node:assert/strict";

import {
  resolveSelections,
  type SemanticSchema,
  type SemanticUnknown,
  type SpaOption,
  type SpaSelection,
} from "../src/index.js";

const schema: SemanticSchema = {
  id: "unknown-resolution-schema",
  version: "1.0.0",
  domain: "visual_character",

  fields: [
    {
      id: "weather",
      category: "weather",
      cardinality: "single",
      unknownAllowed: true,
    },
    {
      id: "character_impression",
      category: "character_impression",
      cardinality: "multiple",
      unknownAllowed: true,
    },
    {
      id: "record_id",
      category: "record_id",
      cardinality: "single",
      unknownAllowed: false,
    },
  ],
};

const options: SpaOption[] = [
  {
    id: "weather-sunny",
    domain: "visual_character",
    category: "weather",
    label: "晴れ",
    semanticValue: "sunny",
  },
  {
    id: "impression-refined",
    domain: "visual_character",
    category: "character_impression",
    label: "上品",
    semanticValue: "refined",
  },
];

test("confirmed value and Unknown on same field create conflict", () => {
  const selections: SpaSelection[] = [
    {
      optionId: "weather-sunny",
      selected: true,
    },
  ];

  const unknowns: SemanticUnknown[] = [
    {
      field: "weather",
      reason: "not_remembered",
    },
  ];

  const result =
    resolveSelections(
      options,
      selections,
      schema,
      unknowns
    );

  assert.equal(
    result.requiresConfirmation,
    true
  );

  assert.equal(
    result.issues.some(
      (issue) =>
        issue.type ===
        "unknown_conflict"
    ),
    true
  );
});

test("Unknown on different field does not conflict with confirmed value", () => {
  const selections: SpaSelection[] = [
    {
      optionId: "impression-refined",
      selected: true,
    },
  ];

  const unknowns: SemanticUnknown[] = [
    {
      field: "weather",
      reason: "not_observed",
    },
  ];

  const result =
    resolveSelections(
      options,
      selections,
      schema,
      unknowns
    );

  assert.equal(
    result.requiresConfirmation,
    false
  );

  assert.equal(
    result.issues.length,
    0
  );
});

test("Unknown is rejected when field does not allow Unknown", () => {
  const unknowns: SemanticUnknown[] = [
    {
      field: "record_id",
      reason: "unknown",
    },
  ];

  const result =
    resolveSelections(
      options,
      [],
      schema,
      unknowns
    );

  assert.equal(
    result.requiresConfirmation,
    true
  );

  assert.equal(
    result.issues.some(
      (issue) =>
        issue.type ===
        "unknown_not_allowed"
    ),
    true
  );
});

test("Unknown referencing nonexistent field creates issue", () => {
  const unknowns: SemanticUnknown[] = [
    {
      field: "does_not_exist",
      reason: "unknown",
    },
  ];

  const result =
    resolveSelections(
      options,
      [],
      schema,
      unknowns
    );

  assert.equal(
    result.requiresConfirmation,
    true
  );

  assert.equal(
    result.issues.some(
      (issue) =>
        issue.type ===
        "unknown_field"
    ),
    true
  );
});

test("valid Unknown alone is accepted", () => {
  const unknowns: SemanticUnknown[] = [
    {
      field: "weather",
      reason:
        "intentionally_unspecified",
    },
  ];

  const result =
    resolveSelections(
      options,
      [],
      schema,
      unknowns
    );

  assert.equal(
    result.requiresConfirmation,
    false
  );

  assert.equal(
    result.issues.length,
    0
  );
});

test("Resolver remains compatible when no Unknown values are supplied", () => {
  const selections: SpaSelection[] = [
    {
      optionId: "weather-sunny",
      selected: true,
    },
  ];

  const result =
    resolveSelections(
      options,
      selections,
      schema
    );

  assert.equal(
    result.requiresConfirmation,
    false
  );

  assert.equal(
    result.issues.length,
    0
  );
});
