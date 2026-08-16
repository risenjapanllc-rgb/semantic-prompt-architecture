import test from "node:test";
import assert from "node:assert/strict";

import {
  resolveSelections,
  type SemanticSchema,
  type SpaOption,
  type SpaSelection,
} from "../src/index.js";

const schema: SemanticSchema = {
  id: "visual-testimony",
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
    id: "weather-rainy",
    domain: "visual_character",
    category: "weather",
    label: "雨",
    semanticValue: "rainy",
  },
  {
    id: "impression-refined",
    domain: "visual_character",
    category: "character_impression",
    label: "上品",
    semanticValue: "refined",
  },
  {
    id: "impression-friendly",
    domain: "visual_character",
    category: "character_impression",
    label: "親しみやすい",
    semanticValue: "friendly",
  },
  {
    id: "invalid-category",
    domain: "visual_character",
    category: "not_in_schema",
    label: "Invalid",
    semanticValue: "invalid",
  },
  {
    id: "wrong-domain",
    domain: "care",
    category: "weather",
    label: "Wrong domain",
    semanticValue: "sunny",
  },
];

test("single field accepts one semantic value", () => {
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

test("single field rejects multiple semantic values", () => {
  const selections: SpaSelection[] = [
    {
      optionId: "weather-sunny",
      selected: true,
    },
    {
      optionId: "weather-rainy",
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
    true
  );

  assert.equal(
    result.issues.some(
      (issue) =>
        issue.type ===
        "cardinality_conflict"
    ),
    true
  );
});

test("multiple field preserves multiple semantic values", () => {
  const selections: SpaSelection[] = [
    {
      optionId: "impression-refined",
      selected: true,
    },
    {
      optionId: "impression-friendly",
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

  assert.deepEqual(
    result.validSelections.map(
      (selection) =>
        selection.optionId
    ),
    [
      "impression-refined",
      "impression-friendly",
    ]
  );
});

test("Option outside active schema category creates issue", () => {
  const selections: SpaSelection[] = [
    {
      optionId: "invalid-category",
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
    true
  );

  assert.equal(
    result.issues.some(
      (issue) =>
        issue.type ===
        "invalid_schema_option"
    ),
    true
  );
});

test("Option from another domain creates schema issue", () => {
  const selections: SpaSelection[] = [
    {
      optionId: "wrong-domain",
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
    true
  );

  assert.equal(
    result.issues.some(
      (issue) =>
        issue.type ===
        "invalid_schema_option"
    ),
    true
  );
});

test("Resolver remains backward compatible without schema", () => {
  const selections: SpaSelection[] = [
    {
      optionId: "weather-sunny",
      selected: true,
    },
    {
      optionId: "weather-rainy",
      selected: true,
    },
  ];

  const result =
    resolveSelections(
      options,
      selections
    );

  assert.equal(
    result.issues.some(
      (issue) =>
        issue.type ===
        "cardinality_conflict"
    ),
    false
  );
});
