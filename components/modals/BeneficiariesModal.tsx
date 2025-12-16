import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { BeneficiariesData } from '../../types';

interface BeneficiariesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: BeneficiariesData) => void;
  initialData: BeneficiariesData | null;
}

const BeneficiariesModal: React.FC<BeneficiariesModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [direct, setDirect] = useState("");
  const [indirect, setIndirect] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setDirect(initialData.direct);
        setIndirect(initialData.indirect);
      } else {
        setDirect("");
        setIndirect("");
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ direct, indirect });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Beneficiarios</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6 overflow-y-auto">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Beneficiario Directo</label>
            <textarea
              placeholder="Beneficiario directo de la iniciativa"
              value={direct}
              onChange={(e) => setDirect(e.target.value)}
              className="w-full h-24 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none placeholder-gray-400 text-gray-700 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Beneficiario Indirecto</label>
            <textarea
              placeholder="Beneficiario indirecto de la iniciativa"
              value={indirect}
              onChange={(e) => setIndirect(e.target.value)}
              className="w-full h-24 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none placeholder-gray-400 text-gray-700 text-sm"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex justify-center pb-8 mt-auto">
          <button
            onClick={handleSave}
            className="bg-primary text-white px-12 py-2.5 rounded-md font-medium hover:bg-opacity-90 transition-colors shadow-md"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default BeneficiariesModal;