import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PanelCero from './components/PanelCero';
import NameModal from './components/modals/NameModal';
import IdentificationModal from './components/modals/IdentificationModal';
import InterventionModal from './components/modals/InterventionModal';
import TypologyModal from './components/modals/TypologyModal';
import InvestmentModal from './components/modals/InvestmentModal';
import ExpensesModal from './components/modals/ExpensesModal';
import ExecutionLicitacionModal from './components/modals/ExecutionLicitacionModal';
import ImpactIndicatorsModal from './components/modals/ImpactIndicatorsModal';
import ProblemModal from './components/modals/ProblemModal';
import BeneficiariesModal from './components/modals/BeneficiariesModal';
import CoverageModal from './components/modals/CoverageModal';
import ExpectedResultsModal from './components/modals/ExpectedResultsModal';
import ShareModal from './components/modals/ShareModal';
import DocumentsModal from './components/modals/DocumentsModal';
import ParticipationModal from './components/modals/ParticipationModal';
import { Pencil, Plus, Menu, ChevronDown, ArrowUpRight, Share2, Link as LinkIcon, Download, Clock, User, Send, FileText, Calendar as CalendarIcon, Trash2, Edit2, LayoutDashboard, Folder, UserCircle, LogOut, File, Users } from 'lucide-react';
import { InitiativeState, IdentificationData, InterventionData, TypologyData, InvestmentData, ExpenseItem, LogEntry, CalendarEvent, LicitacionData, ImpactIndicator, FormulationData, BeneficiariesData, CoverageData, ExpectedResult, DocumentItem, ParticipationEntry } from './types';
import { jsPDF } from "jspdf";

const App: React.FC = () => {
  // Navigation State - Changed default to 'dashboard'
  const [viewMode, setViewMode] = useState<'dashboard' | 'detail' | 'panel0'>('dashboard'); 
  const [activeView, setActiveView] = useState('Identificación');
  
  // Header Menu State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Helper to create a log entry easily
  const createLog = (action: string, type: 'update' | 'status_change' | 'creation' = 'update', details?: string): LogEntry => ({
    id: Date.now().toString(),
    timestamp: new Date(),
    user: 'Usuario Actual',
    action,
    details,
    type
  });

  // --- Initial Data Generation ---
  const generateMockInitiative = (index: number): InitiativeState => ({
      id: index.toString(),
      name: 'Mejoramiento Cesfam Pueblo Lo Espejo, Segunda Etapa',
      status: 'Activo',
      priority: 'Alta',
      stage: 'Ejecución',
      lastUpdate: '02-03-2026',
      isFavorite: index === 0,
      image: index === 0 ? "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=800&auto=format&fit=crop" : null,
      identification: {
          imagePreview: null,
          description: "Proyecto de mejoramiento de infraestructura de salud...",
          responsibleUnit: "SECPLA",
          inCharge: "Juan Pérez",
          code1: "RENC_RES_2025",
          code2: "014"
      },
      typology: {
          projectType: "Obra",
          investmentScope: "Salud",
          strategicGuideline: "Promoción del bienestar social y la salud comunitaria",
          program: "PMB"
      },
      intervention: null,
      investment: {
        type: 'Propio',
        department: 'Obras',
        inscriptionDate: '10-01-2025',
        documents: []
      },
      execution: {
        licitacion: null,
        documents: []
      },
      participation: [], // Initial empty array for participation
      expenses: [],
      impactIndicators: [],
      formulation: {
          problem: "",
          beneficiaries: null,
          coverage: null,
          expectedResults: []
      },
      logs: [],
      calendarEvents: []
  });

  // List of all initiatives
  const [initiativesList, setInitiativesList] = useState<InitiativeState[]>(
      Array(6).fill(null).map((_, i) => generateMockInitiative(i))
  );

  // Current Active Initiative (Detailed View)
  const [initiative, setInitiative] = useState<InitiativeState>(initiativesList[0]);
  
  // Track which section opened the document modal
  const [activeDocumentSection, setActiveDocumentSection] = useState<'investment' | 'execution' | 'participation' | null>(null);
  
  // Temporary storage for participation editing
  const [activeParticipationEntry, setActiveParticipationEntry] = useState<ParticipationEntry | null>(null);

  const [modals, setModals] = useState({
    name: false,
    identification: false,
    intervention: false,
    typology: false,
    investment: false,
    expenses: false,
    executionLicitacion: false,
    impactIndicators: false,
    // Formulation modals
    problem: false,
    beneficiaries: false,
    coverage: false,
    expectedResults: false,
    // Share modal
    share: false,
    // Document modal
    documents: false,
    // Participation modal
    participation: false
  });
  
  // State for new log entry
  const [newLogText, setNewLogText] = useState("");

  // Dropdown states
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const statusOptions = ["Borrador", "Activo", "Pausado", "Completado", "Cancelado"];

  const [showStageDropdown, setShowStageDropdown] = useState(false);
  const stageOptions = ["Inversión", "Ejecución", "Operación"];

  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const priorityOptions = ["Alta", "Media", "Baja"];

  // --- Calendar State ---
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 1)); 
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEventData, setNewEventData] = useState({ title: '', startDate: '', endDate: '' });

  // Navigation Logic
  const handleBackToDashboard = () => {
    setViewMode('dashboard');
  };

  const handleSelectInitiative = (id: string) => {
    const selected = initiativesList.find(i => i.id === id);
    if (selected) {
        setInitiative(selected);
        setViewMode('detail');
        setActiveView('Identificación');
    }
  };

  // Menu Navigation Handlers
  const handleMenuNavigation = (target: 'panel0' | 'dashboard' | 'profile' | 'logout') => {
      setIsMenuOpen(false);
      if (target === 'panel0') {
          setViewMode('panel0');
      } else if (target === 'dashboard') {
          setViewMode('dashboard');
      } else if (target === 'logout') {
          // Placeholder for logout
          console.log("Logout clicked");
      }
  };

  // Flow Step 1: Create New Initiative
  const handleCreateNew = () => {
      // Prepare a clean state for the new initiative, but don't add to list yet
      const newInit: InitiativeState = {
          id: "", // Will be assigned on save
          name: "Nueva Iniciativa",
          status: "Borrador",
          stage: "",
          priority: "",
          identification: null,
          intervention: null,
          typology: null,
          investment: null,
          execution: null,
          participation: [],
          expenses: [],
          impactIndicators: [],
          formulation: {
            problem: "",
            beneficiaries: null,
            coverage: null,
            expectedResults: []
          },
          logs: [
            {
                id: Date.now().toString(),
                timestamp: new Date(),
                user: 'Usuario Actual',
                action: 'Iniciativa creada',
                type: 'creation'
            }
          ],
          calendarEvents: []
      };
      
      setInitiative(newInit);
      setActiveView('Identificación');
      // No view mode change yet, the modal opens on top of dashboard essentially, 
      // but to keep flow consistent we might want to switch or just show modal.
      // Current flow requests: Create -> Open Name Modal -> Save -> Show Detail.
      openNameModal();
  };

  // --- PDF Generation Handler ---
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    let yPos = 20;
    const lineHeight = 7;
    const margin = 20;
    const pageWidth = doc.internal.pageSize.getWidth();
    const contentWidth = pageWidth - (margin * 2);

    // Title
    doc.setFontSize(18);
    doc.setTextColor(49, 52, 139); // primary color
    doc.text("Ficha de Iniciativa", margin, yPos);
    yPos += 12;

    // Initiative Name
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    const splitTitle = doc.splitTextToSize(initiative.name, contentWidth);
    doc.text(splitTitle, margin, yPos);
    yPos += (splitTitle.length * lineHeight) + 5;

    // General Info
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Estado: ${initiative.status}  |  Prioridad: ${initiative.priority || 'N/A'}`, margin, yPos);
    yPos += lineHeight;
    if (initiative.stage) {
      doc.text(`Etapa: ${initiative.stage}`, margin, yPos);
      yPos += lineHeight;
    }
    yPos += lineHeight;

    // Helper to add section
    const addSection = (title: string, content: string[][]) => {
       if (yPos > 260) {
         doc.addPage();
         yPos = 20;
       }
       // Section Header
       doc.setFontSize(12);
       doc.setTextColor(49, 52, 139);
       doc.setFont(undefined, 'bold');
       doc.text(title, margin, yPos);
       yPos += lineHeight;
       
       // Section Content
       doc.setFontSize(10);
       doc.setTextColor(60, 60, 60);
       doc.setFont(undefined, 'normal');
       
       content.forEach(([label, value]) => {
          if (value && typeof value === 'string' && value.trim() !== '') {
            if (yPos > 275) {
                doc.addPage();
                yPos = 20;
            }
            const labelText = `${label}: `;
            const valueText = value;
            
            // Simple check to align if needed, usually direct printing is fine
            const fullText = `${labelText}${valueText}`;
            const splitText = doc.splitTextToSize(fullText, contentWidth);
            doc.text(splitText, margin, yPos);
            yPos += (splitText.length * 6);
          }
       });
       yPos += 4; // Spacing after section
    };

    // Identificación
    if (initiative.identification) {
        addSection("Identificación", [
            ["Unidad Responsable", initiative.identification.responsibleUnit],
            ["Encargado", initiative.identification.inCharge],
            ["Código 1", initiative.identification.code1],
            ["Código 2", initiative.identification.code2],
            ["Descripción", initiative.identification.description]
        ]);
    }

    // Intervención
    if (initiative.intervention) {
        addSection("Intervención", [
            ["Comuna", initiative.intervention.comuna],
            ["Sector", initiative.intervention.sector]
        ]);
    }

    // Tipología
    if (initiative.typology) {
        addSection("Tipología", [
             ["Tipo de proyecto", initiative.typology.projectType],
             ["Ámbito de inversión", initiative.typology.investmentScope],
             ["Lineamiento estratégico", initiative.typology.strategicGuideline],
             ["Programa", initiative.typology.program]
        ]);
    }

    // Formulación
    addSection("Formulación", [
        ["Problema", initiative.formulation.problem],
        ["Beneficiarios Directos", initiative.formulation.beneficiaries?.direct || ""],
        ["Beneficiarios Indirectos", initiative.formulation.beneficiaries?.indirect || ""],
        ["Cobertura (Link)", initiative.formulation.coverage?.link || ""]
    ]);
    
    // Resultados esperados
    if (initiative.formulation.expectedResults.length > 0) {
        if (yPos > 260) { doc.addPage(); yPos = 20; }
        doc.setFontSize(12);
        doc.setTextColor(49, 52, 139);
        doc.setFont(undefined, 'bold');
        doc.text("Resultados Esperados", margin, yPos);
        yPos += lineHeight;
        doc.setFontSize(9);
        doc.setTextColor(80, 80, 80);
        doc.setFont(undefined, 'normal');
        initiative.formulation.expectedResults.forEach(r => {
             const text = `• ${r.description}\n   Indicador: ${r.indicator} | Meta: ${r.goal}`;
             const split = doc.splitTextToSize(text, contentWidth);
             doc.text(split, margin, yPos);
             yPos += (split.length * 5) + 2;
        });
        yPos += 4;
    }

    // Investment
    if (initiative.investment) {
         const inv = initiative.investment;
         const data = [
             ["Tipo de financiamiento", inv.type],
             ...(inv.type === 'Propio' ? [
                 ["Departamento", inv.department || ""],
                 ["Fecha inscripción", inv.inscriptionDate || ""]
             ] : [
                 ["Financista", inv.financier || ""],
                 ["Fondo", inv.fund || ""],
                 ["Estado Postulación", inv.postulationState || ""]
             ])
         ];
         addSection("Plan de Inversión", data);
    }

    // Expenses
    if (initiative.expenses.length > 0) {
        if (yPos > 260) { doc.addPage(); yPos = 20; }
        doc.setFontSize(12);
        doc.setTextColor(49, 52, 139);
        doc.setFont(undefined, 'bold');
        doc.text("Gastos", margin, yPos);
        yPos += lineHeight;
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(60, 60, 60);
        initiative.expenses.forEach(e => {
            if (e.item) {
                const text = `${e.item}: ${e.total} (Ejecución: ${e.execution})`;
                doc.text(text, margin, yPos);
                yPos += 6;
            }
        });
        yPos += 4;
    }
    
    // Execution
    if (initiative.execution?.licitacion) {
        const lic = initiative.execution.licitacion;
         addSection("Ejecución - Licitación", [
             ["Tipo", lic.type],
             ["Detalle", lic.detail],
             ["Estado", lic.status],
             ["Ejecutor", lic.executor],
             ["Monto", lic.amount]
         ]);
    }
    
    // Impact Indicators
    if (initiative.impactIndicators.length > 0) {
        if (yPos > 260) { doc.addPage(); yPos = 20; }
        doc.setFontSize(12);
        doc.setTextColor(49, 52, 139);
        doc.setFont(undefined, 'bold');
        doc.text("Indicadores de Impacto", margin, yPos);
        yPos += lineHeight;
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(80, 80, 80);
        initiative.impactIndicators.forEach(i => {
             const text = `• ${i.name} (${i.percentage})\n   ${i.description}`;
             const split = doc.splitTextToSize(text, contentWidth);
             doc.text(split, margin, yPos);
             yPos += (split.length * 5) + 2;
        });
    }

    // Save
    doc.save("ficha-iniciativa.pdf");
  };

  // --- Modal Handlers ---
  const openNameModal = () => setModals(prev => ({ ...prev, name: true }));
  const closeNameModal = () => setModals(prev => ({ ...prev, name: false }));
  
  const saveName = (newName: string) => {
    // 1. Create the final new initiative object with an ID
    const newInitiative: InitiativeState = { 
        ...initiative, 
        id: Date.now().toString(), // Generate ID here
        name: newName,
        lastUpdate: new Date().toLocaleDateString('es-CL'),
        logs: [createLog('Nombre actualizado'), ...initiative.logs] 
    };

    // 2. Add it to the main list
    setInitiativesList(prev => [newInitiative, ...prev]);

    // 3. Set it as the current active initiative
    setInitiative(newInitiative);

    // 4. Proceed to detail view
    setViewMode('detail'); 
    setActiveView('Identificación'); 
    closeNameModal();
  };

  const updateInitiative = (updater: (prev: InitiativeState) => InitiativeState) => {
      setInitiative(prev => {
          const updated = updater(prev);
          // Also update the list item so dashboard reflects changes immediately if we go back
          setInitiativesList(currentList => 
             currentList.map(item => item.id === updated.id ? updated : item)
          );
          return updated;
      });
  };

  const openIdModal = () => setModals(prev => ({ ...prev, identification: true }));
  const closeIdModal = () => setModals(prev => ({ ...prev, identification: false }));

  const saveIdentification = (data: IdentificationData) => {
    updateInitiative(prev => ({ 
        ...prev, 
        identification: data,
        logs: [createLog('Identificación actualizada'), ...prev.logs]
    }));
    closeIdModal();
  };

  const openInterventionModal = () => setModals(prev => ({ ...prev, intervention: true }));
  const closeInterventionModal = () => setModals(prev => ({ ...prev, intervention: false }));
  
  const saveIntervention = (data: InterventionData) => {
    updateInitiative(prev => ({ 
        ...prev, 
        intervention: data,
        logs: [createLog('Área de intervención actualizada'), ...prev.logs]
    }));
    closeInterventionModal();
  };

  const openTypologyModal = () => setModals(prev => ({ ...prev, typology: true }));
  const closeTypologyModal = () => setModals(prev => ({ ...prev, typology: false }));

  const saveTypology = (data: TypologyData) => {
    updateInitiative(prev => ({ 
        ...prev, 
        typology: data,
        logs: [createLog('Tipologías actualizadas'), ...prev.logs]
    }));
    closeTypologyModal();
  };

  const openInvestmentModal = () => setModals(prev => ({ ...prev, investment: true }));
  const closeInvestmentModal = () => setModals(prev => ({ ...prev, investment: false }));

  const saveInvestment = (data: InvestmentData) => {
    updateInitiative(prev => ({ 
        ...prev, 
        investment: { ...prev.investment, ...data }, // merge to preserve documents
        logs: [createLog('Plan de inversión actualizado'), ...prev.logs]
    }));
    closeInvestmentModal();
  };

  const openExpensesModal = () => setModals(prev => ({ ...prev, expenses: true }));
  const closeExpensesModal = () => setModals(prev => ({ ...prev, expenses: false }));

  const saveExpenses = (data: ExpenseItem[]) => {
    updateInitiative(prev => ({ 
        ...prev, 
        expenses: data,
        logs: [createLog('Tabla de gastos actualizada'), ...prev.logs]
    }));
    closeExpensesModal();
  };

  const openExecutionLicitacionModal = () => setModals(prev => ({ ...prev, executionLicitacion: true }));
  const closeExecutionLicitacionModal = () => setModals(prev => ({ ...prev, executionLicitacion: false }));

  const saveExecutionLicitacion = (data: LicitacionData) => {
    updateInitiative(prev => ({
        ...prev,
        execution: { ...prev.execution, licitacion: data },
        logs: [createLog('Datos de licitación actualizados'), ...prev.logs]
    }));
    closeExecutionLicitacionModal();
  };

  const openImpactIndicatorsModal = () => setModals(prev => ({ ...prev, impactIndicators: true }));
  const closeImpactIndicatorsModal = () => setModals(prev => ({ ...prev, impactIndicators: false }));

  const saveImpactIndicators = (data: ImpactIndicator[]) => {
    updateInitiative(prev => ({
        ...prev,
        impactIndicators: data,
        logs: [createLog('Indicadores de impacto actualizados'), ...prev.logs]
    }));
    closeImpactIndicatorsModal();
  };

  // --- Formulation Modal Handlers ---
  const saveProblem = (problem: string) => {
    updateInitiative(prev => ({
        ...prev,
        formulation: { ...prev.formulation, problem },
        logs: [createLog('Problema o brecha actualizada'), ...prev.logs]
    }));
    setModals(prev => ({ ...prev, problem: false }));
  };

  const saveBeneficiaries = (data: BeneficiariesData) => {
    updateInitiative(prev => ({
        ...prev,
        formulation: { ...prev.formulation, beneficiaries: data },
        logs: [createLog('Beneficiarios actualizados'), ...prev.logs]
    }));
    setModals(prev => ({ ...prev, beneficiaries: false }));
  };

  const saveCoverage = (data: CoverageData) => {
    updateInitiative(prev => ({
        ...prev,
        formulation: { ...prev.formulation, coverage: data },
        logs: [createLog('Cobertura y accesibilidad actualizada'), ...prev.logs]
    }));
    setModals(prev => ({ ...prev, coverage: false }));
  };

  const saveExpectedResults = (data: ExpectedResult[]) => {
    updateInitiative(prev => ({
        ...prev,
        formulation: { ...prev.formulation, expectedResults: data },
        logs: [createLog('Resultados esperados actualizados'), ...prev.logs]
    }));
    setModals(prev => ({ ...prev, expectedResults: false }));
  };

  // --- Share Modal Handlers ---
  const openShareModal = () => setModals(prev => ({ ...prev, share: true }));
  const closeShareModal = () => setModals(prev => ({ ...prev, share: false }));

  // --- Documents Modal Handlers ---
  const openDocumentsModal = (section: 'investment' | 'execution' | 'participation') => {
      setActiveDocumentSection(section);
      setModals(prev => ({ ...prev, documents: true }));
  };
  const closeDocumentsModal = () => {
      setModals(prev => ({ ...prev, documents: false }));
      setActiveDocumentSection(null);
  };
  
  const saveDocument = (doc: DocumentItem) => {
      updateInitiative(prev => {
          const newLogs = [createLog(`Documento añadido: ${doc.name}`), ...prev.logs];
          
          if (activeDocumentSection === 'investment') {
              const currentDocs = prev.investment?.documents || [];
              return {
                  ...prev,
                  investment: {
                      ...prev.investment,
                      type: prev.investment?.type || 'Propio',
                      documents: [...currentDocs, doc]
                  },
                  logs: newLogs
              };
          } else if (activeDocumentSection === 'execution') {
               const currentDocs = prev.execution?.documents || [];
               return {
                  ...prev,
                  execution: {
                      licitacion: prev.execution?.licitacion || null,
                      documents: [...currentDocs, doc]
                  },
                  logs: newLogs
               };
          } else if (activeDocumentSection === 'participation') {
              // Special handling for participation: update the temporary state for the modal
              if (activeParticipationEntry) {
                  setActiveParticipationEntry({
                      ...activeParticipationEntry,
                      documents: [...activeParticipationEntry.documents, doc]
                  });
              }
              // We don't update main initiative state yet, waiting for Modal Save
              return prev;
          }
          return prev;
      });
      closeDocumentsModal();
  };

  // --- Participation Modal Handlers ---
  const openParticipationModal = (entry?: ParticipationEntry) => {
      if (entry) {
          setActiveParticipationEntry(entry);
      } else {
          setActiveParticipationEntry({
              id: Date.now().toString(),
              date: '',
              activityName: '',
              participantsCount: '',
              description: '',
              documents: [],
              comments: []
          });
      }
      setModals(prev => ({ ...prev, participation: true }));
  };

  const closeParticipationModal = () => {
      setModals(prev => ({ ...prev, participation: false }));
      setActiveParticipationEntry(null);
  };

  const saveParticipation = (data: ParticipationEntry) => {
      updateInitiative(prev => {
          const existingIndex = prev.participation.findIndex(p => p.id === data.id);
          let newParticipation = [...prev.participation];
          let logAction = '';

          if (existingIndex >= 0) {
              newParticipation[existingIndex] = data;
              logAction = 'Participación ciudadana actualizada';
          } else {
              newParticipation = [data, ...newParticipation];
              logAction = 'Nuevo registro de participación ciudadana';
          }

          return {
              ...prev,
              participation: newParticipation,
              logs: [createLog(logAction), ...prev.logs]
          };
      });
      closeParticipationModal();
  };

  const deleteParticipation = (id: string) => {
      updateInitiative(prev => ({
          ...prev,
          participation: prev.participation.filter(p => p.id !== id),
          logs: [createLog('Registro de participación eliminado'), ...prev.logs]
      }));
  };

  const handleNavigate = (label: string) => {
    setActiveView(label);
  };

  const handleStatusSelect = (status: string) => {
    const newStage = status === 'Activo' ? initiative.stage : "";
    updateInitiative(prev => ({ 
        ...prev, 
        status: status, 
        stage: newStage,
        logs: [createLog(`Cambio de estado a ${status}`, 'status_change'), ...prev.logs]
    }));
    setShowStatusDropdown(false);
  };

  const handleStageSelect = (stage: string) => {
    updateInitiative(prev => ({ 
        ...prev, 
        stage: stage,
        logs: [createLog(`Etapa cambiada a ${stage}`), ...prev.logs]
    }));
    setShowStageDropdown(false);
  };

  const handlePrioritySelect = (priority: string) => {
    updateInitiative(prev => ({ 
        ...prev, 
        priority: priority,
        logs: [createLog(`Prioridad cambiada a ${priority}`), ...prev.logs]
    }));
    setShowPriorityDropdown(false);
  };

  const handleAddLog = () => {
    if (!newLogText.trim()) return;
    updateInitiative(prev => ({
        ...prev,
        logs: [createLog('Nota de bitácora', 'update', newLogText), ...prev.logs]
    }));
    setNewLogText("");
  };

  // Calendar Helpers
  const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
  const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(parseInt(e.target.value));
    setCurrentDate(newDate);
  };
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDate = new Date(currentDate);
    newDate.setFullYear(parseInt(e.target.value));
    setCurrentDate(newDate);
  };
  const handleCreateEvent = () => {
    if (!newEventData.title || !newEventData.startDate) return;
    const newEvent: CalendarEvent = { id: Date.now().toString(), title: newEventData.title, startDate: newEventData.startDate, endDate: newEventData.endDate };
    updateInitiative(prev => ({ ...prev, calendarEvents: [...prev.calendarEvents, newEvent], logs: [createLog('Evento de calendario creado'), ...prev.logs] }));
    setNewEventData({ title: '', startDate: '', endDate: '' });
    setShowEventForm(false);
  };
  const deleteEvent = (id: string) => {
      updateInitiative(prev => ({ ...prev, calendarEvents: prev.calendarEvents.filter(e => e.id !== id), logs: [createLog('Evento de calendario eliminado'), ...prev.logs] }));
  };
  const formatDate = (date: Date) => {
    const formatted = new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true }).format(date);
    return formatted.replace(/\./g, '');
  };
  const formatEventDate = (dateString: string) => {
      const date = new Date(dateString + 'T00:00:00'); 
      return new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  };

  // --- Main Layout ---
  return (
    <div className="min-h-screen bg-bgLight font-sans text-gray-800">
      
      {/* Global Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-50 shadow-sm">
        <div className="flex items-center gap-4" ref={menuRef}>
          <div className="relative">
              <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-600 hover:text-primary transition-colors focus:outline-none"
              >
                  <Menu size={24} />
              </button>
              
              {/* Hamburger Menu Dropdown */}
              {isMenuOpen && (
                  <div className="absolute top-10 left-0 w-64 bg-white rounded-lg shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200 z-[60]">
                      <div className="px-2 space-y-1">
                          <button 
                              onClick={() => handleMenuNavigation('panel0')}
                              className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-md flex items-center gap-3 transition-colors group"
                          >
                              <LayoutDashboard size={18} className="text-gray-400 group-hover:text-primary"/>
                              <span className="group-hover:text-primary font-medium">Panel Cero</span>
                          </button>
                          
                          <button 
                              onClick={() => handleMenuNavigation('dashboard')}
                              className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-md flex items-center gap-3 transition-colors group"
                          >
                              <Folder size={18} className="text-gray-400 group-hover:text-primary"/>
                              <span className="group-hover:text-primary font-medium">Mis iniciativas</span>
                          </button>
                          
                          <button 
                              onClick={() => handleMenuNavigation('profile')}
                              className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-md flex items-center gap-3 transition-colors group"
                          >
                              <UserCircle size={18} className="text-gray-400 group-hover:text-primary"/>
                              <span className="group-hover:text-primary font-medium">Mi perfil</span>
                          </button>

                          <div className="my-2 border-t border-gray-100"></div>

                          <button 
                              onClick={() => handleMenuNavigation('logout')}
                              className="w-full text-left px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-md flex items-center gap-3 transition-colors group"
                          >
                              <span className="text-gray-400 group-hover:text-red-500 font-medium w-full text-center">Cerrar Sesión</span>
                          </button>
                      </div>
                  </div>
              )}
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-primary font-medium text-base">Región Metropolitana</span>
          <span className="text-gray-300 text-xl font-light">|</span>
          <img src="logo_CAPCA_azul.webp" alt="CAPCA" className="h-8" />
        </div>
      </header>
      
      {/* --- View Controller --- */}
      <div className="pt-16 min-h-screen">
          
          {/* 1. Panel Cero View */}
          {viewMode === 'panel0' && (
              <PanelCero onNavigateToInitiatives={() => setViewMode('dashboard')} />
          )}

          {/* 2. Dashboard View */}
          {viewMode === 'dashboard' && (
              <Dashboard 
                initiatives={initiativesList}
                onSelectInitiative={handleSelectInitiative} 
                onCreateNew={handleCreateNew} 
              />
          )}

          {/* 3. Detail View */}
          {viewMode === 'detail' && (
             <div className="flex">
                <Sidebar 
                    activeItem={activeView} 
                    onNavigate={handleNavigate} 
                    onCreateNew={handleCreateNew} 
                    onBack={handleBackToDashboard} 
                />
                
                <main className="flex-1 md:ml-64 transition-all">
                  <div className="p-8 max-w-7xl mx-auto">
                    
                    {/* Breadcrumb / Title Area */}
                    <div className="mb-8">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-2">
                        <div className="flex items-center gap-3 group">
                          <h1 className="text-xl font-medium text-gray-700">{initiative.name}</h1>
                          {activeView === 'Identificación' && (
                            <button 
                              onClick={openNameModal}
                              className="text-gray-400 hover:text-primary transition-colors p-1 rounded-md hover:bg-gray-100"
                              title="Editar nombre"
                            >
                              <Pencil size={16} />
                            </button>
                          )}
                        </div>

                        {/* Action buttons */}
                        {(activeView === 'Formulación' || activeView === 'Identificación' || activeView === 'Calendario' || activeView === 'Plan de inversión' || activeView === 'Participación ciudadana') && (
                          <div className="flex items-center gap-3">
                              <span className="text-xs text-gray-400 font-medium bg-gray-100 px-2 py-1 rounded">
                                  Última actualización {formatDate(initiative.logs[0]?.timestamp || new Date())}
                              </span>
                              <button 
                                onClick={handleDownloadPDF}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-md text-sm hover:bg-gray-50 shadow-sm transition-colors"
                              >
                                  <Download size={14} /> Ficha automática
                              </button>
                              <button 
                                onClick={openShareModal}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 text-gray-600 rounded-md text-sm hover:bg-gray-50 shadow-sm transition-colors"
                              >
                                  <Share2 size={14} /> Compartir
                              </button>
                          </div>
                        )}
                      </div>

                      {/* Filter Bar */}
                      <div className="bg-white p-2 rounded-lg border border-gray-200 flex flex-wrap gap-4 items-center shadow-sm relative z-20">
                        <div className="flex-1 border-r border-gray-100 h-8 hidden lg:block"></div>
                        <div className="flex-1 border-r border-gray-100 h-8 hidden lg:block"></div>
                        <div className="flex-1 h-8 hidden lg:block"></div>
                        
                        {/* Status Dropdown */}
                        <div className="flex items-center gap-2 px-4 relative">
                            <span className="text-sm font-medium text-gray-600">Estado</span>
                            <div 
                              onClick={() => {
                                  setShowStatusDropdown(!showStatusDropdown);
                                  setShowStageDropdown(false);
                                  setShowPriorityDropdown(false);
                              }}
                              className="border border-gray-300 rounded-full px-3 py-1 text-sm flex items-center gap-2 cursor-pointer bg-white hover:border-primary transition-colors min-w-[130px] justify-between"
                            >
                              <span className={initiative.status ? "text-gray-800" : "text-gray-500"}>
                                  {initiative.status || "Seleccionar"}
                              </span>
                              <ChevronDown size={14} className={`transition-transform duration-200 ${showStatusDropdown ? 'rotate-180' : ''}`} />
                            </div>

                            {showStatusDropdown && (
                              <div className="absolute top-full left-12 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                                  {statusOptions.map((option) => (
                                      <div 
                                          key={option}
                                          onClick={() => handleStatusSelect(option)}
                                          className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 ${initiative.status === option ? 'text-primary font-medium bg-indigo-50' : 'text-gray-700'}`}
                                      >
                                          {option}
                                      </div>
                                  ))}
                              </div>
                            )}
                        </div>

                        {/* Stage Dropdown (Conditional) */}
                        {initiative.status === 'Activo' && (
                            <div className="flex items-center gap-2 px-4 border-l border-gray-200 relative animate-in fade-in slide-in-from-left-2 duration-300">
                                <div 
                                  onClick={() => {
                                      setShowStageDropdown(!showStageDropdown);
                                      setShowStatusDropdown(false);
                                      setShowPriorityDropdown(false);
                                  }}
                                  className="border border-gray-300 rounded-full px-3 py-1 text-sm flex items-center gap-2 cursor-pointer bg-white hover:border-primary transition-colors min-w-[130px] justify-between"
                                >
                                  <span className={initiative.stage ? "text-gray-800" : "text-gray-500"}>
                                      {initiative.stage || "Seleccionar"}
                                  </span>
                                  <ChevronDown size={14} className={`transition-transform duration-200 ${showStageDropdown ? 'rotate-180' : ''}`} />
                                </div>

                                {showStageDropdown && (
                                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                                      {stageOptions.map((option) => (
                                          <div 
                                              key={option}
                                              onClick={() => handleStageSelect(option)}
                                              className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 ${initiative.stage === option ? 'text-primary font-medium bg-indigo-50' : 'text-gray-700'}`}
                                          >
                                              {option}
                                          </div>
                                      ))}
                                  </div>
                                )}
                            </div>
                        )}

                        {/* Priority Dropdown */}
                        <div className="flex items-center gap-2 px-4 border-l border-gray-200 relative">
                            <span className="text-sm font-medium text-gray-600">Prioridad</span>
                            <div 
                              onClick={() => {
                                  setShowPriorityDropdown(!showPriorityDropdown);
                                  setShowStatusDropdown(false);
                                  setShowStageDropdown(false);
                              }}
                              className="border border-gray-300 rounded-full px-3 py-1 text-sm flex items-center gap-2 cursor-pointer bg-white hover:border-primary transition-colors min-w-[130px] justify-between"
                            >
                              <span className={initiative.priority ? "text-gray-800" : "text-gray-500"}>
                                  {initiative.priority || "Seleccionar"}
                              </span>
                              <ChevronDown size={14} className={`transition-transform duration-200 ${showPriorityDropdown ? 'rotate-180' : ''}`} />
                            </div>

                            {showPriorityDropdown && (
                              <div className="absolute top-full left-12 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                                  {priorityOptions.map((option) => (
                                      <div 
                                          key={option}
                                          onClick={() => handlePrioritySelect(option)}
                                          className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-50 ${initiative.priority === option ? 'text-primary font-medium bg-indigo-50' : 'text-gray-700'}`}
                                      >
                                          {option}
                                      </div>
                                  ))}
                              </div>
                            )}
                        </div>
                      </div>
                    </div>

                    {/* View Content (Details) */}
                    {activeView === 'Identificación' && (
                        /* ... Identificación cards code kept same ... */
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* ... (Existing Identificación code omitted for brevity but preserved) ... */}
                            <div 
                            className={`bg-white rounded-lg border shadow-sm transition-all duration-300 flex flex-col ${initiative.identification ? 'border-gray-200' : 'border-gray-200 hover:border-primary/50 cursor-pointer'}`}
                            style={{ minHeight: '320px' }}
                            onClick={!initiative.identification ? openIdModal : undefined}
                            >
                            <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                                <h3 className="font-semibold text-gray-700">Identificación</h3>
                                {initiative.identification && (
                                    <button onClick={openIdModal} className="text-gray-400 hover:text-primary"><Pencil size={14}/></button>
                                )}
                            </div>
                            
                            <div className="flex-1 p-6 relative">
                                {initiative.identification ? (
                                <div className="flex flex-col md:flex-row gap-8 h-full">
                                    <div className="w-full md:w-5/12 flex flex-col gap-4">
                                        {initiative.identification.imagePreview && (
                                            <div className="w-full rounded-lg overflow-hidden shadow-sm aspect-[4/3] bg-gray-100">
                                                <img 
                                                    src={initiative.identification.imagePreview} 
                                                    alt="Initiative" 
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="space-y-1">
                                            <p className="text-base font-semibold text-gray-700">
                                                Código 1: <span className="font-normal text-gray-600">{initiative.identification.code1}</span>
                                            </p>
                                            <p className="text-base font-semibold text-gray-700">
                                                Código 2: <span className="font-normal text-gray-600">{initiative.identification.code2}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col gap-8">
                                        <div>
                                            <h4 className="text-xl font-semibold text-gray-700 mb-3">Descripción</h4>
                                            <p className="text-gray-600 text-base leading-relaxed">
                                                {initiative.identification.description}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-semibold text-gray-700 mb-3">Responsables</h4>
                                            <div className="space-y-1">
                                                <p className="text-gray-600 text-base">
                                                    {initiative.identification.responsibleUnit}
                                                </p>
                                                <p className="text-gray-600 text-base">
                                                    {initiative.identification.inCharge}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                ) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <Plus size={32} strokeWidth={1.5} className="mb-2" />
                                    <span className="text-lg font-light">Añadir información</span>
                                </div>
                                )}
                            </div>
                            </div>

                            {/* Card 2: Área de intervención */}
                            <div 
                            className={`bg-white rounded-lg border shadow-sm transition-all duration-300 flex flex-col ${initiative.intervention ? 'border-gray-200' : 'border-gray-200 hover:border-primary/50 cursor-pointer'}`}
                            style={{ minHeight: '320px' }}
                            onClick={openInterventionModal}
                            >
                                <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <h3 className="font-semibold text-gray-700">Área de intervención</h3>
                                        {initiative.intervention && (
                                            <p className="text-gray-600 text-sm mt-1">{initiative.intervention.sector}</p>
                                        )}
                                    </div>
                                    {initiative.intervention && (
                                        <button className="text-gray-400 hover:text-primary"><Pencil size={14}/></button>
                                    )}
                                </div>
                                
                                <div className={`flex-1 flex flex-col items-center justify-center ${initiative.intervention ? 'p-0 overflow-hidden' : 'p-6 text-gray-400'}`}>
                                    {initiative.intervention ? (
                                        <div className="w-full h-full bg-gray-100 relative">
                                            <img 
                                                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?q=80&w=1200&auto=format&fit=crop" 
                                                alt="Map of area" 
                                                className="w-full h-full object-cover grayscale opacity-60"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-1/2 h-1/2 bg-primary/30 border-2 border-primary rotate-12 transform -skew-x-12"></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <Plus size={32} strokeWidth={1.5} className="mb-2" />
                                            <span className="text-lg font-light">Añadir información</span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Card 3: Tipologías */}
                            <div 
                                className={`bg-white rounded-lg border shadow-sm transition-all duration-300 flex flex-col ${initiative.typology ? 'border-gray-200' : 'border-gray-200 hover:border-primary/50 cursor-pointer'}`}
                                style={{ minHeight: '320px' }}
                                onClick={openTypologyModal}
                            >
                                <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                                    <h3 className="font-semibold text-gray-700">Tipologías</h3>
                                    {initiative.typology && (
                                        <button className="text-gray-400 hover:text-primary"><Pencil size={14}/></button>
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col justify-center p-6">
                                    {initiative.typology ? (
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm font-bold text-gray-700 mb-2">Tipo de proyecto</p>
                                                <span className="inline-block px-3 py-1 rounded-full border border-primary text-primary text-xs font-medium bg-white">
                                                    {initiative.typology.projectType || "-"}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-700 mb-2">Ámbito de inversión</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {initiative.typology.investmentScope ? 
                                                        initiative.typology.investmentScope.split(',').map((scope, idx) => (
                                                            <span key={idx} className="inline-block px-3 py-1 rounded-full border border-primary text-primary text-xs font-medium bg-white">
                                                                {scope.trim()}
                                                            </span>
                                                        )) 
                                                        : <span>-</span>
                                                    }
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-700 mb-2">Lineamiento estratégico</p>
                                                <span className="inline-block px-3 py-1 rounded-full border border-primary text-primary text-xs font-medium bg-white">
                                                    {initiative.typology.strategicGuideline || "-"}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-700 mb-2">Programa</