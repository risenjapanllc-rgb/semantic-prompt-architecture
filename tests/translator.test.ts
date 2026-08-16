import test from "node:test";
import assert from "node:assert/strict";

import {
  canonicalizeSemanticState,
  createDefaultTranslator,
  translateCanonicalState,
  type SemanticState,
} from "../src/index.js";

test("Translator converts canonical values into Prompt Instructions", () => {
  const semanticState: SemanticState = {
    domain: "visual_character",

    values: {
      character_impression: [
        "refined",
        "friendly",
      ],
    },

    unknowns: [],
  };

  const canonical =
    canonicalizeSemanticState(
      semanticState
    );

  const ir =
    translateCanonicalState(
      canonical
    );

  assert.deepEqual(
    ir.instructions,
    [
      {
        field:
          "character_impression",
        value:
          "friendly",
      },
      {
        field:
          "character_impression",
        value:
          "refined",
      },
    ]
  );
});

test("Unknown becomes preserve_unknown constraint", () => {
  const semanticState: SemanticState = {
    domain: "visual_character",

    values: {},

    unknowns: [
      {
        field: "weather",
        reason: "not_remembered",
      },
    ],
  };

  const canonical =
    canonicalizeSemanticState(
      semanticState
    );

  const ir =
    translateCanonicalState(
      canonical
    );

  assert.deepEqual(
    ir.constraints,
    [
      {
        field: "weather",
        kind: "preserve_unknown",
        reason: "not_remembered",
      },
    ]
  );
});

test("Translator preserves domain", () => {
  const semanticState: SemanticState = {
    domain: "care",

    values: {
      emotional_state: [
        "anxious",
      ],
    },

    unknowns: [],
  };

  const canonical =
    canonicalizeSemanticState(
      semanticState
    );

  const ir =
    translateCanonicalState(
      canonical
    );

  assert.equal(
    ir.domain,
    "care"
  );
});

test("equivalent Semantic States produce identical Prompt IR", () => {
  const left: SemanticState = {
    domain: "visual_character",

    values: {
      weather: [
        "sunny",
      ],

      character_impression: [
        "refined",
        "friendly",
      ],
    },

    unknowns: [
      {
        field: "exact_eye_shape",
        reason: "not_observed",
      },
    ],
  };

  const right: SemanticState = {
    domain: "visual_character",

    values: {
      character_impression: [
        "friendly",
        "refined",
        "friendly",
      ],

      weather: [
        "sunny",
      ],
    },

    unknowns: [
      {
        field: "exact_eye_shape",
        reason: "not_observed",
      },
      {
        field: "exact_eye_shape",
        reason: "not_observed",
      },
    ],
  };

  const leftIR =
    translateCanonicalState(
      canonicalizeSemanticState(
        left
      )
    );

  const rightIR =
    translateCanonicalState(
      canonicalizeSemanticState(
        right
      )
    );

  assert.deepEqual(
    leftIR,
    rightIR
  );
});

test("Translator does not invent semantic values", () => {
  const semanticState: SemanticState = {
    domain: "visual_character",

    values: {
      character_impression: [
        "refined",
      ],
    },

    unknowns: [],
  };

  const ir =
    translateCanonicalState(
      canonicalizeSemanticState(
        semanticState
      )
    );

  assert.deepEqual(
    ir.instructions,
    [
      {
        field:
          "character_impression",
        value:
          "refined",
      },
    ]
  );

  assert.equal(
    ir.instructions.some(
      (instruction) =>
        instruction.value ===
        "beautiful"
    ),
    false
  );
});

test("default Translator implements SpaTranslator contract", () => {
  const translator =
    createDefaultTranslator();

  assert.equal(
    translator.id,
    "spa-default-translator"
  );

  assert.equal(
    translator.version,
    "1.0.0"
  );

  const semanticState: SemanticState = {
    domain: "visual_character",

    values: {
      weather: [
        "sunny",
      ],
    },

    unknowns: [],
  };

  const result =
    translator.translate(
      canonicalizeSemanticState(
        semanticState
      )
    );

  assert.deepEqual(
    result.instructions,
    [
      {
        field: "weather",
        value: "sunny",
      },
    ]
  );
});
