
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
        // Initialize with default items from screenshot 12.jpg
        setItems([
          { id: '1', item: 'Instalación y mano de obra.', total: '', spent: '', execution: '', category: 'investment' },
          { id: '2', item: 'Ingeniería y diseño.', total: '', spent: '', execution: '', category: 'investment' },
          { id: '3', item: 'Ahorro en mantención', total: '', spent: '', execution: '', category: 'operation' }
        ]);
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleAddItem = (category: 'investment' | 'operation') => {
    setItems([
      ...items,
      { id: Date.now().toString(), item: '', total: '', spent: '', execution: '', category }
    ]);
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleChange = (id: string, field: keyof ExpenseItem, value: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSave = () => {
    onSave(items);
  };

  const renderSection = (title: string, category: 'investment' | 'operation') => {
    const sectionItems = items.filter(i => i.category === category);
    
    return (
      <div className="space-y-4 mb-10">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        
        <div className="grid grid-cols-12 gap-4 mb-2">
          <div className="col-span-3"></div>
          <div className="col-span-3 text-[11px] font-bold text-gray-500 uppercase">Total</div>
          <div className="col-span-3 text-[11px] font-bold text-gray-500 uppercase">Gastado</div>
          <div className="col-span-3 text-[11px] font-bold text-gray-500 uppercase">Ejecución presupuestaria %</div>
        </div>

        {sectionItems.map((item) => (
          <div key={item.id} className="grid grid-cols-12 gap-4 items-center group">
            <div className="col-span-3 relative">
              <input 
                type="text"
                placeholder="Escribir ítem..."
                value={item.item}
                onChange={(e) => handleChange(item.id, 'item', e.target.value)}
                className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20 text-sm placeholder-gray-300 min-h-[60px]"
              />
              {sectionItems.length > 1 && (
                <button 
                    onClick={() => handleRemoveItem(item.id)}
                    className="absolute -left-8 top-1/2 -translate-y-1/2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                    <Trash2 size={16} />
                </button>
              )}
            </div>
            <div className="col-span-3">
              <input 
                type="text"
                placeholder="Monto total"
                value={item.total}
                onChange={(e) => handleChange(item.id, 'total', e.target.value)}
                className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20 text-sm placeholder-gray-300 min-h-[60px]"
              />
            </div>
            <div className="col-span-3">
              <input 
                type="text"
                placeholder="Monto gastado"
                value={item.spent}
                onChange={(e) => handleChange(item.id, 'spent', e.target.value)}
                className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20 text-sm placeholder-gray-300 min-h-[60px]"
              />
            </div>
            <div className="col-span-3">
              <input 
                type="text"
                placeholder="Porcentaje"
                value={item.execution}
                onChange={(e) => handleChange(item.id, 'execution', e.target.value)}
                className="w-full px-4 py-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary/20 text-sm placeholder-gray-300 min-h-[60px]"
              />
            </div>
          </div>
        ))}

        <div className="flex pt-2">
            <button 
                onClick={() => handleAddItem(category)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-lg text-gray-400 hover:text-primary hover:bg-gray-50 transition-all text-sm font-medium"
            >
                <Plus size={16} /> Añadir
            </button>
        </div>

        {/* Section Totals Row */}
        <div className="grid grid-cols-12 gap-4 pt-4 mt-2">
            <div className="col-span-3"></div>
            <div className="col-span-3">
                <input readOnly placeholder="Total" className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-lg text-sm text-gray-400 outline-none" />
            </div>
            <div className="col-span-3">
                <input readOnly placeholder="Monto gastado total" className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-lg text-sm text-gray-400 outline-none" />
            </div>
            <div className="col-span-3">
                <input readOnly placeholder="Porcentaje" className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-lg text-sm text-gray-400 outline-none" />
            </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-6xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-8 border-b border-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">Modelo de costos y presupuesto</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-10 overflow-y-auto flex-1">
            {renderSection("Costos de inversión", "investment")}
            
            {renderSection("Costos de operación", "operation")}

            {/* Global Total Row */}
            <div className="border-t border-gray-200 pt-10 mt-10">
                <div className="grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-3">
                        <span className="text-sm font-bold text-gray-700">Total costos inversión y operación</span>
                    </div>
                    <div className="col-span-3">
                        <input readOnly placeholder="Monto total" className="w-full px-4 py-5 bg-gray-50/50 border border-gray-100 rounded-lg text-sm text-gray-400 outline-none" />
                    </div>
                    <div className="col-span-3">
                        <input readOnly placeholder="Monto gastado" className="w-full px-4 py-5 bg-gray-50/50 border border-gray-100 rounded-lg text-sm text-gray-400 outline-none" />
                    </div>
                    <div className="col-span-3">
                        <input readOnly placeholder="Porcentaje" className="w-full px-4 py-5 bg-gray-50/50 border border-gray-100 rounded-lg text-sm text-gray-400 outline-none" />
                    </div>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-50 flex justify-center bg-white rounded-b-lg">
          <button
            onClick={handleSave}
            className="bg-primary text-white px-16 py-3 rounded-md font-bold hover:bg-opacity-90 transition-all shadow-lg active:scale-95"
          >
            Guardar
          </button>
        </div>

      </div>
    </div>
  );
};

export default ExpensesModal;
