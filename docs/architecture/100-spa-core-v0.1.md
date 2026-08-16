# Semantic Prompt Architecture Core v0.1

Status: Draft Core Specification  
Version: 0.1  
Architecture: Semantic Prompt Architecture (SPA)

---

## 1. Purpose

Semantic Prompt Architecture (SPA) separates human meaning from model-specific prompt wording.

Traditional prompt-oriented systems often follow this structure:

~~~text
Human
↓
Prompt
↓
AI Model
~~~

SPA instead introduces a semantic layer:

~~~text
Human
↓
Selection
↓
Semantic State
↓
Canonical State
↓
Translator
↓
Prompt IR
↓
Prompt Renderer
↓
AI Model
~~~

The durable asset is not the prompt.

The durable asset is the semantic meaning represented by the system.

Prompts are generated artifacts.

---

## 2. Core Architecture

SPA Core v0.1 defines the following processing pipeline:

~~~text
Human Intent
    ↓
Option Library
    ↓
Selection
    ↓
Semantic Schema
    ↓
Selection Resolver
    ↓
Semantic State
    ↓
Canonical State
    ↓
Translator
    ↓
Prompt IR
    ↓
Prompt Renderer
    ↓
Rendered Prompt
    ↓
AI Model
~~~

Each layer has a distinct responsibility.

Meaning must not be silently changed when crossing layer boundaries.

---

## 3. Core Principle

SPA follows this rule:

> Users select meaning.  
> Applications preserve meaning.  
> Translators express meaning.  
> Renderers format instructions.  
> AI models receive generated prompts.

Prompt wording is replaceable.

Semantic meaning is durable.

---

## 4. Option

An Option is a selectable semantic unit.

~~~ts
export type SpaOption = {
  id: string;
  domain: string;
  category: string;
  label: string;
  semanticValue: string;
  description?: string;
  incompatibleWith?: string[];
  requires?: string[];
};
~~~

Example:

~~~ts
{
  id: "character-impression-refined",
  domain: "visual_character",
  category: "character_impression",
  label: "上品",
  semanticValue: "refined"
}
~~~

`label` is human-facing.

`semanticValue` is system-facing.

Neither field is model-specific prompt wording.

An Option must not silently imply unrelated semantic attributes.

For example, selecting:

~~~text
上品
~~~

must not automatically imply:

~~~text
beautiful
wealthy
young
slim
luxury clothing
~~~

unless those meanings are independently represented and explicitly confirmed.

---

## 5. Selection

A Selection records an explicit user choice.

~~~ts
export type SpaSelection = {
  optionId: string;
  selected: boolean;
};
~~~

Selection records choice.

Option defines meaning.

Selection must not reinterpret the Option.

---

## 6. Semantic Schema

Semantic Schema defines the valid semantic structure of a domain.

~~~ts
export type SemanticFieldCardinality =
  | "single"
  | "multiple";

export type SemanticField = {
  id: string;
  category: string;
  cardinality: SemanticFieldCardinality;
  unknownAllowed: boolean;
};

export type SemanticSchema = {
  id: string;
  version: string;
  domain: string;
  fields: SemanticField[];
};
~~~

A Semantic Field defines where a semantic value belongs.

Example:

~~~ts
{
  id: "weather",
  category: "weather",
  cardinality: "single",
  unknownAllowed: true
}
~~~

Semantic Schema makes semantic validity explicit rather than relying on prompt wording.

---

## 7. Cardinality

A Semantic Field may be:

~~~text
single
multiple
~~~

A `single` field permits one confirmed semantic value.

Example:

~~~text
weather = sunny
~~~

Selecting both:

~~~text
weather = sunny
weather = rainy
~~~

creates a cardinality conflict.

A `multiple` field may preserve several independent values.

Example:

~~~text
character_impression = refined
character_impression = friendly
~~~

Both may coexist when allowed by the domain.

---

## 8. Selection Resolution

Selection Resolver validates selected meaning before Semantic State is treated as resolved.

SPA Core v0.1 recognizes resolution issues including:

~~~text
unknown_option
invalid_schema_option
incompatible_selection
missing_requirement
cardinality_conflict
unknown_field
unknown_not_allowed
unknown_conflict
ambiguous_selection
~~~

Resolution must not silently repair contradictory meaning.

When confirmation is required, the contradiction remains explicit.

---

## 9. Unknown Principle

Unknown is a first-class semantic state.

SPA must not force false certainty.

Supported Unknown reasons include:

~~~ts
export type UnknownReason =
  | "unknown"
  | "not_remembered"
  | "not_observed"
  | "not_applicable"
  | "intentionally_unspecified";
~~~

Unknown may represent:

- information the user does not know
- information the user does not remember
- information that was not observed
- information that does not apply
- information intentionally left unspecified

Unknown is not a descriptive Option.

Unknown represents absence of confirmed semantic information.

---

## 10. Unknown Conflict

A field must not simultaneously contain a confirmed value and an Unknown state.

Example:

~~~text
weather = sunny
+
weather = not_remembered
~~~

This creates:

~~~text
unknown_conflict
~~~

However:

~~~text
character_impression = refined
+
weather = not_remembered
~~~

does not create a conflict because the values belong to different Semantic Fields.

If:

~~~text
unknownAllowed = false
~~~

then an Unknown state for that field creates:

~~~text
unknown_not_allowed
~~~

Unknown must never be silently converted into invented information.

---

## 11. Semantic State

Semantic State is the model-independent representation of confirmed meaning.

~~~ts
export type SemanticState = {
  domain: string;
  values: Record<string, string[]>;
  unknowns: SemanticUnknown[];
};
~~~

Example:

~~~ts
{
  domain: "visual_character",

  values: {
    character_impression: [
      "refined",
      "friendly"
    ]
  },

  unknowns: [
    {
      field: "weather",
      reason: "not_remembered"
    }
  ]
}
~~~

Semantic State contains meaning.

It must not contain model-specific prompt instructions.

---

## 12. Canonical State

Canonical State provides a deterministic representation of Semantic State.

SPA Core v0.1 canonicalization performs:

1. deterministic category ordering
2. deterministic semantic value ordering
3. duplicate semantic value removal
4. deterministic Unknown ordering
5. duplicate Unknown removal
6. preservation of the original Semantic State
7. deterministic serialization for equivalent meaning

Equivalent Semantic States must produce equivalent Canonical States.

For example:

~~~text
refined
friendly
~~~

and:

~~~text
friendly
refined
friendly
~~~

represent the same semantic meaning after canonicalization.

Canonicalization changes representation.

It must not change meaning.

---

## 13. Determinism Invariant

SPA Core v0.1 defines the following invariant:

> Equivalent semantic meaning must produce an equivalent canonical representation.

For the default deterministic pipeline:

> Equivalent semantic meaning must produce identical Prompt IR and identical rendered prompt text.

Conceptually:

~~~text
Semantic State A ─┐
Semantic State B ─┼─→ Canonical State X
Semantic State C ─┘
                         ↓
                     Translator
                         ↓
                     Prompt IR
                         ↓
                      Renderer
                         ↓
                 Identical Prompt
~~~

Input ordering and duplicate representation must not introduce prompt variation.

---

## 14. Translator

Translator converts Canonical State into Prompt IR.

~~~ts
export type SpaTranslator = {
  id: string;
  version: string;

  translate(
    state: CanonicalSemanticState
  ): PromptIR;
};
~~~

Translator is a boundary between model-independent semantic representation and prompt-oriented representation.

A Translator must not invent unrelated semantic meaning.

For example:

~~~text
refined
~~~

must not silently become:

~~~text
beautiful
~~~

unless a domain or model adapter explicitly defines and documents that mapping.

---

## 15. Prompt IR

Prompt IR is an intermediate representation between semantic meaning and final prompt formatting.

~~~ts
export type PromptInstruction = {
  field: string;
  value: string;
};

export type PromptConstraint = {
  field: string;
  kind: "preserve_unknown";
  reason: UnknownReason;
};

export type PromptIR = {
  domain: string;
  instructions: PromptInstruction[];
  constraints: PromptConstraint[];
};
~~~

Prompt IR is not necessarily the final prompt.

It allows multiple renderers to consume the same translated meaning.

---

## 16. Unknown in Prompt IR

Unknown must remain explicit when crossing into the prompt-oriented layer.

Example:

~~~text
weather = not_remembered
~~~

becomes conceptually:

~~~text
field: weather
kind: preserve_unknown
reason: not_remembered
~~~

The purpose is to prevent downstream systems from interpreting missing information as permission to invent a fact.

---

## 17. Prompt Renderer

Prompt Renderer converts Prompt IR into a model-consumable representation.

~~~ts
export type RenderedPrompt = {
  rendererId: string;
  rendererVersion: string;
  text: string;
};

export type SpaPromptRenderer = {
  id: string;
  version: string;

  render(
    ir: PromptIR
  ): RenderedPrompt;
};
~~~

SPA Core v0.1 includes a deterministic generic renderer.

Example output:

~~~text
Domain: visual_character

Instructions:
- character_impression: friendly
- character_impression: refined
- weather: sunny

Constraints:
- exact_eye_shape: preserve_unknown (not_observed)
~~~

The generic renderer is a reference representation.

Domain-specific and model-specific renderers may use different syntax.

---

## 18. Renderer Determinism

A deterministic renderer must not depend on input array ordering.

Instructions and constraints must be rendered in deterministic order.

Therefore:

~~~text
same semantic meaning
↓
same Canonical State
↓
same Prompt IR
↓
same rendered prompt
~~~

must hold for a deterministic SPA pipeline.

---

## 19. Separation of Meaning and Prompt Wording

SPA distinguishes two major architectural regions.

~~~text
MEANING LAYER

Selection
↓
Semantic Schema
↓
Resolver
↓
Semantic State
↓
Canonical State

==============================

PROMPT EXPRESSION LAYER

Translator
↓
Prompt IR
↓
Prompt Renderer
↓
AI Model
~~~

The boundary is intentional.

Changes to prompt wording should not require rewriting stored human meaning.

Changes to AI models should not require redefining user intent.

---

## 20. Domain Independence

SPA Core is domain-independent.

Applications may define different Semantic Schemas and Option Libraries while sharing the same Core architecture.

Example:

### Visual domain

~~~text
character_impression
facial_impression
expression
clothing
weather
environment
spatial_relationship
~~~

### Care or conversation domain

~~~text
emotional_state
support_preference
communication_style
conversation_intention
desired_interaction_style
~~~

The semantic fields differ.

The architecture remains shared.

---

## 21. Domain Adapter Model

SPA Core defines the shared semantic architecture.

A Domain Adapter defines how a particular application domain uses that architecture.

A Domain Adapter may provide:

- Semantic Schema
- Option Library
- domain-specific validation rules
- domain-specific Translator behavior
- domain-specific Prompt IR conventions
- model-specific renderer configuration

Conceptually:

~~~text
                 SPA Core
                    │
        ┌───────────┴───────────┐
        │                       │
 Visual Domain Adapter    Care Domain Adapter
        │                       │
        ↓                       ↓
 Visual AI Models         Language AI Models
~~~

The domain meanings differ.

The Core architecture remains shared.

Domain adapters must not silently weaken Core semantic invariants.

If a domain introduces derived meaning, that derivation must be explicit and documented.

---

## 22. Model Adapter Model

Different AI models may require different prompt formats.

SPA allows multiple model adapters to consume the same semantic meaning.

Conceptually:

~~~text
Canonical State
      ↓
Translator
      ↓
Prompt IR
      │
      ├── Renderer A → Model A
      ├── Renderer B → Model B
      └── Renderer C → Model C
~~~

Model-specific wording belongs downstream from durable semantic meaning.

Changing an AI provider should not require rewriting confirmed human meaning.

---

## 23. What SPA Core v0.1 Guarantees

For conforming deterministic implementations, SPA Core v0.1 is designed to guarantee the following.

### Semantic preservation

Selected meaning is represented independently from final prompt wording.

### Explicit uncertainty

Unknown information remains explicitly represented.

### No forced false certainty

Users may represent information as Unknown when the active Semantic Schema allows it.

### Conflict visibility

Contradictory or invalid semantic selections are surfaced rather than silently repaired.

### Schema awareness

Selections can be checked against an explicit domain Semantic Schema.

### Cardinality enforcement

Single-value and multiple-value semantic fields can be distinguished.

### Canonical determinism

Equivalent semantic meaning produces equivalent Canonical State.

### Prompt determinism

With the same deterministic Translator and Renderer:

~~~text
equivalent semantic meaning
↓
identical Prompt IR
↓
identical rendered prompt
~~~

### Model separation

Semantic meaning can survive changes in downstream AI models and prompt syntax.

---

## 24. What SPA Core v0.1 Does Not Guarantee

SPA does not guarantee deterministic AI generation.

The following statement is not guaranteed:

~~~text
same prompt
↓
same AI output
~~~

External AI models may contain:

- stochastic sampling
- nondeterministic inference behavior
- model-version differences
- provider-side changes
- hidden system instructions
- safety transformations
- generation randomness

SPA controls semantic representation and prompt construction.

It does not control the internal generation process of an external AI model.

Therefore the precise v0.1 claim is:

> SPA reduces prompt variation caused by inconsistent semantic representation and prompt construction.

It does not claim to eliminate all variation in AI-generated outputs.

---

## 25. Non-Invention Principle

SPA Core must not silently create semantic facts that were not:

- selected
- confirmed
- explicitly supplied
- derived by a declared semantic rule
- supplied by an authorized Domain Adapter

In particular:

~~~text
Unknown
~~~

must not automatically become:

~~~text
probable value
default value
visually convenient value
model-preferred value
~~~

without an explicit transformation rule.

Inference must remain distinguishable from confirmed meaning.

A downstream AI model may generate incidental detail.

That generated detail must not automatically become confirmed Semantic State.

---

## 26. Human Confirmation Principle

When a semantic contradiction or meaningful ambiguity cannot be resolved deterministically, the system should return the issue to the human-facing application.

Conceptually:

~~~text
Selection
↓
Resolver
↓
Conflict or ambiguity
↓
Human confirmation
↓
Updated Selection
↓
Resolver
↓
Resolved Semantic State
~~~

Human confirmation takes precedence over model convenience.

---

## 27. Deterministic Pipeline Principle

Where deterministic components are used, the same semantic meaning should produce the same generated prompt representation.

Conceptually:

~~~text
Equivalent Meaning
↓
Canonicalization
↓
Canonical State
↓
Deterministic Translator
↓
Prompt IR
↓
Deterministic Renderer
↓
Identical Rendered Prompt
~~~

This removes variation caused by:

- input ordering
- duplicated semantic values
- duplicated Unknown values
- arbitrary renderer ordering

Determinism applies to SPA prompt construction.

It does not imply deterministic AI generation.

---

## 28. Versioning Principle

Semantic meaning and prompt representation should be independently versionable.

Example:

~~~text
Semantic Schema
visual-character@1.0.0

Translator
spa-default-translator@1.0.0

Renderer
spa-generic-renderer@1.0.0
~~~

A future implementation should be able to record enough information to identify how a rendered prompt was produced.

Conceptually:

~~~text
Semantic State
+
Semantic Schema Version
+
Translator Version
+
Renderer Version
+
Target Model
=
Traceable Generation Context
~~~

This supports reproducibility, debugging, comparison, and migration.

---

## 29. Conformance Requirements

An implementation claiming SPA Core v0.1 conformance should satisfy the following minimum requirements.

1. Represent selectable meaning independently from prompt wording.
2. Represent Semantic State explicitly.
3. Support explicit Unknown states.
4. Validate Unknown against Semantic Schema.
5. Detect incompatible semantic selections.
6. Enforce declared semantic field cardinality.
7. Support declared semantic requirements.
8. Detect confirmed-value and Unknown conflicts.
9. Preserve semantic meaning during canonicalization.
10. Remove representational duplicates without changing meaning.
11. Canonicalize equivalent semantic representations deterministically.
12. Separate Canonical State from Prompt IR.
13. Separate Prompt IR from final rendering.
14. Preserve Unknown as an explicit downstream constraint.
15. Avoid undeclared semantic invention.
16. Produce deterministic rendered prompts when using deterministic Translator and Renderer implementations.
17. Keep model-specific prompt syntax outside the durable semantic source of truth.

---

## 30. Reference Implementation

The SPA repository contains a TypeScript reference implementation of the Core architecture.

Current reference modules include:

~~~text
src/types.ts
src/selection-resolver.ts
src/semantic-state.ts
src/semantic-schema.ts
src/canonical-state.ts
src/translator.ts
src/prompt-renderer.ts
~~~

The implementation is validated through:

~~~text
TypeScript strict type checking
+
automated semantic tests
+
deterministic pipeline tests
~~~

The specification defines the architecture.

The TypeScript implementation demonstrates one reference implementation.

---

## 31. Tested Core Behaviors

The reference implementation currently tests behaviors including:

- selected Option becomes Semantic State
- multiple compatible values are preserved
- unknown Option IDs are rejected
- explicit incompatibilities are detected
- declared requirements are enforced
- Unknown is preserved
- Semantic Schema fields are validated
- domain mismatches are rejected
- single-value cardinality conflicts are detected
- multiple-value fields preserve compatible values
- Unknown conflicts are detected
- Unknown-disallowed fields reject Unknown
- invalid Unknown fields are rejected
- canonical category order is deterministic
- canonical value order is deterministic
- duplicate values are removed
- duplicate Unknown states are removed
- equivalent Semantic States serialize identically
- canonicalization does not mutate Semantic State
- Translator does not invent unrelated semantic values
- Unknown becomes an explicit Prompt IR constraint
- equivalent meaning produces identical Prompt IR
- Renderer ordering is deterministic
- equivalent meaning produces identical rendered prompts

These tests validate the reference implementation.

They do not replace the architectural specification.

---

## 32. Core v0.1 Boundary

SPA Core v0.1 intentionally remains small.

It defines:

~~~text
Option
Selection
Semantic Schema
Selection Resolution
Semantic State
Canonical State
Prompt IR
Translation
Prompt Rendering
~~~

It does not yet standardize:

~~~text
AI provider APIs
token budgeting
multimodal binary formats
agent execution
tool calling
retrieval systems
long-term memory systems
model sampling parameters
provider-specific safety behavior
authentication
billing
deployment infrastructure
~~~

Those capabilities may be implemented as adapters or future extensions.

---

## 33. Extension Principle

Future SPA extensions should preserve the Core separation:

~~~text
Human Meaning
↓
Durable Semantic Representation
==============================
Replaceable AI Expression Layer
↓
AI Model
~~~

Extensions should not collapse semantic meaning back into model-specific prompt strings.

---

## 34. Reference Domain Strategy

SPA Core should be tested across domains with substantially different purposes.

Two initial reference domains are proposed:

### Visual Testimony

A visual domain involving:

- character appearance
- character impression
- environment
- spatial relationships
- witnessed actions
- uncertainty
- visual constraints

### Care / Conversation

A conversational support domain involving:

- emotional state
- support preference
- conversation intention
- communication preference
- interaction style
- uncertainty

If both domains can share SPA Core while defining different Domain Adapters, this provides evidence that the architecture is not limited to image prompt generation.

---

## 35. Architectural Claim

SPA Core v0.1 makes a limited but important architectural claim:

> Human meaning can be represented independently from model-specific prompt wording.

And:

> Equivalent semantic meaning can be normalized into a deterministic representation before prompt generation.

And, with deterministic translation and rendering:

> Equivalent semantic meaning can produce identical rendered prompts.

This makes prompt strategy replaceable while preserving the semantic source of truth.

---

## 36. Architectural Summary

Traditional prompt-oriented architecture:

~~~text
Human
↓
Prompt Engineering
↓
AI
~~~

SPA architecture:

~~~text
Human
↓
Meaning Selection
↓
Semantic Validation
↓
Semantic State
↓
Canonical Meaning
↓
Prompt Translation
↓
Prompt IR
↓
Prompt Rendering
↓
AI
~~~

The central architectural principle is:

> Human meaning should be durable.  
> Prompt wording should be replaceable.

SPA Core v0.1 establishes the first reference architecture and implementation for that separation.
