# SPA Third Domain Validation

Status: Completed  
Architecture baseline: SPA Core v0.1.0  
Validation domain: Research Evidence  
Validation commit: `bae289b`

---

## 1. Purpose

This validation tests whether Semantic Prompt Architecture (SPA) can accept a substantially different semantic domain without modifying SPA Core.

The first two reference domains were:

- Visual Testimony
- Care / Conversation

The third validation domain is:

- Research Evidence

The purpose is not merely to add another example.

The purpose is to test whether the Domain Adapter boundary is genuinely reusable across semantically different applications.

---

## 2. Validation Question

The primary question is:

> Can a new semantic domain be implemented through Semantic Schema, Option Library, Translator, and the existing Domain Adapter Contract without modifying SPA Core?

For this validation, the required answer was:

~~~text
YES
~~~

---

## 3. Research Evidence Domain

The Research Evidence adapter introduces semantic dimensions including:

~~~text
evidence_strength
source_type
claim_status
uncertainty
citation_preference
~~~

These dimensions differ substantially from the semantic dimensions used by Visual Testimony and Care / Conversation.

This makes Research Evidence useful as a test of architectural generality.

---

## 4. Architecture Used

The Research Evidence domain uses the existing SPA pipeline:

~~~text
Human Selection
      ↓
Option Library
      ↓
Semantic Schema
      ↓
Selection Resolver
      ↓
Semantic State
      ↓
Canonical State
      ↓
Research Evidence Translator
      ↓
Prompt IR
      ↓
Prompt Renderer
~~~

No new SPA Core processing layer was required.

---

## 5. Domain Adapter Components

The Research Evidence adapter contains:

~~~text
src/domains/research-evidence/
├── index.ts
├── options.ts
├── schema.ts
└── translator.ts
~~~

Its semantic behavior is validated by:

~~~text
tests/research-evidence.test.ts
~~~

The adapter uses the same Core contracts already used by the previous domains.

---

## 6. Core Non-Modification Result

During validation, the following SPA Core files were explicitly checked for modifications:

~~~text
src/types.ts
src/selection-resolver.ts
src/semantic-state.ts
src/semantic-schema.ts
src/canonical-state.ts
src/translator.ts
src/prompt-renderer.ts
~~~

The validation result was:

~~~text
SPA Core unchanged.
~~~

This is the central result of the third-domain experiment.

Research Evidence required domain-specific semantic definitions.

It did not require a new Core semantic mechanism.

---

## 7. Semantic Independence

The validation verifies that independent semantic dimensions remain independent.

For example:

~~~text
evidence_strength = strong
~~~

does not automatically imply:

~~~text
claim_status = supported
~~~

Likewise:

~~~text
source_type = peer_reviewed
~~~

does not automatically imply:

~~~text
evidence_strength = strong
claim_status = supported
~~~

This preserves SPA's Non-Invention Principle.

A source type is not silently converted into a conclusion about evidence strength or claim truth.

---

## 8. Claim Status Non-Invention

The Research Evidence Translator explicitly verifies that:

~~~text
claim_status = contested
~~~

is not translated into:

~~~text
false
~~~

`contested` and `false` are different semantic claims.

The Translator preserves the represented meaning rather than replacing it with a stronger interpretation.

---

## 9. Unknown Preservation

Research Evidence preserves Unknown as a first-class semantic state.

For example:

~~~text
uncertainty = unknown
~~~

is translated into an explicit `preserve_unknown` constraint.

The system does not invent an uncertainty level merely because a downstream prompt might otherwise benefit from one.

This confirms that the existing SPA Unknown mechanism applies to the third domain without Core modification.

---

## 10. Cardinality

The existing Semantic Schema cardinality mechanism is sufficient for Research Evidence.

For example:

~~~text
claim_status
~~~

is a single-value field.

Therefore selecting both:

~~~text
supported
contested
~~~

creates a cardinality conflict.

By contrast:

~~~text
source_type
~~~

is a multiple-value field and may preserve more than one source type.

No Research-specific cardinality mechanism was required.

---

## 11. Determinism

Equivalent Research Evidence meaning produces equivalent canonical representation and deterministic Prompt IR.

Input ordering and duplicate semantic representation do not alter the translated result.

This uses the existing SPA deterministic pipeline.

No Research-specific canonicalization mechanism was required.

---

## 12. Domain Adapter Conformance

The Research Evidence adapter passes the existing SPA Domain Adapter Conformance Kit.

The validation includes checks for:

- domain consistency
- Semantic Schema compatibility
- Option validity
- Translator identity
- Translator version
- Translator domain preservation
- Unknown preservation
- deterministic translation

The existing Conformance Kit required no Core changes for the third domain.

---

## 13. Automated Verification

At validation commit:

~~~text
bae289b
~~~

the repository verification result was:

~~~text
TypeScript typecheck: PASS

tests 89
pass 89
fail 0
cancelled 0
skipped 0
todo 0
~~~

The Git working tree was clean after commit and push.

---

## 14. Three-Domain Result

SPA has now been exercised across three substantially different semantic domains:

~~~text
Visual Testimony ───────┐
                        │
Care / Conversation ────┼──→ SPA Core
                        │
Research Evidence ──────┘
~~~

The domains differ in vocabulary and purpose.

They share the same architectural mechanisms.

---

## 15. What This Validation Demonstrates

This validation provides evidence for the following architectural claim:

> SPA Domain Adapters can introduce substantially different semantic vocabularies without requiring those vocabularies to become part of SPA Core.

The validation does not prove that SPA can represent every possible semantic domain.

It does demonstrate that the Core / Domain boundary has survived a third, intentionally different application domain.

---

## 16. What This Validation Does Not Demonstrate

This validation does not establish that:

- every future domain can be represented without Core evolution
- all possible semantic relationships are already modeled
- all model-specific translation problems are solved
- all domain-specific Non-Invention rules can be detected generically
- SPA eliminates nondeterminism in downstream AI model output

Future domains may expose genuine missing Core abstractions.

When that occurs, the architectural question should be:

> Is the missing capability domain-specific, or is it a general semantic requirement shared across domains?

Only the latter should normally justify SPA Core expansion.

---

## 17. Version Boundary

SPA Core v0.1.0 was tagged before the Research Evidence adapter was added.

The Research Evidence validation therefore represents post-v0.1.0 evidence about the stability of the v0.1 Core architecture.

The validation does not retroactively change the contents of the `v0.1.0` release.

It demonstrates that the released Core boundary remained usable when a third domain was introduced afterward.

---

## 18. Validation Conclusion

The third-domain validation succeeded.

The result is:

~~~text
Research Evidence Domain Adapter
            ↓
Existing SPA Domain Adapter Contract
            ↓
Existing SPA Core
            ↓
No Core modification required
            ↓
89 / 89 tests passing
~~~

The architectural significance is not that SPA now contains three domain examples.

The significance is that three different semantic domains can currently share one Core architecture while keeping their domain-specific meaning outside the Core.

That is the boundary this validation was designed to test.
