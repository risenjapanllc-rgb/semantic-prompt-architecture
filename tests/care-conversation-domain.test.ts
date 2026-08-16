import test from "node:test";
import assert from "node:assert/strict";

import {
  buildSemanticState,
  canonicalizeSemanticState,
  careConversationOptions,
  careConversationSchema,
  createDefaultTranslator,
  createGenericPromptRenderer,
  resolveSelections,
  validateOptionAgainstSchema,
  type SpaSelection,
} from "../src/index.js";

test("Care Conversation options belong to the domain schema", () => {
  for (
    const option
    of careConversationOptions
  ) {
    assert.equal(
      validateOptionAgainstSchema(
        careConversationSchema,
        option
      ),
      true
    );
  }
});

test("emotional state remains independent from support preference", () => {
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

  assert.deepEqual(
    state.values,
    {
      emotional_state: [
        "anxious",
      ],
      support_preference: [
        "listening",
      ],
    }
  );
});

test("care selection does not invent unrelated emotional meaning", () => {
  const selections:
    SpaSelection[] = [
    {
      optionId:
        "support-preference-practical",
      selected: true,
    },
  ];

  const resolution =
    resolveSelections(
      careConversationOptions,
      selections,
      careConversationSchema
    );

  const state =
    buildSemanticState(
      "care_conversation",
      careConversationOptions,
      resolution.validSelections
    );

  assert.deepEqual(
    state.values,
    {
      support_preference: [
        "practical_support",
      ],
    }
  );

  assert.equal(
    "emotional_state"
      in state.values,
    false
  );

  assert.equal(
    "conversation_intention"
      in state.values,
    false
  );
});

test("Care Conversation preserves Unknown explicitly", () => {
  const state =
    buildSemanticState(
      "care_conversation",
      careConversationOptions,
      [],
      [
        {
          field: "emotional_state",
          reason: "intentionally_unspecified",
        },
      ]
    );

  assert.deepEqual(
    state.unknowns,
    [
      {
        field: "emotional_state",
        reason:
          "intentionally_unspecified",
      },
    ]
  );
});

test("Care Conversation uses existing SPA pipeline end to end", () => {
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
    createDefaultTranslator();

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
      "emotional_state: anxious"
    ),
    true
  );

  assert.equal(
    prompt.text.includes(
      "support_preference: listening"
    ),
    true
  );

  assert.equal(
    prompt.text.includes(
      "communication_style: gentle"
    ),
    true
  );

  assert.equal(
    prompt.text.includes(
      "conversation_intention: express_feelings"
    ),
    true
  );
});

test("Care Conversation domain remains separate from Visual Testimony semantics", () => {
  const ids =
    new Set(
      careConversationOptions.map(
        (option) => option.id
      )
    );

  assert.equal(
    ids.has(
      "character-impression-refined"
    ),
    false
  );

  assert.equal(
    ids.has(
      "weather-sunny"
    ),
    false
  );
});
