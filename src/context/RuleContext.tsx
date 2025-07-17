// RuleContext.tsx
import React, { createContext, useReducer, useContext } from 'react';

// Rule object structure
interface Rule {
  column: string;
  type: string;
  errorMessage: string;
}

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
const ADD_RULE_SET = 'ADD_RULE_SET';
const ADD_RULE_TO_SET = 'ADD_RULE_TO_SET';

// Action interfaces
interface AddRuleSetAction {
  type: typeof ADD_RULE_SET;
  payload: RuleSet;
}

interface AddRuleToSetAction {
  type: typeof ADD_RULE_TO_SET;
  payload: { ruleSetName: string; rule: Rule };
}

type RuleActions = AddRuleSetAction | AddRuleToSetAction;

// Initial state
const initialState: RuleState = {
  ruleSets: [],
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
    default:
      return state;
  }
};

// Create context
const RuleContext = createContext<any>(null);

// Rule provider component
export const RuleProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(ruleReducer, initialState);

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
