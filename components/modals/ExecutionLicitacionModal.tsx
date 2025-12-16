import React, { useState, useEffect } from 'react';
import { X, ChevronDown, Calendar, Plus, Trash2 } from 'lucide-react';
import { LicitacionData, LicitacionDate } from '../../types';

interface ExecutionLicitacionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: LicitacionData) => void;
  initialData?: LicitacionData | null;
}

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

  // Date management
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
      // Demo default fill if empty for smoother demo flow, or save what's there
      if (!formData.type && !formData.detail) {
          onSave({
            type: "Obra",
            detail: "300m2 de estacionamientos",
            status: "En preparación",
            link: "www.mercadopublico.cl/saldkfk/235",
            dates: [
                { date: "16-10-2026", title: "Entrega primer avance" },
                { date: "30-10-2026", title: "Entrega segundo avance" },
                { date: "16-10-2026", title: "Entrega final" }
            ],
            executor: "Consulta Gutierrez Spa rut: 17.397.202-K",
            resolution: "342fsls3",
            amount: "26.000.000"
          });
      } else {
          onSave(formData);
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Licitación 1</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-5 overflow-y-auto">
          
          {/* Tipo */}
          <div className="flex items-center gap-4">
              <label className="w-32 text-sm font-semibold text-gray-700">Tipo:</label>
              <div className="relative flex-1">
                <select
                    className="w-full appearance-none bg-white border border-gray-300 px-4 py-2.5 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer pr-10"
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                >
                    <option value="" disabled hidden>Seleccionar</option>
                    <option value="Obra">Obra</option>
                    <option value="Consultoría">Consultoría</option>
                    <option value="Equipamiento">Equipamiento</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
          </div>

          {/* Detalle */}
          <div className="space-y-2">
             <label className="block text-sm font-semibold text-gray-700">Detalle de la licitación</label>
             <input 
                type="text" 
                placeholder="Nombre o descripción de la licitación"
                value={formData.detail}
                onChange={(e) => handleChange('detail', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-300 text-sm"
             />
          </div>

          {/* Estado */}
          <div className="flex items-center gap-4">
              <label className="w-32 text-sm font-semibold text-gray-700">Estado de licitación:</label>
              <div className="relative flex-1">
                <select
                    className="w-full appearance-none bg-white border border-gray-300 px-4 py-2.5 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer pr-10"
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                >
                    <option value="" disabled hidden>Seleccionar</option>
                    <option value="En preparación">En preparación</option>
                    <option value="Publicada">Publicada</option>
                    <option value="Cerrada">Cerrada</option>
                    <option value="Adjudicada">Adjudicada</option>
                    <option value="Desierta">Desierta</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
          </div>

          {/* Link */}
          <div className="space-y-2">
             <label className="block text-sm font-semibold text-gray-700">Link</label>
             <input 
                type="text" 
                placeholder="Link de la licitación"
                value={formData.link}
                onChange={(e) => handleChange('link', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-300 text-sm"
             />
          </div>

           {/* Fechas importantes */}
           <div className="space-y-2">
             <label className="block text-sm font-semibold text-gray-700">Fechas importantes</label>
             <div className="flex gap-2">
                <div className="relative w-1/3">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar size={16} className="text-gray-400" />
                    </div>
                    <input 
                        type="text" // Using text to simulate "Seleccionar" placeholder behavior more easily for demo
                        placeholder="Seleccionar"
                        onFocus={(e) => e.target.type = 'date'}
                        onBlur={(e) => e.target.type = 'text'}
                        value={tempDate}
                        onChange={(e) => setTempDate(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-400 text-sm"
                    />
                </div>
                <input 
                    type="text"
                    placeholder="Título"
                    value={tempDateTitle}
                    onChange={(e) => setTempDateTitle(e.target.value)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-300 text-sm"
                />
             </div>
             
             <button 
                onClick={handleAddDate}
                disabled={!tempDate || !tempDateTitle}
                className="flex items-center text-gray-500 hover:text-primary text-sm font-medium mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
             >
                <Plus size={16} className="mr-1" />
                Añadir
             </button>

             {/* List of dates */}
             {formData.dates.length > 0 && (
                 <div className="mt-3 space-y-2">
                     {formData.dates.map((d, idx) => (
                         <div key={idx} className="flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-100 text-sm">
                             <div className="flex gap-4">
                                 <span className="font-medium text-gray-700">{d.date}</span>
                                 <span className="text-gray-600">{d.title}</span>
                             </div>
                             <button onClick={() => removeDate(idx)} className="text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                         </div>
                     ))}
                 </div>
             )}
          </div>

          {/* Adjudicado / Ejecutor */}
          <div className="space-y-2">
             <label className="block text-sm font-semibold text-gray-700">Adjudicado / Ejecutor</label>
             <input 
                type="text" 
                placeholder="Nombre del ejecutor"
                value={formData.executor}
                onChange={(e) => handleChange('executor', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-300 text-sm"
             />
          </div>

          {/* Resolución */}
          <div className="space-y-2">
             <label className="block text-sm font-semibold text-gray-700">Resolución</label>
             <input 
                type="text" 
                placeholder="Resolución"
                value={formData.resolution}
                onChange={(e) => handleChange('resolution', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-300 text-sm"
             />
          </div>

          {/* Monto */}
          <div className="space-y-2">
             <label className="block text-sm font-semibold text-gray-700">Monto</label>
             <input 
                type="text" 
                placeholder="Pesos"
                value={formData.amount}
                onChange={(e) => handleChange('amount', e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-300 text-sm"
             />
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-center">
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

export default ExecutionLicitacionModal;