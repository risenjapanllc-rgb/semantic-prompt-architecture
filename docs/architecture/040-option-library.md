# SPA Option Library

## Purpose

The Option Library defines reusable semantic choices that users can select without writing model-specific prompts.

An Option represents meaning.

It does not represent final prompt wording.

---

## Core Structure

Options are organized by semantic category.

Example:

Character
↓
Impression
↓
Option
↓
Selection
↓
Semantic State

The purpose of categorization is to help users express meaning precisely without requiring prompt-engineering knowledge.

---

## Option Definition

~~~ts
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
~~~

### Example

~~~ts
{
  id: "character-impression-refined",
  domain: "visual_character",
  category: "character_impression",
  label: "上品",
  semanticValue: "refined"
}
~~~

The user sees:

上品

The Semantic State stores:

refined

The Translator later decides how that meaning should be expressed to the target AI model.

---

## Semantic Categories

Options that describe different kinds of meaning should not be mixed into one undifferentiated list.

For example:

### Character Impression

- 上品
- 親しみやすい
- 素朴
- 華やか
- 落ち着いた

### Facial Impression

- 柔らかい顔立ち
- 凛とした顔立ち
- 優しい顔立ち
- 整った顔立ち

### Emotional Expression

- 穏やか
- 明るい
- 緊張している
- 悲しげ
- 無表情

These categories represent different semantic dimensions.

Selecting one must not silently imply values in another category.

---

## Independent Semantic Dimensions

SPA should prefer independent semantic dimensions over bundled descriptions.

For example:

上品で美しく裕福そうな女性

should not normally be represented as one Option.

Instead:

Character Impression:

- 上品

Facial Impression:

- 整った顔立ち

Social or economic appearance:

- only represented if the domain actually requires it and the user confirms it

This reduces unintended semantic inference.

---

## Compatibility

Some Options may be compatible and selectable together.

Example:

- 上品
- 穏やか
- 親しみやすい

Other combinations may require validation.

The Option Library may declare explicit incompatibilities.

~~~ts
{
  id: "expression-smiling",
  incompatibleWith: [
    "expression-expressionless"
  ]
}
~~~

Applications should not assume incompatibility merely because two words appear different.

Compatibility is a domain rule.

---

## Unknown

Every category that may contain uncertain information should support an Unknown path.

Unknown is not a normal descriptive Option.

It represents the absence of confirmed semantic information.

Examples:

- 不明
- 覚えていない
- 見ていない
- 該当しない
- あえて指定しない

The UI must not force users to choose a descriptive Option when the meaning is unknown.

---

## Free Text

Free text may be available when the Option Library cannot adequately express the intended meaning.

However, free text should not automatically become model-specific prompt text.

Conceptually:

Free Text
↓
Semantic Interpretation or Confirmation
↓
Semantic State
↓
Translator
↓
Prompt

Free text is therefore an extension mechanism.

It does not bypass the semantic architecture.

---

## Domain Libraries

SPA Core defines the Option Library structure.

Individual applications define domain-specific libraries.

Examples:

### Visual Testimony

- character impression
- facial impression
- expression
- clothing
- environment
- spatial relationship
- visual style constraints

### Care / Conversation

- emotional state
- communication preference
- support preference
- conversation intention
- desired interaction style

The domains differ.

The Option architecture remains shared.

---

## Core Principle

Users select meaning.

Applications preserve meaning.

Translators express meaning.

AI models receive generated instructions.

Prompt wording is not the durable asset.

Semantic meaning is.
