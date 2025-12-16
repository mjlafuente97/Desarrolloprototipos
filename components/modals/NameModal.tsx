import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface NameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  onSave: (newName: string) => void;
}

const NameModal: React.FC<NameModalProps> = ({ isOpen, onClose, currentName, onSave }) => {
  const [name, setName] = useState(currentName);

  // Reset name when modal opens
  useEffect(() => {
    if (isOpen) setName(currentName === "Nueva Iniciativa" ? "" : currentName);
  }, [isOpen, currentName]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-xl mx-4 overflow-hidden animate-fade-in-up p-2">
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-2">
          <h2 className="text-xl font-semibold text-gray-800">Nueva iniciativa</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 pt-2 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre
            </label>
            <input
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-gray-300"
              placeholder="Agregar nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-2 pb-8 flex justify-center">
          <button
            onClick={() => onSave(name || "Nueva Iniciativa")}
            className="bg-primary text-white px-10 py-2.5 rounded-md font-medium hover:bg-opacity-90 transition-colors shadow-sm"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default NameModal;