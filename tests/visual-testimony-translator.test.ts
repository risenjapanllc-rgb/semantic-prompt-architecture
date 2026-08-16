import test from "node:test";
import assert from "node:assert/strict";

import {
  buildSemanticState,
  canonicalizeSemanticState,
  createGenericPromptRenderer,
  createVisualTestimonyTranslator,
  resolveSelections,
  translateVisualValue,
  visualTestimonyOptions,
  visualTestimonySchema,
  type SpaSelection,
} from "../src/index.js";

test("Visual Translator expresses refined without inventing beauty or wealth", () => {
  assert.equal(
    translateVisualValue(
      "character_impression",
      "refined"
    ),
    "refined appearance"
  );

  const translated =
    translateVisualValue(
      "character_impression",
      "refined"
    );

  assert.equal(
    translated.includes("beautiful"),
    false
  );

  assert.equal(
    translated.includes("wealthy"),
    false
  );

  assert.equal(
    translated.includes("young"),
    false
  );
});

test("Visual Translator translates known domain semantic values", () => {
  assert.equal(
    translateVisualValue(
      "weather",
      "sunny"
    ),
    "sunny weather"
  );

  assert.equal(
    translateVisualValue(
      "facial_impression",
      "gentle"
    ),
    "gentle facial impression"
  );

  assert.equal(
    translateVisualValue(
      "clothing",
      "formal"
    ),
    "formal clothing"
  );
});

test("Visual Translator preserves unmapped semantic values instead of inventing replacements", () => {
  assert.equal(
    translateVisualValue(
      "future_field",
      "future_value"
    ),
    "future_value"
  );
});

test("Visual Translator preserves Unknown as explicit constraint", () => {
  const state =
    canonicalizeSemanticState({
      domain: "visual_testimony",

      values: {
        character_impression: [
          "refined",
        ],
      },

      unknowns: [
        {
          field: "weather",
          reason: "not_observed",
        },
      ],
    });

  const translator =
    createVisualTestimonyTranslator();

  const ir =
    translator.translate(state);

  assert.deepEqual(
    ir.constraints,
    [
      {
        field: "weather",
        kind: "preserve_unknown",
        reason: "not_observed",
      },
    ]
  );
});

test("Visual Translator is deterministic for equivalent semantic meaning", () => {
  const translator =
    createVisualTestimonyTranslator();

  const left =
    canonicalizeSemanticState({
      domain: "visual_testimony",

      values: {
        character_impression: [
          "refined",
          "friendly",
        ],
        weather: [
          "sunny",
        ],
      },

      unknowns: [],
    });

  const right =
    canonicalizeSemanticState({
      domain: "visual_testimony",

      values: {
        weather: [
          "sunny",
          "sunny",
        ],
        character_impression: [
          "friendly",
          "refined",
          "friendly",
        ],
      },

      unknowns: [],
    });

  assert.deepEqual(
    translator.translate(left),
    translator.translate(right)
  );
});

test("Visual Testimony domain pipeline renders translated visual wording", () => {
  const selections:
    SpaSelection[] = [
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
          field: "hair",
          reason: "not_remembered",
        },
      ]
    );

  const canonical =
    canonicalizeSemanticState(
      state
    );

  const translator =
    createVisualTestimonyTranslator();

  const renderer =
    createGenericPromptRenderer();

  const ir =
    translator.translate(
      canonical
    );

  const prompt =
    renderer.render(ir);

  assert.equal(
    prompt.text.includes(
      "- character_impression: refined appearance"
    ),
    true
  );

  assert.equal(
    prompt.text.includes(
      "- facial_impression: gentle facial impression"
    ),
    true
  );

  assert.equal(
    prompt.text.includes(
      "- environment: outdoor environment"
    ),
    true
  );

  assert.equal(
    prompt.text.includes(
      "- weather: sunny weather"
    ),
    true
  );

  assert.equal(
    prompt.text.includes(
      "- hair: preserve_unknown (not_remembered)"
    ),
    true
  );

  for (
    const invented
    of [
      "beautiful",
      "wealthy",
      "luxury",
      "slim",
    ]
  ) {
    assert.equal(
      prompt.text.includes(
        invented
      ),
      false
    );
  }
});

test("Visual Translator implements its own versioned translator identity", () => {
  const translator =
    createVisualTestimonyTranslator();

  assert.equal(
    translator.id,
    "visual-testimony-translator"
  );

  assert.equal(
    translator.version,
    "0.1.0"
  );
});
