import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (problem: string) => void;
  initialValue: string;
}

const ProblemModal: React.FC<ProblemModalProps> = ({ isOpen, onClose, onSave, initialValue }) => {
  const [problem, setProblem] = useState("");

  useEffect(() => {
    if (isOpen) {
      setProblem(initialValue);
    }
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Problema o brecha</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8">
          <textarea
            placeholder="Problema o brecha identificada para esta iniciativa."
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            className="w-full h-40 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none placeholder-gray-400 text-gray-700"
          />
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex justify-center pb-8">
          <button
            onClick={() => onSave(problem)}
            className="bg-primary text-white px-12 py-2.5 rounded-md font-medium hover:bg-opacity-90 transition-colors shadow-md"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProblemModal;