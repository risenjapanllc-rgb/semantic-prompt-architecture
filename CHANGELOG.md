# Changelog

All notable changes to Semantic Prompt Architecture (SPA) are documented in this file.

---

## [0.1.0] - 2026-08-16

Initial public architecture release of Semantic Prompt Architecture Core.

### Core Architecture

- Added model-independent Semantic State.
- Added explicit Semantic Schema definitions.
- Added semantic field cardinality.
- Added Selection resolution.
- Added Option compatibility validation.
- Added Option requirement validation.
- Added schema-aware Option validation.
- Added explicit Unknown representation.
- Added Unknown conflict detection.
- Added deterministic Canonical State.
- Added Prompt IR.
- Added versioned Translator contract.
- Added deterministic generic Prompt Renderer.

### Semantic Guarantees

- Preserves semantic meaning independently from prompt wording.
- Keeps semantic dimensions independent unless explicitly related.
- Prevents silent replacement of Unknown with invented facts.
- Detects conflicting confirmed and Unknown values.
- Detects invalid single-field cardinality.
- Preserves unmapped semantic values instead of silently replacing them.
- Provides deterministic canonicalization for equivalent semantic meaning.
- Supports deterministic translation and rendering.

### Domain Adapter Architecture

- Added SPA Domain Adapter architecture.
- Added Domain Adapter Contract.
- Added machine-checkable Domain Adapter Conformance Kit.
- Added checks for:
  - adapter and schema domain consistency
  - Option validity
  - Translator identity
  - Translator version
  - Translator domain preservation
  - deterministic translation
  - Unknown preservation

### Reference Domains

#### Visual Testimony

- Added Visual Testimony Semantic Schema.
- Added Visual Testimony Option Library.
- Added Visual Testimony Translator.
- Added domain-specific Non-Invention tests.
- Added end-to-end SPA pipeline tests.

#### Care / Conversation

- Added Care / Conversation Semantic Schema.
- Added Care / Conversation Option Library.
- Added Care / Conversation Translator.
- Added semantic independence tests.
- Added Unknown preservation tests.
- Added domain-specific Non-Invention tests.
- Added end-to-end SPA pipeline tests.

### Documentation

- Added SPA Core v0.1 architecture specification.
- Added SPA Domain Adapter Contract.
- Added public project README.
- Documented:
  - Option
  - Selection
  - Semantic Schema
  - Semantic State
  - Canonical State
  - Translator
  - Prompt IR
  - Prompt Renderer
  - Unknown principle
  - Non-Invention principle
  - determinism
  - Domain Adapter architecture
  - Conformance Kit

### Verification

SPA v0.1.0 is released with:

- TypeScript strict type checking
- automated semantic tests
- deterministic pipeline tests
- two reference Domain Adapters
- shared Domain Adapter conformance testing

At release preparation time, the repository test suite contains 79 passing tests.

---

## Core Principle

> Meaning is durable.  
> Domain expression is replaceable.  
> Prompt wording is generated.
