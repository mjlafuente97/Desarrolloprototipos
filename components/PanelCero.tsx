import React from 'react';
import { Maximize2, ExternalLink, MoreHorizontal, Circle } from 'lucide-react';

interface PanelCeroProps {
  onNavigateToInitiatives?: () => void;
}

const PanelCero: React.FC<PanelCeroProps> = ({ onNavigateToInitiatives }) => {
  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6 animate-fade-in-up pb-12">
      
      <div className="grid grid-cols-12 gap-6">
        
        {/* LEFT COLUMN (Wider) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          
          {/* 1. Integrador de indicadores */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-primary px-4 py-2 flex justify-between items-center">
              <span className="text-white font-medium">Integrador de indicadores</span>
              <a 
                href="https://nucleos.cerolabs.cl/nucleos?page=1"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white text-primary text-xs px-3 py-1 rounded-full flex items-center gap-1 font-medium hover:bg-gray-100 transition-colors"
              >
                <ExternalLink size={12} /> Abrir
              </a>
            </div>
            
            <div className="p-4">
              <div className="flex gap-2 mb-4 overflow-x-auto">
                {['Indicador 1', 'Indicador 2', 'Indicador 3', 'Indicador 4'].map((tab, i) => (
                  <button key={i} className={`text-xs px-3 py-1 rounded-full ${i === 0 ? 'bg-gray-100 font-semibold text-gray-700' : 'text-gray-500 hover:bg-gray-50'}`}>
                    {tab}
                  </button>
                ))}
                <button className="bg-gray-700 text-white text-[10px] px-2 py-1 rounded-full ml-auto">Ir al núcleo</button>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                {/* Bar Chart Section */}
                <div className="w-full md:w-1/3 flex flex-col gap-4">
                  <div className="bg-white border border-gray-100 rounded p-4 h-48 flex items-end justify-between gap-2 relative">
                    <div className="absolute top-2 left-2 text-xs font-medium text-gray-500">Título de este indicador</div>
                     {/* Bars */}
                    <div className="flex flex-col items-center gap-2 w-1/3 h-full justify-end">
                      <div className="w-full bg-[#6C4C95] rounded-t-sm h-[70%]"></div>
                      <span className="text-[10px] text-gray-500">Linares</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 w-1/3 h-full justify-end">
                      <div className="w-full bg-[#856BAC] rounded-t-sm h-[65%]"></div>
                      <span className="text-[10px] text-gray-500">Curicó</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 w-1/3 h-full justify-end">
                      <div className="w-full bg-[#B5A4C9] rounded-t-sm h-[55%]"></div>
                      <span className="text-[10px] text-gray-500">Talca</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="border border-gray-100 rounded p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-xs text-gray-500 mb-1">Título de este indicador</span>
                        <span className="text-2xl font-bold text-gray-800">104.567</span>
                        <span className="text-[10px] text-gray-400 leading-tight">Establecimientos Educacionales</span>
                     </div>
                     <div className="border border-gray-100 rounded p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-xs text-gray-500 mb-1">Título de este indicador</span>
                        <span className="text-2xl font-bold text-gray-800">9.357</span>
                        <span className="text-[10px] text-gray-400 leading-tight">Centros de salud</span>
                     </div>
                  </div>
                </div>

                {/* Map Section */}
                <div className="w-full md:w-2/3 bg-gray-100 rounded-lg relative overflow-hidden min-h-[250px]">
                   <img 
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop" 
                    alt="Mapa de calor" 
                    className="w-full h-full object-cover opacity-80"
                   />
                   <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-transparent to-orange-500/20 mix-blend-multiply"></div>
                   
                   {/* Heatmap overlay simulation */}
                   <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-orange-500/40 blur-3xl rounded-full"></div>
                   <div className="absolute bottom-1/3 left-1/3 w-24 h-24 bg-red-500/30 blur-2xl rounded-full"></div>

                   <div className="absolute top-4 right-4 bg-white rounded flex flex-col shadow-sm">
                      <button className="p-1 hover:bg-gray-50 text-gray-600">+</button>
                      <button className="p-1 hover:bg-gray-50 text-gray-600">-</button>
                   </div>
                   
                   {/* Dots */}
                   <div className="absolute top-10 left-20 w-2 h-2 bg-orange-500 rounded-full border border-white"></div>
                   <div className="absolute bottom-20 right-40 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
                   <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-500 rounded-full border border-white"></div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Monitor Capacidad de Carga */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
             <div className="bg-[#5B6E96] px-4 py-2 flex justify-between items-center">
              <span className="text-white font-medium">Monitor Capacidad de Carga</span>
              <a 
                href="https://demo.capca.cl/municipio" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white text-[#5B6E96] text-xs px-3 py-1 rounded-full flex items-center gap-1 font-medium hover:bg-gray-100 transition-colors"
              >
                <ExternalLink size={12} /> Abrir
              </a>
            </div>
            
            <div className="p-4">
              <div className="flex gap-4 mb-4 text-xs border-b border-gray-100 pb-2">
                 <span className="font-semibold text-gray-700 border-b-2 border-gray-700 pb-2 -mb-2.5">Indicador 1</span>
                 <span className="text-gray-500 cursor-pointer">Indicador 2</span>
                 <span className="text-gray-500 cursor-pointer">Indicador 3</span>
                 <span className="text-gray-500 cursor-pointer">Indicador 4</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Stat 1 */}
                 <div className="border border-gray-100 rounded p-4 flex flex-col justify-center">
                    <h4 className="text-xs text-gray-500 mb-4">Residuos Sólidos Domiciliarios Totales</h4>
                    <p className="text-xs text-gray-600 mb-1">Oferta de educación total</p>
                    <span className="text-3xl font-bold text-[#D3455B]">4.855</span>
                    <span className="text-xs font-semibold text-gray-600">Capacidad saturada</span>
                 </div>

                  {/* Stat 2 */}
                 <div className="border border-gray-100 rounded p-4 flex flex-col justify-center">
                    <div className="h-6"></div> {/* Spacer */}
                    <p className="text-xs text-gray-600 mb-1">Agua potable y servida</p>
                    <span className="text-3xl font-bold text-[#C8D12D]">189.355</span>
                    <span className="text-xs font-semibold text-gray-600">Capacidad en latencia</span>
                 </div>

                 {/* Chart */}
                 <div className="border border-gray-100 rounded p-4">
                    <h4 className="text-xs text-gray-500 mb-2">Agua potable y servida</h4>
                    <div className="relative h-32 w-full mt-2">
                        {/* Fake Line Chart using SVG */}
                        <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none">
                           {/* Grid lines */}
                           <line x1="0" y1="20" x2="200" y2="20" stroke="#eee" strokeWidth="1" />
                           <line x1="0" y1="50" x2="200" y2="50" stroke="#eee" strokeWidth="1" />
                           <line x1="0" y1="80" x2="200" y2="80" stroke="#eee" strokeWidth="1" />
                           
                           {/* Red Line */}
                           <polyline 
                             points="0,60 30,55 50,20 70,20 90,20 110,20 130,20 150,20 170,20 200,20" 
                             fill="none" stroke="#D3455B" strokeWidth="2"
                           />
                           {/* Yellow Line */}
                           <polyline 
                             points="0,70 30,65 50,40 70,40 90,40 110,40 130,40 150,40 170,40 200,40" 
                             fill="none" stroke="#C8D12D" strokeWidth="2"
                           />
                           {/* Gray Line */}
                           <polyline 
                             points="0,90 30,85 50,80 70,75 90,85 110,80 130,85 150,80 170,85 200,80" 
                             fill="none" stroke="#666" strokeWidth="1"
                           />
                        </svg>
                        <div className="flex justify-between text-[8px] text-gray-400 mt-1">
                           <span>Julio 2021</span>
                           <span>Julio 2023</span>
                           <span>Julio 2025</span>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-2">
                        <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-gray-500"></div><span className="text-[8px] text-gray-500">RSD totales producidos</span></div>
                        <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#D3455B]"></div><span className="text-[8px] text-gray-500">Capacidad</span></div>
                        <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#C8D12D]"></div><span className="text-[8px] text-gray-500">Latencia</span></div>
                    </div>
                 </div>
              </div>
            </div>
          </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 3. Aplicación externa */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-[#A88B9D] px-4 py-2 flex justify-between items-center">
                  <span className="text-white font-medium">Aplicación externa</span>
                  <button className="bg-white text-[#A88B9D] text-xs px-3 py-1 rounded-full flex items-center gap-1 font-medium hover:bg-gray-100 transition-colors">
                    <ExternalLink size={12} /> Abrir
                  </button>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-semibold text-gray-700">Control de tránsito en Vivo</span>
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                    </span>
                  </div>
                  <div className="rounded-lg overflow-hidden h-48">
                     <img 
                        src="https://images.unsplash.com/photo-1575608882585-8869c97ebc1a?q=80&w=800&auto=format&fit=crop" 
                        alt="Traffic Camera" 
                        className="w-full h-full object-cover"
                     />
                  </div>
                </div>
              </div>

              {/* 4. Visión Ciudadana */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-[#56A89B] px-4 py-2 flex justify-between items-center">
                  <span className="text-white font-medium">Visión Ciudadana</span>
                  <button className="bg-white text-[#56A89B] text-xs px-3 py-1 rounded-full flex items-center gap-1 font-medium hover:bg-gray-100 transition-colors">
                    <ExternalLink size={12} /> Abrir
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-700 mb-4 font-medium">Participación ciudadana en proyecto "Quiero mi Barrio" según rango etario</p>
                  
                  <div className="relative h-40 w-full">
                       <svg viewBox="0 0 200 100" className="w-full h-full" preserveAspectRatio="none">
                           {/* Lines */}
                           <polyline 
                             points="0,80 40,75 80,40 120,50 160,30 200,60" 
                             fill="none" stroke="#56A89B" strokeWidth="3"
                           />
                           <polyline 
                             points="0,70 40,65 80,30 120,40 160,80 200,70" 
                             fill="none" stroke="#6C4C95" strokeWidth="3"
                           />
                           <polyline 
                             points="0,60 40,40 80,60 120,20 160,30 200,10" 
                             fill="none" stroke="#2D8BBA" strokeWidth="3"
                           />
                        </svg>
                  </div>
                  <div className="flex justify-center gap-4 mt-2">
                      <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#56A89B]"></div><span className="text-[8px] text-gray-500">Adultos mayores</span></div>
                      <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#6C4C95]"></div><span className="text-[8px] text-gray-500">Adultos</span></div>
                      <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#2D8BBA]"></div><span className="text-[8px] text-gray-500">Niños</span></div>
                  </div>
                </div>
              </div>
           </div>

        </div>

        {/* RIGHT COLUMN (Narrower) */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
           
           {/* 1. Seguimiento de iniciativas */}
           <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-[#6A7FBA] px-4 py-2 flex justify-between items-center">
              <span className="text-white font-medium">Seguimiento de iniciativas</span>
              <button 
                onClick={onNavigateToInitiatives}
                className="bg-white text-[#6A7FBA] text-xs px-3 py-1 rounded-full flex items-center gap-1 font-medium hover:bg-gray-100 transition-colors"
              >
                <ExternalLink size={12} /> Abrir
              </button>
            </div>
            
            <div className="p-4">
               {/* Filters */}
               <div className="flex gap-2 mb-4">
                  <div className="bg-white border border-gray-200 rounded text-[10px] px-2 py-1 flex justify-between items-center w-1/2">
                    <div className="flex flex-col">
                      <span className="text-[8px] text-gray-400">Estado</span>
                      <span className="font-semibold text-gray-700">SELECCIONAR</span>
                    </div>
                    <ChevronDownIcon size={12} className="text-gray-400" />
                  </div>
                  <div className="bg-white border border-gray-200 rounded text-[10px] px-2 py-1 flex justify-between items-center w-1/2">
                    <div className="flex flex-col">
                      <span className="text-[8px] text-gray-400">Línea estratégica</span>
                      <span className="font-semibold text-gray-700">SELECCIONAR</span>
                    </div>
                    <ChevronDownIcon size={12} className="text-gray-400" />
                  </div>
               </div>

               {/* Horizontal Bars */}
               <div className="space-y-3 mb-6">
                  <h4 className="text-[10px] font-semibold text-gray-600 mb-2">Cantidad de proyectos por línea estratégica</h4>
                  {[
                    { label: 'L1: Economía', width: '85%', color: 'bg-[#6A7FBA]' },
                    { label: 'L2: Social', width: '60%', color: 'bg-[#6A7FBA]' },
                    { label: 'L3: Ambiental', width: '25%', color: 'bg-[#6A7FBA]' },
                    { label: 'L4: Institucional', width: '20%', color: 'bg-[#6A7FBA]' },
                    { label: 'L5: Deporte', width: '15%', color: 'bg-[#6A7FBA]' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                       <span className="text-[9px] text-gray-500 w-20 truncate">{item.label}</span>
                       <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full ${item.color} rounded-full`} style={{ width: item.width }}></div>
                       </div>
                    </div>
                  ))}
                  <div className="flex justify-between text-[8px] text-gray-400 pl-20">
                     <span>0</span><span>100</span><span>200</span><span>300</span><span>400</span>
                  </div>
               </div>

               {/* Pie Chart & Total */}
               <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                  <div className="flex flex-col items-center">
                     <span className="text-[10px] text-gray-500 mb-2">Total proyectos por estado</span>
                     <div className="relative w-24 h-24">
                        <svg viewBox="0 0 32 32" className="w-full h-full transform -rotate-90">
                           <circle cx="16" cy="16" r="16" fill="transparent" />
                           <circle cx="16" cy="16" r="8" fill="transparent" stroke="#5B6E96" strokeWidth="16" strokeDasharray="75 100" />
                           <circle cx="16" cy="16" r="8" fill="transparent" stroke="#E5E7EB" strokeWidth="16" strokeDasharray="25 100" strokeDashoffset="-75" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="w-12 h-12 bg-white rounded-full"></div>
                        </div>
                     </div>
                  </div>
                  <div className="flex flex-col items-center justify-center">
                     <span className="text-[10px] text-gray-500 mb-1">Total proyectos</span>
                     <span className="text-4xl font-bold text-gray-800">124</span>
                     <span className="text-sm font-medium text-gray-600">Proyectos</span>
                  </div>
               </div>
            </div>
           </div>

           {/* 2. Project List */}
           <div className="space-y-3">
              {[
                { name: 'CONSTRUCCION ELECTRIFICACION POTRERILLOS ALTOS Y EL RELOJ, OVALLE', status: 'Búsqueda financiamiento', statusColor: 'bg-[#56765E]', date: '02-03-2026', desc: 'Acceso equitativo a los derechos humanos-sociales, económicos y culturales' },
                { name: 'CONSTRUCCION ELECTRIFICACION POTRERILLOS ALTOS Y EL RELOJ, OVALLE', status: 'Ejecución', statusColor: 'bg-[#76B086]', date: '02-03-2026', desc: 'Infraestructura Habilitante y resiliente Medio ambiente construido' },
                { name: 'CONSTRUCCION ELECTRIFICACION POTRERILLOS ALTOS Y EL RELOJ, OVALLE', status: 'Búsqueda financiamiento', statusColor: 'bg-[#56765E]', date: '02-03-2026', desc: 'Desarrollo integral de los asentamientos humanos Centros poblados / espacios públicos Medio ambiente construido' },
                { name: 'CONSTRUCCION ELECTRIFICACION POTRERILLOS ALTOS Y EL RELOJ, OVALLE', status: 'Búsqueda financiamiento', statusColor: 'bg-[#56765E]', date: '02-03-2026', desc: 'Planificación y evaluación de largo plazo' },
                { name: 'CONSTRUCCION ELECTRIFICACION POTRERILLOS ALTOS Y EL RELOJ, OVALLE', status: 'Ejecución', statusColor: 'bg-[#76B086]', date: '02-03-2026', desc: 'Infraestructura Habilitante y resiliente Medio ambiente construido' },
              ].map((project, i) => (
                 <div key={i} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex justify-between items-start gap-2 mb-2">
                       <h5 className="text-[10px] font-bold text-gray-700 uppercase leading-tight line-clamp-2">{project.name}</h5>
                       <div className={`shrink-0 ${project.statusColor} text-white text-[8px] px-2 py-1 rounded text-center leading-none min-w-[70px]`}>
                          <span className="block text-[6px] opacity-80 mb-0.5">Estado actual</span>
                          {project.status}
                       </div>
                    </div>
                    <div className="space-y-2">
                       <div>
                          <span className="text-[8px] text-gray-500 block">Línea estratégica</span>
                          <p className="text-[9px] text-gray-600 leading-tight">{project.desc}</p>
                       </div>
                       <div>
                          <span className="text-[8px] text-gray-400 block">Última actualización</span>
                          <span className="text-[9px] text-gray-600 font-medium">{project.date}</span>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
};

// Simple Icon component for the PanelCero file locally
const ChevronDownIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m6 9 6 6 6-6"/>
  </svg>
);

export default PanelCero;