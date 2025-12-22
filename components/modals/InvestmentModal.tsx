import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Calendar } from 'lucide-react';
import { InvestmentData } from '../../types';

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: InvestmentData) => void;
  initialData?: InvestmentData | null;
}

const DEPARTMENTS = [
  "Dirección de Desarrollo Comunitario (DIDECO)",
  "Dirección de Tránsito y Transporte Público",
  "Dirección de Obras Municipales (DOM)",
  "Dirección de Desarrollo Ambiental (DDA)",
  "Dirección de Administración y Finanzas (DAF)",
  "Secretaría Comunal de Planificación (SECPLA)"
];

const POSTULATION_STATES = [
  "En preparación",
  "Enviada",
  "Espera resultados",
  "Adjudicada",
  "No adjudicado"
];

const InvestmentModal: React.FC<InvestmentModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [data, setData] = useState<InvestmentData>({
    id: '',
    type: '',
    department: '',
    inscriptionDate: '',
    postulationState: '',
    financier: '',
    fund: '',
    responsible: '',
    postulationDate: '',
    resultDate: '',
    documents: []
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setData(initialData);
      } else {
        setData({ 
          id: Date.now().toString(), 
          type: '', 
          department: '', 
          inscriptionDate: '', 
          postulationState: '',
          financier: '',
          fund: '',
          responsible: '',
          postulationDate: '',
          resultDate: '',
          documents: [] 
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (key: keyof InvestmentData, value: string) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave(data);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Financiamiento</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6">
            {/* Row 1: Tipo & Estado (if Externo) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="block text-gray-700 font-medium text-xs">Tipo</label>
                    <div className="relative">
                        <select
                            className="w-full appearance-none bg-white border border-gray-300 px-4 py-2.5 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer pr-10 text-sm"
                            value={data.type}
                            onChange={(e) => handleChange('type', e.target.value as any)}
                        >
                            <option value="" disabled hidden>Seleccionar</option>
                            <option value="Propio">Propio</option>
                            <option value="Externo">Externo</option>
                            <option value="Sin definir">Sin definir</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                </div>

                {data.type === 'Externo' && (
                    <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1">
                        <label className="block text-gray-700 font-medium text-xs">Estado de postulación</label>
                        <div className="relative">
                            <select
                                className="w-full appearance-none bg-white border border-gray-300 px-4 py-2.5 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer pr-10 text-sm"
                                value={data.postulationState}
                                onChange={(e) => handleChange('postulationState', e.target.value)}
                            >
                                <option value="" disabled hidden>Seleccionar</option>
                                {POSTULATION_STATES.map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>
                )}
            </div>

            {/* Conditional Content based on Type */}
            {data.type === 'Propio' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-1">
                    <div className="space-y-1.5">
                        <label className="block text-gray-700 font-medium text-xs">Departamento</label>
                        <div className="relative">
                            <select
                                className="w-full appearance-none bg-white border border-gray-300 px-4 py-2.5 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer pr-10 text-sm"
                                value={data.department}
                                onChange={(e) => handleChange('department', e.target.value)}
                            >
                                <option value="" disabled hidden>Seleccionar</option>
                                {DEPARTMENTS.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-gray-700 font-medium text-xs">Fecha inscripción</label>
                        <div className="relative group">
                            <button 
                                className="w-full text-left bg-white border border-gray-300 px-4 py-2.5 rounded-md text-gray-500 hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary flex justify-between items-center text-sm transition-colors"
                                onClick={() => handleChange('inscriptionDate', new Date().toLocaleDateString('es-CL'))}
                            >
                                {data.inscriptionDate || "Seleccionar"}
                                <Calendar size={16} className="text-gray-400" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {data.type === 'Externo' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-top-1">
                    {/* Financista */}
                    <div className="space-y-1.5">
                        <label className="block text-gray-700 font-medium text-xs">Financista</label>
                        <input 
                            type="text" 
                            placeholder="Nombre del organismo"
                            className="w-full bg-white border border-gray-300 px-4 py-2.5 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm placeholder-gray-300"
                            value={data.financier}
                            onChange={(e) => handleChange('financier', e.target.value)}
                        />
                    </div>

                    {/* Fondo */}
                    <div className="space-y-1.5">
                        <label className="block text-gray-700 font-medium text-xs">Fondo</label>
                        <input 
                            type="text" 
                            placeholder="Nombre del financiamiento"
                            className="w-full bg-white border border-gray-300 px-4 py-2.5 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm placeholder-gray-300"
                            value={data.fund}
                            onChange={(e) => handleChange('fund', e.target.value)}
                        />
                    </div>

                    {/* Responsable */}
                    <div className="space-y-1.5">
                        <label className="block text-gray-700 font-medium text-xs">Responsable de la postulación</label>
                        <input 
                            type="text" 
                            placeholder="Nombre del responsable"
                            className="w-full bg-white border border-gray-300 px-4 py-2.5 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm placeholder-gray-300"
                            value={data.responsible}
                            onChange={(e) => handleChange('responsible', e.target.value)}
                        />
                    </div>

                    {/* Dates Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="block text-gray-700 font-medium text-xs">Fecha postulación</label>
                            <div className="relative">
                                <button 
                                    className="w-full text-left bg-white border border-gray-300 px-4 py-2.5 rounded-md text-gray-500 hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary flex justify-between items-center text-sm transition-colors"
                                    onClick={() => handleChange('postulationDate', new Date().toLocaleDateString('es-CL'))}
                                >
                                    {data.postulationDate || "Seleccionar"}
                                    <Calendar size={16} className="text-gray-400" />
                                </button>
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-gray-700 font-medium text-xs">Fecha de resultados</label>
                            <div className="relative">
                                <button 
                                    className="w-full text-left bg-white border border-gray-300 px-4 py-2.5 rounded-md text-gray-500 hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary flex justify-between items-center text-sm transition-colors"
                                    onClick={() => handleChange('resultDate', new Date().toLocaleDateString('es-CL'))}
                                >
                                    {data.resultDate || "Seleccionar"}
                                    <Calendar size={16} className="text-gray-400" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="px-8 pb-10 flex justify-center">
          <button
            onClick={handleSave}
            className="bg-primary text-white w-full max-w-[160px] py-2.5 rounded-md font-semibold hover:bg-opacity-90 transition-all shadow-sm text-sm"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestmentModal;