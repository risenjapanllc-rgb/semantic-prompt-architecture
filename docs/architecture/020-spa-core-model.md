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

---

## Selection

A Selection records a user's explicit choice of an Option.

```ts
export type SpaSelection = {
  optionId: string;
  selected: boolean;
};
```

### Example

```ts
{
  optionId: "face-impression-refined",
  selected: true
}
```

A Selection records the user's choice.

It does not contain prompt text and does not reinterpret the meaning of the selected Option.

Option defines meaning.

Selection records choice.

The selected Options are later used to construct Semantic State.

---

---

## Semantic State

Semantic State is the model-independent source of truth.

It represents the meaning selected or confirmed by the user without containing model-specific prompt instructions.

```ts
export type SemanticState = {
  domain: string;

  values: Record<
    string,
    string[]
  >;

  unknowns: string[];

  metadata?: Record<
    string,
    unknown
  >;
};
```

### Example

```ts
{
  domain: "character_impression",

  values: {
    face_impression: [
      "refined",
      "warm",
      "gentle"
    ]
  },

  unknowns: [
    "exact_eye_shape"
  ]
}
```

Semantic State must remain independent from any specific AI model.

It stores meaning, not prompt wording.

Unknown information must remain explicitly represented as Unknown.

Semantic State is the durable asset of SPA.