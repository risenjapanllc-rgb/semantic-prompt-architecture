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

---

## Canonical State

Canonical State is the normalized representation of Semantic State.

Its purpose is to provide a stable semantic representation that Translators can consume without depending on UI labels or model-specific prompt wording.

```ts
export type CanonicalValue = {
  id: string;
  value: string;
  sourceOptionIds: string[];
};

export type CanonicalState = {
  domain: string;

  categories: Record<
    string,
    CanonicalValue[]
  >;

  unknowns: string[];
};
```

### Example

```ts
{
  domain: "character_impression",

  categories: {
    face_impression: [
      {
        id: "refined",
        value: "refined",
        sourceOptionIds: [
          "face-impression-refined"
        ]
      },
      {
        id: "gentle",
        value: "gentle",
        sourceOptionIds: [
          "face-impression-gentle"
        ]
      }
    ]
  },

  unknowns: [
    "exact_eye_shape"
  ]
}
```

Canonical State normalizes meaning without adding new meaning.

It must not infer information that the user did not provide or confirm.

It must preserve Unknown as Unknown.

It must remain independent from any specific AI model.

Canonical State is the stable input contract for Translators.

---

## Translator

A Translator converts Canonical State into model-specific instructions.

The Translator is the boundary between stable semantic meaning and model-dependent prompt representation.

```ts
export type PromptSection = {
  id: string;
  title: string;
  priority: number;
  instructions: string[];
};

export type SpaTranslator = {
  modelFamily: string;
  version: string;

  translate(
    state: CanonicalState
  ): PromptSection[];
};
```

### Example

The same Canonical State:

```ts
{
  domain: "character_impression",

  categories: {
    face_impression: [
      {
        id: "refined",
        value: "refined",
        sourceOptionIds: [
          "face-impression-refined"
        ]
      }
    ]
  },

  unknowns: []
}
```

may be translated differently for different AI models.

Conceptually:

```text
Canonical State
      |
      +--> Image Model A Translator
      |        |
      |        +--> model-specific visual instructions
      |
      +--> Image Model B Translator
      |        |
      |        +--> different model-specific instructions
      |
      +--> Language Model Translator
               |
               +--> language-model-specific instructions
```

The Translator may change as AI models change.

Canonical State must not change merely because the target AI model changes.

A Translator must not invent new semantic facts.

A Translator may change wording, ordering, emphasis, and model-specific syntax only when necessary to communicate the existing meaning effectively.

Unknown information must not be converted into invented detail.

The Translator is replaceable.

Semantic meaning is durable.

---

## Prompt Renderer

Prompt Renderer converts Prompt Sections produced by a Translator into the final model input.

```ts
export type PromptRenderer = {
  render(
    sections: PromptSection[]
  ): string;
};
```

The Prompt Renderer is responsible for presentation, not meaning.

It may:

- order Prompt Sections by priority
- apply model-specific formatting
- add required structural separators
- remove unnecessary formatting duplication

It must not:

- invent new semantic facts
- reinterpret the user's meaning
- silently replace Unknown with assumptions
- introduce domain knowledge that is absent from Canonical State
- change the semantic intent of Translator output

### Processing Flow

```text
Semantic State
      |
      v
Canonical State
      |
      v
Translator
      |
      v
Prompt Sections
      |
      v
Prompt Renderer
      |
      v
Final Model Input
      |
      v
AI Model
```

### Separation of Responsibilities

Semantic State owns meaning.

Canonical State owns normalization.

Translator owns model-specific semantic translation.

Prompt Renderer owns final prompt representation.

AI Model owns generation.

The final prompt is a generated artifact.

It is not the source of truth.

Changing a Prompt Renderer must not require changing the underlying Semantic State.