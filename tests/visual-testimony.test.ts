import test from "node:test";
import assert from "node:assert/strict";

import {
  buildSemanticState,
  canonicalizeSemanticState,
  createDefaultTranslator,
  createGenericPromptRenderer,
  resolveSelections,
  validateOptionAgainstSchema,
  visualTestimonyOptions,
  visualTestimonySchema,
  type SpaSelection,
} from "../src/index.js";

test("Visual Testimony options belong to the domain schema", () => {
  for (
    const option
    of visualTestimonyOptions
  ) {
    assert.equal(
      validateOptionAgainstSchema(
        visualTestimonySchema,
        option
      ),
      true,
      `Invalid option: ${option.id}`
    );
  }
});

test("refined selection preserves only explicitly selected meaning", () => {
  const selections: SpaSelection[] = [
    {
      optionId:
        "character-impression-refined",
      selected: true,
    },
  ];

  const resolution =
    resolveSelections(
      visualTestimonyOptions,
      selections,
      visualTestimonySchema
    );

  assert.equal(
    resolution.requiresConfirmation,
    false
  );

  const state =
    buildSemanticState(
      "visual_testimony",
      visualTestimonyOptions,
      resolution.validSelections
    );

  assert.deepEqual(
    state.values,
    {
      character_impression: [
        "refined",
      ],
    }
  );

  const serialized =
    JSON.stringify(state);

  for (
    const inventedValue
    of [
      "beautiful",
      "wealthy",
      "young",
      "slim",
      "luxury",
    ]
  ) {
    assert.equal(
      serialized.includes(
        inventedValue
      ),
      false
    );
  }
});

test("independent Visual Testimony dimensions remain independent", () => {
  const selections: SpaSelection[] = [
    {
      optionId:
        "character-impression-refined",
      selected: true,
    },
    {
      optionId:
        "facial-impression-gentle",
      selected: true,
    },
    {
      optionId:
        "weather-sunny",
      selected: true,
    },
  ];

  const resolution =
    resolveSelections(
      visualTestimonyOptions,
      selections,
      visualTestimonySchema
    );

  assert.equal(
    resolution.requiresConfirmation,
    false
  );

  const state =
    buildSemanticState(
      "visual_testimony",
      visualTestimonyOptions,
      resolution.validSelections
    );

  assert.deepEqual(
    state.values,
    {
      character_impression: [
        "refined",
      ],
      facial_impression: [
        "gentle",
      ],
      weather: [
        "sunny",
      ],
    }
  );
});

test("Visual Testimony expression incompatibility is detected", () => {
  const selections: SpaSelection[] = [
    {
      optionId:
        "expression-smiling",
      selected: true,
    },
    {
      optionId:
        "expression-expressionless",
      selected: true,
    },
  ];

  const resolution =
    resolveSelections(
      visualTestimonyOptions,
      selections,
      visualTestimonySchema
    );

  assert.equal(
    resolution.requiresConfirmation,
    true
  );

  assert.equal(
    resolution.issues.some(
      (issue) =>
        issue.type ===
        "incompatible_selection"
    ),
    true
  );
});

test("Visual Testimony single-value fields enforce cardinality", () => {
  const selections: SpaSelection[] = [
    {
      optionId:
        "weather-sunny",
      selected: true,
    },
    {
      optionId:
        "weather-rainy",
      selected: true,
    },
  ];

  const resolution =
    resolveSelections(
      visualTestimonyOptions,
      selections,
      visualTestimonySchema
    );

  assert.equal(
    resolution.requiresConfirmation,
    true
  );

  assert.equal(
    resolution.issues.some(
      (issue) =>
        issue.type ===
        "cardinality_conflict"
    ),
    true
  );
});

test("Visual Testimony uses the existing SPA pipeline end to end", () => {
  const selections: SpaSelection[] = [
    {
      optionId:
        "character-impression-refined",
      selected: true,
    },
    {
      optionId:
        "character-impression-friendly",
      selected: true,
    },
    {
      optionId:
        "environment-outdoor",
      selected: true,
    },
    {
      optionId:
        "weather-sunny",
      selected: true,
    },
  ];

  const resolution =
    resolveSelections(
      visualTestimonyOptions,
      selections,
      visualTestimonySchema
    );

  assert.equal(
    resolution.requiresConfirmation,
    false
  );

  const state =
    buildSemanticState(
      "visual_testimony",
      visualTestimonyOptions,
      resolution.validSelections,
      [
        {
          field: "facial_impression",
          reason: "not_remembered",
        },
      ]
    );

  const canonical =
    canonicalizeSemanticState(
      state
    );

  const translator =
    createDefaultTranslator();

  const renderer =
    createGenericPromptRenderer();

  const prompt =
    renderer.render(
      translator.translate(
        canonical
      )
    );

  assert.equal(
    prompt.text.includes(
      "- character_impression: friendly"
    ),
    true
  );

  assert.equal(
    prompt.text.includes(
      "- character_impression: refined"
    ),
    true
  );

  assert.equal(
    prompt.text.includes(
      "- environment: outdoor"
    ),
    true
  );

  assert.equal(
    prompt.text.includes(
      "- weather: sunny"
    ),
    true
  );

  assert.equal(
    prompt.text.includes(
      "- facial_impression: preserve_unknown (not_remembered)"
    ),
    true
  );
});
