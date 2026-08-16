import test from "node:test";
import assert from "node:assert/strict";

import {
  buildSemanticFieldMap,
  getSemanticFieldByCategory,
  validateOptionAgainstSchema,
  type SemanticSchema,
  type SpaOption,
} from "../src/index.js";

const schema: SemanticSchema = {
  id: "visual-character-schema",
  version: "1.0.0",
  domain: "visual_character",

  fields: [
    {
      id: "character_impression",
      category: "character_impression",
      cardinality: "multiple",
      unknownAllowed: true,
    },
    {
      id: "weather",
      category: "weather",
      cardinality: "single",
      unknownAllowed: true,
    },
  ],
};

test("Semantic Field map is deterministic", () => {
  const map =
    buildSemanticFieldMap(schema);

  assert.equal(
    map.get("weather")?.category,
    "weather"
  );

  assert.equal(
    map.get("weather")?.cardinality,
    "single"
  );
});

test("Semantic Field can be resolved from Option category", () => {
  const field =
    getSemanticFieldByCategory(
      schema,
      "character_impression"
    );

  assert.equal(
    field?.id,
    "character_impression"
  );
});

test("Option belonging to schema domain and category is valid", () => {
  const option: SpaOption = {
    id: "weather-sunny",
    domain: "visual_character",
    category: "weather",
    label: "晴れ",
    semanticValue: "sunny",
  };

  assert.equal(
    validateOptionAgainstSchema(
      schema,
      option
    ),
    true
  );
});

test("Option with unknown semantic category is rejected", () => {
  const option: SpaOption = {
    id: "unknown-category-option",
    domain: "visual_character",
    category: "does_not_exist",
    label: "Unknown category",
    semanticValue: "value",
  };

  assert.equal(
    validateOptionAgainstSchema(
      schema,
      option
    ),
    false
  );
});

test("Option from another domain is rejected", () => {
  const option: SpaOption = {
    id: "care-emotion-calm",
    domain: "care",
    category: "character_impression",
    label: "穏やか",
    semanticValue: "calm",
  };

  assert.equal(
    validateOptionAgainstSchema(
      schema,
      option
    ),
    false
  );
});

test("duplicate Semantic Field ids are rejected", () => {
  const invalidSchema: SemanticSchema = {
    id: "invalid-schema",
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
        id: "weather",
        category: "weather_secondary",
        cardinality: "single",
        unknownAllowed: true,
      },
    ],
  };

  assert.throws(
    () =>
      buildSemanticFieldMap(
        invalidSchema
      ),
    /Duplicate semantic field id/
  );
});
