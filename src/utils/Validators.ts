import type { Rule } from "../screens/ConfigureRules";
import { RuleType } from "../utils/Constants"; 

export const getValidatorForColumn = (
    columnName: string,
    validationRules: Rule[]
  ) => {
    const rule = validationRules.find((rule) => rule.column === columnName);
    if (!rule) return null;

    return (params: any) => {
      const value = params.newValue;
      let errorMessage = "";
      let errorColor = "";

      switch (rule.type) {
        case RuleType.REQUIRED:
          if (!value || value.trim() === "") {
            errorMessage = rule.errorMessage;
            errorColor = rule.errorColor;
          }
          break;

        case RuleType.RANGE:
          if (
            typeof value !== "number" ||
            value < (rule.minValue ?? -Infinity) ||
            value > (rule.maxValue ?? Infinity)
          ) {
            errorMessage = rule.errorMessage;
            errorColor = rule.errorColor;
          }
          break;

        case RuleType.EMAIL:
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errorMessage = rule.errorMessage;
            errorColor = rule.errorColor;
          }
          break;

        case RuleType.MIN_LENGTH:
          if (
            typeof value !== "string" ||
            value.length < (rule.minLength ?? 0)
          ) {
            errorMessage = rule.errorMessage;
            errorColor = rule.errorColor;
          }
          break;

        case RuleType.MAX_LENGTH:
          if (
            typeof value !== "string" ||
            value.length > (rule.maxLength ?? Infinity)
          ) {
            errorMessage = rule.errorMessage;
            errorColor = rule.errorColor;
          }
          break;

        case RuleType.PATTERN:
          try {
            const regex = new RegExp(rule.pattern || "");
            if (!regex.test(value)) {
              errorMessage = rule.errorMessage;
              errorColor = rule.errorColor;
            }
          } catch {
            console.warn("Invalid regex pattern in rule:", rule.pattern);
          }
          break;

        case RuleType.IN_LIST:
          const allowed = (rule.allowedValues || "")
            .split(",")
            .map((v) => v.trim());
          if (!allowed.includes(value)) {
            errorMessage = rule.errorMessage;
            errorColor = rule.errorColor;
          }
          break;

        case RuleType.STARTS_WITH:
          if (!value.startsWith(rule.targetValue || "")) {
            errorMessage = rule.errorMessage;
            errorColor = rule.errorColor;
          }
          break;

        case RuleType.ENDS_WITH:
          if (!value.endsWith(rule.targetValue || "")) {
            errorMessage = rule.errorMessage;
            errorColor = rule.errorColor;
          }
          break;

        case RuleType.NUMBER:
          if (isNaN(Number(value))) {
            errorMessage = rule.errorMessage;
            errorColor = rule.errorColor;
          }
          break;

        case RuleType.TEXT:
          if (/\d/.test(value)) {
            errorMessage = rule.errorMessage;
            errorColor = rule.errorColor;
          }
          break;

        default:
          break;
      }

      if (errorMessage) {
        return { valid: false, error: errorMessage, errorColor }; // Return error errorMessage
      }

      return { valid: true, error: null, errorColor: "" }; // No error
    };
  };