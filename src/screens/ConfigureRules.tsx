// RuleConfigurator.tsx
import { useState } from "react";
import { useRuleContext } from "../context/RuleContext"; // Import the context
import Modal from "react-modal";
import RuleList from "../components/RulesList";
import { Plus } from "lucide-react";

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

  const handleAddRule = () => {
    setRules([...rules, newRule]);
    setNewRule({ column: "", type: "", errorMessage: "", errorColor: "#ff0000" });
  };

  const handleSave = () => {
    if (!ruleSetName.trim()) {
      alert("Please provide a name for the rule set");
      return;
    }

    const ruleSet = { name: ruleSetName, rules };
    dispatch({ type: "ADD_RULE_SET", payload: ruleSet });

    // Reset form fields
    setRuleSetName("");
    setRules([]);
    setModalOpen(false);
  };

  return (
    <div className="bg-gray-800 h-screen p-6 pt-32">
      <RuleList setModalOpen={setModalOpen} />

      <Modal
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        contentLabel="Create Rule Set"
        className="bg-white p-8 rounded-lg shadow-lg max-w-lg mx-auto mt-[10vh]"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 "
      >
        {/* <h3 className="text-xl font-semibold mb-4">Create New Rule Set</h3> */}

        <div className="flex justify-between mb-5">
          {/* Rule Set Name */}
          <input
            type="text"
            placeholder="Rule Set Name"
            value={ruleSetName}
            onChange={(e) => setRuleSetName(e.target.value)}
            className="w-full outline-none border-b-2 p-3 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="mb-4 space-y-3">
          <div className="flex justify-between">
            {/* Rule Inputs */}
            <span className="font-semibold text-xl">Create Rule</span>
            {/* Add Rule Button */}
            <button
              onClick={handleAddRule}
              className="bg-green-500 flex items-center justify-evenly gap-1 text-white py-1 px-4 rounded-lg  hover:bg-green-600"
            >
              <Plus size={20} /> Save
            </button>
          </div>
          <input
            type="text"
            placeholder="Column Name"
            value={newRule.column}
            onChange={(e) => setNewRule({ ...newRule, column: e.target.value })}
            className="w-full outline-none border-b-2 p-3 focus:outline-none focus:border-purple-500"
          />

          <select
            value={newRule.type}
            onChange={(e) => setNewRule({ ...newRule, type: e.target.value })}
            className="w-full outline-none border-b-2 p-3 focus:outline-none focus:border-purple-500"
          >
            <option value="">Select Rule Type</option>
            <option value="required">Required</option>
            <option value="range">Range</option>
            <option value="email">Email</option>
          </select>

          <input
            type="text"
            placeholder="Error Message"
            value={newRule.errorMessage}
            onChange={(e) => setNewRule({ ...newRule, errorMessage: e.target.value })}
            className="w-full outline-none border-b-2 p-3 focus:outline-none focus:border-purple-500"
          />

          <div className="flex flex-row-reverse justify-end gap-2 items-center px-3" >
            <label htmlFor="errorColor" className="text-xl" >Error Highlight color</label>
            <input
              name="errorColor"
              type="color"
              placeholder="Error Highlight Color"
              value={newRule.errorColor}
              onChange={(e) => setNewRule({ ...newRule, errorColor: e.target.value })}
              // className="w-full outline-none border-b-2 p-3 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <span className="font-semibold text-xl">Current Rules</span>
          <div className="max-h-32 overflow-y-auto flex flex-col gap-2 ">
            {rules.map((rule: any) => {
              return (
                <div className=" bg-purple-400 text-white rounded-lg p-2 flex gap-2">
                  <span>{rule.column}</span>,<span>{rule.type}</span>,<span>{rule.errorMessage}</span>
                </div>
              );
            })}
          </div>
        </div>
        {/* Save Rule Set */}
        <button onClick={handleSave} className="bg-blue-500 text-white py-2 px-6 rounded-lg shadow-lg mt-4 hover:bg-blue-600">
          Save Rule Set
        </button>
      </Modal>
    </div>
  );
};

export default RuleConfigurator;
