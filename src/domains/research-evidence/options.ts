import type {
  SpaOption,
} from "../../types.js";

export const researchEvidenceOptions:
  SpaOption[] = [
  {
    id: "evidence-strength-strong",
    domain: "research_evidence",
    category: "evidence_strength",
    label: "Strong evidence",
    semanticValue: "strong",
  },
  {
    id: "evidence-strength-moderate",
    domain: "research_evidence",
    category: "evidence_strength",
    label: "Moderate evidence",
    semanticValue: "moderate",
  },
  {
    id: "evidence-strength-limited",
    domain: "research_evidence",
    category: "evidence_strength",
    label: "Limited evidence",
    semanticValue: "limited",
  },

  {
    id: "source-type-peer-reviewed",
    domain: "research_evidence",
    category: "source_type",
    label: "Peer-reviewed research",
    semanticValue: "peer_reviewed",
  },
  {
    id: "source-type-primary",
    domain: "research_evidence",
    category: "source_type",
    label: "Primary source",
    semanticValue: "primary_source",
  },
  {
    id: "source-type-systematic-review",
    domain: "research_evidence",
    category: "source_type",
    label: "Systematic review",
    semanticValue: "systematic_review",
  },

  {
    id: "claim-status-supported",
    domain: "research_evidence",
    category: "claim_status",
    label: "Supported",
    semanticValue: "supported",
  },
  {
    id: "claim-status-contested",
    domain: "research_evidence",
    category: "claim_status",
    label: "Contested",
    semanticValue: "contested",
  },
  {
    id: "claim-status-unresolved",
    domain: "research_evidence",
    category: "claim_status",
    label: "Unresolved",
    semanticValue: "unresolved",
  },

  {
    id: "uncertainty-low",
    domain: "research_evidence",
    category: "uncertainty",
    label: "Low uncertainty",
    semanticValue: "low",
  },
  {
    id: "uncertainty-moderate",
    domain: "research_evidence",
    category: "uncertainty",
    label: "Moderate uncertainty",
    semanticValue: "moderate",
  },
  {
    id: "uncertainty-high",
    domain: "research_evidence",
    category: "uncertainty",
    label: "High uncertainty",
    semanticValue: "high",
  },

  {
    id: "citation-preference-primary",
    domain: "research_evidence",
    category: "citation_preference",
    label: "Prefer primary sources",
    semanticValue: "prefer_primary_sources",
  },
  {
    id: "citation-preference-peer-reviewed",
    domain: "research_evidence",
    category: "citation_preference",
    label: "Prefer peer-reviewed sources",
    semanticValue: "prefer_peer_reviewed",
  },
];
