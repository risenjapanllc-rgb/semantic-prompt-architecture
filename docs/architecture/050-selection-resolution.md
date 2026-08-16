# SPA Selection Resolution

## Purpose

Selection Resolution converts raw user selections into validated semantic selections before Semantic State is constructed.

Its purpose is to preserve human meaning while preventing contradictions, accidental implications, and invalid combinations from silently entering Semantic State.

The Selection Resolver is not a prompt generator.

It operates entirely in the semantic layer.

---

## Core Flow

Human
↓
Selection UI
↓
Raw Selections
↓
Selection Resolver
↓
Validated Selections
↓
Semantic State
↓
Canonical State
↓
Translator
↓
Prompt

---

## Responsibilities

The Selection Resolver may:

- verify that selected Option IDs exist
- detect explicitly declared incompatibilities
- enforce required dependencies
- detect conflicts between descriptive values and Unknown states
- preserve multiple compatible selections
- return validation issues that require human confirmation

The Selection Resolver must not:

- invent semantic values
- infer unselected attributes
- rewrite human meaning
- generate model-specific prompt wording
- silently resolve meaningful ambiguity

---

## Resolution Types

~~~ts
export type ResolutionIssueType =
  | "unknown_option"
  | "incompatible_selection"
  | "missing_requirement"
  | "unknown_conflict"
  | "ambiguous_selection";
~~~

A Resolution Issue describes a semantic problem that should be handled before durable Semantic State is created.

---

## Resolution Issue

~~~ts
export type ResolutionIssue = {
  type: ResolutionIssueType;

  optionIds: string[];

  category?: string;

  message: string;
};
~~~

The message is human-facing.

It should explain the issue without exposing model-specific prompt logic.

---

## Resolution Result

~~~ts
export type SelectionResolutionResult = {
  validSelections: SpaSelection[];

  issues: ResolutionIssue[];

  requiresConfirmation: boolean;
};
~~~

A Selection Resolution Result separates selections that can safely proceed from issues that require correction or confirmation.

---

## Compatible Selections

Multiple selections may coexist when they represent independent or compatible meanings.

Example:

~~~text
Character Impression:
- 上品
- 親しみやすい

Emotional Expression:
- 穏やか
~~~

These values do not automatically conflict.

SPA must not treat semantic difference as semantic contradiction.

---

## Explicit Incompatibility

Incompatibility should normally be declared by the domain Option Library.

Example:

~~~ts
{
  id: "expression-smiling",
  incompatibleWith: [
    "expression-expressionless"
  ]
}
~~~

If both are selected, the Resolver should produce an issue.

Conceptually:

~~~text
smiling
+
expressionless
↓
incompatible_selection
↓
human confirmation or correction
~~~

The Resolver must not silently choose one.

---

## Requirements

Some Options may require another semantic selection.

Example:

~~~ts
{
  id: "expression-tears-visible",
  requires: [
    "face-visible"
  ]
}
~~~

If the required semantic condition is absent, the Resolver may return:

~~~text
missing_requirement
~~~

Requirements must be domain-defined.

They must not be invented dynamically merely because an AI model prefers a particular prompt structure.

---

## Unknown Conflict

Unknown is an explicit semantic state.

A descriptive value and an Unknown state for the same semantic field should not silently coexist when they contradict each other.

Example:

~~~text
Weather:
- sunny
- not remembered
~~~

This requires resolution.

The system must not assume that one value is more authoritative without a domain rule or human confirmation.

---

## Unknown Is Not a Default

Failure to select an Option does not automatically mean Unknown.

These states are different:

~~~text
No selection yet
Unknown
Not remembered
Not observed
Intentionally unspecified
~~~

Applications should preserve this distinction when it matters to the domain.

---

## Ambiguity

Some combinations are not logically incompatible but may be ambiguous.

Example:

~~~text
Character Impression:
- 素朴
- 華やか
~~~

Depending on the domain, both may be valid.

The Resolver must not declare them contradictory merely because they appear semantically different.

If the domain requires clarification, it should produce:

~~~text
ambiguous_selection
~~~

and request human confirmation.

---

## No Silent Semantic Expansion

Suppose the user selects:

~~~text
上品
~~~

The Resolver must not add:

~~~text
美人
裕福
若い
細身
高級な服装
~~~

unless those values were independently selected, confirmed, or explicitly derived by a documented domain rule that preserves the intended meaning.

Selection Resolution validates meaning.

It does not expand meaning.

---

## Human Confirmation

When a meaningful conflict cannot be resolved deterministically, SPA should return the issue to the human-facing application.

Conceptually:

~~~text
Raw Selections
↓
Resolver
↓
Conflict detected
↓
Human confirmation
↓
Updated Selection
↓
Resolver
↓
Validated Selection
~~~

Human confirmation takes precedence over model convenience.

---

## Deterministic Resolution

Where possible, Selection Resolution should be deterministic.

The same:

~~~text
Option Library
+
Raw Selections
+
Resolution Rules
~~~

should produce the same semantic validation result.

This reduces prompt variability before prompt generation even begins.

---

## Separation from AI Models

Selection Resolution belongs before model-specific translation.

~~~text
Selection Resolution
        |
        | semantic rules
        v
Semantic State
        |
        v
Canonical State
        |
        | model boundary
        v
Translator
        |
        v
AI Model
~~~

Changing the target AI model must not change whether two human semantic selections are logically compatible.

---

## Core Principle

Selection Resolution protects meaning before generation.

The system should resolve structural problems early.

It should return meaningful ambiguity to the human.

It should never use prompt engineering as a substitute for semantic clarity.

Validate meaning first.

Translate meaning later.
