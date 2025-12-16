import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { ExpenseItem } from '../../types';

interface ExpensesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ExpenseItem[]) => void;
  initialData: ExpenseItem[];
}

const ExpensesModal: React.FC<ExpensesModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [items, setItems] = useState<ExpenseItem[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (initialData && initialData.length > 0) {
        setItems(initialData);
      } else {
        // Initialize with one empty row if no data
        setItems([{ id: Date.now().toString(), item: '', total: '', spent: '', execution: '' }]);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleAddItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), item: '', total: '', spent: '', execution: '' }
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length === 1) {
        // Clear instead of delete if it's the last one
        setItems([{ id: Date.now().toString(), item: '', total: '', spent: '', execution: '' }]);
    } else {
        setItems(items.filter(item => item.id !== id));
    }
  };

  const handleChange = (id: string, field: keyof ExpenseItem, value: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSave = () => {
    // Filter out completely empty rows if needed, or just save
    onSave(items);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Tabla de gastos</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto">
            {/* Table Headers */}
            <div className="grid grid-cols-12 gap-4 mb-2 px-1">
                <div className="col-span-3 text-sm font-semibold text-gray-700">Ítem</div>
                <div className="col-span-3 text-sm font-semibold text-gray-700">Total</div>
                <div className="col-span-3 text-sm font-semibold text-gray-700">Gastado</div>
                <div className="col-span-3 text-sm font-semibold text-gray-700">Ejecución presupuestaria %</div>
            </div>

            {/* Rows */}
            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item.id} className="grid grid-cols-12 gap-4 items-start group relative">
                        {/* Inputs */}
                        <div className="col-span-3">
                            <input 
                                type="text"
                                placeholder="Administración"
                                value={item.item}
                                onChange={(e) => handleChange(item.id, 'item', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-300 text-sm"
                            />
                        </div>
                        <div className="col-span-3">
                            <input 
                                type="text"
                                placeholder="Monto total"
                                value={item.total}
                                onChange={(e) => handleChange(item.id, 'total', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-300 text-sm"
                            />
                        </div>
                        <div className="col-span-3">
                            <input 
                                type="text"
                                placeholder="Monto gastado"
                                value={item.spent}
                                onChange={(e) => handleChange(item.id, 'spent', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-300 text-sm"
                            />
                        </div>
                        <div className="col-span-3 relative">
                            <input 
                                type="text"
                                placeholder="Porcentaje"
                                value={item.execution}
                                onChange={(e) => handleChange(item.id, 'execution', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-300 text-sm"
                            />
                             {/* Delete Button (visible on hover) */}
                             {items.length > 1 && (
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

export default ExpensesModal;