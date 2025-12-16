import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { ImpactIndicator } from '../../types';

interface ImpactIndicatorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ImpactIndicator[]) => void;
  initialData: ImpactIndicator[];
}

const ImpactIndicatorsModal: React.FC<ImpactIndicatorsModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [items, setItems] = useState<ImpactIndicator[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (initialData && initialData.length > 0) {
        setItems(initialData);
      } else {
        // Initialize with two empty rows for default/demo look
        setItems([
            { id: Date.now().toString(), name: '', percentage: '', description: '' },
            { id: (Date.now() + 1).toString(), name: '', percentage: '', description: '' }
        ]);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), name: '', percentage: '', description: '' }
    ]);
  };

  const handleRemoveItem = (id: string) => {
      setItems(items.filter(item => item.id !== id));
  };

  const handleChange = (id: string, field: keyof ImpactIndicator, value: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSave = () => {
    // If empty for demo, fill with sample data
    const isBasicallyEmpty = items.every(i => !i.name && !i.percentage && !i.description);
    
    if (isBasicallyEmpty) {
        onSave([
            { id: '1', name: 'KPI 1: Cesfam operativo', percentage: '30%', description: 'Obra gruesa' },
            { id: '2', name: 'KPI 2: 100 adultos mayores nuevos inscritos', percentage: '0%', description: 'Aun no inicia la inscripción' },
            { id: '3', name: 'Encuesta de satisfacción', percentage: '85%', description: 'Encuesta realizada el 20 de enero' }
        ]);
    } else {
        onSave(items);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Indicadores de impacto</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto">
            {/* Table Headers */}
            <div className="grid grid-cols-12 gap-6 mb-2">
                <div className="col-span-4 text-sm font-semibold text-gray-700">KPI</div>
                <div className="col-span-3 text-sm font-semibold text-gray-700">% de logro</div>
                <div className="col-span-5 text-sm font-semibold text-gray-700">Descripción</div>
            </div>

            {/* Rows */}
            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-6 items-start group relative">
                        {/* KPI */}
                        <div className="col-span-4">
                            <input 
                                type="text"
                                placeholder="Nombre del KPI"
                                value={item.name}
                                onChange={(e) => handleChange(item.id, 'name', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-300 text-sm"
                            />
                        </div>
                        {/* Percentage */}
                        <div className="col-span-3">
                            <input 
                                type="text"
                                placeholder="Porcentaje"
                                value={item.percentage}
                                onChange={(e) => handleChange(item.id, 'percentage', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-300 text-sm"
                            />
                        </div>
                        {/* Description */}
                        <div className="col-span-5 relative">
                            <input 
                                type="text"
                                placeholder="Detalle del KPI"
                                value={item.description}
                                onChange={(e) => handleChange(item.id, 'description', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-300 text-sm"
                            />
                             {/* Delete Button (visible on hover, if more than 1 item) */}
                             {items.length > 0 && (
                                <button 
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="absolute -right-8 top-3 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                    title="Eliminar fila"
                                >
                                    <Trash2 size={18} />
                                </button>
                             )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Button */}
            <div className="mt-6">
                <button 
                    onClick={handleAddItem}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50 hover:text-primary hover:border-primary/30 transition-all text-sm font-medium"
                >
                    <Plus size={16} /> Añadir
                </button>
            </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex justify-center mt-auto pb-8">
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

export default ImpactIndicatorsModal;