# CEP-XXX: Title

Status: Draft  
Authors:  
Created:  
Target SPA Version: Undetermined

---

## 1. Summary

Describe the proposed Core change in a few sentences.

Do not begin with implementation details.

State the general semantic capability being proposed.

---

## 2. Problem

What semantic problem has been observed?

Describe the problem independently of the proposed solution.

---

## 3. Cross-Domain Evidence

Which domains encounter this problem?

### Domain A

Observed behavior:

~~~text
Describe reproducible evidence.
~~~

### Domain B

Observed behavior:

~~~text
Describe reproducible evidence.
~~~

Explain why these are instances of the same architectural problem rather than unrelated domain requirements.

---

## 4. Existing Core Limitation

Which existing SPA Core mechanism is insufficient?

Relevant Core components:

- [ ] Option
- [ ] Selection
- [ ] Semantic Schema
- [ ] Selection Resolver
- [ ] Semantic State
- [ ] Canonical State
- [ ] Translator
- [ ] Prompt IR
- [ ] Prompt Renderer
- [ ] Unknown
- [ ] Domain Adapter Contract
- [ ] Conformance Kit
- [ ] Other

Explain why the requirement cannot be represented cleanly using the existing architecture.

---

## 5. Proposed Core Abstraction

Describe the proposed domain-independent abstraction.

If useful, include conceptual types or pseudocode.

~~~ts
// Proposed conceptual API
~~~

Explain why this belongs in Core rather than a Domain Adapter.

---

## 6. Alternatives Considered

### Alternative A: Keep in Domain Adapter

Explain whether the problem can remain domain-specific.

### Alternative B: Use Existing Core

Explain whether existing structures can represent the requirement.

### Alternative C: Helper or Extension

Explain whether a non-Core extension would be sufficient.

### Alternative D: Defer

What happens if SPA waits for more evidence?

---

## 7. Semantic Preservation Analysis

Answer:

- Does existing meaning remain unchanged?
- Does stored Semantic State remain valid?
- Does canonical representation change?
- Is information added, removed, or reinterpreted?
- Can old and new representations coexist?

---

## 8. Non-Invention Analysis

Could this proposal create semantic facts that were not explicitly represented?

~~~text
Risk:
Safeguard:
Test:
~~~

Explain how Non-Invention remains enforceable.

---

## 9. Unknown Analysis

Does the proposal affect:

- unknown
- not_remembered
- not_observed
- not_applicable
- intentionally_unspecified

Describe preservation rules.

~~~text
Unknown impact:
~~~

---

## 10. Determinism Analysis

Describe effects on:

- canonical ordering
- canonical serialization
- equivalent Semantic States
- Prompt IR
- rendered prompts

~~~text
Determinism impact:
~~~

---

## 11. Compatibility Impact

Classification:

- [ ] Backward-compatible
- [ ] Conditionally backward-compatible
- [ ] Breaking
- [ ] Unknown

Affected contracts:

~~~text
List affected public contracts.
~~~

---

## 12. Domain Adapter Impact

### Visual Testimony

~~~text
No change / Optional adoption / Migration / Incompatible
~~~

### Care / Conversation

~~~text
No change / Optional adoption / Migration / Incompatible
~~~

### Research Evidence

~~~text
No change / Optional adoption / Migration / Incompatible
~~~

---

## 13. Conformance Impact

Does the Conformance Kit change?

~~~text
No change
or
Clarification of existing requirement
or
New architectural requirement
~~~

Describe required tests.

---

## 14. Test Plan

Required automated evidence:

- [ ] positive behavior
- [ ] invalid behavior
- [ ] Non-Invention
- [ ] Unknown preservation
- [ ] deterministic equivalence
- [ ] existing Domain Adapters
- [ ] Conformance Kit
- [ ] migration behavior

Additional tests:

~~~text
Describe proposal-specific tests.
~~~

---

## 15. Migration Plan

Who must migrate?

~~~text
Describe migration.
~~~

Can migration be automated?

~~~text
Yes / No / Not applicable
~~~

Does stored Semantic State change?

~~~text
Yes / No
~~~

---

## 16. Versioning Assessment

Recommended outcome:

- [ ] No Core release required
- [ ] PATCH
- [ ] MINOR
- [ ] MAJOR
- [ ] Defer

Reason:

~~~text
Explain using SPA Versioning Policy.
~~~

---

## 17. Rejection Criteria

What evidence would demonstrate that this proposal should not enter Core?

~~~text
Define falsifiable rejection conditions.
~~~

---

## 18. Decision

Status:

~~~text
Draft
Evidence Gathering
Review
Accepted
Implemented
Validated
Deferred
Rejected
Withdrawn
Superseded
~~~

Decision rationale:

~~~text
Complete during review.
~~~
