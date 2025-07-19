// RuleConfigurator.tsx
import { useState } from "react";
import { useRuleContext } from "../context/RuleContext"; // Import the context
import Modal from "react-modal";
import RuleList from "../components/RulesList";
import { Pencil, Plus, Trash2 } from "lucide-react";

const RuleConfigurator = () => {
  const { dispatch } = useRuleContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [ruleSetName, setRuleSetName] = useState("");
  const [rules, setRules] = useState<any[]>([]);
  const [newRule, setNewRule] = useState({
    column: "",
    type: "",
    errorMessage: "",
    errorColor: "#ff0000",
  });
  const [editMode, setEditMode] = useState(false);
  const [editRuleIndex, setEditRuleIndex] = useState<number | null>(null);
  const [editRuleSetName, setEditRuleSetName] = useState<string | null>(null);

  const handleAddRule = () => {
    if (editRuleIndex !== null) {
      const updatedRules = [...rules];
      updatedRules[editRuleIndex] = newRule;
      setRules(updatedRules);
      setEditRuleIndex(null);
    } else {
      setRules([...rules, newRule]);
    }

    setNewRule({
      column: "",
      type: "",
      errorMessage: "",
      errorColor: "#ff0000",
    });
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
    setNewRule({
      column: "",
      type: "",
      errorMessage: "",
      errorColor: "#ff0000",
    });
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
            onChange={(e) => setNewRule({ ...newRule, type: e.target.value })}
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
          </select>

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
                        setNewRule({
                          column: "",
                          type: "",
                          errorMessage: "",
                          errorColor: "#ff0000",
                        });
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
