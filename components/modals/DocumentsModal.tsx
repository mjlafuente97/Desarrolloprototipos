import React, { useState, useRef } from 'react';
import { X, Upload } from 'lucide-react';
import { DocumentItem } from '../../types';

interface DocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (doc: DocumentItem) => void;
}

const DocumentsModal: React.FC<DocumentsModalProps> = ({ isOpen, onClose, onSave }) => {
  const [docName, setDocName] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      // Auto-fill name if empty
      if (!docName) {
        setDocName(e.target.files[0].name);
      }
      setLinkUrl(""); // Clear link if file selected
    }
  };

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinkUrl(e.target.value);
    setSelectedFile(null); // Clear file if link entered
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = () => {
    if (!docName) return; // Simple validation

    const newDoc: DocumentItem = {
      id: Date.now().toString(),
      name: docName,
      type: selectedFile ? 'file' : 'link',
      url: linkUrl || undefined,
      fileName: selectedFile?.name,
      fileType: selectedFile?.type || 'application/pdf' // Default fallback
    };

    onSave(newDoc);
    
    // Reset fields
    setDocName("");
    setLinkUrl("");
    setSelectedFile(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Adjuntar documentos</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Subir del computador</label>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className={`flex items-center gap-2 px-4 py-2.5 border rounded-md text-sm font-medium transition-colors w-fit
                  ${selectedFile ? 'border-green-500 text-green-700 bg-green-50' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}
                `}
              >
                <Upload size={16} />
                {selectedFile ? 'Archivo seleccionado' : 'Examinar'}
              </button>
              {selectedFile && <p className="text-xs text-green-600 mt-1 truncate max-w-[200px]">{selectedFile.name}</p>}
            </div>

            {/* Link Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Adjuntar link</label>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600 w-8">Link</span>
                <input 
                  type="text" 
                  placeholder="Pegar URL"
                  value={linkUrl}
                  onChange={handleLinkChange}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-300 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Name Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Nombre del documento</label>
            <input 
              type="text" 
              placeholder="Nombre del documento"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-300 text-sm"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex justify-center pb-8 mt-4">
          <button
            onClick={handleSave}
            disabled={!docName || (!linkUrl && !selectedFile)}
            className="bg-primary text-white px-12 py-2.5 rounded-md font-medium hover:bg-opacity-90 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Guardar
          </button>
        </div>

      </div>
    </div>
  );
};

export default DocumentsModal;