import {
  meetingPreferenceOptions,
} from "./options.js";

import {
  meetingPreferenceSchema,
} from "./schema.js";

import {
  meetingPreferenceTranslator,
} from "./translator.js";

export const meetingPreferenceAdapter = {
  id: "meeting-preference",
  version: "1.0.0",
  domain: "meeting_preference",
  schema: meetingPreferenceSchema,
  options: meetingPreferenceOptions,
  translator:
    meetingPreferenceTranslator,
};
