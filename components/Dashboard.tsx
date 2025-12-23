import React, { useState, useRef, useEffect } from 'react';
import { Search, Plus, LayoutGrid, List, ChevronDown, ChevronLeft, ChevronRight, Star, MoreHorizontal, Filter, X } from 'lucide-react';
import { InitiativeState } from '../types';

interface DashboardProps {
  initiatives: InitiativeState[];
  onSelectInitiative: (id: string) => void;
  onCreateNew: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ initiatives, onSelectInitiative, onCreateNew }) => {
  const [viewType, setViewType] = useState<'list' | 'grid'>('grid');
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const filterRef = useRef<HTMLDivElement>(null);

  const statusOptions = ["Borrador", "Activo", "Pausado", "Completado", "Cancelado"];

  // Close filter dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter initiatives based on search and status
  const filteredInitiatives = initiatives.filter(init => {
    const matchesStatus = !selectedStatus || init.status === selectedStatus;
    const matchesSearch = init.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (init.identification?.code1?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    return matchesStatus && matchesSearch;
  });

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
                className="flex items-center gap-2 bg-[#2A2AA9] text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-opacity-90 transition-colors whitespace-nowrap shadow-sm"
              >
                <Plus size={18} />
                Nueva iniciativa
              </button>

              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Buscar" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white shadow-sm"
                />
              </div>

              {/* Status Filter Button */}
              <div className="relative" ref={filterRef}>
                <button 
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex items-center gap-2 px-4 py-2.5 border rounded-md transition-all text-sm min-w-[140px] justify-between shadow-sm
                    ${selectedStatus ? 'bg-indigo-50 border-primary text-primary font-semibold' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                >
                  <div className="flex items-center gap-2">
                    <Filter size={14} className={selectedStatus ? 'text-primary' : 'text-gray-400'} />
                    {selectedStatus || "Estado"}
                  </div>
                  <ChevronDown size={14} className={`transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>

                {isFilterOpen && (
                  <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-[100] animate-in fade-in zoom-in-95 duration-150">
                    <div 
                      onClick={() => { setSelectedStatus(null); setIsFilterOpen(false); }}
                      className="px-4 py-2 text-xs text-gray-400 hover:bg-gray-50 cursor-pointer border-b border-gray-50 mb-1"
                    >
                      Mostrar todas
                    </div>
                    {statusOptions.map((option) => (
                      <div 
                        key={option}
                        onClick={() => { setSelectedStatus(option); setIsFilterOpen(false); }}
                        className={`px-4 py-2 text-sm cursor-pointer transition-colors flex items-center justify-between
                          ${selectedStatus === option ? 'text-primary font-bold bg-indigo-50' : 'text-gray-700 hover:bg-gray-50'}`}
                      >
                        {option}
                        {selectedStatus === option && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                      </div>
                    ))}
                  </div>
                )}
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
                <span className="px-3 py-1 bg-white border border-gray-300 rounded text-sm font-medium text-gray-600">{filteredInitiatives.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        {initiatives.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-32 bg-white rounded-lg border border-gray-200 shadow-sm animate-in fade-in duration-500">
              <div className="bg-gray-50 p-6 rounded-full mb-6 text-gray-300">
                 <Plus size={48} strokeWidth={1} />
              </div>
              <h3 className="text-xl font-medium text-gray-600">no hay iniciativas por el momento</h3>
              <p className="text-gray-400 mt-2 mb-8 max-w-md text-center">Tus iniciativas aparecerán aquí una vez que comiences a crearlas utilizando el botón superior.</p>
              <button 
                onClick={onCreateNew}
                className="bg-primary text-white px-8 py-2.5 rounded-md hover:bg-opacity-90 transition-all font-medium shadow-md active:scale-95"
              >
                Crear iniciativa
              </button>
           </div>
        ) : filteredInitiatives.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-24 bg-white rounded-lg border border-gray-200 shadow-sm animate-in fade-in">
              <Search size={40} className="text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-600">No hay coincidencias</h3>
              <p className="text-gray-400 mt-1 mb-6">Prueba ajustando tus filtros de búsqueda o estado.</p>
              <button 
                onClick={() => { setSelectedStatus(null); setSearchTerm(''); }}
                className="text-primary font-bold text-sm hover:underline flex items-center gap-2"
              >
                Limpiar filtros
              </button>
           </div>
        ) : (
        <div className={viewType === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
          {filteredInitiatives.map((initiative) => (
            <React.Fragment key={initiative.id}>
              {viewType === 'list' ? (
                // --- LIST VIEW ---
                <div 
                  onDoubleClick={() => initiative.id && onSelectInitiative(initiative.id)}
                  className="bg-white rounded-lg border border-gray-200 p-4 flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="w-24 h-16 bg-gray-50 border border-gray-200 rounded-sm flex-shrink-0 overflow-hidden relative">
                    {initiative.image || initiative.identification?.imagePreview ? (
                        <img src={initiative.image || initiative.identification?.imagePreview || ""} alt={initiative.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cube-coat.png')] opacity-50"></div>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-center gap-1 min-w-0 w-full md:w-auto">
                     <h3 className="font-bold text-gray-800 text-sm truncate">{initiative.name}</h3>
                     
                     <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-gray-500 font-medium">Lineamiento estratégico</span>
                        <span className="inline-block border border-primary/40 text-primary text-[10px] px-2 py-0.5 rounded-full w-fit bg-indigo-50/30">
                          {initiative.typology?.strategicGuideline || "Sin definir"}
                        </span>
                     </div>
                  </div>

                  <button className="text-gray-400 hover:text-yellow-400 transition-colors">
                     <Star size={18} fill={initiative.isFavorite ? "currentColor" : "none"} className={initiative.isFavorite ? "text-yellow-400" : ""} />
                  </button>

                  <div className="hidden md:block w-px h-12 bg-gray-200 mx-2"></div>

                  <div className="flex flex-col gap-1 min-w-[140px]">
                      <p className="text-xs text-gray-500">
                        Código 1: <span className="font-semibold text-gray-700">{initiative.identification?.code1 || "-"}</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Código 2: <span className="font-semibold text-gray-700">{initiative.identification?.code2 || "-"}</span>
                      </p>
                  </div>

                  <div className="hidden md:block w-px h-12 bg-gray-200 mx-2"></div>

                  <div className="flex flex-col gap-1 min-w-[120px]">
                      <p className="text-xs text-gray-500">Última actualización</p>
                      <p className="text-xs font-semibold text-gray-700">{initiative.lastUpdate || "Reciente"}</p>
                  </div>

                  <div className="min-w-[100px] flex justify-end">
                      <div className="bg-primary text-white text-xs px-4 py-2 rounded-md font-medium text-center shadow-sm">
                          <p className="opacity-80 text-[10px] leading-none mb-0.5">Estado actual</p>
                          <p className="font-bold leading-none">{initiative.status}</p>
                      </div>
                  </div>
                </div>
              ) : (
                // --- GRID VIEW ---
                <div 
                   onDoubleClick={() => initiative.id && onSelectInitiative(initiative.id)}
                   className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer flex flex-col group h-full"
                >
                    <div className="h-40 bg-gray-50 border-b border-gray-100 relative overflow-hidden">
                        {initiative.image || initiative.identification?.imagePreview ? (
                            <img src={initiative.image || initiative.identification?.imagePreview || ""} alt={initiative.name} className="w-full h-full object-cover absolute inset-0 transition-transform duration-500 group-hover:scale-110" />
                        ) : (
                            <div className="w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cube-coat.png')] opacity-60"></div>
                        )}
                        
                        <div className="absolute top-0 left-0 w-full p-3 flex justify-between z-10">
                            <button className="text-gray-400 hover:text-yellow-400 transition-colors drop-shadow-sm">
                                <Star size={18} fill={initiative.isFavorite ? "currentColor" : "none"} className={initiative.isFavorite ? "text-yellow-400" : "text-white/80"} />
                            </button>
                            <div className="bg-primary/90 text-white text-[9px] px-2 py-1 rounded font-bold shadow-md">
                                {initiative.status}
                            </div>
                        </div>
                    </div>

                    <div className="p-4 flex flex-col flex-1 gap-4">
                        <h3 className="font-bold text-gray-800 text-sm leading-snug line-clamp-2 min-h-[40px] group-hover:text-primary transition-colors">{initiative.name}</h3>
                        
                        <div className="mt-auto pt-4 flex justify-between items-center text-[10px] text-gray-400 border-t border-gray-50 uppercase tracking-wider font-semibold">
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
        {filteredInitiatives.length > 0 && (
            <div className="mt-8 flex justify-end items-center gap-2">
            <span className="text-sm text-gray-500 mr-4">1-{filteredInitiatives.length} de {filteredInitiatives.length}</span>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:text-primary hover:border-primary transition-colors shadow-sm"><ChevronLeft size={16} /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded border border-gray-200 text-gray-400 hover:text-primary hover:border-primary transition-colors shadow-sm"><ChevronRight size={16} /></button>
            </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;