import type {
  CanonicalSemanticState,
  SemanticSchema,
  SpaOption,
  SpaTranslator,
} from "../types.js";

import {
  canonicalizeSemanticState,
} from "../canonical-state.js";

import {
  validateOptionAgainstSchema,
} from "../semantic-schema.js";

export type DomainAdapterDefinition = {
  domain: string;
  schema: SemanticSchema;
  options: SpaOption[];
  translator: SpaTranslator;
};

export type DomainAdapterConformanceIssueType =
  | "domain_mismatch"
  | "invalid_option"
  | "translator_identity_missing"
  | "translator_version_missing"
  | "translator_domain_mismatch"
  | "translator_nondeterministic"
  | "unknown_not_preserved";

export type DomainAdapterConformanceIssue = {
  type: DomainAdapterConformanceIssueType;
  message: string;
  optionId?: string;
};

export type DomainAdapterConformanceResult = {
  conforms: boolean;
  issues: DomainAdapterConformanceIssue[];
};

function stableSerialize(
  value: unknown
): string {
  return JSON.stringify(value);
}

export function checkDomainAdapterConformance(
  adapter: DomainAdapterDefinition
): DomainAdapterConformanceResult {
  const issues:
    DomainAdapterConformanceIssue[] = [];

  if (
    adapter.schema.domain !==
    adapter.domain
  ) {
    issues.push({
      type: "domain_mismatch",
      message:
        "Semantic Schema domain does not match adapter domain.",
    });
  }

  for (const option of adapter.options) {
    if (
      option.domain !==
      adapter.domain
    ) {
      issues.push({
        type: "domain_mismatch",
        optionId: option.id,
        message:
          "Option domain does not match adapter domain.",
      });

      continue;
    }

    if (
      !validateOptionAgainstSchema(
        adapter.schema,
        option
      )
    ) {
      issues.push({
        type: "invalid_option",
        optionId: option.id,
        message:
          "Option does not conform to the Semantic Schema.",
      });
    }
  }

  if (
    adapter.translator.id.trim()
      .length === 0
  ) {
    issues.push({
      type:
        "translator_identity_missing",
      message:
        "Translator must have a stable identity.",
    });
  }

  if (
    adapter.translator.version.trim()
      .length === 0
  ) {
    issues.push({
      type:
        "translator_version_missing",
      message:
        "Translator must have an explicit version.",
    });
  }

  const probeA:
    CanonicalSemanticState =
    canonicalizeSemanticState({
      domain: adapter.domain,
      values: {},
      unknowns: [],
    });

  const probeB:
    CanonicalSemanticState =
    canonicalizeSemanticState({
      domain: adapter.domain,
      values: {},
      unknowns: [],
    });

  const translatedA =
    adapter.translator.translate(
      probeA
    );

  const translatedB =
    adapter.translator.translate(
      probeB
    );

  if (
    translatedA.domain !==
      adapter.domain ||
    translatedB.domain !==
      adapter.domain
  ) {
    issues.push({
      type:
        "translator_domain_mismatch",
      message:
        "Translator must preserve the adapter domain.",
    });
  }

  if (
    stableSerialize(translatedA) !==
    stableSerialize(translatedB)
  ) {
    issues.push({
      type:
        "translator_nondeterministic",
      message:
        "Equivalent Canonical States must produce equivalent Prompt IR.",
    });
  }

  const unknownField =
    adapter.schema.fields.find(
      (field) =>
        field.unknownAllowed
    );

  if (unknownField) {
    const unknownProbe =
      canonicalizeSemanticState({
        domain: adapter.domain,
        values: {},
        unknowns: [
          {
            field:
              unknownField.id,
            reason: "unknown",
          },
        ],
      });

    const translatedUnknown =
      adapter.translator.translate(
        unknownProbe
      );

    const preserved =
      translatedUnknown.constraints
        .some(
          (constraint) =>
            constraint.field ===
              unknownField.id &&
            constraint.kind ===
              "preserve_unknown" &&
            constraint.reason ===
              "unknown"
        );

    if (!preserved) {
      issues.push({
        type:
          "unknown_not_preserved",
        message:
          "Translator must preserve Unknown as an explicit Prompt IR constraint.",
      });
    }
  }

  return {
    conforms: issues.length === 0,
    issues,
  };
}
