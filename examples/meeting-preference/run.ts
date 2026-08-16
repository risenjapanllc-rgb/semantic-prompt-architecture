import {
  buildSemanticState,
  canonicalizeSemanticState,
  createGenericPromptRenderer,
  resolveSelections,
  type SemanticUnknown,
  type SpaSelection,
} from "../../src/index.js";

import {
  meetingPreferenceAdapter,
} from "./adapter.js";

const selections:
  SpaSelection[] = [
    {
      optionId:
        "meeting-style-structured",
      selected: true,
    },
    {
      optionId:
        "response-preference-concise",
      selected: true,
    },
  ];

const unknowns:
  SemanticUnknown[] = [];

const resolution =
  resolveSelections(
    meetingPreferenceAdapter.options,
    selections,
    meetingPreferenceAdapter.schema,
    unknowns
  );

if (resolution.requiresConfirmation) {
  console.error(
    "Selection resolution failed:",
    resolution.issues
  );

  process.exitCode = 1;
} else {
  const semanticState =
    buildSemanticState(
      meetingPreferenceAdapter.domain,
      meetingPreferenceAdapter.options,
      resolution.validSelections,
      unknowns
    );

  const canonicalState =
    canonicalizeSemanticState(
      semanticState
    );

  const promptIR =
    meetingPreferenceAdapter
      .translator
      .translate(
        canonicalState
      );

  const renderer =
    createGenericPromptRenderer();

  const rendered =
    renderer.render(
      promptIR
    );

  console.log(rendered.text);
}
