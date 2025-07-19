// RuleConfigurator.tsx
import { useState } from "react";
import { useRuleContext } from "../context/RuleContext"; // Import the context
import Modal from "react-modal";
import RuleList from "../components/RulesList";
import { Pencil, Plus, Trash2 } from "lucide-react";

export interface Rule {
  column: string;
  type:
    | ""
    | "required"
    | "range"
    | "email"
    | "minLength"
    | "maxLength"
    | "pattern"
    | "inList"
    | "startsWith"
    | "endsWith"
    | "number"
    | "text";
  errorMessage: string;
  errorColor: string;

  // Optional fields depending on type
  minValue?: number;
  maxValue?: number;

  minLength?: number;
  maxLength?: number;

  pattern?: string;

  allowedValues?: string; // comma-separated list for UI; split when using

  targetValue?: string; // for startsWith / endsWith
}
const RuleConfigurator = () => {
  const { dispatch } = useRuleContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [ruleSetName, setRuleSetName] = useState("");
  const [rules, setRules] = useState<Rule[]>([]);
  const [newRule, setNewRule] = useState<Rule>({
    column: "",
    type: "",
    errorMessage: "",
    errorColor: "#ff0000",

    // For 'range'
    minValue: undefined,
    maxValue: undefined,

    // For 'minLength' and 'maxLength'
    minLength: undefined,
    maxLength: undefined,

    // For 'pattern'
    pattern: "",

    // For 'inList'
    allowedValues: "",

    // For 'startsWith' and 'endsWith'
    targetValue: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [editRuleIndex, setEditRuleIndex] = useState<number | null>(null);
  const [editRuleSetName, setEditRuleSetName] = useState<string | null>(null);

  const resetRule = () => {
    setNewRule({
      column: "",
      type: "",
      errorMessage: "",
      errorColor: "#ff0000",

      // For 'range'
      minValue: undefined,
      maxValue: undefined,

      // For 'minLength' and 'maxLength'
      minLength: undefined,
      maxLength: undefined,

      // For 'pattern'
      pattern: "",

      // For 'inList'
      allowedValues: "",

      // For 'startsWith' and 'endsWith'
      targetValue: "",
    });
  }

  const handleAddRule = () => {
    if (editRuleIndex !== null) {
      const updatedRules = [...rules];
      updatedRules[editRuleIndex] = newRule;
      setRules(updatedRules);
      setEditRuleIndex(null);
    } else {
      setRules([...rules, newRule]);
    }

    resetRule();
  };

  const handleEdit = (ruleSet: { name: string; rules: any[] }) => {
    setRuleSetName(ruleSet.name);
    setRules(ruleSet.rules);
    setEditMode(true);
    setModalOpen(true);
    setEditRuleSetName(ruleSet.name);
  };

  const handleDelete = (ruleSet: { name: string; rules: any[] }) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the rule set "${ruleSet.name}"?`
    );
    if (confirmDelete) {
      dispatch({
        type: "DELETE_RULE_SET",
        payload: ruleSet,
      });
    }
  };

  const handleSave = () => {
    if (!ruleSetName.trim()) {
      alert("Please provide a name for the rule set");
      return;
    }

    const updatedRuleSet = { name: ruleSetName, rules };

    if (editRuleSetName) {
      dispatch({
        type: "UPDATE_RULE_SET",
        payload: updatedRuleSet,
      });
    } else {
      dispatch({
        type: "ADD_RULE_SET",
        payload: updatedRuleSet,
      });
    }

    // Reset everything
    setRuleSetName("");
    setRules([]);
    resetRule()
    setEditRuleSetName(null);
    setModalOpen(false);
  };

  return (
    <div className="bg-gray-800 h-screen p-6 pt-32">
      <RuleList
        setModalOpen={setModalOpen}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Create Rule Set"
        className="bg-gray-900 text-white p-8 rounded-lg shadow-lg max-w-lg mx-auto mt-[10vh]"
        overlayClassName="fixed inset-0 bg-black bg-opacity-60"
      >
        <div className="flex justify-between mb-5">
          <input
            type="text"
            placeholder="Rule Set Name"
            value={ruleSetName}
            onChange={(e) => setRuleSetName(e.target.value)}
            className="w-full bg-transparent border-b-2 border-purple-500 p-3 text-white focus:outline-none focus:border-purple-400"
          />
        </div>

        <div className="mb-4 space-y-3">
          <span className="font-semibold text-xl">Create Rule</span>

          <input
            type="text"
            placeholder="Column Name"
            value={newRule.column}
            onChange={(e) => setNewRule({ ...newRule, column: e.target.value })}
            className="w-full bg-transparent border-b-2 border-purple-500 p-3 text-white focus:outline-none focus:border-purple-400"
          />

          <select
            value={newRule.type}
            onChange={(e) => setNewRule({ ...newRule, type: e.target.value as Rule["type"] })}
            className="w-full bg-transparent border-b-2 border-purple-500 p-3 text-white focus:outline-none focus:border-purple-400"
          >
            <option value="" className="text-black">
              Select Rule Type
            </option>
            <option value="required" className="text-black">
              Required
            </option>
            <option value="range" className="text-black">
              Range
            </option>
            <option value="email" className="text-black">
              Email
            </option>
            <option value="minLength" className="text-black">
              Min Length
            </option>
            <option value="maxLength" className="text-black">
              Max Length
            </option>
            <option value="pattern" className="text-black">
              Regex Pattern
            </option>
            <option value="number" className="text-black">
              Number Only
            </option>
            <option value="text" className="text-black">
              Text Only
            </option>
            <option value="inList" className="text-black">
              In List
            </option>
            <option value="startsWith" className="text-black">
              Starts With
            </option>
            <option value="endsWith" className="text-black">
              Ends With
            </option>
          </select>

          {newRule.type === "range" && (
            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Min Value"
                className="w-1/2 bg-transparent border-b-2 border-purple-500 p-3 text-white"
                onChange={(e) =>
                  setNewRule({ ...newRule, minValue: Number(e.target.value) })
                }
                value={newRule.minValue || ""}
              />
              <input
                type="number"
                placeholder="Max Value"
                className="w-1/2 bg-transparent border-b-2 border-purple-500 p-3 text-white"
                onChange={(e) =>
                  setNewRule({ ...newRule, maxValue: Number(e.target.value) })
                }
                value={newRule.maxValue || ""}
              />
            </div>
          )}

          {newRule.type === "minLength" && (
            <input
              type="number"
              placeholder="Minimum Length"
              className="w-full bg-transparent border-b-2 border-purple-500 p-3 text-white"
              value={newRule.minLength || ""}
              onChange={(e) =>
                setNewRule({ ...newRule, minLength: Number(e.target.value) })
              }
            />
          )}

          {newRule.type === "maxLength" && (
            <input
              type="number"
              placeholder="Maximum Length"
              className="w-full bg-transparent border-b-2 border-purple-500 p-3 text-white"
              value={newRule.maxLength || ""}
              onChange={(e) =>
                setNewRule({ ...newRule, maxLength: Number(e.target.value) })
              }
            />
          )}

          {newRule.type === "pattern" && (
            <input
              type="text"
              placeholder="Regex Pattern (e.g. ^[A-Z]{3}\\d{3}$)"
              className="w-full bg-transparent border-b-2 border-purple-500 p-3 text-white"
              value={newRule.pattern || ""}
              onChange={(e) =>
                setNewRule({ ...newRule, pattern: e.target.value })
              }
            />
          )}

          {newRule.type === "inList" && (
            <input
              type="text"
              placeholder="Comma-separated values (e.g. A,B,C)"
              className="w-full bg-transparent border-b-2 border-purple-500 p-3 text-white"
              value={newRule.allowedValues || ""}
              onChange={(e) =>
                setNewRule({ ...newRule, allowedValues: e.target.value })
              }
            />
          )}

          {["startsWith", "endsWith"].includes(newRule.type) && (
            <input
              type="text"
              placeholder={`Value must ${
                newRule.type === "startsWith" ? "start" : "end"
              } with...`}
              className="w-full bg-transparent border-b-2 border-purple-500 p-3 text-white"
              value={newRule.targetValue || ""}
              onChange={(e) =>
                setNewRule({ ...newRule, targetValue: e.target.value })
              }
            />
          )}

          <input
            type="text"
            placeholder="Error Message"
            value={newRule.errorMessage}
            onChange={(e) =>
              setNewRule({ ...newRule, errorMessage: e.target.value })
            }
            className="w-full bg-transparent border-b-2 border-purple-500 p-3 text-white focus:outline-none focus:border-purple-400"
          />

          <div className="flex flex-row-reverse justify-end gap-2 items-center pt-2">
            <label htmlFor="errorColor" className="text-xl">
              Error Highlight color
            </label>
            <input
              name="errorColor"
              type="color"
              value={newRule.errorColor}
              onChange={(e) =>
                setNewRule({ ...newRule, errorColor: e.target.value })
              }
            />
          </div>

          <div className="w-full flex justify-end">
            <button
              onClick={handleAddRule}
              className="bg-green-500 flex items-center justify-evenly gap-1 text-white py-1 px-4 rounded-lg hover:bg-green-600"
            >
              <Plus size={20} /> {editRuleIndex !== null ? "Update" : "Save"}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <span className="font-semibold text-xl">Current Rules</span>
          <div className="max-h-32 overflow-y-auto flex flex-col gap-2">
            {rules.map((rule: any, index: number) => (
              <div
                key={index}
                className="bg-purple-600 text-white rounded-lg p-3 flex justify-between items-center shadow-md"
              >
                <div className="flex flex-col text-sm">
                  <span>
                    <strong>Column:</strong> {rule.column}
                  </span>
                  <span>
                    <strong>Type:</strong> {rule.type}
                  </span>
                  <span>
                    <strong>Message:</strong> {rule.errorMessage}
                  </span>
                </div>

                <div className="flex gap-3 items-center">
                  <button
                    onClick={() => {
                      setNewRule(rule);
                      setEditRuleIndex(index);
                    }}
                    className="p-2 bg-yellow-400 hover:bg-yellow-500 text-black rounded-full"
                    title="Edit"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => {
                      const updatedRules = [...rules];
                      updatedRules.splice(index, 1);
                      setRules(updatedRules);
                      if (editRuleIndex === index) {
                        setEditRuleIndex(null);
                        resetRule()
                      }
                    }}
                    className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-full"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          className="bg-purple-500 text-white py-2 px-6 rounded-lg shadow-lg mt-4 hover:bg-purple-600"
        >
          Save Rule Set
        </button>
      </Modal>
    </div>
  );
};

export default RuleConfigurator;
