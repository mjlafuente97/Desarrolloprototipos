import React, { useState, useEffect } from 'react';
import { X, Calendar, User, MessageSquare, Paperclip, Trash2, Plus, File, Link as LinkIcon, Send } from 'lucide-react';
import { ParticipationEntry, DocumentItem, CommentItem } from '../../types';

interface ParticipationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ParticipationEntry) => void;
  initialData?: ParticipationEntry | null;
  onAddDocument: () => void; // Trigger parent to open document modal
  tempDocuments: DocumentItem[]; // Receive documents from parent state while editing
}

const ParticipationModal: React.FC<ParticipationModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  initialData, 
  onAddDocument,
  tempDocuments
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'files' | 'comments'>('general');
  const [formData, setFormData] = useState<ParticipationEntry>({
    id: '',
    date: '',
    activityName: '',
    participantsCount: '',
    description: '',
    documents: [],
    comments: []
  });

  const [newComment, setNewComment] = useState("");

  // Sync internal state with props
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({ ...initialData });
      } else {
        setFormData({
          id: Date.now().toString(),
          date: '',
          activityName: '',
          participantsCount: '',
          description: '',
          documents: [],
          comments: []
        });
      }
      setActiveTab('general');
    }
  }, [isOpen, initialData]);

  // Sync documents when tempDocuments updates (from parent DocumentModal)
  useEffect(() => {
      if (isOpen) {
          setFormData(prev => ({ ...prev, documents: tempDocuments }));
      }
  }, [tempDocuments, isOpen]);

  if (!isOpen) return null;

  const handleChange = (key: keyof ParticipationEntry, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment: CommentItem = {
      id: Date.now().toString(),
      author: 'Usuario Actual', // Placeholder
      text: newComment,
      date: new Date()
    };
    setFormData(prev => ({
      ...prev,
      comments: [comment, ...prev.comments]
    }));
    setNewComment("");
  };

  const handleDeleteDocument = (docId: string) => {
      const updatedDocs = formData.documents.filter(d => d.id !== docId);
      setFormData(prev => ({ ...prev, documents: updatedDocs }));
      // Note: Ideally we should sync this back to parent if parent holds the "source of truth" 
      // during the edit session, but for this flow, we sync on Save.
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Encuentro Participativo</h2>
            <p className="text-xs text-gray-500 mt-1">Gestión de resultados y evidencias</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'general' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Datos generales
          </button>
          <button
            onClick={() => setActiveTab('files')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'files' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Evidencias (Fotos/Videos) <span className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded-full">{formData.documents.length}</span>
          </button>
          <button
            onClick={() => setActiveTab('comments')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'comments' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Comentarios <span className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded-full">{formData.comments.length}</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto flex-1 bg-gray-50/50">
          
          {activeTab === 'general' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Fecha del encuentro</label>
                  <div className="relative">
                    <input 
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm text-gray-700"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Cantidad de participantes</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="number"
                      placeholder="0"
                      value={formData.participantsCount}
                      onChange={(e) => handleChange('participantsCount', e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm placeholder-gray-400"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nombre de la actividad</label>
                <input 
                  type="text"
                  placeholder="Ej: Taller de diagnóstico barrial"
                  value={formData.activityName}
                  onChange={(e) => handleChange('activityName', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Descripción / Acuerdos</label>
                <textarea 
                  placeholder="Resumen de los temas tratados y acuerdos principales..."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm placeholder-gray-400 resize-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'files' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-2 duration-200">
                <div className="flex justify-between items-center">
                    <h3 className="text-sm font-semibold text-gray-700">Registro fotográfico y audiovisual</h3>
                    <button 
                        onClick={onAddDocument}
                        className="flex items-center gap-2 bg-white border border-primary text-primary px-3 py-1.5 rounded-md text-sm hover:bg-indigo-50 transition-colors"
                    >
                        <Plus size={16} /> Adjuntar archivo
                    </button>
                </div>

                {formData.documents.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-10 flex flex-col items-center justify-center text-gray-400">
                        <Paperclip size={32} className="mb-2 opacity-50" />
                        <p className="text-sm">No hay archivos adjuntos</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.documents.map((doc) => (
                            <div key={doc.id} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm flex items-start gap-3 relative group">
                                <div className="bg-indigo-50 p-2 rounded text-primary">
                                    {doc.type === 'link' ? <LinkIcon size={20} /> : <File size={20} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate" title={doc.name}>{doc.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{doc.type === 'link' ? doc.url : doc.fileName}</p>
                                </div>
                                <button 
                                    onClick={() => handleDeleteDocument(doc.id)}
                                    className="text-gray-400 hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="flex flex-col h-full animate-in fade-in slide-in-from-right-2 duration-200">
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 max-h-[300px]">
                    {formData.comments.length === 0 ? (
                        <div className="text-center text-gray-400 py-10">
                            <MessageSquare size={32} className="mx-auto mb-2 opacity-20" />
                            <p className="text-sm">No hay comentarios aún.</p>
                        </div>
                    ) : (
                        formData.comments.map(comment => (
                            <div key={comment.id} className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-gray-700">{comment.author}</span>
                                    <span className="text-[10px] text-gray-400">{new Date(comment.date).toLocaleDateString()}</span>
                                </div>
                                <p className="text-sm text-gray-600">{comment.text}</p>
                            </div>
                        ))
                    )}
                </div>
                
                <div className="bg-white p-2 rounded-lg border border-gray-300 flex items-center gap-2">
                    <input 
                        type="text" 
                        placeholder="Escribe un comentario..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                        className="flex-1 outline-none text-sm px-2 text-gray-700 placeholder-gray-400"
                    />
                    <button 
                        onClick={handleAddComment}
                        disabled={!newComment.trim()}
                        className="bg-primary text-white p-2 rounded hover:bg-opacity-90 disabled:opacity-50 transition-colors"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-primary text-white px-6 py-2 rounded-md text-sm font-medium hover:bg-opacity-90 transition-colors shadow-sm"
          >
            Guardar cambios
          </button>
        </div>

      </div>
    </div>
  );
};

export default ParticipationModal;