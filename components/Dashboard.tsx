
import React, { useState } from 'react';
import { Search, Plus, LayoutGrid, List, ChevronDown, ChevronLeft, ChevronRight, Star, MoreHorizontal } from 'lucide-react';
import { InitiativeState } from '../types';

interface DashboardProps {
  initiatives: InitiativeState[];
  onSelectInitiative: (id: string) => void;
  onCreateNew: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ initiatives, onSelectInitiative, onCreateNew }) => {
  const [viewType, setViewType] = useState<'list' | 'grid'>('grid');

  return (
    <div className="min-h-screen bg-bgLight font-sans text-gray-800 pt-16">
      <div className="max-w-7xl mx-auto p-8">
        
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-primary mb-6">Mis iniciativas</h1>
          
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex items-center gap-4 w-full md:w-auto flex-1">
              <button 
                onClick={onCreateNew}
                className="flex items-center gap-2 bg-[#2A2AA9] text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-opacity-90 transition-colors whitespace-nowrap"
              >
                <Plus size={18} />
                Nueva iniciativa
              </button>

              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar" 
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                />
              </div>

              <div className="relative">
                <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 text-sm min-w-[100px] justify-between">
                  Estado <ChevronDown size={14} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-end">
              <div className="flex items-center bg-gray-200 rounded-md p-1">
                <button 
                  onClick={() => setViewType('grid')}
                  className={`p-1.5 rounded transition-all ${viewType === 'grid' ? 'bg-white shadow-sm text-gray-700' : 'bg-transparent text-gray-500 hover:text-gray-700'}`}
                  title="Ver como tarjetas"
                >
                  <LayoutGrid size={18} />
                </button>
                <button 
                  onClick={() => setViewType('list')}
                  className={`p-1.5 rounded transition-all ${viewType === 'list' ? 'bg-white shadow-sm text-gray-700' : 'bg-transparent text-gray-500 hover:text-gray-700'}`}
                  title="Ver como lista"
                >
                  <List size={18} />
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-700">Total</span>
                <span className="px-3 py-1 bg-white border border-gray-300 rounded text-sm font-medium text-gray-600">{initiatives.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {initiatives.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-20 bg-white rounded-lg border border-gray-200">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                 <Plus size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700">No tienes iniciativas creadas</h3>
              <p className="text-gray-500 mt-2 mb-6">Comienza creando tu primera iniciativa de inversión.</p>
              <button 
                onClick={onCreateNew}
                className="bg-primary text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors"
              >
                Crear iniciativa
              </button>
           </div>
        ) : (
        <div className={viewType === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
          {initiatives.map((initiative) => (
            <React.Fragment key={initiative.id}>
              {viewType === 'list' ? (
                // --- LIST VIEW ---
                <div 
                  onDoubleClick={() => initiative.id && onSelectInitiative(initiative.id)}
                  className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-shadow cursor-pointer group"
                >
                  {/* Image Placeholder */}
                  <div className="w-24 h-16 bg-gray-50 border border-gray-200 rounded-sm flex-shrink-0 overflow-hidden relative">
                    {initiative.image || initiative.identification?.imagePreview ? (
                        <img src={initiative.image || initiative.identification?.imagePreview || ""} alt={initiative.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cube-coat.png')] opacity-50"></div>
                    )}
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 flex flex-col justify-center gap-1 min-w-0 w-full md:w-auto">
                     <h3 className="font-bold text-gray-800 text-sm truncate">{initiative.name}</h3>
                     
                     <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-gray-500 font-medium">Lineamiento estratégico</span>
                        <span className="inline-block border border-primary/40 text-primary text-[10px] px-2 py-0.5 rounded-full w-fit bg-indigo-50/30">
                          {initiative.typology?.strategicGuideline || "Sin definir"}
                        </span>
                     </div>
                  </div>

                  {/* Star */}
                  <button className="text-gray-400 hover:text-yellow-400 transition-colors">
                     <Star size={18} fill={initiative.isFavorite ? "currentColor" : "none"} className={initiative.isFavorite ? "text-yellow-400" : ""} />
                  </button>

                  {/* Divider */}
                  <div className="hidden md:block w-px h-12 bg-gray-200 mx-2"></div>

                  {/* Codes */}
                  <div className="flex flex-col gap-1 min-w-[140px]">
                      <p className="text-xs text-gray-500">
                        Código 1: <span className="font-semibold text-gray-700">{initiative.identification?.code1 || "-"}</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Código 2: <span className="font-semibold text-gray-700">{initiative.identification?.code2 || "-"}</span>
                      </p>
                  </div>

                  {/* Divider */}
                  <div className="hidden md:block w-px h-12 bg-gray-200 mx-2"></div>

                  {/* Last Update */}
                  <div className="flex flex-col gap-1 min-w-[120px]">
                      <p className="text-xs text-gray-500">Última actualización</p>
                      <p className="text-xs font-semibold text-gray-700">{initiative.lastUpdate || "Reciente"}</p>
                  </div>

                  {/* Status Button */}
                  <div className="min-w-[100px] flex justify-end">
                      <div className="bg-primary text-white text-xs px-4 py-2 rounded-md font-medium text-center">
                          <p className="opacity-80 text-[10px] leading-none mb-0.5">Estado actual</p>
                          <p className="font-bold leading-none">{initiative.status}</p>
                      </div>
                  </div>
                </div>
              ) : (
                // --- GRID VIEW ---
                <div 
                   onDoubleClick={() => initiative.id && onSelectInitiative(initiative.id)}
                   className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer flex flex-col"
                >
                    {/* Header Image Area */}
                    <div className="h-40 bg-gray-50 border-b border-gray-100 relative">
                        {initiative.image || initiative.identification?.imagePreview ? (
                            <img src={initiative.image || initiative.identification?.imagePreview || ""} alt={initiative.name} className="w-full h-full object-cover absolute inset-0" />
                        ) : (
                            <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cube-coat.png')] opacity-60"></div>
                        )}
                        
                        <div className="absolute top-0 left-0 w-full p-3 flex justify-between z-10">
                            <button className="text-gray-400 hover:text-yellow-400 transition-colors drop-shadow-sm">
                                <Star size={18} fill={initiative.isFavorite ? "currentColor" : "none"} className={initiative.isFavorite ? "text-yellow-400" : "text-gray-400 mix-blend-difference"} />
                            </button>
                            <button className="text-gray-400 hover:text-gray-600 drop-shadow-sm bg-white/50 rounded-full p-0.5">
                                <MoreHorizontal size={18} className="text-gray-600"/>
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="p-4 flex flex-col flex-1 gap-4">
                        <h3 className="font-bold text-gray-800 text-sm leading-snug line-clamp-2">{initiative.name}</h3>
                        
                        <div className="mt-auto pt-4 flex justify-between items-center text-xs text-gray-500 border-t border-gray-50">
                             <span>{initiative.identification?.code1 || "-"}</span>
                             <span>{initiative.lastUpdate || "Reciente"}</span>
                        </div>
                    </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
        )}

        {/* Pagination */}
        {initiatives.length > 0 && (
            <div className="mt-8 flex justify-end items-center gap-2">
            <span className="text-sm text-gray-500 mr-4">1-{initiatives.length} de {initiatives.length}</span>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:text-primary hover:border-primary transition-colors"><ChevronLeft size={16} /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:text-primary hover:border-primary transition-colors"><ChevronRight size={16} /></button>
            </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;
