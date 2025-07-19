export const RuleType = {
  REQUIRED : "required",
  RANGE : "range",
  EMAIL : "email",
  MIN_LENGTH : "minLength",
  MAX_LENGTH : "maxLength",
  PATTERN : "pattern",
  IN_LIST : "inList",
  STARTS_WITH : "startsWith",
  ENDS_WITH : "endsWith",
  NUMBER : "number",
  TEXT : "text",
}

export type RuleType = typeof RuleType[keyof typeof RuleType];
