import test from "node:test";
import assert from "node:assert/strict";

import {
  buildSemanticState,
  resolveSelections,
  type SpaOption,
  type SpaSelection,
} from "../src/index.js";

const options: SpaOption[] = [
  {
    id: "character-impression-refined",
    domain: "visual_character",
    category: "character_impression",
    label: "上品",
    semanticValue: "refined",
  },
  {
    id: "character-impression-friendly",
    domain: "visual_character",
    category: "character_impression",
    label: "親しみやすい",
    semanticValue: "friendly",
  },
  {
    id: "expression-smiling",
    domain: "visual_character",
    category: "expression",
    label: "笑顔",
    semanticValue: "smiling",
    incompatibleWith: [
      "expression-expressionless",
    ],
  },
  {
    id: "expression-expressionless",
    domain: "visual_character",
    category: "expression",
    label: "無表情",
    semanticValue: "expressionless",
  },
  {
    id: "face-visible",
    domain: "visual_character",
    category: "visibility",
    label: "顔が見える",
    semanticValue: "face_visible",
  },
  {
    id: "tears-visible",
    domain: "visual_character",
    category: "expression_detail",
    label: "涙が見える",
    semanticValue: "tears_visible",
    requires: [
      "face-visible",
    ],
  },
];

test("selected semantic option becomes Semantic State value", () => {
  const selections: SpaSelection[] = [
    {
      optionId:
        "character-impression-refined",
      selected: true,
    },
  ];

  const result =
    resolveSelections(
      options,
      selections
    );

  assert.equal(
    result.requiresConfirmation,
    false
  );

  const state =
    buildSemanticState(
      "visual_character",
      options,
      result.validSelections
    );

  assert.deepEqual(
    state.values,
    {
      character_impression: [
        "refined",
      ],
    }
  );
});

test("compatible semantic selections are both preserved", () => {
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
  ];

  const result =
    resolveSelections(
      options,
      selections
    );

  assert.equal(
    result.requiresConfirmation,
    false
  );

  const state =
    buildSemanticState(
      "visual_character",
      options,
      result.validSelections
    );

  assert.deepEqual(
    state.values
      .character_impression,
    [
      "refined",
      "friendly",
    ]
  );
});

test("unknown Option ID creates unknown_option issue", () => {
  const selections: SpaSelection[] = [
    {
      optionId:
        "does-not-exist",
      selected: true,
    },
  ];

  const result =
    resolveSelections(
      options,
      selections
    );

  assert.equal(
    result.requiresConfirmation,
    true
  );

  assert.equal(
    result.issues[0]?.type,
    "unknown_option"
  );
});

test("incompatible semantic selections create issue", () => {
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

  const result =
    resolveSelections(
      options,
      selections
    );

  assert.equal(
    result.requiresConfirmation,
    true
  );

  assert.equal(
    result.issues.some(
      (issue) =>
        issue.type ===
        "incompatible_selection"
    ),
    true
  );
});

test("missing required semantic option creates issue", () => {
  const selections: SpaSelection[] = [
    {
      optionId: "tears-visible",
      selected: true,
    },
  ];

  const result =
    resolveSelections(
      options,
      selections
    );

  assert.equal(
    result.requiresConfirmation,
    true
  );

  assert.equal(
    result.issues.some(
      (issue) =>
        issue.type ===
        "missing_requirement"
    ),
    true
  );
});

test("required semantic option allows selection to resolve", () => {
  const selections: SpaSelection[] = [
    {
      optionId: "face-visible",
      selected: true,
    },
    {
      optionId: "tears-visible",
      selected: true,
    },
  ];

  const result =
    resolveSelections(
      options,
      selections
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

test("Unknown is preserved explicitly in Semantic State", () => {
  const selections: SpaSelection[] = [
    {
      optionId:
        "character-impression-refined",
      selected: true,
    },
  ];

  const result =
    resolveSelections(
      options,
      selections
    );

  const state =
    buildSemanticState(
      "visual_character",
      options,
      result.validSelections,
      [
        {
          field: "exact_eye_shape",
          reason: "not_remembered",
        },
      ]
    );

  assert.deepEqual(
    state.unknowns,
    [
      {
        field: "exact_eye_shape",
        reason: "not_remembered",
      },
    ]
  );

  assert.equal(
    state.values.character_impression
      .includes("refined"),
    true
  );
});

