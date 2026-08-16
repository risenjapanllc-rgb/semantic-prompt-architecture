import test from "node:test";
import assert from "node:assert/strict";

import {
  careConversationOptions,
  careConversationSchema,
  checkDomainAdapterConformance,
  createCareConversationTranslator,
  createVisualTestimonyTranslator,
  visualTestimonyOptions,
  visualTestimonySchema,
  type SpaTranslator,
} from "../src/index.js";

test("Visual Testimony conforms to SPA Domain Adapter Contract", () => {
  const result =
    checkDomainAdapterConformance({
      domain: "visual_testimony",
      schema:
        visualTestimonySchema,
      options:
        visualTestimonyOptions,
      translator:
        createVisualTestimonyTranslator(),
    });

  assert.equal(
    result.conforms,
    true
  );

  assert.deepEqual(
    result.issues,
    []
  );
});

test("Care Conversation conforms to SPA Domain Adapter Contract", () => {
  const result =
    checkDomainAdapterConformance({
      domain: "care_conversation",
      schema:
        careConversationSchema,
      options:
        careConversationOptions,
      translator:
        createCareConversationTranslator(),
    });

  assert.equal(
    result.conforms,
    true
  );

  assert.deepEqual(
    result.issues,
    []
  );
});

test("Conformance detects adapter and schema domain mismatch", () => {
  const result =
    checkDomainAdapterConformance({
      domain: "wrong_domain",
      schema:
        visualTestimonySchema,
      options: [],
      translator:
        createVisualTestimonyTranslator(),
    });

  assert.equal(
    result.conforms,
    false
  );

  assert.equal(
    result.issues.some(
      (issue) =>
        issue.type ===
        "domain_mismatch"
    ),
    true
  );
});

test("Conformance detects invalid domain Option", () => {
  const result =
    checkDomainAdapterConformance({
      domain: "visual_testimony",
      schema:
        visualTestimonySchema,
      options: [
        {
          id: "invalid-option",
          domain:
            "visual_testimony",
          category:
            "does_not_exist",
          label:
            "Invalid",
          semanticValue:
            "invalid",
        },
      ],
      translator:
        createVisualTestimonyTranslator(),
    });

  assert.equal(
    result.conforms,
    false
  );

  assert.equal(
    result.issues.some(
      (issue) =>
        issue.type ===
        "invalid_option"
    ),
    true
  );
});

test("Conformance detects missing translator identity and version", () => {
  const invalidTranslator:
    SpaTranslator = {
    id: "",
    version: "",

    translate(state) {
      return {
        domain: state.domain,
        instructions: [],
        constraints: [],
      };
    },
  };

  const result =
    checkDomainAdapterConformance({
      domain: "visual_testimony",
      schema:
        visualTestimonySchema,
      options: [],
      translator:
        invalidTranslator,
    });

  assert.equal(
    result.conforms,
    false
  );

  assert.equal(
    result.issues.some(
      (issue) =>
        issue.type ===
        "translator_identity_missing"
    ),
    true
  );

  assert.equal(
    result.issues.some(
      (issue) =>
        issue.type ===
        "translator_version_missing"
    ),
    true
  );
});

test("Conformance detects translator domain mutation", () => {
  const invalidTranslator:
    SpaTranslator = {
    id:
      "invalid-domain-translator",
    version: "0.1.0",

    translate() {
      return {
        domain: "invented_domain",
        instructions: [],
        constraints: [],
      };
    },
  };

  const result =
    checkDomainAdapterConformance({
      domain: "visual_testimony",
      schema:
        visualTestimonySchema,
      options: [],
      translator:
        invalidTranslator,
    });

  assert.equal(
    result.issues.some(
      (issue) =>
        issue.type ===
        "translator_domain_mismatch"
    ),
    true
  );
});

test("Conformance detects Unknown loss", () => {
  const invalidTranslator:
    SpaTranslator = {
    id:
      "unknown-dropping-translator",
    version: "0.1.0",

    translate(state) {
      return {
        domain: state.domain,
        instructions: [],
        constraints: [],
      };
    },
  };

  const result =
    checkDomainAdapterConformance({
      domain: "care_conversation",
      schema:
        careConversationSchema,
      options: [],
      translator:
        invalidTranslator,
    });

  assert.equal(
    result.conforms,
    false
  );

  assert.equal(
    result.issues.some(
      (issue) =>
        issue.type ===
        "unknown_not_preserved"
    ),
    true
  );
});

test("Conformance detects nondeterministic Translator", () => {
  let counter = 0;

  const invalidTranslator:
    SpaTranslator = {
    id:
      "nondeterministic-translator",
    version: "0.1.0",

    translate(state) {
      counter += 1;

      return {
        domain: state.domain,
        instructions: [
          {
            field: "counter",
            value:
              String(counter),
          },
        ],
        constraints:
          state.unknowns.map(
            (unknown) => ({
              field:
                unknown.field,
              kind: "preserve_unknown" as const,
              reason:
                unknown.reason,
            })
          ),
      };
    },
  };

  const result =
    checkDomainAdapterConformance({
      domain: "visual_testimony",
      schema:
        visualTestimonySchema,
      options: [],
      translator:
        invalidTranslator,
    });

  assert.equal(
    result.conforms,
    false
  );

  assert.equal(
    result.issues.some(
      (issue) =>
        issue.type ===
        "translator_nondeterministic"
    ),
    true
  );
});
