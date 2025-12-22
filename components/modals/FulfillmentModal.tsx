import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Clock, AlertCircle, MessageCircle } from 'lucide-react';
import { ExpectedResult, FulfillmentStatus } from '../../types';

interface FulfillmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: ExpectedResult | null;
  onSave: (resultId: string, status: FulfillmentStatus, comment: string) => void;
}

const FulfillmentModal: React.FC<FulfillmentModalProps> = ({ isOpen, onClose, result, onSave }) => {
  const [status, setStatus] = useState<FulfillmentStatus>('pending');
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (isOpen && result) {
      setStatus(result.status || 'pending');
      setComment(result.fulfillmentComment || "");
    }
  }, [isOpen, result]);

  if (!isOpen || !result) return null;

  const handleSave = () => {
    onSave(result.id, status, comment);
  };

  const statusOptions: { id: FulfillmentStatus; label: string; icon: any; color: string; bgColor: string }[] = [
    { id: 'pending', label: 'Pendiente', icon: Clock, color: 'text-gray-500', bgColor: 'bg-gray-100' },
    { id: 'in_progress', label: 'En proceso', icon: AlertCircle, color: 'text-blue-500', bgColor: 'bg-blue-50' },
    { id: 'achieved', label: 'Alcanzada', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' },
    { id: 'not_achieved', label: 'No alcanzada', icon: X, color: 'text-red-500', bgColor: 'bg-red-50' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Seguimiento de Meta</h2>
            <p className="text-sm text-gray-500 mt-1">Evalúa el cumplimiento del resultado esperado</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-6 overflow-y-auto">
          {/* Info Card */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-5">
            <h3 className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2">Resultado Esperado</h3>
            <p className="text-sm text-indigo-900 font-medium leading-relaxed">{result.description}</p>
            <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-indigo-200/50">
              <div>
                <span className="text-[10px] text-indigo-600 font-bold uppercase block">Indicador</span>
                <span className="text-sm text-indigo-900">{result.indicator}</span>
              </div>
              <div>
                <span className="text-[10px] text-indigo-600 font-bold uppercase block">Meta Definida</span>
                <span className="text-sm font-bold text-indigo-900">{result.goal}</span>
              </div>
            </div>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Estado de cumplimiento</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {statusOptions.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setStatus(opt.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all gap-2
                    ${status === opt.id ? `border-primary bg-primary text-white shadow-md` : `border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-200 hover:bg-white`}
                  `}
                >
                  <opt.icon size={20} className={status === opt.id ? 'text-white' : opt.color} />
                  <span className="text-xs font-bold">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
              <MessageCircle size={16} /> Comentarios de seguimiento
            </label>
            <textarea
              placeholder="Explica el avance real, desviaciones o motivos del resultado obtenido..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full h-32 px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary outline-none text-sm placeholder-gray-400 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-md text-gray-600 text-sm font-medium hover:bg-gray-100 transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={handleSave}
            className="bg-primary text-white px-8 py-2 rounded-md text-sm font-bold hover:bg-opacity-90 shadow-md transition-colors"
          >
            Guardar Avance
          </button>
        </div>
      </div>
    </div>
  );
};

export default FulfillmentModal;