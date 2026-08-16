# SPA Domain Adapter Quickstart

Status: Developer Guide  
Target: SPA v0.1 architecture

---

## 1. Goal

This guide shows the shortest path for creating a Domain Adapter with Semantic Prompt Architecture.

The goal is:

~~~text
Domain Meaning
    ↓
Semantic Schema
    ↓
Options
    ↓
Translator
    ↓
Domain Adapter
    ↓
Conformance
    ↓
SPA Pipeline
    ↓
Rendered Prompt
~~~

A Domain Adapter defines domain meaning.

It should not modify SPA Core merely to introduce new domain vocabulary.

---

## 2. What SPA Core Already Provides

SPA Core already provides the shared architecture for:

- Selection
- Semantic Schema
- Selection Resolution
- Semantic State
- Canonical State
- Translator contracts
- Prompt IR
- Prompt Rendering
- Unknown preservation
- deterministic representation
- Domain Adapter conformance

A new domain normally supplies:

~~~text
Schema
Options
Translator
Adapter composition
Tests
~~~

---

## 3. Minimal Example Domain

This guide uses a deliberately small example domain:

~~~text
Meeting Preference
~~~

It has two independent semantic fields:

~~~text
meeting_style
response_preference
~~~

Example meanings:

~~~text
meeting_style = structured
response_preference = concise
~~~

Selecting one must not silently create the other.

---

## 4. Define the Semantic Schema

Create a schema describing the semantic fields.

Conceptually:

~~~ts
import type {
  SemanticSchema,
} from "../../index.js";

export const meetingPreferenceSchema:
  SemanticSchema = {
    id: "meeting-preference",
    version: "1.0.0",
    domain: "meeting_preference",

    fields: [
      {
        id: "meeting_style",
        category: "meeting_style",
        cardinality: "single",
        unknownAllowed: true,
      },
      {
        id: "response_preference",
        category: "response_preference",
        cardinality: "single",
        unknownAllowed: true,
      },
    ],
  };
~~~

The Schema defines structure.

It does not define prompt wording.

---

## 5. Define Options

Options expose selectable meaning.

Conceptually:

~~~ts
import type {
  SpaOption,
} from "../../index.js";

export const meetingPreferenceOptions:
  SpaOption[] = [
    {
      id: "meeting-style-structured",
      domain: "meeting_preference",
      category: "meeting_style",
      label: "構造化された進行",
      semanticValue: "structured",
    },
    {
      id: "meeting-style-open",
      domain: "meeting_preference",
      category: "meeting_style",
      label: "自由な進行",
      semanticValue: "open",
    },
    {
      id: "response-preference-concise",
      domain: "meeting_preference",
      category: "response_preference",
      label: "簡潔な応答",
      semanticValue: "concise",
    },
  ];
~~~

The user-facing label and semantic value are separate.

For example:

~~~text
User sees:
簡潔な応答

Semantic State stores:
concise
~~~

---

## 6. Preserve Independent Meaning

Suppose the user selects:

~~~text
meeting_style = structured
~~~

SPA must not silently add:

~~~text
response_preference = concise
~~~

unless that second meaning is explicitly selected, confirmed, or produced by an explicitly declared semantic rule.

This is part of the Non-Invention Principle.

---

## 7. Resolve Selection

Selections reference Option IDs.

Conceptually:

~~~ts
const selections = [
  {
    optionId:
      "meeting-style-structured",
    selected: true,
  },
];
~~~

Use the existing Selection Resolver with the domain Schema and Options.

The Resolver is responsible for validating semantic consistency.

Domain code should not create a second independent resolution architecture.

---

## 8. Build Semantic State

After valid selection resolution, construct Semantic State.

Conceptually:

~~~text
{
  domain: "meeting_preference",

  values: {
    meeting_style: [
      "structured"
    ]
  },

  unknowns: []
}
~~~

This is model-independent meaning.

Do not store final prompt wording here.

---

## 9. Represent Unknown Explicitly

If the user does not remember a preference, preserve that fact.

Conceptually:

~~~text
{
  field: "response_preference",
  reason: "not_remembered"
}
~~~

Do not replace Unknown with a guessed value such as:

~~~text
concise
neutral
default
~~~

Unknown is semantic information.

It is not permission to invent information.

---

## 10. Canonicalize

Pass Semantic State through SPA canonicalization.

Canonicalization provides deterministic representation.

Equivalent meaning should produce equivalent Canonical State regardless of:

- input ordering
- duplicate values
- duplicate Unknown representation

Domain Adapters should use the Core canonicalization mechanism rather than implementing their own equivalent mechanism.

---

## 11. Implement a Translator

The Translator converts Canonical State into Prompt IR.

Conceptually:

~~~ts
import type {
  SpaTranslator,
} from "../../index.js";

export const meetingPreferenceTranslator:
  SpaTranslator = {
    id: "meeting-preference-translator",
    version: "1.0.0",

    translate(state) {
      // Convert represented semantic values
      // into domain-appropriate Prompt IR.
      //
      // Preserve Unknown explicitly.
      //
      // Do not invent unrelated meaning.

      return {
        domain: state.domain,
        instructions: [],
        constraints: [],
      };
    },
  };
~~~

The Translator may change wording.

It must preserve meaning.

---

## 12. Translator Boundary

The Translator is allowed to express:

~~~text
structured
~~~

using wording appropriate for the target prompt.

It is not allowed to silently transform it into unrelated facts such as:

~~~text
formal
strict
executive
high-status
short meeting
~~~

unless those meanings are explicitly represented by the domain.

Translation is expression.

Translation is not semantic invention.

---

## 13. Preserve Unknown in Prompt IR

Unknown should cross the Translator boundary explicitly.

Conceptually:

~~~text
Semantic Unknown

response_preference
=
not_remembered

        ↓

Prompt Constraint

field:
response_preference

kind:
preserve_unknown

reason:
not_remembered
~~~

This prevents missing information from silently becoming fabricated information downstream.

---

## 14. Render the Prompt

Prompt IR is passed to a Prompt Renderer.

The generic SPA renderer can produce a deterministic representation.

Conceptually:

~~~text
Domain: meeting_preference

Instructions:
- meeting_style: structured

Constraints:
- response_preference: preserve_unknown (not_remembered)
~~~

A model-specific renderer may use different wording.

The underlying semantic meaning should remain the same.

---

## 15. Create the Domain Adapter

A Domain Adapter groups the domain components behind the shared SPA architecture.

Conceptually:

~~~text
Meeting Preference Adapter

├── Semantic Schema
├── Option Library
└── Translator
~~~

The adapter should expose domain meaning without redefining SPA Core.

Use the existing Domain Adapter contract in the repository as the authoritative implementation reference.

---

## 16. Run Conformance

Every maintained Domain Adapter should pass the SPA Domain Adapter Conformance Kit.

Conformance checks include architectural expectations such as:

- adapter/schema domain consistency
- Option validity
- Translator identity
- Translator version
- Translator domain preservation
- Unknown preservation
- deterministic translation

Passing conformance does not prove that every domain-specific semantic rule is correct.

Domain-specific tests are still required.

---

## 17. Add Domain Tests

At minimum, a Domain Adapter should test:

1. Options belong to the domain Schema.
2. Independent semantic dimensions remain independent.
3. Single-value fields enforce cardinality.
4. Unknown remains explicit.
5. Translator does not invent unrelated meaning.
6. Equivalent meaning translates deterministically.
7. The complete SPA pipeline works end to end.
8. The adapter passes the Conformance Kit.

Tests should protect meaning, not merely code execution.

---

## 18. Recommended Directory Shape

A typical adapter may use:

~~~text
src/domains/example-domain/
├── index.ts
├── options.ts
├── schema.ts
└── translator.ts
~~~

With tests such as:

~~~text
tests/example-domain.test.ts
~~~

Domain organization may vary.

The architectural contract matters more than the directory name.

---

## 19. What Not to Put in SPA Core

Do not add domain vocabulary to Core merely because your adapter needs it.

For example:

~~~text
meeting_style
response_preference
weather
facial_impression
emotional_state
evidence_strength
citation_preference
~~~

belong to domains.

SPA Core should contain general semantic architecture.

---

## 20. When the Existing Core Feels Insufficient

First ask:

> Is this limitation specific to my domain?

If yes:

~~~text
keep it in the Domain Adapter
~~~

If the same architectural limitation appears across substantially different domains, gather evidence.

Do not modify Core immediately.

SPA uses the Core Expansion Proposal process for evidence-driven Core evolution.

See:

~~~text
docs/governance/020-core-expansion-proposal.md
docs/governance/cep/000-template.md
~~~

---

## 21. Existing Reference Domains

The repository currently contains multiple reference domains.

Use them as implementation examples:

~~~text
src/domains/visual-testimony/
src/domains/care-conversation/
src/domains/research-evidence/
~~~

They intentionally represent different semantic problem spaces.

The shared architecture is the important part.

---

## 22. Developer Checklist

Before considering a Domain Adapter complete:

~~~text
[ ] Domain has a Semantic Schema
[ ] Options belong to the Schema
[ ] Semantic dimensions remain independent
[ ] Cardinality is explicit
[ ] Unknown behavior is explicit
[ ] Translator has identity and version
[ ] Translator preserves domain
[ ] Translator avoids semantic invention
[ ] Translation is deterministic where required
[ ] Domain tests pass
[ ] SPA Conformance passes
[ ] Existing Core tests still pass
[ ] SPA Core was not modified without architectural evidence
~~~

---

## 23. Mental Model

The shortest useful mental model for SPA is:

~~~text
Do not write prompts first.

Represent meaning first.
        ↓
Validate meaning.
        ↓
Canonicalize meaning.
        ↓
Translate meaning.
        ↓
Render instructions.
~~~

The prompt is output.

The semantic representation is the durable asset.

---

## 24. Next Step

After building one Domain Adapter successfully, compare the implementation with the existing reference domains.

If your domain works through the existing Core:

~~~text
that is evidence the Core boundary is holding
~~~

If your domain exposes a genuine shared architectural limitation:

~~~text
document the evidence
↓
compare across domains
↓
consider a CEP
~~~

Do not expand Core merely to make one adapter more convenient.
