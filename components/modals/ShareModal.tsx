import React, { useState, useEffect } from 'react';
import { X, Copy, Check, UserPlus, Mail } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  initiativeName: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, initiativeName }) => {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [inviteStatus, setInviteStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
        setCopied(false);
        setEmail("");
        setInviteStatus('idle');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Simulate current URL
  const shareUrl = "https://plataforma.capca.cl/iniciativas/3418c787-7aa4";

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInvite = () => {
    if (!email.trim() || !email.includes('@')) return;
    
    setInviteStatus('sending');
    // Simulate API call
    setTimeout(() => {
        setInviteStatus('sent');
        setEmail("");
        // Reset status after a delay
        setTimeout(() => setInviteStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Compartir iniciativa</h2>
            <p className="text-xs text-gray-500 mt-1 truncate max-w-[300px]">{initiativeName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-8">
            
            {/* Section 1: Copy Link */}
            <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">Copiar enlace</label>
                <div className="flex gap-2">
                    <div className="flex-1 bg-gray-50 border border-gray-200 rounded-md px-4 py-2.5 text-sm text-gray-600 truncate font-mono select-all">
                        {shareUrl}
                    </div>
                    <button 
                        onClick={handleCopy}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all min-w-[100px] justify-center ${
                            copied 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        {copied ? "Copiado" : "Copiar"}
                    </button>
                </div>
            </div>

            <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase font-medium">O invitar personas</span>
                <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Section 2: Invite by Email */}
            <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">Agregar personas al documento</label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                            type="email" 
                            placeholder="correo@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm placeholder-gray-400"
                        />
                    </div>
                    <button 
                        onClick={handleInvite}
                        disabled={inviteStatus !== 'idle' || !email}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all min-w-[100px] justify-center text-white ${
                            inviteStatus === 'sent'
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-primary hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed'
                        }`}
                    >
                        {inviteStatus === 'sent' ? (
                            <>
                                <Check size={16} /> Enviado
                            </>
                        ) : (
                            <>
                                <UserPlus size={16} /> Invitar
                            </>
                        )}
                    </button>
                </div>
                {inviteStatus === 'sent' && (
                    <p className="text-xs text-green-600 animate-fade-in flex items-center gap-1">
                        <Check size={12} /> Invitación enviada correctamente
                    </p>
                )}
                <p className="text-xs text-gray-500">
                    Las personas invitadas recibirán un correo con acceso de edición a esta iniciativa.
                </p>
            </div>

        </div>
      </div>
    </div>
  );
};

export default ShareModal;