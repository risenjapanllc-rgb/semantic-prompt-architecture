import test from "node:test";
import assert from "node:assert/strict";

import {
  buildSemanticState,
  canonicalizeSemanticState,
  checkDomainAdapterConformance,
  createGenericPromptRenderer,
  resolveSelections,
  type SpaSelection,
} from "../src/index.js";

import {
  meetingPreferenceAdapter,
} from "../examples/meeting-preference/index.js";

test(
  "Meeting Preference starter conforms to SPA Domain Adapter Contract",
  () => {
    const result =
      checkDomainAdapterConformance(
        meetingPreferenceAdapter
      );

    assert.equal(
      result.conforms,
      true,
      JSON.stringify(
        result.issues,
        null,
        2
      )
    );
  }
);

test(
  "Meeting Preference keeps independent semantic dimensions independent",
  () => {
    const selections:
      SpaSelection[] = [
        {
          optionId:
            "meeting-style-structured",
          selected: true,
        },
      ];

    const resolution =
      resolveSelections(
        meetingPreferenceAdapter.options,
        selections,
        meetingPreferenceAdapter.schema
      );

    assert.equal(
      resolution.requiresConfirmation,
      false
    );

    const state =
      buildSemanticState(
        meetingPreferenceAdapter.domain,
        meetingPreferenceAdapter.options,
        resolution.validSelections
      );

    assert.deepEqual(
      state.values,
      {
        meeting_style: [
          "structured",
        ],
      }
    );

    assert.equal(
      "response_preference" in
        state.values,
      false
    );
  }
);

test(
  "Meeting Preference starter renders end to end",
  () => {
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

    const resolution =
      resolveSelections(
        meetingPreferenceAdapter.options,
        selections,
        meetingPreferenceAdapter.schema
      );

    assert.equal(
      resolution.requiresConfirmation,
      false
    );

    const state =
      buildSemanticState(
        meetingPreferenceAdapter.domain,
        meetingPreferenceAdapter.options,
        resolution.validSelections
      );

    const canonical =
      canonicalizeSemanticState(
        state
      );

    const ir =
      meetingPreferenceAdapter
        .translator
        .translate(
          canonical
        );

    const renderer =
      createGenericPromptRenderer();

    const rendered =
      renderer.render(
        ir
      );

    assert.match(
      rendered.text,
      /Use a structured meeting flow\./
    );

    assert.match(
      rendered.text,
      /Keep responses concise\./
    );
  }
);
