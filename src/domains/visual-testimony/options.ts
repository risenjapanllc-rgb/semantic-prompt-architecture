import type {
  SpaOption,
} from "../../types.js";

export const visualTestimonyOptions:
  SpaOption[] = [
  {
    id: "character-impression-refined",
    domain: "visual_testimony",
    category: "character_impression",
    label: "上品",
    semanticValue: "refined",
  },
  {
    id: "character-impression-friendly",
    domain: "visual_testimony",
    category: "character_impression",
    label: "親しみやすい",
    semanticValue: "friendly",
  },
  {
    id: "character-impression-calm",
    domain: "visual_testimony",
    category: "character_impression",
    label: "落ち着いた",
    semanticValue: "calm",
  },
  {
    id: "character-impression-simple",
    domain: "visual_testimony",
    category: "character_impression",
    label: "素朴",
    semanticValue: "simple",
  },

  {
    id: "facial-impression-soft",
    domain: "visual_testimony",
    category: "facial_impression",
    label: "柔らかい顔立ち",
    semanticValue: "soft",
  },
  {
    id: "facial-impression-dignified",
    domain: "visual_testimony",
    category: "facial_impression",
    label: "凛とした顔立ち",
    semanticValue: "dignified",
  },
  {
    id: "facial-impression-gentle",
    domain: "visual_testimony",
    category: "facial_impression",
    label: "優しい顔立ち",
    semanticValue: "gentle",
  },

  {
    id: "age-appearance-young-adult",
    domain: "visual_testimony",
    category: "age_appearance",
    label: "若い成人に見える",
    semanticValue: "young_adult",
  },
  {
    id: "age-appearance-middle-aged",
    domain: "visual_testimony",
    category: "age_appearance",
    label: "中年に見える",
    semanticValue: "middle_aged",
  },
  {
    id: "age-appearance-older-adult",
    domain: "visual_testimony",
    category: "age_appearance",
    label: "高齢に見える",
    semanticValue: "older_adult",
  },

  {
    id: "expression-calm",
    domain: "visual_testimony",
    category: "expression",
    label: "穏やかな表情",
    semanticValue: "calm",
  },
  {
    id: "expression-smiling",
    domain: "visual_testimony",
    category: "expression",
    label: "笑顔",
    semanticValue: "smiling",
    incompatibleWith: [
      "expression-expressionless",
    ],
  },
  {
    id: "expression-expressionless",
    domain: "visual_testimony",
    category: "expression",
    label: "無表情",
    semanticValue: "expressionless",
    incompatibleWith: [
      "expression-smiling",
    ],
  },
  {
    id: "expression-sad",
    domain: "visual_testimony",
    category: "expression",
    label: "悲しげ",
    semanticValue: "sad",
  },

  {
    id: "clothing-casual",
    domain: "visual_testimony",
    category: "clothing",
    label: "普段着",
    semanticValue: "casual",
  },
  {
    id: "clothing-formal",
    domain: "visual_testimony",
    category: "clothing",
    label: "フォーマル",
    semanticValue: "formal",
  },
  {
    id: "clothing-simple",
    domain: "visual_testimony",
    category: "clothing",
    label: "シンプルな服装",
    semanticValue: "simple",
  },

  {
    id: "hair-short",
    domain: "visual_testimony",
    category: "hair",
    label: "短い髪",
    semanticValue: "short",
  },
  {
    id: "hair-medium",
    domain: "visual_testimony",
    category: "hair",
    label: "中くらいの長さ",
    semanticValue: "medium",
  },
  {
    id: "hair-long",
    domain: "visual_testimony",
    category: "hair",
    label: "長い髪",
    semanticValue: "long",
  },

  {
    id: "environment-indoor",
    domain: "visual_testimony",
    category: "environment",
    label: "屋内",
    semanticValue: "indoor",
  },
  {
    id: "environment-outdoor",
    domain: "visual_testimony",
    category: "environment",
    label: "屋外",
    semanticValue: "outdoor",
  },

  {
    id: "spatial-near",
    domain: "visual_testimony",
    category: "spatial_relationship",
    label: "近くにいる",
    semanticValue: "near",
  },
  {
    id: "spatial-far",
    domain: "visual_testimony",
    category: "spatial_relationship",
    label: "離れている",
    semanticValue: "far",
  },

  {
    id: "weather-sunny",
    domain: "visual_testimony",
    category: "weather",
    label: "晴れ",
    semanticValue: "sunny",
  },
  {
    id: "weather-cloudy",
    domain: "visual_testimony",
    category: "weather",
    label: "曇り",
    semanticValue: "cloudy",
  },
  {
    id: "weather-rainy",
    domain: "visual_testimony",
    category: "weather",
    label: "雨",
    semanticValue: "rainy",
  },
];
