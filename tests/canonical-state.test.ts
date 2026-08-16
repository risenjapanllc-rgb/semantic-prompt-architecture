import test from "node:test";
import assert from "node:assert/strict";

import {
  canonicalizeSemanticState,
  serializeCanonicalState,
  type SemanticState,
} from "../src/index.js";

test("canonicalization sorts semantic categories", () => {
  const state: SemanticState = {
    domain: "visual_character",

    values: {
      weather: [
        "sunny",
      ],
      character_impression: [
        "refined",
      ],
    },

    unknowns: [],
  };

  const canonical =
    canonicalizeSemanticState(
      state
    );

  assert.deepEqual(
    Object.keys(
      canonical.values
    ),
    [
      "character_impression",
      "weather",
    ]
  );
});

test("canonicalization sorts semantic values", () => {
  const state: SemanticState = {
    domain: "visual_character",

    values: {
      character_impression: [
        "warm",
        "friendly",
        "refined",
      ],
    },

    unknowns: [],
  };

  const canonical =
    canonicalizeSemanticState(
      state
    );

  assert.deepEqual(
    canonical.values
      .character_impression,
    [
      "friendly",
      "refined",
      "warm",
    ]
  );
});

test("canonicalization removes duplicate semantic values", () => {
  const state: SemanticState = {
    domain: "visual_character",

    values: {
      character_impression: [
        "refined",
        "friendly",
        "refined",
        "friendly",
      ],
    },

    unknowns: [],
  };

  const canonical =
    canonicalizeSemanticState(
      state
    );

  assert.deepEqual(
    canonical.values
      .character_impression,
    [
      "friendly",
      "refined",
    ]
  );
});

test("canonicalization sorts Unknown values deterministically", () => {
  const state: SemanticState = {
    domain: "visual_character",

    values: {},

    unknowns: [
      {
        field: "weather",
        reason: "not_observed",
      },
      {
        field: "exact_eye_shape",
        reason: "not_remembered",
      },
    ],
  };

  const canonical =
    canonicalizeSemanticState(
      state
    );

  assert.deepEqual(
    canonical.unknowns,
    [
      {
        field: "exact_eye_shape",
        reason: "not_remembered",
      },
      {
        field: "weather",
        reason: "not_observed",
      },
    ]
  );
});

test("canonicalization removes duplicate Unknown values", () => {
  const state: SemanticState = {
    domain: "visual_character",

    values: {},

    unknowns: [
      {
        field: "weather",
        reason: "unknown",
      },
      {
        field: "weather",
        reason: "unknown",
      },
    ],
  };

  const canonical =
    canonicalizeSemanticState(
      state
    );

  assert.deepEqual(
    canonical.unknowns,
    [
      {
        field: "weather",
        reason: "unknown",
      },
    ]
  );
});

test("equivalent Semantic States produce identical canonical serialization", () => {
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
        reason: "not_remembered",
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
        reason: "not_remembered",
      },
      {
        field: "exact_eye_shape",
        reason: "not_remembered",
      },
    ],
  };

  assert.equal(
    serializeCanonicalState(
      left
    ),
    serializeCanonicalState(
      right
    )
  );
});

test("canonicalization does not mutate original Semantic State", () => {
  const state: SemanticState = {
    domain: "visual_character",

    values: {
      character_impression: [
        "warm",
        "refined",
      ],
    },

    unknowns: [
      {
        field: "weather",
        reason: "not_observed",
      },
    ],
  };

  const before =
    JSON.stringify(state);

  canonicalizeSemanticState(
    state
  );

  assert.equal(
    JSON.stringify(state),
    before
  );
});
