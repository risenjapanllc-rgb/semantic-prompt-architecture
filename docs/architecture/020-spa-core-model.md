# SPA Core Model

## Purpose

Semantic Prompt Architecture (SPA) separates human meaning from model-specific prompts.

The durable asset is Semantic State.

Prompts are generated artifacts.

---

## Semantic Flow

SPA converts human meaning into model-specific instructions.

Human
↓
Selection UI
↓
Selection
↓
Semantic State
↓
Canonical State
↓
Translator
↓
Prompt Renderer
↓
AI Model

The durable asset is Semantic State.

Prompt is a generated artifact.

Unknown remains Unknown.

---

## Option

An Option is a selectable semantic unit presented to the user.

```ts
export type SpaOption = {
  id: string;
  category: string;
  label: string;
  semanticValue: string;
  description?: string;
  incompatibleWith?: string[];
};
```

### Example

```ts
{
  id: "face-impression-refined",
  category: "face_impression",
  label: "上品",
  semanticValue: "refined"
}
```

`label` is human-facing.

`semanticValue` represents meaning inside the system.

Neither field contains model-specific prompt instructions.

The same semantic value may later be translated differently for different AI models.