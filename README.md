# Semantic Prompt Architecture

Semantic Prompt Architecture (SPA) is an architecture for separating human meaning from model-specific prompt wording.

Instead of treating prompts as the durable source of truth, SPA preserves meaning in a model-independent semantic representation and generates prompts from that representation.

~~~text
Human Intent
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
Domain Translator
    ↓
Prompt IR
    ↓
Prompt Renderer
    ↓
AI Model
~~~

> Users select meaning.  
> Applications preserve meaning.  
> Translators express meaning.  
> Renderers format instructions.  
> AI models receive generated prompts.

The durable asset is semantic meaning.

Prompts are generated artifacts.

---

## Why SPA?

Prompt-oriented applications often store meaning directly inside prompt text.

That creates several problems:

- human intent becomes coupled to prompt wording
- changing AI models may require rewriting stored prompts
- semantic contradictions can remain hidden inside natural language
- unknown information may be silently replaced by guesses
- equivalent meaning may produce inconsistent prompt construction
- domain-specific assumptions may become mixed with reusable infrastructure

SPA introduces explicit semantic boundaries so that meaning can be preserved independently from its final expression.

---

## Core Architecture

SPA separates the meaning layer from the prompt-expression layer.

~~~text
MEANING LAYER

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

==============================

PROMPT EXPRESSION LAYER

Domain Translator
↓
Prompt IR
↓
Prompt Renderer
↓
AI Model
~~~

Each layer has a distinct responsibility.

Meaning must not be silently changed when crossing architectural boundaries.

---

## Core Concepts

### Option

An Option is a selectable semantic unit.

~~~ts
{
  id: "character-impression-refined",
  domain: "visual_testimony",
  category: "character_impression",
  label: "上品",
  semanticValue: "refined"
}
~~~

The user sees:

~~~text
上品
~~~

The semantic system stores:

~~~text
refined
~~~

The Option does not contain final model-specific prompt wording.

---

### Selection

Selection records an explicit choice.

~~~ts
{
  optionId: "character-impression-refined",
  selected: true
}
~~~

Option defines meaning.

Selection records choice.

---

### Semantic Schema

Semantic Schema defines the valid semantic structure of a domain.

A field declares:

- semantic identity
- category
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

Schema validity is explicit rather than hidden inside prompt wording.

---

### Semantic State

Semantic State is the model-independent representation of confirmed meaning.

~~~ts
{
  domain: "visual_testimony",

  values: {
    character_impression: [
      "refined"
    ]
  },

  unknowns: [
    {
      field: "weather",
      reason: "not_observed"
    }
  ]
}
~~~

Semantic State stores meaning.

It does not store final prompt text.

---

### Canonical State

Canonical State creates a deterministic representation of equivalent semantic meaning.

Canonicalization includes:

- deterministic category ordering
- deterministic value ordering
- duplicate value removal
- deterministic Unknown ordering
- duplicate Unknown removal

Therefore, equivalent semantic meaning can produce equivalent downstream representations.

---

### Translator

A Translator converts Canonical State into Prompt IR.

Different domains may express the same architectural structures differently.

For example:

~~~text
Semantic value:
anxious

Care Translator:
the person describes feeling anxious
~~~

Translation changes expression.

It must not silently invent unrelated meaning.

---

### Prompt IR

Prompt IR is an intermediate representation between semantic meaning and final prompt formatting.

Conceptually:

~~~text
Canonical State
↓
Translator
↓
Prompt IR
↓
Renderer
↓
Rendered Prompt
~~~

This keeps domain translation separate from final model-specific formatting.

---

## Unknown Is First-Class

SPA does not require false certainty.

Unknown information remains explicitly represented.

Supported reasons currently include:

~~~text
unknown
not_remembered
not_observed
not_applicable
intentionally_unspecified
~~~

For example:

~~~text
weather = not_observed
~~~

must not silently become:

~~~text
weather = sunny
~~~

Unknown is preserved through the semantic pipeline and becomes an explicit Prompt IR constraint.

---

## Non-Invention Principle

SPA must not silently create semantic facts that were not selected, confirmed, supplied by an authorized source, or derived through an explicitly declared rule.

For example:

~~~text
selected:
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
emotional_state = anxious
~~~

must not automatically become:

~~~text
panic disorder
depression
trauma
diagnosis
~~~

A Translator may change wording.

It must not treat translation as permission to invent meaning.

---

## Determinism

SPA provides deterministic semantic canonicalization.

For the deterministic reference pipeline:

~~~text
Equivalent Semantic Meaning
            ↓
   Equivalent Canonical State
            ↓
      Same Translator
            ↓
     Equivalent Prompt IR
            ↓
      Same Renderer
            ↓
   Identical Rendered Prompt
~~~

Input ordering and duplicate representation should not introduce accidental prompt variation.

---

## Domain Adapter Architecture

SPA Core is domain-independent.

Domain-specific meaning is supplied through a Domain Adapter.

~~~text
SPA Core
   ↑
   │ Domain Adapter Contract
   │
   ├── Visual Testimony
   ├── Care / Conversation
   └── Future Domains
~~~

A Domain Adapter contains three primary components:

~~~text
Domain Adapter
├── Semantic Schema
├── Option Library
└── Translator
~~~

This allows substantially different domains to share the same semantic-preservation architecture.

---

## Reference Domain: Visual Testimony

The Visual Testimony adapter demonstrates SPA in a visual-description domain.

Example semantic dimensions include:

- character impression
- facial impression
- expression
- clothing
- weather
- environment
- spatial relationship

Example:

~~~text
character_impression = refined
~~~

may be expressed by the Visual Translator as:

~~~text
refined appearance
~~~

without inventing unrelated attributes such as beauty, wealth, age, or clothing.

---

## Reference Domain: Care / Conversation

The Care / Conversation adapter demonstrates SPA in a conversational domain.

Example semantic dimensions include:

- emotional state
- support preference
- communication style
- conversation intention

Example:

~~~text
emotional_state = anxious
support_preference = listening
communication_style = gentle
~~~

may be expressed as:

~~~text
the person describes feeling anxious
prioritize listening before offering solutions
use a gentle communication style
~~~

These meanings remain independent.

Selecting a support preference does not silently create an emotional state or conversation intention.

---

## Domain Adapter Contract

SPA defines an explicit Domain Adapter Contract.

A conforming adapter should provide:

1. a stable domain identity
2. a Semantic Schema
3. schema-compatible Options
4. independent semantic dimensions
5. explicit Unknown handling
6. Non-Invention behavior
7. a versioned Translator
8. deterministic translation
9. Prompt IR output
10. compatibility with the shared SPA pipeline

See:

~~~text
docs/architecture/110-domain-adapter-contract.md
~~~

---

## Conformance Kit

SPA includes a machine-checkable Domain Adapter Conformance Kit.

It currently checks conditions including:

- adapter / schema domain consistency
- Option validity against Semantic Schema
- Translator identity
- Translator version
- Translator domain preservation
- deterministic translation
- Unknown preservation

Example:

~~~ts
const result =
  checkDomainAdapterConformance({
    domain: "visual_testimony",
    schema: visualTestimonySchema,
    options: visualTestimonyOptions,
    translator:
      createVisualTestimonyTranslator(),
  });

console.log(result.conforms);
~~~

The Conformance Kit does not attempt to mathematically prove every domain-specific Non-Invention property.

Domain-specific semantic tests remain necessary.

---

## Adding a New Domain

A new SPA Domain Adapter should normally follow this sequence:

~~~text
1. Define a stable domain identifier
2. Define the Semantic Schema
3. Define semantic fields
4. Define the Option Library
5. Validate Options against the Schema
6. Test semantic independence
7. Test Unknown behavior
8. Test Non-Invention behavior
9. Implement the Domain Translator
10. Test Translator determinism
11. Run the Conformance Kit
12. Test the end-to-end SPA pipeline
~~~

A new domain should not require changes to SPA Core unless it reveals a genuinely domain-independent requirement.

---

## Quick Development Check

Install dependencies:

~~~bash
npm install
~~~

Run TypeScript validation:

~~~bash
npm run typecheck
~~~

Run the test suite:

~~~bash
npm test
~~~

The current reference implementation includes tests for:

- Selection resolution
- semantic requirements
- incompatibility handling
- cardinality
- Unknown preservation
- Unknown conflicts
- Semantic Schema validation
- canonicalization
- deterministic translation
- Prompt IR
- rendering
- Visual Testimony
- Care / Conversation
- Domain Adapter conformance

---

## Repository Structure

~~~text
src/
├── canonical-state.ts
├── prompt-renderer.ts
├── selection-resolver.ts
├── semantic-schema.ts
├── semantic-state.ts
├── translator.ts
├── types.ts
│
├── conformance/
│   ├── domain-adapter.ts
│   └── index.ts
│
└── domains/
    ├── visual-testimony/
    └── care-conversation/

tests/
└── *.test.ts

docs/
└── architecture/
    ├── 100-spa-core-v0.1.md
    └── 110-domain-adapter-contract.md
~~~

---

## SPA Core v0.1

SPA Core v0.1 establishes the initial architecture around:

~~~text
Option
↓
Selection
↓
Semantic Schema
↓
Resolution
↓
Semantic State
↓
Canonical State
↓
Translator
↓
Prompt IR
↓
Renderer
~~~

Two substantially different reference domains currently operate on the shared Core:

~~~text
Visual Testimony
Care / Conversation
~~~

Both are also checked through the shared Domain Adapter Conformance Kit.

---

## Current Status

SPA is currently an early reference implementation and architectural specification.

The v0.1 work establishes:

- model-independent semantic state
- explicit semantic schemas
- deterministic canonicalization
- explicit Unknown representation
- semantic conflict resolution
- Prompt IR
- versioned Translators
- deterministic rendering
- Domain Adapter architecture
- two reference Domain Adapters
- a Domain Adapter Contract
- a machine-checkable Conformance Kit

The project should be treated as evolving architecture rather than a finalized universal standard.

---

## Core Principle

> Meaning is durable.  
> Domain expression is replaceable.  
> Prompt wording is generated.
