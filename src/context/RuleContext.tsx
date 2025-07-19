// RuleContext.tsx
import { createContext, useReducer, useContext, useEffect } from "react";
import type { Rule } from "../screens/ConfigureRules";

// Rule set structure with a name and rules
interface RuleSet {
  name: string;
  rules: Rule[];
}

// Initial state containing an array of rule sets
interface RuleState {
  ruleSets: RuleSet[];
}

// Action types
const ADD_RULE_SET = "ADD_RULE_SET";
const ADD_RULE_TO_SET = "ADD_RULE_TO_SET";
const UPDATE_RULE_SET = "UPDATE_RULE_SET";
const DELETE_RULE_SET = "DELETE_RULE_SET";

// Action interfaces
interface AddRuleSetAction {
  type: typeof ADD_RULE_SET;
  payload: RuleSet;
}

interface AddRuleToSetAction {
  type: typeof ADD_RULE_TO_SET;
  payload: { ruleSetName: string; rule: Rule };
}

interface UpdateRuleSetAction {
  type: typeof UPDATE_RULE_SET;
  payload: RuleSet;
}

interface DeleteRuleSetAction {
  type: typeof DELETE_RULE_SET;
  payload: RuleSet;
}

type RuleActions =
  | AddRuleSetAction
  | AddRuleToSetAction
  | UpdateRuleSetAction
  | DeleteRuleSetAction;

// Load initial state from localStorage or use default
const loadInitialState = (): RuleState => {
  const defaultRuleSet: RuleSet = {
    name: "Dummy Rules",
    rules: [
      {
        column: "Message",
        type: "text",
        errorMessage: "Message can only be of type Text",
        errorColor: "#ff00ae",
        pattern: "",
        allowedValues: "",
        targetValue: "",
      },
      {
        column: "Category",
        type: "inList",
        errorMessage: "Value out of bounds",
        errorColor: "#ff0000",
        pattern: "",
        allowedValues: "ham,spam",
        targetValue: "",
      },
    ],
  };

  const storedState = localStorage.getItem("ruleState");

  if (storedState) {
    const parsed: RuleState = JSON.parse(storedState);

    // Avoid adding demo if it's already there (by name)
    const demoExists = parsed.ruleSets.some(
      (rs) => rs.name === defaultRuleSet.name
    );
    return {
      ruleSets: demoExists
        ? parsed.ruleSets
        : [defaultRuleSet, ...parsed.ruleSets],
    };
  }

  // First-time user — only demo rules
  return { ruleSets: [defaultRuleSet] };
};

// Reducer function to manage rule sets and rules
const ruleReducer = (state: RuleState, action: RuleActions): RuleState => {
  switch (action.type) {
    case ADD_RULE_SET:
      return {
        ...state,
        ruleSets: [...state.ruleSets, action.payload],
      };
    case ADD_RULE_TO_SET:
      return {
        ...state,
        ruleSets: state.ruleSets.map((ruleSet) =>
          ruleSet.name === action.payload.ruleSetName
            ? { ...ruleSet, rules: [...ruleSet.rules, action.payload.rule] }
            : ruleSet
        ),
      };
    case UPDATE_RULE_SET:
      return {
        ...state,
        ruleSets: state.ruleSets.map((set) =>
          set.name === action.payload.name ? action.payload : set
        ),
      };
    case DELETE_RULE_SET:
      return {
        ...state,
        ruleSets: state.ruleSets.filter(
          (rs) => rs.name !== action.payload.name
        ),
      };
    default:
      return state;
  }
};

// Create context
const RuleContext = createContext<any>(null);

// Rule provider component
export const RuleProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(ruleReducer, loadInitialState());

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("ruleState", JSON.stringify(state));
  }, [state]);

  return (
    <RuleContext.Provider value={{ state, dispatch }}>
      {children}
    </RuleContext.Provider>
  );
};

// Custom hook to use the rule context
export const useRuleContext = () => {
  return useContext(RuleContext);
};
