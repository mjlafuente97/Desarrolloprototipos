import React, { useState } from 'react';
import { X, ChevronDown, Trash2 } from 'lucide-react';
import { InterventionData } from '../../types';

interface InterventionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: InterventionData) => void;
}

// List of communes in the Santiago Metropolitan Region
const COMMUNES = [
  "Alhué", "Buin", "Calera de Tango", "Cerrillos", "Cerro Navia", "Colina", "Conchalí", 
  "Curacaví", "El Bosque", "El Monte", "Estación Central", "Huechuraba", "Independencia", 
  "Isla de Maipo", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", 
  "Lampa", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", 
  "María Pinto", "Melipilla", "Ñuñoa", "Padre Hurtado", "Paine", "Pedro Aguirre Cerda", 
  "Peñaflor", "Peñalolén", "Pirque", "Providencia", "Pudahuel", "Puente Alto", "Quilicura", 
  "Quinta Normal", "Recoleta", "Renca", "San Bernardo", "San Joaquín", "San José de Maipo", 
  "San Miguel", "San Pedro", "San Ramón", "Santiago", "Talagante", "Til Til", "Vitacura"
];

const InterventionModal: React.FC<InterventionModalProps> = ({ isOpen, onClose, onSave }) => {
  const [comuna, setComuna] = useState("");
  const [sector, setSector] = useState("");
  
  // State for the Draw Tool dropdown
  const [showDrawOptions, setShowDrawOptions] = useState(false);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = () => {
    // If fields are empty, we might want to prevent save or save defaults.
    // For this demo, we'll save whatever is there, or default values if empty to match the screenshot flow.
    onSave({
        comuna: comuna || "Santiago",
        sector: sector || "Barrio Pueblo Lo Espejo"
    });
  };

  const drawOptions = ["Punto", "Línea", "Polígono"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Área de intervención</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-8 overflow-y-auto">
          
          {/* Section: Localización */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-gray-700">Localización</h3>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Comuna Dropdown */}
              <div className="w-full md:w-1/3 relative">
                <div className="relative">
                  <select 
                    className="w-full appearance-none bg-white border border-gray-300 px-4 py-2.5 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
                    value={comuna}
                    onChange={(e) => setComuna(e.target.value)}
                  >
                    <option value="" disabled hidden>Comuna</option>
                    {COMMUNES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
              </div>

              {/* Sector Input */}
              <div className="w-full md:w-2/3">
                <input 
                  type="text" 
                  placeholder="Sector o área" 
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent placeholder-gray-400"
                />
              </div>
            </div>
          </div>

          {/* Section: Dibujar área */}
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-gray-700">Dibujar área</h3>
            
            <div className="flex flex-wrap gap-3 mb-4">
              {/* Select Tool Dropdown */}
              <div className="relative">
                <button 
                    onClick={() => setShowDrawOptions(!showDrawOptions)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium min-w-[140px] justify-between transition-colors"
                >
                    {selectedTool || "Seleccionar"} 
                    <ChevronDown size={14} className={`transition-transform duration-200 ${showDrawOptions ? 'rotate-180' : ''}`}/>
                </button>

                {showDrawOptions && (
                    <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-20 py-1 animate-in fade-in zoom-in-95 duration-100">
                        {drawOptions.map((option) => (
                            <div 
                                key={option}
                                onClick={() => {
                                    setSelectedTool(option);
                                    setShowDrawOptions(false);
                                }}
                                className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 ${selectedTool === option ? 'text-primary font-medium bg-indigo-50' : 'text-gray-700'}`}
                            >
                                {option}
                            </div>
                        ))}
                    </div>
                )}
              </div>
              
              {/* Delete Tool */}
              <button 
                onClick={() => setSelectedTool(null)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium hover:text-red-600 hover:border-red-200 transition-colors"
              >
                Borrar área <Trash2 size={14} />
              </button>
            </div>

            {/* Map Placeholder */}
            <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
               {/* Using a light map image to match the screenshot style */}
               <img 
                 src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?q=80&w=1200&auto=format&fit=crop" 
                 alt="Map of area" 
                 className="w-full h-full object-cover opacity-80"
               />

               {/* Polygon Overlay */}
               {selectedTool === 'Polígono' && (
                  <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 400 320" preserveAspectRatio="none">
                      <polygon 
                          points="180,80 280,100 290,180 220,240 120,200 130,120" 
                          className="fill-indigo-500/30 stroke-indigo-600 stroke-2"
                      />
                  </svg>
               )}
               
               {/* Map overlay controls simulation */}
               <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-20">
                 <button className="bg-white p-2 rounded shadow text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors font-bold">+</button>
                 <button className="bg-white p-2 rounded shadow text-gray-600 hover:bg-gray-50 hover:text-primary transition-colors font-bold">-</button>
               </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-center mt-auto">
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

export default InterventionModal;