import test from "node:test";
import assert from "node:assert/strict";

import {
  buildSemanticState,
  canonicalizeSemanticState,
  careConversationOptions,
  careConversationSchema,
  createCareConversationTranslator,
  createGenericPromptRenderer,
  resolveSelections,
  translateCareValue,
  type SpaSelection,
} from "../src/index.js";

test("Care Translator expresses anxious without inventing diagnosis", () => {
  const translated =
    translateCareValue(
      "emotional_state",
      "anxious"
    );

  assert.equal(
    translated,
    "the person describes feeling anxious"
  );

  const forbidden = [
    "panic disorder",
    "depression",
    "trauma",
    "mental illness",
    "diagnosis",
  ];

  for (const invented of forbidden) {
    assert.equal(
      translated
        .toLowerCase()
        .includes(invented),
      false
    );
  }
});

test("Care Translator expresses listening preference as interaction guidance", () => {
  assert.equal(
    translateCareValue(
      "support_preference",
      "listening"
    ),
    "prioritize listening before offering solutions"
  );
});

test("Care Translator translates communication and intention independently", () => {
  assert.equal(
    translateCareValue(
      "communication_style",
      "gentle"
    ),
    "use a gentle communication style"
  );

  assert.equal(
    translateCareValue(
      "conversation_intention",
      "consider_next_step"
    ),
    "help the person consider possible next steps"
  );
});

test("Care Translator preserves unmapped semantic values instead of inventing replacements", () => {
  assert.equal(
    translateCareValue(
      "future_care_field",
      "future_care_value"
    ),
    "future_care_value"
  );
});

test("Care Translator preserves Unknown as explicit constraint", () => {
  const state =
    canonicalizeSemanticState({
      domain: "care_conversation",

      values: {
        support_preference: [
          "listening",
        ],
      },

      unknowns: [
        {
          field: "emotional_state",
          reason:
            "intentionally_unspecified",
        },
      ],
    });

  const translator =
    createCareConversationTranslator();

  const ir =
    translator.translate(state);

  assert.deepEqual(
    ir.constraints,
    [
      {
        field: "emotional_state",
        kind: "preserve_unknown",
        reason:
          "intentionally_unspecified",
      },
    ]
  );
});

test("Care Translator is deterministic for equivalent semantic meaning", () => {
  const translator =
    createCareConversationTranslator();

  const left =
    canonicalizeSemanticState({
      domain: "care_conversation",

      values: {
        emotional_state: [
          "anxious",
        ],
        support_preference: [
          "listening",
        ],
        communication_style: [
          "gentle",
        ],
      },

      unknowns: [],
    });

  const right =
    canonicalizeSemanticState({
      domain: "care_conversation",

      values: {
        communication_style: [
          "gentle",
          "gentle",
        ],
        support_preference: [
          "listening",
        ],
        emotional_state: [
          "anxious",
          "anxious",
        ],
      },

      unknowns: [],
    });

  assert.deepEqual(
    translator.translate(left),
    translator.translate(right)
  );
});

test("Care Conversation domain pipeline renders care-specific wording without inventing meaning", () => {
  const selections:
    SpaSelection[] = [
    {
      optionId:
        "emotional-state-anxious",
      selected: true,
    },
    {
      optionId:
        "support-preference-listening",
      selected: true,
    },
    {
      optionId:
        "communication-style-gentle",
      selected: true,
    },
    {
      optionId:
        "conversation-intention-express",
      selected: true,
    },
  ];

  const resolution =
    resolveSelections(
      careConversationOptions,
      selections,
      careConversationSchema
    );

  assert.equal(
    resolution.requiresConfirmation,
    false
  );

  const state =
    buildSemanticState(
      "care_conversation",
      careConversationOptions,
      resolution.validSelections
    );

  const canonical =
    canonicalizeSemanticState(
      state
    );

  const translator =
    createCareConversationTranslator();

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
      "emotional_state: the person describes feeling anxious"
    ),
    true
  );

  assert.equal(
    prompt.text.includes(
      "support_preference: prioritize listening before offering solutions"
    ),
    true
  );

  assert.equal(
    prompt.text.includes(
      "communication_style: use a gentle communication style"
    ),
    true
  );

  assert.equal(
    prompt.text.includes(
      "conversation_intention: support the person in putting current feelings into words"
    ),
    true
  );

  const forbidden = [
    "panic disorder",
    "depression",
    "trauma",
    "mental illness",
    "diagnosis",
  ];

  for (const invented of forbidden) {
    assert.equal(
      prompt.text
        .toLowerCase()
        .includes(invented),
      false
    );
  }
});
