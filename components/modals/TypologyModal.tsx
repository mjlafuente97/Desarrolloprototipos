import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, Check } from 'lucide-react';
import { TypologyData } from '../../types';

interface TypologyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TypologyData) => void;
}

const INVESTMENT_SCOPES = [
  "Salud",
  "Educación, Cultura y Patrimonio",
  "Vivienda y Desarrollo Urbano",
  "Transporte y Conectividad",
  "Recursos Hídricos y Saneamiento",
  "Medio Ambiente y Recursos Naturales",
  "Seguridad Pública y Protección Civil",
  "Energía y Eficiencia Energética",
  "Turismo, Comercio y Fomento Productivo",
  "Deporte y Recreación",
  "Comunicaciones y Transformación Digital",
  "Multisectorial"
];

const STRATEGIC_GUIDELINES = [
  "Fortalecimiento Sector Salud Municipal",
  "Fortalecimiento Sector Educación Municipal",
  "Fortalecimiento Seguridad Ciudadana y Buena Convivencia",
  "Desarrollo Social",
  "Desarrollo y Protección del Medio Ambiente",
  "Desarrollo Económico - Productivo",
  "Fortalecimiento Sector Deportes, Cultura y Recreación",
  "Fortalecimiento Participación Ciudadana",
  "Desarrollo Urbano - Territorial",
  "Modernización Institucional - Municipal"
];

const PROGRAMS = [
  "Proyecto de Mejoramiento y Mantención de Calzadas, Veredas y Calles, incorporando la Accesibilidad Universal",
  "Plan de Intervención, Construcción, Mejoramiento y Equipamiento de Espacios Públicos para el Desarrollo y la Seguridad de los Barrios (Áreas Verdes, Multicanchas, Espacios Comunitarios, Espacios Culturales, Recreativos, Cámaras de Vigilancia, entre otros.)",
  "Programa Soporte Profesional Interdisciplinario para (la elaboración y postulación de) Proyectos Urbanos y Otras Iniciativas.",
  "Proyecto Implementación (Desarrollo) de un Eje Cívico Comunal",
  "Creación e Implementación Unidad Sistema de Información Geográfica (SIG) y Estadísticas Comunales."
];

const TypologyModal: React.FC<TypologyModalProps> = ({ isOpen, onClose, onSave }) => {
  const [data, setData] = useState<TypologyData>({
    projectType: "",
    investmentScope: "",
    strategicGuideline: "",
    program: ""
  });

  const [isInvestmentDropdownOpen, setIsInvestmentDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsInvestmentDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isOpen) return null;

  const handleChange = (key: keyof TypologyData, value: string) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const toggleInvestmentScope = (scope: string) => {
    const currentScopes = data.investmentScope ? data.investmentScope.split(', ').filter(Boolean) : [];
    let newScopes;
    if (currentScopes.includes(scope)) {
      newScopes = currentScopes.filter(s => s !== scope);
    } else {
      newScopes = [...currentScopes, scope];
    }
    setData(prev => ({ ...prev, investmentScope: newScopes.join(', ') }));
  };

  const handleSave = () => {
    onSave(data);
  };

  const renderSelect = (label: string, key: keyof TypologyData, options: string[]) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
      <label className="text-gray-700 font-medium md:col-span-1 text-sm">{label}</label>
      <div className="relative md:col-span-2">
        <select
          className="w-full appearance-none bg-white border border-gray-300 px-4 py-2.5 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer pr-10 text-sm"
          value={data[key]}
          onChange={(e) => handleChange(key, e.target.value)}
        >
          <option value="" disabled hidden>Seleccionar</option>
          {options.map(opt => (
            <option key={opt} value={opt} className="text-sm">
              {opt.length > 80 ? opt.substring(0, 80) + "..." : opt}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
      </div>
    </div>
  );

  const renderMultiSelect = () => {
      const selectedScopes = data.investmentScope ? data.investmentScope.split(', ').filter(Boolean) : [];
      
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <label className="text-gray-700 font-medium md:col-span-1 text-sm">Ámbito de inversión</label>
            <div className="relative md:col-span-2" ref={dropdownRef}>
                <button
                    className="w-full text-left bg-white border border-gray-300 px-4 py-2.5 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer relative flex justify-between items-center text-sm"
                    onClick={() => setIsInvestmentDropdownOpen(!isInvestmentDropdownOpen)}
                >
                    <span className="truncate pr-4">
                        {selectedScopes.length > 0 ? selectedScopes.join(', ') : "Seleccionar"}
                    </span>
                    <ChevronDown className="text-gray-400" size={16} />
                </button>
                
                {isInvestmentDropdownOpen && (
                    <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20 max-h-60 overflow-y-auto">
                        {INVESTMENT_SCOPES.map(scope => {
                            const isSelected = selectedScopes.includes(scope);
                            return (
                                <div 
                                    key={scope}
                                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center justify-between text-xs text-gray-700 select-none"
                                    onClick={() => toggleInvestmentScope(scope)}
                                >
                                    <span>{scope}</span>
                                    {isSelected && <Check size={14} className="text-primary" />}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
      );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">Tipologías</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 space-y-8">
          {renderSelect("Tipo de proyecto", "projectType", [
            "Estudio",
            "Diseño",
            "Construcción/ Ejecución",
            "Adquisición",
            "Implementación de software"
          ])}
          
          {renderMultiSelect()}

          {renderSelect("Lineamiento estratégico", "strategicGuideline", STRATEGIC_GUIDELINES)}
          
          {renderSelect("Programa", "program", PROGRAMS)}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-center">
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

export default TypologyModal;