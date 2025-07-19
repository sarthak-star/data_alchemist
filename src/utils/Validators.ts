import type { Rule } from "../screens/ConfigureRules";

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
        case "required":
          if (!value || value.trim() === "") {
            errorMessage = rule.errorMessage;
            errorColor = rule.errorColor;
          }
          break;

        case "range":
          if (
            typeof value !== "number" ||
            value < (rule.minValue ?? -Infinity) ||
            value > (rule.maxValue ?? Infinity)
          ) {
            errorMessage = rule.errorMessage;
            errorColor = rule.errorColor;
          }
          break;

        case "email":
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            errorMessage = rule.errorMessage;
            errorColor = rule.errorColor;
          }
          break;

        case "minLength":
          if (
            typeof value !== "string" ||
            value.length < (rule.minLength ?? 0)
          ) {
            errorMessage = rule.errorMessage;
            errorColor = rule.errorColor;
          }
          break;

        case "maxLength":
          if (
            typeof value !== "string" ||
            value.length > (rule.maxLength ?? Infinity)
          ) {
            errorMessage = rule.errorMessage;
            errorColor = rule.errorColor;
          }
          break;

        case "pattern":
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

        case "inList":
          const allowed = (rule.allowedValues || "")
            .split(",")
            .map((v) => v.trim());
          if (!allowed.includes(value)) {
            errorMessage = rule.errorMessage;
            errorColor = rule.errorColor;
          }
          break;

        case "startsWith":
          if (!value.startsWith(rule.targetValue || "")) {
            errorMessage = rule.errorMessage;
            errorColor = rule.errorColor;
          }
          break;

        case "endsWith":
          if (!value.endsWith(rule.targetValue || "")) {
            errorMessage = rule.errorMessage;
            errorColor = rule.errorColor;
          }
          break;

        case "number":
          if (isNaN(Number(value))) {
            errorMessage = rule.errorMessage;
            errorColor = rule.errorColor;
          }
          break;

        case "text":
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