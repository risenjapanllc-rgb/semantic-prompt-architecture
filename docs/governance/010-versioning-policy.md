# SPA Versioning Policy

Status: Draft Governance Policy  
Applies to: Semantic Prompt Architecture (SPA)

---

## 1. Purpose

This document defines how Semantic Prompt Architecture versions should evolve.

SPA distinguishes between:

- Core architecture
- Domain Adapters
- documentation and validation evidence
- compatibility-preserving implementation improvements
- breaking semantic contract changes

Version numbers should communicate changes to architectural contracts rather than merely the amount of code added.

---

## 2. Baseline

The first public architecture release is:

~~~text
SPA v0.1.0
~~~

The v0.1.0 baseline establishes:

- Option
- Selection
- Semantic Schema
- Selection Resolver
- Semantic State
- Canonical State
- Translator
- Prompt IR
- Prompt Renderer
- Unknown preservation
- Non-Invention principles
- Domain Adapter Contract
- Domain Adapter Conformance Kit

After v0.1.0, a third domain was added:

~~~text
Research Evidence
~~~

That domain was implemented without modifying SPA Core.

The third-domain validation therefore provides evidence that Domain Adapter expansion does not by itself require a Core version change.

---

## 3. Versioning Principle

SPA versions should reflect semantic and architectural compatibility.

The central rule is:

> A new domain is not automatically a new Core version.

Likewise:

> More code is not automatically a larger version.

Version changes should correspond to changes in contracts, behavior, guarantees, or published architecture.

---

## 4. PATCH Version

A PATCH version is appropriate for backward-compatible corrections or clarifications that do not introduce a new architectural capability.

Examples may include:

- documentation corrections
- typo fixes
- clearer specification wording
- additional validation records
- test corrections that do not change intended behavior
- implementation fixes that restore already-documented behavior
- additional examples
- non-breaking internal refactoring

Conceptually:

~~~text
v0.1.0
↓
v0.1.1
~~~

means:

~~~text
same architectural contract
+
corrections or clarifications
~~~

A PATCH release must not silently redefine existing semantic meaning.

---

## 5. MINOR Version

A MINOR version is appropriate when SPA gains a new backward-compatible architectural capability or published contract.

Examples may include:

- a new general Core abstraction
- a new optional semantic mechanism
- a new backward-compatible contract field
- a new standardized pipeline capability
- a new general conformance requirement
- a new extension mechanism shared across domains

Conceptually:

~~~text
v0.1.x
↓
v0.2.0
~~~

means:

~~~text
existing contracts remain usable
+
new general architectural capability
~~~

A new Domain Adapter alone does not normally justify a MINOR Core release.

---

## 6. MAJOR Version

A MAJOR version is appropriate when an existing public architectural contract changes incompatibly.

Examples may include:

- changing the meaning of an existing Core type
- removing a published Core field
- changing required Translator behavior incompatibly
- changing Canonical State semantics incompatibly
- changing Unknown semantics incompatibly
- changing Domain Adapter requirements so existing conforming adapters no longer conform
- changing deterministic guarantees in a breaking way

Conceptually:

~~~text
v0.x
↓
v1.0.0
~~~

should occur only when SPA is ready to make a stronger stability commitment.

After 1.0.0, incompatible public contract changes require a new MAJOR version.

---

## 7. Domain Adapter Versioning

Domain Adapters have their own identities and versions.

A Domain Adapter may evolve without requiring SPA Core to evolve.

For example:

~~~text
SPA Core v0.1
│
├── Visual Testimony Adapter
├── Care / Conversation Adapter
└── Research Evidence Adapter
~~~

Each adapter may add or refine domain vocabulary while continuing to use the same Core architecture.

Domain-specific change should remain domain-specific whenever possible.

---

## 8. Core Expansion Gate

SPA Core should not be expanded merely because one domain needs a feature.

Before adding a new Core abstraction, the following question must be asked:

> Is this requirement genuinely cross-domain, or is it domain-specific?

A proposed Core capability should normally satisfy multiple conditions:

1. It cannot be represented cleanly using the existing Core.
2. It represents semantic architecture rather than prompt wording.
3. It is useful beyond one narrow domain.
4. Keeping it domain-specific would create duplicated architectural mechanisms.
5. Its behavior can be specified independently of a particular AI model.
6. Its compatibility implications can be tested.
7. It can be incorporated without weakening Non-Invention or Unknown preservation.

If these conditions are not met, the capability should normally remain in a Domain Adapter.

---

## 9. Evidence Before Core Expansion

Core evolution should be evidence-driven.

Preferred evidence includes:

- multiple domains encountering the same limitation
- repeated adapter-level workarounds
- inability to express a semantic distinction without violating Core invariants
- conformance failures revealing a general architectural gap
- ambiguity that cannot be resolved at the domain layer
- a reproducible semantic preservation problem

One domain requesting convenience is not sufficient evidence by itself.

---

## 10. Non-Invention Compatibility

No version change may silently weaken the Non-Invention Principle.

A newer version must not reinterpret existing semantic values as additional facts unless that behavior is:

- explicitly specified
- versioned
- testable
- visible at the appropriate architectural layer

For example:

~~~text
refined
~~~

must not acquire an implicit meaning such as:

~~~text
beautiful
wealthy
young
~~~

merely because a newer Translator finds those words useful.

Semantic expansion must remain explicit.

---

## 11. Unknown Compatibility

Unknown is a first-class semantic state.

A newer SPA version must not silently convert:

~~~text
unknown
not_remembered
not_observed
not_applicable
intentionally_unspecified
~~~

into confirmed semantic values.

Changes to Unknown representation or behavior are architectural changes and must be versioned accordingly.

---

## 12. Determinism Compatibility

Deterministic canonicalization is part of the SPA architectural contract.

Equivalent semantic meaning should continue to produce equivalent canonical representation.

For deterministic pipelines, equivalent semantic meaning should continue to produce identical Prompt IR and rendered prompt output.

A change that intentionally alters these guarantees must be treated as an architectural compatibility decision rather than an incidental implementation detail.

---

## 13. Conformance Compatibility

The Domain Adapter Conformance Kit represents executable architectural expectations.

When new conformance checks are introduced, they must be classified as either:

~~~text
clarification of an existing requirement
~~~

or:

~~~text
new architectural requirement
~~~

A clarification may qualify for PATCH treatment if conforming implementations were already expected to satisfy the behavior.

A genuinely new required contract may justify a MINOR or MAJOR change depending on compatibility.

---

## 14. Validation Records

Validation records are evidence about architecture.

They are not automatically architecture changes.

For example:

~~~text
Third Domain Validation
↓
Research Evidence succeeds
↓
SPA Core unchanged
~~~

strengthens confidence in the existing architecture.

It does not by itself require a new Core version.

Validation may instead reveal evidence that later justifies architectural evolution.

---

## 15. Pre-1.0 Policy

SPA is currently pre-1.0.

During the pre-1.0 period, architecture may still evolve significantly.

However, SPA should still use version numbers deliberately.

The project should avoid treating pre-1.0 status as permission for uncontrolled breaking changes.

Breaking changes should be:

- explicit
- documented
- tested
- justified by architectural evidence

The purpose of the pre-1.0 period is to discover stable boundaries.

---

## 16. Path Toward 1.0

SPA should not reach 1.0 merely because enough time has passed.

A 1.0 release should represent confidence that the public Core contracts are sufficiently stable for external Domain Adapters to depend on them.

Evidence toward 1.0 may include:

- multiple substantially different Domain Adapters
- successful external or independent adapter implementation
- stable Core boundaries across repeated validation
- mature conformance testing
- documented compatibility policy
- migration guidance
- clear public API boundaries
- absence of unresolved foundational semantic problems

The third-domain validation is one piece of this evidence.

It is not, by itself, sufficient evidence for 1.0.

---

## 17. Release Decision Questions

Before creating a release, maintainers should ask:

1. Did SPA Core change?
2. Did a published contract change?
3. Did semantic behavior change?
4. Did Unknown behavior change?
5. Did Non-Invention behavior change?
6. Did deterministic behavior change?
7. Did Domain Adapter conformance requirements change?
8. Are existing adapters still compatible?
9. Is the change domain-specific or cross-domain?
10. Is there test or validation evidence for the change?

The answers determine the appropriate release level.

---

## 18. Current Post-v0.1.0 Assessment

After SPA v0.1.0:

- Research Evidence was added as a third Domain Adapter.
- the existing Domain Adapter Contract remained usable
- the existing Conformance Kit remained usable
- the existing Unknown mechanism remained usable
- the existing cardinality mechanism remained usable
- the existing deterministic pipeline remained usable
- SPA Core required no modification
- repository verification reached 89 passing tests

Therefore the third-domain addition does not currently provide evidence that SPA Core requires v0.2.0.

It instead provides evidence that the v0.1 Core boundary is holding.

---

## 19. Governing Principle

SPA Core should evolve when reality exposes a shared semantic requirement that the existing architecture cannot represent cleanly.

It should not evolve merely because expansion is possible.

The governing direction is:

~~~text
New Domain
    ↓
Use Existing Core
    ↓
Observe Friction
    ↓
Determine Whether Friction Is Domain-Specific
    ↓
If Domain-Specific → Keep It in the Adapter
    ↓
If Cross-Domain → Gather Evidence
    ↓
Specify General Requirement
    ↓
Test Compatibility
    ↓
Then Consider Core Evolution
~~~

This keeps SPA Core small, explicit, and evidence-driven.
