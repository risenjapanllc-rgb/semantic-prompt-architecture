# SPA Core Expansion Proposal Process

Status: Draft Governance Policy  
Abbreviation: CEP  
Applies to: Semantic Prompt Architecture Core

---

## 1. Purpose

A Core Expansion Proposal (CEP) is the formal mechanism for proposing a new capability or change to SPA Core.

The purpose of CEP is to prevent SPA Core from expanding merely because a feature is useful to one application or one Domain Adapter.

SPA Core should evolve only when there is evidence of a general semantic architecture requirement.

---

## 2. Governing Question

Every CEP must answer:

> Why must this capability exist in SPA Core rather than in a Domain Adapter?

A proposal that cannot answer this question clearly should normally remain domain-specific.

---

## 3. Core Expansion Is Exceptional

The default architectural decision is:

~~~text
New requirement
      ↓
Domain Adapter
~~~

Core expansion is considered only when the existing Core cannot represent a genuinely shared requirement cleanly.

Conceptually:

~~~text
Domain A friction ───┐
                     │
Domain B friction ───┼──→ Shared architectural limitation?
                     │
Domain C friction ───┘
                              │
                         Yes ─┴─ No
                          ↓       ↓
                        CEP     Adapter
~~~

A single-domain convenience request is not normally sufficient evidence.

---

## 4. CEP Scope

A CEP may propose changes involving:

- Core semantic types
- Semantic Schema
- Selection Resolution
- Semantic State
- Canonical State
- Unknown representation
- Translator contracts
- Prompt IR
- Prompt Renderer contracts
- Domain Adapter Contract
- Conformance requirements
- deterministic guarantees
- semantic preservation guarantees
- general extension mechanisms

A CEP should not be used merely to add:

- domain vocabulary
- domain Options
- domain-specific translation wording
- model-specific prompt wording
- application UI behavior
- one application's business rules

Those normally belong outside SPA Core.

---

## 5. Required Evidence

A CEP must provide evidence that the proposed capability is architectural rather than merely convenient.

Preferred evidence includes one or more of:

1. Multiple domains encounter the same limitation.
2. Multiple adapters independently implement equivalent workarounds.
3. Existing Core types cannot preserve a required semantic distinction.
4. Existing Core behavior creates an unavoidable ambiguity.
5. A general Non-Invention guarantee cannot be expressed with current mechanisms.
6. A general Unknown-preservation requirement cannot be expressed with current mechanisms.
7. Conformance testing exposes the same architectural gap across domains.
8. A semantic invariant cannot be enforced without duplicating Core-like logic in adapters.

Evidence should be reproducible where possible.

---

## 6. Required Proposal Structure

Every CEP must contain the following sections:

~~~text
1. Summary
2. Problem
3. Cross-Domain Evidence
4. Existing Core Limitation
5. Proposed Core Abstraction
6. Alternatives Considered
7. Semantic Preservation Analysis
8. Non-Invention Analysis
9. Unknown Analysis
10. Determinism Analysis
11. Compatibility Impact
12. Domain Adapter Impact
13. Conformance Impact
14. Test Plan
15. Migration Plan
16. Versioning Assessment
17. Rejection Criteria
18. Decision
~~~

A proposal may include additional sections when necessary.

---

## 7. Problem Before Solution

A CEP must define the semantic problem before proposing a type, API, or implementation.

Bad sequence:

~~~text
We should add a new Core interface.
↓
Find reasons to use it.
~~~

Required sequence:

~~~text
Observed semantic problem
↓
Evidence
↓
Existing Core limitation
↓
General requirement
↓
Possible abstractions
↓
Compatibility analysis
↓
Proposed Core change
~~~

The architecture should emerge from demonstrated need.

---

## 8. Cross-Domain Evidence

Cross-domain evidence is a central CEP requirement.

The proposal should identify which domains expose the same underlying architectural problem.

For example:

~~~text
Domain A
  ↓
cannot represent semantic relation X

Domain B
  ↓
cannot represent semantic relation X

Therefore:
  ↓
possible shared Core limitation
~~~

The domains do not need to use identical vocabulary.

They must share the same underlying architectural requirement.

---

## 9. Existing Core Limitation

A CEP must identify exactly why the current Core is insufficient.

It must distinguish between:

~~~text
cannot represent
~~~

and:

~~~text
can represent, but less conveniently
~~~

Core expansion is much easier to justify for the first case than the second.

The proposal should reference the existing Core contract or invariant involved.

---

## 10. Proposed Core Abstraction

The proposed abstraction must be domain-independent.

It should be expressible without requiring vocabulary from the domains that motivated it.

For example, a proposed Core abstraction should not require SPA Core to understand concepts such as:

~~~text
weather
anxiety
peer_reviewed
facial_expression
citation_style
~~~

Those are domain meanings.

Core abstractions should describe general semantic structure.

---

## 11. Alternatives Considered

Every CEP must consider alternatives.

At minimum:

- keep the capability entirely in Domain Adapters
- use existing Core structures differently
- add a domain-level helper
- extend the Conformance Kit without changing Core
- add an optional adapter contract
- defer the change until more evidence exists

The proposal should explain why the selected approach is preferable.

---

## 12. Semantic Preservation Analysis

A CEP must explain whether the proposal changes how meaning is represented or preserved.

The analysis must answer:

- Can existing Semantic States retain their meaning?
- Can existing Options retain their meaning?
- Does canonicalization change?
- Does translation semantics change?
- Can old and new representations be distinguished?
- Is information lost during migration?

A Core change must not silently reinterpret stored meaning.

---

## 13. Non-Invention Analysis

Every CEP must explicitly analyze the Non-Invention Principle.

The proposal must answer:

> Could this change cause SPA to create semantic facts that were not selected, confirmed, explicitly derived, or supplied by an authorized adapter?

If yes, the proposal must define safeguards.

If those safeguards cannot be made explicit and testable, the proposal should not be accepted.

---

## 14. Unknown Analysis

Every CEP must analyze Unknown behavior.

The proposal must determine whether it affects:

- unknown
- not_remembered
- not_observed
- not_applicable
- intentionally_unspecified

Unknown must not become an implicit permission to invent information.

If Unknown semantics change, the change must be explicit and versioned.

---

## 15. Determinism Analysis

A CEP must identify its effect on deterministic behavior.

The proposal must answer:

- Does canonical serialization remain deterministic?
- Do equivalent Semantic States remain equivalent?
- Does Prompt IR remain deterministic where required?
- Does rendered prompt output remain deterministic where required?
- Are new ordering rules necessary?

Any intentional weakening of deterministic guarantees must be treated as an architectural compatibility change.

---

## 16. Compatibility Impact

Every CEP must classify compatibility impact.

Possible classifications include:

~~~text
backward-compatible
conditionally backward-compatible
breaking
unknown
~~~

The proposal must identify affected public contracts.

Examples:

- TypeScript types
- serialized Semantic State
- Semantic Schema
- Translator interface
- Prompt IR
- Domain Adapter Contract
- Conformance behavior

---

## 17. Domain Adapter Impact

A CEP must evaluate all maintained reference domains.

At minimum, current reference domains include:

~~~text
Visual Testimony
Care / Conversation
Research Evidence
~~~

For each domain, the proposal should determine:

- no change required
- optional adoption
- migration required
- incompatible

A general Core change should be tested against existing adapters.

---

## 18. Conformance Impact

A CEP must define whether the Domain Adapter Conformance Kit changes.

New conformance behavior must be classified as either:

~~~text
clarification of existing requirement
~~~

or:

~~~text
new architectural requirement
~~~

This classification affects versioning.

---

## 19. Test Plan

A CEP must define executable evidence before acceptance.

The test plan should include, where applicable:

- positive semantic behavior
- invalid semantic behavior
- Non-Invention cases
- Unknown cases
- deterministic equivalence
- compatibility with existing adapters
- conformance behavior
- migration behavior

A Core proposal without a credible test strategy is incomplete.

---

## 20. Migration Plan

If existing users or adapters are affected, the CEP must define migration.

The migration plan should answer:

- What changes?
- Who must change?
- Can migration be automated?
- Can old and new formats coexist?
- Is stored Semantic State affected?
- Is rollback possible?

Breaking migration must never be hidden inside an implementation commit.

---

## 21. Versioning Assessment

Every CEP must recommend a release impact according to the SPA Versioning Policy.

Possible outcomes include:

~~~text
No Core release required
PATCH
MINOR
MAJOR
Defer
~~~

The recommendation must be justified by compatibility impact rather than feature size.

---

## 22. Rejection Criteria

A CEP should normally be rejected or deferred when:

- the requirement exists in only one domain and is naturally domain-specific
- existing Core mechanisms already represent the requirement adequately
- the proposal mainly improves convenience
- the abstraction depends on model-specific prompt wording
- the abstraction embeds domain vocabulary into Core
- Non-Invention behavior is unclear
- Unknown behavior is unclear
- compatibility impact is unknown
- no executable validation strategy exists
- insufficient evidence exists to distinguish a general requirement from a local workaround

Rejection does not mean the underlying problem is unimportant.

It means the problem has not yet justified Core expansion.

---

## 23. CEP Lifecycle

A CEP may move through the following states:

~~~text
Draft
↓
Evidence Gathering
↓
Review
↓
Accepted
↓
Implemented
↓
Validated
~~~

Alternative outcomes include:

~~~text
Deferred
Rejected
Withdrawn
Superseded
~~~

A CEP should record its current status explicitly.

---

## 24. Acceptance

Acceptance means:

> The proposal has demonstrated a sufficiently general semantic architecture requirement to justify Core evolution.

Acceptance does not mean implementation is automatically correct.

Implementation must still pass:

- type checking
- Core tests
- Domain Adapter tests
- Conformance tests
- proposal-specific validation

---

## 25. Core Expansion Invariant

The governing invariant is:

> SPA Core expands only when evidence demonstrates a shared semantic requirement that cannot be represented cleanly by the existing architecture.

This keeps Core evolution driven by semantic necessity rather than accumulation of features.
