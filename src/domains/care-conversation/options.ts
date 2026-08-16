import type {
  SpaOption,
} from "../../types.js";

export const careConversationOptions:
  SpaOption[] = [
  {
    id: "emotional-state-calm",
    domain: "care_conversation",
    category: "emotional_state",
    label: "穏やか",
    semanticValue: "calm",
  },
  {
    id: "emotional-state-anxious",
    domain: "care_conversation",
    category: "emotional_state",
    label: "不安",
    semanticValue: "anxious",
  },
  {
    id: "emotional-state-sad",
    domain: "care_conversation",
    category: "emotional_state",
    label: "悲しい",
    semanticValue: "sad",
  },
  {
    id: "emotional-state-confused",
    domain: "care_conversation",
    category: "emotional_state",
    label: "混乱している",
    semanticValue: "confused",
  },

  {
    id: "support-preference-listening",
    domain: "care_conversation",
    category: "support_preference",
    label: "まず話を聞いてほしい",
    semanticValue: "listening",
  },
  {
    id: "support-preference-practical",
    domain: "care_conversation",
    category: "support_preference",
    label: "具体的な方法を一緒に考えたい",
    semanticValue: "practical_support",
  },
  {
    id: "support-preference-reflection",
    domain: "care_conversation",
    category: "support_preference",
    label: "気持ちを整理したい",
    semanticValue: "reflection",
  },

  {
    id: "communication-style-gentle",
    domain: "care_conversation",
    category: "communication_style",
    label: "やわらかく話してほしい",
    semanticValue: "gentle",
  },
  {
    id: "communication-style-direct",
    domain: "care_conversation",
    category: "communication_style",
    label: "率直に話してほしい",
    semanticValue: "direct",
  },
  {
    id: "communication-style-concise",
    domain: "care_conversation",
    category: "communication_style",
    label: "簡潔に話してほしい",
    semanticValue: "concise",
  },

  {
    id: "conversation-intention-express",
    domain: "care_conversation",
    category: "conversation_intention",
    label: "今の気持ちを言葉にしたい",
    semanticValue: "express_feelings",
  },
  {
    id: "conversation-intention-understand",
    domain: "care_conversation",
    category: "conversation_intention",
    label: "状況を理解したい",
    semanticValue: "understand_situation",
  },
  {
    id: "conversation-intention-next-step",
    domain: "care_conversation",
    category: "conversation_intention",
    label: "次にできることを考えたい",
    semanticValue: "consider_next_step",
  },
];
