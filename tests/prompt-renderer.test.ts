import test from "node:test";
import assert from "node:assert/strict";

import {
  canonicalizeSemanticState,
  createDefaultTranslator,
  createGenericPromptRenderer,
  renderPromptIR,
  type PromptIR,
  type SemanticState,
} from "../src/index.js";

test("Renderer produces deterministic generic prompt", () => {
  const ir: PromptIR = {
    domain: "visual_character",

    instructions: [
      {
        field: "weather",
        value: "sunny",
      },
      {
        field:
          "character_impression",
        value: "refined",
      },
      {
        field:
          "character_impression",
        value: "friendly",
      },
    ],

    constraints: [
      {
        field: "exact_eye_shape",
        kind: "preserve_unknown",
        reason: "not_observed",
      },
    ],
  };

  const result =
    renderPromptIR(ir);

  assert.equal(
    result,
    [
      "Domain: visual_character",
      "",
      "Instructions:",
      "- character_impression: friendly",
      "- character_impression: refined",
      "- weather: sunny",
      "",
      "Constraints:",
      "- exact_eye_shape: preserve_unknown (not_observed)",
    ].join("\n")
  );
});

test("Renderer does not mutate Prompt IR", () => {
  const ir: PromptIR = {
    domain: "visual_character",

    instructions: [
      {
        field: "weather",
        value: "sunny",
      },
      {
        field: "weather",
        value: "cloudy",
      },
    ],

    constraints: [],
  };

  const before =
    JSON.stringify(ir);

  renderPromptIR(ir);

  assert.equal(
    JSON.stringify(ir),
    before
  );
});

test("Renderer works with instructions only", () => {
  const ir: PromptIR = {
    domain: "care",

    instructions: [
      {
        field: "emotional_state",
        value: "anxious",
      },
    ],

    constraints: [],
  };

  assert.equal(
    renderPromptIR(ir),
    [
      "Domain: care",
      "",
      "Instructions:",
      "- emotional_state: anxious",
    ].join("\n")
  );
});

test("Renderer works with constraints only", () => {
  const ir: PromptIR = {
    domain: "visual_character",

    instructions: [],

    constraints: [
      {
        field: "weather",
        kind: "preserve_unknown",
        reason: "not_remembered",
      },
    ],
  };

  assert.equal(
    renderPromptIR(ir),
    [
      "Domain: visual_character",
      "",
      "Constraints:",
      "- weather: preserve_unknown (not_remembered)",
    ].join("\n")
  );
});

test("generic Renderer implements renderer contract", () => {
  const renderer =
    createGenericPromptRenderer();

  const ir: PromptIR = {
    domain: "visual_character",

    instructions: [
      {
        field: "weather",
        value: "sunny",
      },
    ],

    constraints: [],
  };

  const result =
    renderer.render(ir);

  assert.equal(
    result.rendererId,
    "spa-generic-renderer"
  );

  assert.equal(
    result.rendererVersion,
    "1.0.0"
  );

  assert.equal(
    result.text,
    [
      "Domain: visual_character",
      "",
      "Instructions:",
      "- weather: sunny",
    ].join("\n")
  );
});

test("equivalent semantic meaning produces identical final prompt", () => {
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

  const translator =
    createDefaultTranslator();

  const renderer =
    createGenericPromptRenderer();

  const leftPrompt =
    renderer.render(
      translator.translate(
        canonicalizeSemanticState(
          left
        )
      )
    );

  const rightPrompt =
    renderer.render(
      translator.translate(
        canonicalizeSemanticState(
          right
        )
      )
    );

  assert.equal(
    leftPrompt.text,
    rightPrompt.text
  );
});

test("end-to-end pipeline preserves Unknown as explicit constraint", () => {
  const semanticState: SemanticState = {
    domain: "visual_character",

    values: {
      character_impression: [
        "refined",
      ],
    },

    unknowns: [
      {
        field: "weather",
        reason: "not_remembered",
      },
    ],
  };

  const translator =
    createDefaultTranslator();

  const renderer =
    createGenericPromptRenderer();

  const result =
    renderer.render(
      translator.translate(
        canonicalizeSemanticState(
          semanticState
        )
      )
    );

  assert.equal(
    result.text.includes(
      "- character_impression: refined"
    ),
    true
  );

  assert.equal(
    result.text.includes(
      "- weather: preserve_unknown (not_remembered)"
    ),
    true
  );
});
