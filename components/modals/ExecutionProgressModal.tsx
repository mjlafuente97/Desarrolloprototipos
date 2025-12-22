
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ExecutionProgressRow } from '../../types';

interface ExecutionProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ExecutionProgressRow[]) => void;
  initialData?: ExecutionProgressRow[] | null;
}

const DEFAULT_ROWS: ExecutionProgressRow[] = [
  { id: '1', label: 'Fecha de inicio proyectado', detail: '', comment: '' },
  { id: '2', label: 'Fecha de inicio real', detail: '', comment: '' },
  { id: '3', label: 'Estado de avance total', detail: '', comment: '' },
  { id: '4', label: 'Estado de avance total', detail: '', comment: '' },
];

const ExecutionProgressModal: React.FC<ExecutionProgressModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [rows, setRows] = useState<ExecutionProgressRow[]>(DEFAULT_ROWS);

  useEffect(() => {
    if (isOpen) {
      if (initialData && initialData.length > 0) {
        setRows(initialData);
      } else {
        setRows(DEFAULT_ROWS.map(row => ({ ...row, detail: '', comment: '' })));
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleRowChange = (id: string, field: 'detail' | 'comment', value: string) => {
    setRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const handleSave = () => {
    onSave(rows);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden animate-fade-in-up">
        
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6">
          <h2 className="text-xl font-semibold text-gray-800">Ejecución</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 pt-0">
          <div className="grid grid-cols-12 gap-8 mb-4 px-2">
            <div className="col-span-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">Obra</div>
            <div className="col-span-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">Detalle</div>
            <div className="col-span-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">Comentario</div>
          </div>

          <div className="space-y-6">
            {rows.map((row) => (
              <div key={row.id} className="grid grid-cols-12 gap-8 items-start">
                {/* Obra Label */}
                <div className="col-span-4 pt-4">
                  <span className="text-sm font-bold text-gray-700 leading-tight block">
                    {row.label}
                  </span>
                </div>

                {/* Detalle Input */}
                <div className="col-span-4">
                  <textarea
                    className="w-full px-4 py-3 border border-gray-100 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder-gray-300 min-h-[80px] bg-white shadow-sm resize-none"
                    placeholder={row.id === '3' ? "Porcentaje de avance" : row.id === '4' ? "Escribir estado" : "Escribir fecha"}
                    value={row.detail}
                    onChange={(e) => handleRowChange(row.id, 'detail', e.target.value)}
                  />
                </div>

                {/* Comentario Input */}
                <div className="col-span-4">
                  <textarea
                    className="w-full px-4 py-3 border border-gray-100 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary placeholder-gray-300 min-h-[80px] bg-white shadow-sm resize-none"
                    placeholder="Agregar un comentario"
                    value={row.comment}
                    onChange={(e) => handleRowChange(row.id, 'comment', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 flex justify-center bg-white border-t border-gray-50">
          <button
            onClick={handleSave}
            className="bg-[#31348b] text-white px-12 py-3 rounded-md font-bold hover:bg-opacity-90 transition-all shadow-md active:scale-95 text-sm"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExecutionProgressModal;
