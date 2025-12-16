import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Calendar } from 'lucide-react';
import { InvestmentData } from '../../types';

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: InvestmentData) => void;
  initialData?: InvestmentData | null;
}

const InvestmentModal: React.FC<InvestmentModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [data, setData] = useState<InvestmentData>({
    type: '',
    department: '',
    inscriptionDate: '',
    postulationState: '',
    financier: '',
    fund: '',
    responsible: '',
    postulationDate: '',
    resultDate: ''
  });

  // Load initial data or reset when opening
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setData(initialData);
      } else {
        setData({ type: '', department: '', inscriptionDate: '', postulationState: '', financier: '', fund: '', responsible: '', postulationDate: '', resultDate: '' });
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

  // Helper to render a date picker style input
  const DateInput = ({ value, onChange, placeholder }: { value?: string, onChange: (val: string) => void, placeholder: string }) => (
    <div className="relative">
      <button 
        className={`w-full text-left border border-gray-300 px-4 py-2.5 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent flex justify-between items-center ${!value ? 'text-gray-500' : 'text-gray-700'}`}
        onClick={() => {
            // Simulation of date picker interaction - using the date from the screenshot for consistency
            onChange("13-02-2024"); 
        }}
      >
        {value || placeholder}
        <Calendar size={16} className="text-gray-400" />
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className={`bg-white rounded-lg shadow-2xl w-full transition-all duration-300 ${data.type === 'Externo' ? 'max-w-4xl' : 'max-w-xl'}`}>
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Financiamiento</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8">
            
            {/* VIEW 1: Default / Propio (Matches Image 29) */}
            {data.type !== 'Externo' && (
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="block text-gray-700 font-semibold text-sm">Tipo</label>
                        <div className="relative">
                            <select
                                className="w-fit min-w-[200px] appearance-none bg-white border border-gray-300 px-4 py-2.5 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer pr-10"
                                value={data.type}
                                onChange={(e) => handleChange('type', e.target.value as any)}
                            >
                                <option value="" disabled hidden>Seleccionar</option>
                                <option value="Propio">Propio</option>
                                <option value="Externo">Externo</option>
                            </select>
                            <ChevronDown className="absolute left-[170px] top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-gray-700 font-semibold text-sm">Departamento</label>
                        <div className="relative">
                            <select
                                className="w-fit min-w-[200px] appearance-none bg-white border border-gray-300 px-4 py-2.5 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer pr-10"
                                value={data.department}
                                onChange={(e) => handleChange('department', e.target.value)}
                            >
                                <option value="" disabled hidden>Seleccionar</option>
                                <option value="Medio Ambiente">Medio Ambiente</option>
                                <option value="Finanzas">Finanzas</option>
                                <option value="Obras">Obras</option>
                            </select>
                            <ChevronDown className="absolute left-[170px] top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-gray-700 font-semibold text-sm">Fecha inscripción</label>
                        <div className="w-fit min-w-[200px]">
                            <DateInput 
                                value={data.inscriptionDate} 
                                onChange={(val) => handleChange('inscriptionDate', val)}
                                placeholder="Seleccionar"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* VIEW 2: Externo (Matches Image 30) */}
            {data.type === 'Externo' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Row 1 */}
                        <div className="space-y-2">
                            <label className="block text-gray-700 font-semibold text-sm">Tipo</label>
                            <div className="relative">
                                <select
                                    className="w-full appearance-none bg-white border border-gray-300 px-4 py-2.5 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer pr-10"
                                    value={data.type}
                                    onChange={(e) => handleChange('type', e.target.value as any)}
                                >
                                    <option value="Propio">Propio</option>
                                    <option value="Externo">Externo</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block text-gray-700 font-semibold text-sm">Estado de postulación</label>
                            <div className="relative">
                                <select
                                    className="w-full appearance-none bg-white border border-gray-300 px-4 py-2.5 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer pr-10"
                                    value={data.postulationState}
                                    onChange={(e) => handleChange('postulationState', e.target.value)}
                                >
                                    <option value="" disabled hidden>Seleccionar</option>
                                    <option value="En proceso">En proceso</option>
                                    <option value="Adjudicado">Adjudicado</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                            </div>
                        </div>
                    </div>

                    {/* Full Width Inputs */}
                    <div className="space-y-2">
                        <label className="block text-gray-700 font-semibold text-sm">Financista</label>
                        <input
                            type="text"
                            placeholder="Nombre del organismo"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-300"
                            value={data.financier}
                            onChange={(e) => handleChange('financier', e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-gray-700 font-semibold text-sm">Fondo</label>
                        <input
                            type="text"
                            placeholder="Nombre del financiamiento"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-300"
                            value={data.fund}
                            onChange={(e) => handleChange('fund', e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="block text-gray-700 font-semibold text-sm">Responsable de la postulación</label>
                        <input
                            type="text"
                            placeholder="Nombre del responsable"
                            className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-300"
                            value={data.responsible}
                            onChange={(e) => handleChange('responsible', e.target.value)}
                        />
                    </div>

                     {/* Row Bottom */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="block text-gray-700 font-semibold text-sm">Fecha postulación</label>
                            <DateInput 
                                value={data.postulationDate} 
                                onChange={(val) => handleChange('postulationDate', val)}
                                placeholder="Seleccionar"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-gray-700 font-semibold text-sm">Fecha de resultados</label>
                            <DateInput 
                                value={data.resultDate} 
                                onChange={(val) => handleChange('resultDate', val)}
                                placeholder="Seleccionar"
                            />
                        </div>
                    </div>

                </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex justify-center pb-8">
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

export default InvestmentModal;