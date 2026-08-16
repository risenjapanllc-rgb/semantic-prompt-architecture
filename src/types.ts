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

export type SpaSelection = {
  optionId: string;
  selected: boolean;
};

export type UnknownReason =
  | "unknown"
  | "not_remembered"
  | "not_observed"
  | "not_applicable"
  | "intentionally_unspecified";

export type SemanticUnknown = {
  field: string;
  reason: UnknownReason;
};

export type SemanticState = {
  domain: string;
  values: Record<string, string[]>;
  unknowns: SemanticUnknown[];
};

export type ResolutionIssueType =
  | "unknown_option"
  | "incompatible_selection"
  | "missing_requirement"
  | "unknown_conflict"
  | "ambiguous_selection";

export type ResolutionIssue = {
  type: ResolutionIssueType;
  optionIds: string[];
  category?: string;
  message: string;
};

export type SelectionResolutionResult = {
  validSelections: SpaSelection[];
  issues: ResolutionIssue[];
  requiresConfirmation: boolean;
};
