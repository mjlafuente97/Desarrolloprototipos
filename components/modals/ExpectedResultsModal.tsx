import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { ExpectedResult } from '../../types';

interface ExpectedResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ExpectedResult[]) => void;
  initialData: ExpectedResult[];
}

const ExpectedResultsModal: React.FC<ExpectedResultsModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [items, setItems] = useState<ExpectedResult[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (initialData && initialData.length > 0) {
        setItems(initialData);
      } else {
        // Initialize with one empty row
        setItems([{ id: Date.now().toString(), description: '', indicator: '', baseLine: '', goal: '' }]);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), description: '', indicator: '', baseLine: '', goal: '' }
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length === 1) {
        setItems([{ id: Date.now().toString(), description: '', indicator: '', baseLine: '', goal: '' }]);
    } else {
        setItems(items.filter(item => item.id !== id));
    }
  };

  const handleChange = (id: string, field: keyof ExpectedResult, value: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSave = () => {
    // For demo purposes, if user saves empty, fill with dummy data to match screenshot flow
    const isEmpty = items.every(i => !i.description && !i.indicator);
    if (isEmpty) {
        onSave([{
            id: '1',
            description: 'Ejemplo de un resultado esperado para esta iniciativa que tiene indicadores clave.',
            indicator: '% de población cubierta por servicio formal de recolección (fuente: SINIM, municipio)',
            baseLine: '82%',
            goal: '95%'
        }]);
    } else {
        onSave(items);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Resultados esperados</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto">
            {/* Table Headers */}
            <div className="grid grid-cols-12 gap-6 mb-2">
                <div className="col-span-4 text-sm font-semibold text-gray-700">Resultado esperado</div>
                <div className="col-span-4 text-sm font-semibold text-gray-700">Indicador asociado</div>
                <div className="col-span-2 text-sm font-semibold text-gray-700">Línea base</div>
                <div className="col-span-2 text-sm font-semibold text-gray-700">Meta</div>
            </div>

            {/* Rows */}
            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-6 items-start group relative">
                        {/* Description */}
                        <div className="col-span-4">
                            <textarea 
                                placeholder="Descripción del resultado"
                                value={item.description}
                                onChange={(e) => handleChange(item.id, 'description', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-300 text-sm h-24 resize-none"
                            />
                        </div>
                        {/* Indicator */}
                        <div className="col-span-4">
                            <textarea 
                                placeholder="Detalle del indicador"
                                value={item.indicator}
                                onChange={(e) => handleChange(item.id, 'indicator', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-300 text-sm h-24 resize-none"
                            />
                        </div>
                        {/* Base Line */}
                        <div className="col-span-2">
                            <input 
                                type="text"
                                placeholder="Número"
                                value={item.baseLine}
                                onChange={(e) => handleChange(item.id, 'baseLine', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-300 text-sm"
                            />
                        </div>
                        {/* Goal */}
                        <div className="col-span-2 relative">
                            <input 
                                type="text"
                                placeholder="Número"
                                value={item.goal}
                                onChange={(e) => handleChange(item.id, 'goal', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-300 text-sm"
                            />
                             {/* Delete Button */}
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

export default ExpectedResultsModal;