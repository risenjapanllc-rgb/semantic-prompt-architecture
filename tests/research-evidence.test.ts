import test from "node:test";
import assert from "node:assert/strict";

import {
  buildSemanticState,
  canonicalizeSemanticState,
  checkDomainAdapterConformance,
  createResearchEvidenceTranslator,
  researchEvidenceOptions,
  researchEvidenceSchema,
  resolveSelections,
  validateOptionAgainstSchema,
  type SpaSelection,
} from "../src/index.js";

test("Research Evidence options belong to the domain schema", () => {
  for (
    const option
    of researchEvidenceOptions
  ) {
    assert.equal(
      validateOptionAgainstSchema(
        researchEvidenceSchema,
        option
      ),
      true
    );
  }
});

test("Research Evidence conforms to SPA Domain Adapter Contract", () => {
  const result =
    checkDomainAdapterConformance({
      domain: "research_evidence",
      schema:
        researchEvidenceSchema,
      options:
        researchEvidenceOptions,
      translator:
        createResearchEvidenceTranslator(),
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

test("evidence strength remains independent from claim status", () => {
  const selections:
    SpaSelection[] = [
    {
      optionId:
        "evidence-strength-strong",
      selected: true,
    },
  ];

  const resolution =
    resolveSelections(
      researchEvidenceOptions,
      selections,
      researchEvidenceSchema
    );

  assert.equal(
    resolution.requiresConfirmation,
    false
  );

  const state =
    buildSemanticState(
      "research_evidence",
      researchEvidenceOptions,
      resolution.validSelections
    );

  assert.deepEqual(
    state.values.evidence_strength,
    ["strong"]
  );

  assert.equal(
    state.values.claim_status,
    undefined
  );
});

test("source type does not invent evidence strength", () => {
  const selections:
    SpaSelection[] = [
    {
      optionId:
        "source-type-peer-reviewed",
      selected: true,
    },
  ];

  const resolution =
    resolveSelections(
      researchEvidenceOptions,
      selections,
      researchEvidenceSchema
    );

  const state =
    buildSemanticState(
      "research_evidence",
      researchEvidenceOptions,
      resolution.validSelections
    );

  assert.deepEqual(
    state.values.source_type,
    ["peer_reviewed"]
  );

  assert.equal(
    state.values.evidence_strength,
    undefined
  );

  assert.equal(
    state.values.claim_status,
    undefined
  );
});

test("Research Translator does not convert contested into false", () => {
  const canonical =
    canonicalizeSemanticState({
      domain: "research_evidence",
      values: {
        claim_status: [
          "contested",
        ],
      },
      unknowns: [],
    });

  const ir =
    createResearchEvidenceTranslator()
      .translate(canonical);

  assert.deepEqual(
    ir.instructions,
    [
      {
        field: "claim_status",
        value:
          "treat the claim as contested",
      },
    ]
  );

  assert.equal(
    ir.instructions.some(
      (instruction) =>
        instruction.value.includes(
          "false"
        )
    ),
    false
  );
});

test("Research Translator preserves Unknown uncertainty", () => {
  const canonical =
    canonicalizeSemanticState({
      domain: "research_evidence",
      values: {},
      unknowns: [
        {
          field: "uncertainty",
          reason: "unknown",
        },
      ],
    });

  const ir =
    createResearchEvidenceTranslator()
      .translate(canonical);

  assert.deepEqual(
    ir.constraints,
    [
      {
        field: "uncertainty",
        kind: "preserve_unknown",
        reason: "unknown",
      },
    ]
  );

  assert.deepEqual(
    ir.instructions,
    []
  );
});

test("multiple research source types remain independently preserved", () => {
  const selections:
    SpaSelection[] = [
    {
      optionId:
        "source-type-peer-reviewed",
      selected: true,
    },
    {
      optionId:
        "source-type-primary",
      selected: true,
    },
  ];

  const resolution =
    resolveSelections(
      researchEvidenceOptions,
      selections,
      researchEvidenceSchema
    );

  assert.equal(
    resolution.requiresConfirmation,
    false
  );

  const state =
    buildSemanticState(
      "research_evidence",
      researchEvidenceOptions,
      resolution.validSelections
    );

  assert.deepEqual(
    state.values.source_type,
    [
      "peer_reviewed",
      "primary_source",
    ]
  );
});

test("single research field enforces cardinality", () => {
  const selections:
    SpaSelection[] = [
    {
      optionId:
        "claim-status-supported",
      selected: true,
    },
    {
      optionId:
        "claim-status-contested",
      selected: true,
    },
  ];

  const resolution =
    resolveSelections(
      researchEvidenceOptions,
      selections,
      researchEvidenceSchema
    );

  assert.equal(
    resolution.requiresConfirmation,
    true
  );

  assert.equal(
    resolution.issues.some(
      (issue) =>
        issue.type ===
        "cardinality_conflict"
    ),
    true
  );
});

test("Research Translator is deterministic for equivalent meaning", () => {
  const translator =
    createResearchEvidenceTranslator();

  const first =
    canonicalizeSemanticState({
      domain: "research_evidence",
      values: {
        source_type: [
          "peer_reviewed",
          "primary_source",
        ],
        claim_status: [
          "contested",
        ],
      },
      unknowns: [],
    });

  const second =
    canonicalizeSemanticState({
      domain: "research_evidence",
      values: {
        claim_status: [
          "contested",
        ],
        source_type: [
          "primary_source",
          "peer_reviewed",
          "peer_reviewed",
        ],
      },
      unknowns: [],
    });

  assert.deepEqual(
    translator.translate(first),
    translator.translate(second)
  );
});

test("Research Evidence uses SPA Core without changing Core semantics", () => {
  const selections:
    SpaSelection[] = [
    {
      optionId:
        "evidence-strength-moderate",
      selected: true,
    },
    {
      optionId:
        "claim-status-unresolved",
      selected: true,
    },
    {
      optionId:
        "citation-preference-primary",
      selected: true,
    },
  ];

  const resolution =
    resolveSelections(
      researchEvidenceOptions,
      selections,
      researchEvidenceSchema,
      [
        {
          field: "uncertainty",
          reason: "not_observed",
        },
      ]
    );

  assert.equal(
    resolution.requiresConfirmation,
    false
  );

  const state =
    buildSemanticState(
      "research_evidence",
      researchEvidenceOptions,
      resolution.validSelections,
      [
        {
          field: "uncertainty",
          reason: "not_observed",
        },
      ]
    );

  const canonical =
    canonicalizeSemanticState(
      state
    );

  const ir =
    createResearchEvidenceTranslator()
      .translate(canonical);

  assert.equal(
    ir.domain,
    "research_evidence"
  );

  assert.equal(
    ir.instructions.length,
    3
  );

  assert.deepEqual(
    ir.constraints,
    [
      {
        field: "uncertainty",
        kind: "preserve_unknown",
        reason: "not_observed",
      },
    ]
  );
});
