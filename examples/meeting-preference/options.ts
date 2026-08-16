import type {
  SpaOption,
} from "../../src/index.js";

export const meetingPreferenceOptions:
  SpaOption[] = [
    {
      id: "meeting-style-structured",
      domain: "meeting_preference",
      category: "meeting_style",
      label: "構造化された進行",
      semanticValue: "structured",
    },
    {
      id: "meeting-style-open",
      domain: "meeting_preference",
      category: "meeting_style",
      label: "自由な進行",
      semanticValue: "open",
    },
    {
      id: "response-preference-concise",
      domain: "meeting_preference",
      category: "response_preference",
      label: "簡潔な応答",
      semanticValue: "concise",
    },
    {
      id: "response-preference-detailed",
      domain: "meeting_preference",
      category: "response_preference",
      label: "詳しい応答",
      semanticValue: "detailed",
    },
  ];
