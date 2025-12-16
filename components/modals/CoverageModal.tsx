import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CoverageData } from '../../types';

interface CoverageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CoverageData) => void;
  initialData: CoverageData | null;
}

const CoverageModal: React.FC<CoverageModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [link, setLink] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setLink(initialData.link);
      } else {
        setLink("");
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSave = () => {
    // We assume if they save, they want the map visualization
    onSave({ link, hasMap: true });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Cobertura y accesibilidad</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6 overflow-y-auto">
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Vincular isocrona de un núcleo</label>
            <input
              type="text"
              placeholder="Pegar link de un núcleo"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-400 text-sm"
            />
          </div>

          <div>
            <h3 className="block text-sm font-semibold text-gray-700 mb-2">Previsualización</h3>
            <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
               <img 
                 src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop" 
                 alt="Map" 
                 className="w-full h-full object-cover opacity-50 grayscale"
               />
               
               {/* Visual simulation of an isochrone polygon */}
               <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 400 320" preserveAspectRatio="none">
                  <path 
                    d="M150,160 Q180,100 220,130 T280,160 T220,240 T150,220 T100,160 T150,160 Z"
                    className="fill-blue-400/30 stroke-blue-500 stroke-2"
                  />
                  {/* Center point */}
                  <circle cx="200" cy="180" r="4" className="fill-white stroke-blue-600 stroke-2" />
               </svg>
            </div>
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

export default CoverageModal;