import React, { useState } from "react";
import { useRuleContext } from "../context/RuleContext"; // Import the context
import { Edit, Eye, FileX, Plus } from "lucide-react";

// Modal component
const Modal: React.FC<{ ruleSet: { name: string; rules: any[] }; onClose: () => void }> = ({ ruleSet, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 ">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[60vw] h-[60vh] ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{ruleSet.name}</h2>
          <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
            Close
          </button>
        </div>
        <pre className="bg-gray-100 p-4 rounded-lg h-4/5 overflow-x-hidden overflow-y-auto ">{JSON.stringify(ruleSet.rules, null, 2)}</pre>
      </div>
    </div>
  );
};

interface RuleListProps {
  setModalOpen: (args: boolean) => void;
  onEdit: (ruleSet: { name: string; rules: any[] }) => void; // ✅ NEW
}

const RuleList: React.FC<RuleListProps> = ({ setModalOpen, onEdit }) => {
  const { state } = useRuleContext();
  const [selectedRuleSet, setSelectedRuleSet] = useState<{ name: string; rules: any[] } | null>(null);

  const handleViewClick = (ruleSet: { name: string; rules: any[] }) => {
    setSelectedRuleSet(ruleSet);
  };

  const handleCloseModal = () => {
    setSelectedRuleSet(null);
  };

  return (
    <div className="p-6">
      <div className="flex text-white justify-between w-full mb-6">
        <h2 className="text-4xl font-semibold">Saved Rule Sets</h2>
        <button
          className="flex items-center gap-1 bg-purple-500 text-white px-4 py-2 rounded-md font-medium"
          onClick={() => setModalOpen(true)}
        >
          <Plus size={22} /> Create Rule Set
        </button>
      </div>

      <div>
        {state.ruleSets.length === 0 ? (
          <p className="text-gray-600 text-center text-3xl flex flex-col items-center gap-5">
            <FileX size={72} /> No rule sets available.
          </p>
        ) : (
          <ul>
            {state.ruleSets.map((ruleSet: any, index: number) => (
              <li key={index} className="mb-4 bg-white p-6 rounded-lg shadow-lg flex justify-between items-center">
                <div className="font-semibold">{ruleSet.name}</div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleViewClick(ruleSet)}
                    className="bg-purple-500 text-white p-3 rounded-lg hover:bg-blue-600"
                  >
                    <Eye size={28} />
                  </button>
                  <button
                    onClick={() => onEdit(ruleSet)} // ✅ Trigger edit
                    className="bg-purple-500 text-white p-3 rounded-lg hover:bg-yellow-600"
                  >
                    <Edit size={28}/>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedRuleSet && <Modal ruleSet={selectedRuleSet} onClose={handleCloseModal} />}
    </div>
  );
};

export default RuleList;

