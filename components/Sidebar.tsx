import React from 'react';
import { 
  FolderOpen, 
  FileText, 
  DollarSign, 
  Wrench, 
  Users, 
  BarChart2, 
  MessageSquare, 
  Calendar,
  ChevronLeft
} from 'lucide-react';

interface SidebarProps {
  activeItem?: string;
  onNavigate?: (label: string) => void;
  onCreateNew?: () => void;
  onBack?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeItem = 'Identificación', onNavigate, onBack }) => {
  const menuItems = [
    { icon: FolderOpen, label: 'Identificación' },
    { icon: FileText, label: 'Formulación' },
    { icon: DollarSign, label: 'Plan de inversión' },
    { icon: Wrench, label: 'Ejecución' },
    { icon: Users, label: 'Participación ciudadana' },
    { icon: BarChart2, label: 'Indicadores de impacto' },
    { icon: MessageSquare, label: 'Bitácora' },
    { icon: Calendar, label: 'Calendario' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-[calc(100vh-4rem)] flex flex-col fixed left-0 top-16 overflow-y-auto z-40 hidden md:flex">
      <div className="p-6">
        {onBack && (
          <button 
            onClick={onBack}
            className="flex items-center gap-1 text-gray-500 text-sm font-medium mb-4 hover:text-primary transition-colors"
          >
            <ChevronLeft size={16} /> Volver
          </button>
        )}
        
        <h1 className="text-primary font-bold text-lg leading-tight">
          Seguimiento<br />de la iniciativa
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {menuItems.map((item, index) => (
          <div
            key={index}
            onClick={() => onNavigate && onNavigate(item.label)}
            className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm cursor-pointer transition-colors ${
              activeItem === item.label
                ? 'bg-indigo-50 text-primary font-medium'
                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            <item.icon size={18} />
            <span className="leading-snug">{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;