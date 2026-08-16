# SPA Selection UI

## Purpose

Selection UI allows people to express meaning without requiring them to write AI prompts.

The user selects human-understandable semantic concepts.

The system preserves those selections as structured meaning and later translates them into model-specific instructions.

The Selection UI is not a prompt editor.

It is an interface for expressing and confirming meaning.

---

## Core Flow

Human Intention
↓
Selection UI
↓
Option
↓
Selection
↓
Semantic State

Prompt generation happens after this process.

The user does not need to know how the target AI model should be prompted.

---

## Core Principles

### 1. Human-facing language

Options should use language that people can understand naturally.

The UI should not expose model-specific prompt syntax.

For example:

- 上品
- 穏やか
- 親しみやすい
- 華やか
- 素朴

These human-facing concepts are preferable to asking the user to write model-specific prompt instructions.

---

### 2. Meaning before wording

The purpose of a selection is to identify meaning.

The exact wording sent to an AI model belongs to the Translator layer.

Example:

User sees:
上品

Semantic meaning:
refined

Model-specific expression:
generated later by Translator

---

### 3. Structured choice before free prompt entry

When a semantic concept can reasonably be represented by structured options, SPA should prefer structured selection over unrestricted prompt writing.

Free text may still be used when structured options cannot adequately express the intended meaning.

Free text is an extension mechanism, not the primary architecture.

---

### 4. Unknown must be selectable

The user must be allowed to say that something is:

- unknown
- not remembered
- not observed
- not applicable
- intentionally unspecified

The UI must not force a false choice merely because the system has available options.

---

### 5. Selection must not create facts

Selecting one semantic attribute must not silently imply another.

For example:

上品

must not automatically mean:

- 美人
- 裕福
- 細身
- 若い
- 高級な服装

unless those meanings are separately represented and explicitly selected or confirmed.

---

### 6. Domain-specific options, shared architecture

SPA defines the Selection UI architecture.

Applications define their own semantic option libraries.

Visual Testimony may define:

- character impression
- facial impression
- clothing
- environment
- spatial relationship

Care or conversation applications may define:

- emotional state
- support preference
- conversation intention
- communication style

The domains may differ.

The Selection → Semantic State architecture remains shared.
