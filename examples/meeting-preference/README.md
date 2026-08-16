# Meeting Preference Starter Adapter

This directory is a minimal copyable SPA Domain Adapter example.

It corresponds to:

`docs/getting-started/010-domain-adapter-quickstart.md`

The example demonstrates:

~~~text
Semantic Schema
↓
Options
↓
Selection Resolution
↓
Semantic State
↓
Canonical State
↓
Domain Translator
↓
Prompt IR
↓
Prompt Renderer
~~~

Run it from the repository root:

~~~bash
npx tsx examples/meeting-preference/run.ts
~~~

Expected semantic meaning:

~~~text
meeting_style = structured
response_preference = concise
~~~

The example intentionally keeps these semantic dimensions independent.

Selecting `structured` does not automatically select `concise`.

The Translator expresses only represented meaning.

It must not invent unrelated attributes.

This directory is an example.

It is not a new SPA Core component and it is not one of the maintained reference domains.
