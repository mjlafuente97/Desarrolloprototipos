
import React, { useState, useEffect } from 'react';
import { X, Trash2, Link as LinkIcon, Search } from 'lucide-react';
import { CoverageData, CoverageNucleus } from '../../types';

interface CoverageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CoverageData) => void;
  initialData: CoverageData | null;
}

const CoverageModal: React.FC<CoverageModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [nuclei, setNuclei] = useState<CoverageNucleus[]>([]);
  const [activeTab, setActiveTab] = useState<string>('n1');

  useEffect(() => {
    if (isOpen) {
      if (initialData?.nuclei && initialData.nuclei.length > 0) {
        setNuclei(initialData.nuclei);
        setActiveTab(initialData.nuclei[0].id);
      } else {
        const first = { id: 'n1', name: 'Núcleo 1', link: '' };
        setNuclei([first]);
        setActiveTab('n1');
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ nuclei: nuclei.filter(n => n.link.length > 0) });
  };

  const updateNucleusLink = (id: string, link: string) => {
    setNuclei(prev => prev.map(n => n.id === id ? { ...n, link } : n));
  };

  const handleAddNucleus = () => {
    const newId = `n${nuclei.length + 1}`;
    const newNucleus = { id: newId, name: `Núcleo ${nuclei.length + 1}`, link: '' };
    setNuclei([...nuclei, newNucleus]);
    setActiveTab(newId);
  };

  const currentNucleus = nuclei.find(n => n.id === activeTab);
  const isPopulated = currentNucleus && currentNucleus.link.length > 5;
  const isNucleo2 = activeTab === 'n2';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl flex flex-col max-h-[95vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 pb-2">
          <h2 className="text-xl font-semibold text-gray-800">Núcleo de integración</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 px-6 mb-6 overflow-x-auto custom-scrollbar">
          {nuclei.map((n) => (
            <button
              key={n.id}
              onClick={() => setActiveTab(n.id)}
              className={`px-6 py-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${activeTab === n.id ? 'border-primary text-primary' : 'border-transparent text-gray-400'}`}
            >
              {n.name}
            </button>
          ))}
          <button
            onClick={handleAddNucleus}
            className="px-6 py-3 text-sm font-semibold border-b-2 border-transparent text-gray-400 hover:text-primary transition-colors flex items-center gap-1"
          >
            Añadir
          </button>
        </div>

        {/* Body */}
        <div className="px-8 pb-8 space-y-6 overflow-y-auto flex-1">
          
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Link del Núcleo</label>
            <div className="relative group">
              <input
                type="text"
                placeholder="Pegar link de un núcleo"
                value={currentNucleus?.link || ""}
                onChange={(e) => updateNucleusLink(activeTab, e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-300 text-sm transition-all pr-12"
              />
              {isPopulated && (
                <button 
                  onClick={() => updateNucleusLink(activeTab, "")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="block text-sm font-bold text-gray-700">Previsualización</h3>
            
            {isPopulated ? (
              <div className="animate-in fade-in zoom-in-95 duration-300">
                <h4 className="text-primary font-bold text-lg mb-4">
                    {isNucleo2 ? "Percepción del delito" : "Movilidad y accidentes"}
                </h4>
                
                <div className="grid grid-cols-12 gap-1 border border-gray-200 rounded-lg overflow-hidden h-[450px]">
                  {/* Left Column Dashboard */}
                  <div className="col-span-4 bg-white p-4 border-r border-gray-100 flex flex-col gap-4 overflow-y-auto custom-scrollbar">
                    
                    {/* Specific content for Nucleo 2 (Police Stations Chart) */}
                    {isNucleo2 ? (
                        <div className="border border-gray-100 rounded p-4 bg-white shadow-sm flex flex-col h-full">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h5 className="text-[11px] font-bold text-gray-700 leading-tight">Cuarteles de carabineros</h5>
                                    <p className="text-[9px] text-gray-400">Cuarteles de Carabineros por categoría</p>
                                </div>
                                <Search size={14} className="text-gray-300" />
                            </div>
                            
                            <div className="flex-1 flex flex-col gap-3">
                                {/* Simulated Bar Chart for Police Stations */}
                                <div className="flex-1 flex items-end justify-between gap-2 px-2 pb-2 border-b border-gray-100">
                                    <div className="w-1/4 bg-[#5b4d96] h-[90%] rounded-t-sm relative group">
                                        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-bold">20</span>
                                    </div>
                                    <div className="w-1/4 bg-[#4a72a8] h-[30%] rounded-t-sm relative">
                                        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-bold">4</span>
                                    </div>
                                    <div className="w-1/4 bg-[#499d9b] h-[15%] rounded-t-sm relative">
                                        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-bold">1</span>
                                    </div>
                                    <div className="w-1/4 bg-[#499d9b] h-[25%] rounded-t-sm relative">
                                        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-bold">3</span>
                                    </div>
                                </div>
                                
                                {/* Legends */}
                                <div className="space-y-1.5 pt-1">
                                    <div className="flex items-center gap-2 text-[8px] font-bold text-gray-600">
                                        <div className="w-2 h-2 bg-[#5b4d96] shrink-0"></div> COMISARÍA
                                    </div>
                                    <div className="flex items-center gap-2 text-[8px] font-bold text-gray-600">
                                        <div className="w-2 h-2 bg-[#4a72a8] shrink-0"></div> SUBCOMISARÍA
                                    </div>
                                    <div className="flex items-center gap-2 text-[8px] font-bold text-gray-600">
                                        <div className="w-2 h-2 bg-[#499d9b] shrink-0"></div> RETÉN
                                    </div>
                                    <div className="flex items-center gap-2 text-[8px] font-bold text-gray-600">
                                        <div className="w-2 h-2 bg-[#499d9b] shrink-0"></div> TENENCIA
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Nucleo 1 Content (Recepciones finales) */
                        <div className="border border-gray-100 rounded p-3 bg-white shadow-sm">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-bold text-gray-700 leading-tight">Recepciones finales de edificación</span>
                                <X size={10} className="text-gray-300" />
                            </div>
                            <div className="h-24 flex items-end justify-between gap-1">
                                <div className="w-1/6 bg-primary/40 h-[60%]"></div>
                                <div className="w-1/6 bg-primary/60 h-[85%]"></div>
                                <div className="w-1/6 bg-primary/30 h-[40%]"></div>
                                <div className="w-1/6 bg-primary h-[70%]"></div>
                                <div className="w-1/6 bg-primary/50 h-[30%]"></div>
                                <div className="w-1/6 bg-primary/70 h-[20%]"></div>
                            </div>
                        </div>
                    )}

                    {/* Stat Cards for Nucleo 2 */}
                    {isNucleo2 ? (
                        <div className="grid grid-cols-2 gap-3 mt-auto">
                            <div className="border border-gray-100 rounded p-4 bg-white shadow-sm flex flex-col items-center justify-center text-center h-40">
                                <span className="text-[10px] font-bold text-gray-700 block uppercase mb-1">Cuarteles de carabineros</span>
                                <span className="text-4xl font-bold text-gray-800 block mb-2">28</span>
                                <span className="text-[9px] text-gray-400 font-bold leading-tight uppercase">Cantidad total de Cuarteles</span>
                            </div>
                            <div className="border border-gray-100 rounded p-4 bg-white shadow-sm flex flex-col items-center justify-center text-center h-40">
                                <span className="text-[10px] font-bold text-gray-700 block uppercase mb-1">Puntos de vigilancia</span>
                                <span className="text-4xl font-bold text-gray-800 block mb-2">928</span>
                                <span className="text-[9px] text-gray-400 font-bold leading-tight uppercase">Número total de cámaras de seguridad</span>
                            </div>
                        </div>
                    ) : (
                        <div className="border border-gray-100 rounded p-3 bg-white shadow-sm">
                            <span className="text-[10px] font-bold text-gray-700 block mb-2">Dependencia moderada severa</span>
                            <span className="text-xl font-bold text-gray-800 block">3.890</span>
                            <span className="text-[9px] text-gray-400 leading-tight block">Número de personas con dependencia moderada severa</span>
                        </div>
                    )}
                  </div>

                  {/* Map Preview */}
                  <div className="col-span-8 bg-gray-50 relative">
                    <img 
                      src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop" 
                      alt="Map" 
                      className="w-full h-full object-cover grayscale opacity-20"
                    />
                    
                    {/* SVG Map Overlay Simulation */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <svg className="w-full h-full" viewBox="0 0 500 450" preserveAspectRatio="none">
                         {/* Areas for Nucleo 1 or 2 */}
                         {!isNucleo2 && (
                            <>
                                <path d="M100,80 L200,50 L300,120 L250,220 L150,250 Z" className="fill-purple-500/40 stroke-purple-600 stroke-1" />
                                <path d="M220,180 L280,160 L320,240 L280,280 L220,260 Z" className="fill-green-500/40 stroke-green-600 stroke-1" />
                            </>
                         )}
                         
                         {/* Cluster points for Nucleo 2 (Image Reference) */}
                         {isNucleo2 && (
                            <>
                                {/* Yellow clusters center */}
                                <circle cx="340" cy="180" r="40" className="fill-yellow-500/30" />
                                <circle cx="330" cy="170" r="4" className="fill-yellow-600/60" />
                                <circle cx="350" cy="190" r="5" className="fill-yellow-600/60" />
                                <circle cx="345" cy="175" r="3" className="fill-yellow-600/60" />
                                <circle cx="320" cy="190" r="4" className="fill-yellow-600/60" />
                                
                                {/* Purple areas top */}
                                <path d="M260,80 L320,70 L340,150 L280,160 Z" className="fill-purple-500/40" />
                                <path d="M280,180 L350,170 L370,250 L310,260 Z" className="fill-purple-500/40" />
                                
                                {/* Blue scattered points right */}
                                <circle cx="450" cy="100" r="5" className="fill-blue-600/40 stroke-blue-700/60" />
                                <circle cx="430" cy="80" r="4" className="fill-blue-600/40 stroke-blue-700/60" />
                                <circle cx="470" cy="120" r="6" className="fill-blue-600/40 stroke-blue-700/60" />
                                <circle cx="410" cy="110" r="4" className="fill-blue-600/40 stroke-blue-700/60" />
                                
                                {/* Green points left */}
                                <circle cx="200" cy="250" r="5" className="fill-green-600/50 stroke-green-700" />
                                <circle cx="210" cy="230" r="4" className="fill-green-600/50 stroke-green-700" />
                                <circle cx="190" cy="270" r="6" className="fill-green-600/50 stroke-green-700" />
                            </>
                         )}
                      </svg>
                    </div>

                    {/* Map Controls */}
                    <div className="absolute top-4 right-4 bg-white rounded border border-gray-200 flex flex-col shadow-sm">
                       <button className="px-2 py-1 hover:bg-gray-50 border-b border-gray-100 font-bold">+</button>
                       <button className="px-2 py-1 hover:bg-gray-50 font-bold">-</button>
                    </div>

                    <div className="absolute bottom-4 right-4 bg-white p-1 rounded border border-gray-200 flex text-[8px] font-bold shadow-md">
                       <span className="px-2 py-1 bg-gray-50 border-r border-gray-200 cursor-pointer">Mapa</span>
                       <span className="px-2 py-1 cursor-pointer">Satélite</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full h-80 bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%,transparent_75%,#f0f0f0_75%,#f0f0f0),linear-gradient(45deg,#f0f0f0_25%,transparent_25%,transparent_75%,#f0f0f0_75%,#f0f0f0)] bg-[length:24px_24px] bg-[position:0_0,12px_12px] border border-gray-200 rounded-lg flex items-center justify-center">
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-8 border-t border-gray-50 flex justify-center bg-white rounded-b-lg">
          <button
            onClick={handleSave}
            className="bg-primary text-white px-16 py-3 rounded-md font-bold hover:bg-opacity-90 transition-all shadow-lg active:scale-95 text-sm"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoverageModal;
