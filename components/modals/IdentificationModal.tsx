
import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Plus } from 'lucide-react';
import { IdentificationData } from '../../types';

interface IdentificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: IdentificationData) => void;
}

const IdentificationModal: React.FC<IdentificationModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<IdentificationData>({
    imagePreview: null,
    description: "",
    responsibleUnit: "",
    inCharge: "",
    code1: "",
    code2: ""
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state when modal opens to simulate the "Start from scratch" flow
  useEffect(() => {
    if (isOpen) {
        setFormData({
            imagePreview: null,
            description: "",
            responsibleUnit: "",
            inCharge: "",
            code1: "",
            code2: ""
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imagePreview: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-y-auto py-10">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 my-auto relative animate-fade-in-up">
        
        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Identificación</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Column: Image & Inputs */}
          <div className="space-y-6">
             {/* Image Upload Area */}
             <div className="space-y-2">
                <div 
                    onClick={!formData.imagePreview ? handleUploadClick : undefined}
                    className={`w-full aspect-video rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group transition-all
                    ${!formData.imagePreview ? 'bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%,transparent_75%,#f0f0f0_75%,#f0f0f0),linear-gradient(45deg,#f0f0f0_25%,transparent_25%,transparent_75%,#f0f0f0_75%,#f0f0f0)] bg-[length:20px_20px] bg-[position:0_0,10px_10px]' : ''}`}
                >
                    {formData.imagePreview ? (
                        <>
                            <img src={formData.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                            <button 
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setFormData(prev => ({...prev, imagePreview: null}));
                                    if (fileInputRef.current) fileInputRef.current.value = "";
                                }}
                                className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80 transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col items-center gap-3">
                            <Upload className="text-gray-400" size={32} />
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleUploadClick(); }}
                                className="bg-gray-700 text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-800 transition-colors"
                            >
                                Subir imagen
                            </button>
                        </div>
                    )}
                </div>
             </div>
             
             {/* Inputs stacked below image */}
             <div className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Unidad Responsable</label>
                    <input 
                        type="text" 
                        placeholder="Nombre de la unidad"
                        value={formData.responsibleUnit}
                        onChange={(e) => setFormData(prev => ({...prev, responsibleUnit: e.target.value}))}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none placeholder-gray-300 text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Encargado</label>
                    <input 
                        type="text" 
                        placeholder="Nombre del responsable"
                        value={formData.inCharge}
                        onChange={(e) => setFormData(prev => ({...prev, inCharge: e.target.value}))}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent outline-none placeholder-gray-300 text-sm"
                    />
                </div>
                
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Códigos de identificación</label>
                    <div className="space-y-3">
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600 w-20">Código 1</span>
                            <input 
                                type="text" 
                                placeholder="Escribir código"
                                value={formData.code1}
                                onChange={(e) => setFormData(prev => ({...prev, code1: e.target.value}))}
                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary outline-none placeholder-gray-300 text-sm"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-600 w-20">Código 2</span>
                            <input 
                                type="text" 
                                placeholder="Escribir código"
                                value={formData.code2}
                                onChange={(e) => setFormData(prev => ({...prev, code2: e.target.value}))}
                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary outline-none placeholder-gray-300 text-sm"
                            />
                        </div>
                        <button className="flex items-center text-gray-400 hover:text-primary text-sm font-medium mt-1">
                            <Plus size={16} className="mr-1" />
                            Añadir
                        </button>
                    </div>
                </div>
             </div>
          </div>

          {/* Right Column: Description */}
          <div className="space-y-6">
            <div className="h-full flex flex-col">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción</label>
                <textarea 
                    placeholder="Descripción breve de la iniciativa"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                    className="w-full flex-1 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary outline-none resize-none text-gray-600 text-sm leading-relaxed placeholder-gray-300 min-h-[200px]"
                />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-center">
          <button
            onClick={() => onSave(formData)}
            className="bg-primary text-white px-12 py-2.5 rounded-md font-medium hover:bg-opacity-90 transition-colors shadow-sm"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default IdentificationModal;
