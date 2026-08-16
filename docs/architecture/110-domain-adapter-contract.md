# SPA Domain Adapter Contract v0.1

Status: Draft Specification  
Version: 0.1  
Architecture: Semantic Prompt Architecture (SPA)

---

## 1. Purpose

A SPA Domain Adapter connects domain-specific human meaning to the domain-independent SPA Core.

SPA Core defines the shared semantic processing architecture.

A Domain Adapter defines the meaning available within a particular application domain.

Examples include:

- Visual Testimony
- Care / Conversation
- future domain-specific applications

The Domain Adapter boundary allows SPA Core to remain reusable without forcing unrelated domains to share the same semantic vocabulary.

---

## 2. Architectural Position

A Domain Adapter sits between domain-specific meaning and SPA Core processing.

~~~text
Human
↓
Domain UI
↓
Domain Option Library
↓
Selection
↓
Domain Semantic Schema
↓
SPA Core Resolver
↓
Semantic State
↓
Canonical State
↓
Domain Translator
↓
Prompt IR
↓
Renderer
↓
AI Model
~~~

The Domain Adapter supplies domain meaning.

SPA Core preserves and processes that meaning.

---

## 3. Required Components

A SPA Domain Adapter v0.1 consists of three primary components:

~~~text
Domain Adapter
├── Semantic Schema
├── Option Library
└── Translator
~~~

These components have different responsibilities.

### Semantic Schema

Defines the semantic fields that exist in the domain.

### Option Library

Defines selectable semantic values available to users or applications.

### Translator

Expresses canonical semantic meaning in a prompt-oriented representation.

The three responsibilities must remain conceptually separate.

---

## 4. Domain Identity

Every Domain Adapter must have a stable domain identifier.

Example:

~~~text
visual_testimony
~~~

or:

~~~text
care_conversation
~~~

The same domain identifier must be used consistently by:

- Semantic Schema
- Options
- Semantic State
- Canonical State
- Prompt IR

A Domain Adapter must not silently move semantic values between unrelated domains.

---

## 5. Semantic Schema Contract

A Domain Adapter must provide a Semantic Schema compatible with SPA Core.

Conceptually:

~~~ts
export type SemanticSchema = {
  id: string;
  version: string;
  domain: string;
  fields: SemanticField[];
};
~~~

Each field defines:

- field identity
- semantic category
- cardinality
- whether Unknown is allowed

Example:

~~~ts
{
  id: "weather",
  category: "weather",
  cardinality: "single",
  unknownAllowed: true
}
~~~

The Schema defines valid semantic structure.

It must not contain model-specific prompt wording.

---

## 6. Option Library Contract

A Domain Adapter may provide a reusable Option Library.

Each Option must represent one selectable semantic unit.

Conceptually:

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

An Option must belong to:

1. the active domain
2. a category defined by the active Semantic Schema

Human-facing labels and internal semantic values must remain distinguishable.

Example:

~~~text
label:
上品

semanticValue:
refined
~~~

The label is not the final prompt.

The semantic value is not model-specific prompt wording.

---

## 7. Independent Semantic Dimensions

A Domain Adapter should represent independent meanings as independent semantic fields or Options.

For example:

~~~text
refined
~~~

must not automatically imply:

~~~text
beautiful
wealthy
young
slim
luxury clothing
~~~

Likewise:

~~~text
support_preference = listening
~~~

must not automatically imply:

~~~text
emotional_state = sad
conversation_intention = express_feelings
~~~

unless such relationships are explicitly represented by a declared domain rule and confirmed according to the application contract.

Semantic convenience must not override semantic accuracy.

---

## 8. Non-Invention Contract

A Domain Adapter must follow the SPA Non-Invention Principle.

It must not silently create semantic facts that were not:

- explicitly selected
- explicitly confirmed
- supplied by an authorized domain source
- derived by an explicitly declared rule

A Translator may change expression.

It must not silently expand meaning.

Conceptually:

~~~text
Semantic meaning:
refined

Allowed translation:
refined appearance

Not automatically allowed:
beautiful wealthy young woman
~~~

Similarly:

~~~text
Semantic meaning:
anxious

Allowed translation:
the person describes feeling anxious

Not automatically allowed:
the person has panic disorder
~~~

Translation is expression.

Translation is not permission for semantic invention.

---

## 9. Unknown Contract

Unknown remains a first-class semantic state across Domain Adapters.

A Domain Adapter must not replace Unknown with a guessed value.

Supported SPA Core reasons include:

~~~text
unknown
not_remembered
not_observed
not_applicable
intentionally_unspecified
~~~

If a field permits Unknown, the Domain Adapter must allow that absence of confirmed meaning to remain explicit.

Conceptually:

~~~text
weather = not_observed
~~~

must not become:

~~~text
weather = sunny
~~~

A Domain Translator must preserve Unknown as a Prompt IR constraint.

---

## 10. Translator Contract

A Domain Adapter may provide a domain-specific Translator implementing the SPA Translator contract.

Conceptually:

~~~ts
export type SpaTranslator = {
  id: string;
  version: string;

  translate(
    state: CanonicalSemanticState
  ): PromptIR;
};
~~~

The Translator receives Canonical State.

It returns Prompt IR.

The Translator must not mutate the Canonical State.

The Translator should have a stable identifier and explicit version.

---

## 11. Translator Responsibilities

A Domain Translator is responsible for expression-level transformation.

It may:

- convert canonical semantic values into domain-appropriate wording
- preserve semantic field identity
- preserve Unknown constraints
- produce deterministic Prompt IR
- provide versioned translation behavior

It must not:

- invent unrelated facts
- silently remove confirmed meaning
- silently resolve contradictions
- convert Unknown into guessed meaning
- depend on incidental input ordering

---

## 12. Fallback Translation

When a Domain Translator encounters a semantic value for which no specialized wording exists, the safe default is to preserve the semantic value rather than invent a replacement.

Conceptually:

~~~text
future_value
↓
future_value
~~~

is preferable to an unsupported semantic guess.

Fallback behavior should preserve information.

It should not manufacture interpretation.

---

## 13. Determinism Contract

For a deterministic Domain Translator:

> Equivalent Canonical States must produce equivalent Prompt IR.

Input ordering and duplicate representation must not change translated meaning.

Conceptually:

~~~text
Canonical State A ─┐
Canonical State B ─┼─→ Same Domain Translator
Canonical State C ─┘
                           ↓
                    Equivalent Prompt IR
~~~

This allows prompt variation to be controlled at explicit architectural boundaries.

---

## 14. Renderer Independence

A Domain Adapter does not need to own the final Renderer.

The architecture permits:

~~~text
Domain Translator
↓
Prompt IR
↓
Generic Renderer
~~~

and also:

~~~text
Domain Translator
↓
Prompt IR
↓
Model-Specific Renderer
~~~

This separation allows the same semantic meaning and Prompt IR architecture to target different AI systems.

Domain meaning must not depend on one renderer implementation.

---

## 15. Visual Testimony Adapter

The Visual Testimony Domain Adapter demonstrates SPA in a visual-description domain.

Its architecture includes:

~~~text
Visual Testimony Schema
↓
Visual Testimony Options
↓
SPA Core
↓
Visual Testimony Translator
↓
Prompt IR
~~~

Example semantic meaning:

~~~text
character_impression = refined
weather = sunny
~~~

Example translated expression:

~~~text
character_impression = refined appearance
weather = sunny weather
~~~

The translation changes wording.

It does not add unrelated visual facts.

---

## 16. Care / Conversation Adapter

The Care / Conversation Domain Adapter demonstrates SPA in a conversational domain.

Its architecture includes:

~~~text
Care Conversation Schema
↓
Care Conversation Options
↓
SPA Core
↓
Care Conversation Translator
↓
Prompt IR
~~~

Example semantic meaning:

~~~text
emotional_state = anxious
support_preference = listening
communication_style = gentle
~~~

Example translated expression:

~~~text
the person describes feeling anxious
prioritize listening before offering solutions
use a gentle communication style
~~~

The Translator expresses the selected meaning as interaction guidance without inventing diagnoses or unrelated emotional facts.

---

## 17. Cross-Domain Isolation

Domain Adapters must remain semantically isolated unless an explicit composition mechanism is defined.

For example:

~~~text
visual_testimony.character_impression
~~~

must not automatically become:

~~~text
care_conversation.emotional_state
~~~

Likewise, Care semantics must not silently create Visual semantics.

Shared SPA Core architecture does not mean shared domain meaning.

---

## 18. Core Independence

SPA Core must not require knowledge of specific domain vocabularies.

Core components operate on generic structures such as:

- Option
- Selection
- Semantic Schema
- Semantic State
- Canonical State
- Prompt IR

Domain-specific values belong outside the Core.

Conceptually:

~~~text
SPA Core
  ↑
  │ generic contract
  │
Domain Adapter
  ├── domain schema
  ├── domain options
  └── domain translator
~~~

This boundary is required for extensibility.

---

## 19. Adding a New Domain

A new SPA Domain Adapter should normally follow this sequence:

~~~text
1. Define stable domain identifier
2. Define Semantic Schema
3. Define semantic fields
4. Define Option Library
5. Validate Options against Schema
6. Test semantic independence
7. Test Unknown behavior
8. Test Non-Invention behavior
9. Implement Domain Translator
10. Test Translator determinism
11. Test end-to-end SPA pipeline
~~~

A new domain should not require modification of SPA Core unless it reveals a genuinely domain-independent architectural requirement.

---

## 20. Conformance Requirements

A Domain Adapter conforms to SPA Domain Adapter Contract v0.1 when:

1. it has a stable domain identity
2. its Options conform to its Semantic Schema
3. semantic dimensions remain independently represented
4. Unknown remains explicit where supported
5. semantic conflicts are delegated to or validated through SPA resolution rules
6. Semantic State remains model-independent
7. its Translator operates from Canonical State
8. its Translator produces Prompt IR
9. its Translator preserves Unknown constraints
10. its Translator does not invent unrelated semantic meaning
11. equivalent canonical meaning produces equivalent translated representation
12. the adapter can participate in the SPA pipeline without embedding domain vocabulary into SPA Core

---

## 21. Current Reference Adapters

SPA currently contains two reference Domain Adapters:

~~~text
Visual Testimony
Care / Conversation
~~~

They intentionally represent substantially different semantic domains.

Their shared use of SPA Core demonstrates that the architecture is not limited to one prompt category or one AI use case.

---

## 22. Architectural Invariant

The central Domain Adapter invariant is:

> Domain-specific meaning may vary.  
> The semantic preservation architecture remains shared.

Therefore:

~~~text
Different Domain
↓
Different Schema
↓
Different Options
↓
Different Translator

but

Selection
↓
Resolution
↓
Semantic State
↓
Canonical State
↓
Prompt IR
~~~

remains structurally consistent.

---

## 23. Core Principle

A Domain Adapter does not teach SPA Core what a domain means.

It supplies domain meaning through explicit contracts.

SPA Core then preserves, validates, canonicalizes, and transports that meaning through stable architectural boundaries.

The result is:

> Meaning is durable.  
> Domain expression is replaceable.  
> Prompt wording is generated.
