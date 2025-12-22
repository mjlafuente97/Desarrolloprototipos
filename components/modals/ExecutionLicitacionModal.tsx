import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Calendar, Plus, Trash2 } from 'lucide-react';
import { LicitacionData, LicitacionDate } from '../../types';

interface ExecutionLicitacionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: LicitacionData) => void;
  initialData?: LicitacionData | null;
}

const LICITACION_STATUS_OPTIONS = [
  "En preparación",
  "Publicada",
  "Cerrada",
  "Desierta",
  "Adjudicada",
  "Revocada",
  "Suspendida"
];

const LICITACION_TYPE_OPTIONS = [
  "(L1) Licitación Pública Menor a 100 UTM",
  "(LE) Licitación Pública Entre 100 y 1000 UTM",
  "(LP) Licitación Pública igual o superior a 1.000 UTM e inferior a 2.000 UTM",
  "(LQ) Licitación Pública igual o superior a 2.000 UTM e inferior a 5.000 UTM",
  "(LR) Licitación Pública igual o superior a 5.000 UTM",
  "(LS) Licitación Pública Servicios personales especializados",
  "(O1) Licitación Pública de Obras",
  "(E2) Licitación Privada Inferior a 100 UTM",
  "(CO) Licitación Privada igual o superior a 100 UTM e inferior a 1000 UTM",
  "(B2) Licitación Privada igual o superior a 1000 UTM e inferior a 2000 UTM",
  "(H2) Licitación Privada igual o superior a 2000 UTM e inferior a 5000 UTM",
  "(I2) Licitación Privada Mayor a 5000 UTM",
  "(O2) Licitación Privada de Obras",
  "(CI) Contrato para la Innovación con preselección",
  "(DC) Diálogos Competitivos",
  "(CI2) Contratos para la Innovación Fase 2",
  "(DC2) Diálogos Competitivos Fase 2"
];

const ExecutionLicitacionModal: React.FC<ExecutionLicitacionModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState<LicitacionData>({
    type: "",
    detail: "",
    status: "",
    link: "",
    dates: [],
    executor: "",
    resolution: "",
    amount: ""
  });

  // Temporales para el flujo de "Añadir otra"
  const [tempDate, setTempDate] = useState("");
  const [tempDateTitle, setTempDateTitle] = useState("");

  useEffect(() => {
    if (isOpen) {
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                type: "",
                detail: "",
                status: "",
                link: "",
                dates: [],
                executor: "",
                resolution: "",
                amount: ""
            });
        }
        setTempDate("");
        setTempDateTitle("");
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (key: keyof LicitacionData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleAddDate = () => {
    if (tempDate && tempDateTitle) {
        const newDate: LicitacionDate = { date: tempDate, title: tempDateTitle };
        setFormData(prev => ({ ...prev, dates: [...prev.dates, newDate] }));
        setTempDate("");
        setTempDateTitle("");
    }
  };

  const removeDate = (index: number) => {
      setFormData(prev => ({ ...prev, dates: prev.dates.filter((_, i) => i !== index) }));
  };

  const handleSave = () => {
      onSave(formData);
  };

  const isAdjudicada = formData.status === "Adjudicada";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-xl flex flex-col max-h-[95vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Licitación 1</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6 overflow-y-auto">
          
          {/* Tipo - Dropdown de capsula */}
          <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Tipo:</label>
              <div className="relative">
                <select
                    className="w-full appearance-none bg-white border border-gray-300 px-4 py-2.5 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer pr-10 text-sm"
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                >
                    <option value="" disabled hidden>Seleccionar</option>
                    {LICITACION_TYPE_OPTIONS.map(opt => (
                      <option key={opt} value={opt} className="text-sm">
                        {opt}
                      </option>
                    ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
          </div>

          {/* Nombre de la licitación */}
          <div className="flex flex-col gap-1.5">
             <label className="text-sm font-medium text-gray-700">Nombre de la licitación</label>
             <input 
                type="text" 
                placeholder="Nombre de la licitación"
                value={formData.detail}
                onChange={(e) => handleChange('detail', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder-gray-300 text-sm transition-all"
             />
          </div>

          {/* Estado de licitación - Dropdown de capsula */}
          <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Estado de licitación:</label>
              <div className="relative">
                <select
                    className="w-full appearance-none bg-white border border-gray-300 px-4 py-2.5 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer pr-10 text-sm"
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                >
                    <option value="" disabled hidden>Seleccionar</option>
                    {LICITACION_STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
          </div>

          {/* Link */}
          <div className="flex flex-col gap-1.5">
             <label className="text-sm font-medium text-gray-700">Link</label>
             <input 
                type="text" 
                placeholder="Link de la licitación"
                value={formData.link}
                onChange={(e) => handleChange('link', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder-gray-300 text-sm transition-all"
             />
          </div>

           {/* Fechas importantes - Selección y agregado múltiple */}
           <div className="space-y-2">
             <label className="text-sm font-medium text-gray-700">Fechas importantes</label>
             <div className="flex gap-2">
                <div className="relative w-1/3">
                    <div className="w-full bg-white border border-gray-300 px-4 py-2.5 rounded-md text-gray-500 hover:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 flex justify-between items-center text-sm transition-colors group cursor-pointer">
                        <span className={tempDate ? "text-gray-700" : "text-gray-400"}>
                            {tempDate ? tempDate : "Seleccionar"}
                        </span>
                        <Calendar size={14} className="text-gray-400 group-hover:text-primary transition-colors" />
                        <input 
                            type="date"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            value={tempDate}
                            onChange={(e) => setTempDate(e.target.value)}
                        />
                    </div>
                </div>
                <input 
                    type="text"
                    placeholder="Título"
                    value={tempDateTitle}
                    onChange={(e) => setTempDateTitle(e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder-gray-300 text-sm transition-all"
                />
             </div>
             
             <button 
                onClick={handleAddDate}
                disabled={!tempDate || !tempDateTitle}
                className="flex items-center text-gray-400 hover:text-primary text-sm font-medium mt-1 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
             >
                <Plus size={16} className="mr-1" />
                Añadir
             </button>

             {/* Lista de fechas agregadas */}
             {formData.dates.length > 0 && (
                 <div className="mt-4 space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                     {formData.dates.map((d, idx) => (
                         <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm animate-in fade-in slide-in-from-top-1">
                             <div className="flex gap-4">
                                 <span className="font-semibold text-gray-700 w-24">{d.date}</span>
                                 <span className="text-gray-600 truncate">{d.title}</span>
                             </div>
                             <button 
                                onClick={() => removeDate(idx)} 
                                className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                title="Eliminar fecha"
                             >
                                <Trash2 size={14}/>
                             </button>
                         </div>
                     ))}
                 </div>
             )}
          </div>

          {/* Campos condicionales - Solo aparecen si el estado es 'Adjudicada' */}
          {isAdjudicada && (
            <div className="space-y-6 pt-4 border-t border-gray-100 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">Adjudicado / Ejecutor</label>
                    <input 
                        type="text" 
                        placeholder="Nombre del ejecutor"
                        value={formData.executor}
                        onChange={(e) => handleChange('executor', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder-gray-300 text-sm transition-all"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">Resolución</label>
                    <input 
                        type="text" 
                        placeholder="Resolución"
                        value={formData.resolution}
                        onChange={(e) => handleChange('resolution', e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder-gray-300 text-sm transition-all"
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">Monto</label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                        <input 
                            type="text" 
                            placeholder="Pesos"
                            value={formData.amount}
                            onChange={(e) => handleChange('amount', e.target.value)}
                            className="w-full pl-8 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder-gray-300 text-sm transition-all"
                        />
                    </div>
                </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-8 pb-10 pt-4 flex justify-center bg-white border-t border-gray-50">
          <button
            onClick={handleSave}
            className="bg-primary text-white w-full max-w-[160px] py-2.5 rounded-md font-bold hover:bg-opacity-90 transition-all shadow-md active:scale-95 text-sm"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExecutionLicitacionModal;