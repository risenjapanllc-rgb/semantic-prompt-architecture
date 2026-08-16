import type {
  SemanticField,
  SemanticSchema,
  SpaOption,
} from "./types.js";

export function buildSemanticFieldMap(
  schema: SemanticSchema
): Map<string, SemanticField> {
  const map =
    new Map<string, SemanticField>();

  for (const field of schema.fields) {
    if (map.has(field.id)) {
      throw new Error(
        `Duplicate semantic field id: ${field.id}`
      );
    }

    map.set(
      field.id,
      field
    );
  }

  return map;
}

export function getSemanticFieldByCategory(
  schema: SemanticSchema,
  category: string
): SemanticField | undefined {
  return schema.fields.find(
    (field) =>
      field.category === category
  );
}

export function validateOptionAgainstSchema(
  schema: SemanticSchema,
  option: SpaOption
): boolean {
  if (option.domain !== schema.domain) {
    return false;
  }

  return (
    getSemanticFieldByCategory(
      schema,
      option.category
    ) !== undefined
  );
}
