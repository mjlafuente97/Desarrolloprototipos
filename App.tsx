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
import ExecutionProgressModal from './components/modals/ExecutionProgressModal';
import ImpactIndicatorsModal from './components/modals/ImpactIndicatorsModal';
import FulfillmentModal from './components/modals/FulfillmentModal';
import ProblemModal from './components/modals/ProblemModal';
import BeneficiariesModal from './components/modals/BeneficiariesModal';
import CoverageModal from './components/modals/CoverageModal';
import ExpectedResultsModal from './components/modals/ExpectedResultsModal';
import ShareModal from './components/modals/ShareModal';
import DocumentsModal from './components/modals/DocumentsModal';
import ParticipationModal from './components/modals/ParticipationModal';
import { Pencil, Plus, Menu, ChevronDown, ArrowUpRight, Share2, Link as LinkIcon, Download, Clock, User, Send, FileText, Calendar as CalendarIcon, Trash2, Edit2, LayoutDashboard, Folder, UserCircle, LogOut, File, Users, Paperclip, MessageSquare, Target, CheckCircle2, AlertTriangle, HelpCircle, MoreHorizontal, RotateCcw, ExternalLink, Search } from 'lucide-react';
import { InitiativeState, IdentificationData, InterventionData, TypologyData, InvestmentData, ExpenseItem, LogEntry, CalendarEvent, LicitacionData, ImpactIndicator, FormulationData, BeneficiariesData, CoverageData, ExpectedResult, DocumentItem, ParticipationEntry, FulfillmentStatus, ExecutionProgressRow } from './types';
import { jsPDF } from "jspdf";

const App: React.FC = () => {
  // Navigation State
  const [viewMode, setViewMode] = useState<'dashboard' | 'detail' | 'panel0'>('dashboard'); 
  const [activeView, setActiveView] = useState('Identificación');
  const [activeLicitacionIndex, setActiveLicitacionIndex] = useState(0);
  const [activeInvestmentIndex, setActiveInvestmentIndex] = useState(0);
  const [activeCardMenu, setActiveCardMenu] = useState<string | null>(null);
  const [activeNucleusId, setActiveNucleusId] = useState<string>('n1');
  
  // Header Menu State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const cardMenuRef = useRef<HTMLDivElement>(null);

  // Helper for empty states
  const emptyText = <span className="text-gray-400 italic font-normal">sin información</span>;

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (cardMenuRef.current && !cardMenuRef.current.contains(event.target as Node)) {
        setActiveCardMenu(null);
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
      investments: [
        {
          type: 'Propio',
          department: 'Obras',
          inscriptionDate: '10-01-2025',
          documents: []
        }
      ],
      execution: {
        licitaciones: [
            { type: "", detail: "", status: "", link: "", dates: [], executor: "", resolution: "", amount: "" }
        ], 
        progress: null,
        documents: []
      },
      participation: [], 
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

  // Tracking for fulfillment modal
  const [activeResultToTrack, setActiveResultToTrack] = useState<ExpectedResult | null>(null);

  const [modals, setModals] = useState({
    name: false,
    identification: false,
    intervention: false,
    typology: false,
    investment: false,
    expenses: false,
    executionLicitacion: false,
    executionProgress: false,
    impactIndicators: false,
    fulfillment: false, 
    problem: false,
    beneficiaries: false,
    coverage: false,
    expectedResults: false,
    share: false,
    documents: false,
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

  // Helper to detect if a licitacion is empty
  const isLicitacionEmpty = (lic: LicitacionData | undefined) => {
    if (!lic) return true;
    return !lic.type && !lic.detail && !lic.status && !lic.link && lic.dates.length === 0 && !lic.executor && !lic.amount;
  };

  // --- Restore Action Handlers ---
  const handleRestoreCard = (cardId: string) => {
    setActiveCardMenu(null);
    updateInitiative(prev => {
        let newState = { ...prev };
        let logAction = "";

        switch (cardId) {
            case 'identification':
                newState.identification = null;
                logAction = "Información de identificación restaurada";
                break;
            case 'intervention':
                newState.intervention = null;
                logAction = "Área de intervención restaurada";
                break;
            case 'typology':
                newState.typology = null;
                logAction = "Tipologías restauradas";
                break;
            case 'calendar':
                newState.calendarEvents = [];
                logAction = "Calendario de fechas restaurado";
                break;
            case 'problem':
                newState.formulation.problem = "";
                logAction = "Problema o brecha restaurado";
                break;
            case 'beneficiaries':
                newState.formulation.beneficiaries = null;
                logAction = "Beneficiarios restaurados";
                break;
            case 'coverage':
                newState.formulation.coverage = null;
                logAction = "Cobertura restaurada";
                break;
            case 'expectedResults':
                newState.formulation.expectedResults = [];
                logAction = "Resultados esperados restaurados";
                break;
            case 'investment':
                const newInvestments = [...prev.investments];
                newInvestments[activeInvestmentIndex] = { type: '', department: '', inscriptionDate: '', documents: [] };
                newState.investments = newInvestments;
                logAction = `Financiamiento ${activeInvestmentIndex + 1} restaurado`;
                break;
            case 'licitacion':
                if (newState.execution?.licitaciones) {
                    const newLics = [...newState.execution.licitaciones];
                    newLics[activeLicitacionIndex] = { type: "", detail: "", status: "", link: "", dates: [], executor: "", resolution: "", amount: "" };
                    newState.execution = { ...newState.execution, licitaciones: newLics };
                }
                logAction = `Licitación ${activeLicitacionIndex + 1} restaurada`;
                break;
        }

        return {
            ...newState,
            logs: [createLog(logAction), ...prev.logs]
        };
    });
  };

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
        setActiveLicitacionIndex(0);
        setActiveInvestmentIndex(0);
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
          console.log("Logout clicked");
      }
  };

  // Flow Step 1: Create New Initiative
  const handleCreateNew = () => {
      const newInit: InitiativeState = {
          id: "", 
          name: "Nueva Iniciativa",
          status: "Borrador",
          stage: "",
          priority: "",
          identification: null,
          intervention: null,
          typology: null,
          investments: [],
          execution: {
            licitaciones: [
                { type: "", detail: "", status: "", link: "", dates: [], executor: "", resolution: "", amount: "" }
            ],
            progress: null,
            documents: []
          },
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

    doc.setFontSize(18);
    doc.setTextColor(49, 52, 139); 
    doc.text("Ficha de Iniciativa", margin, yPos);
    yPos += 12;

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    const splitTitle = doc.splitTextToSize(initiative.name, contentWidth);
    doc.text(splitTitle, margin, yPos);
    yPos += (splitTitle.length * lineHeight) + 5;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Estado: ${initiative.status}  |  Prioridad: ${initiative.priority || 'N/A'}`, margin, yPos);
    yPos += lineHeight;
    if (initiative.stage) {
      doc.text(`Etapa: ${initiative.stage}`, margin, yPos);
      yPos += lineHeight;
    }
    yPos += lineHeight;

    const addSection = (title: string, content: string[][]) => {
       if (yPos > 260) {
         doc.addPage();
         yPos = 20;
       }
       doc.setFontSize(12);
       doc.setTextColor(49, 52, 139);
       doc.setFont(undefined, 'bold');
       doc.text(title, margin, yPos);
       yPos += lineHeight;
       
       doc.setFontSize(10);
       doc.setTextColor(60, 60, 60);
       doc.setFont(undefined, 'normal');
       
       content.forEach(([label, value]) => {
          if (value && typeof value === 'string' && value.trim() !== '') {
            if (yPos > 275) {
                doc.addPage();
                yPos = 20;
            }
            const fullText = `${label}: ${value}`;
            const splitText = doc.splitTextToSize(fullText, contentWidth);
            doc.text(splitText, margin, yPos);
            yPos += (splitText.length * 6);
          }
       });
       yPos += 4; 
    };

    if (initiative.identification) {
        addSection("Identificación", [
            ["Unidad Responsable", initiative.identification.responsibleUnit],
            ["Encargado", initiative.identification.inCharge],
            ["Código 1", initiative.identification.code1],
            ["Código 2", initiative.identification.code2],
            ["Descripción", initiative.identification.description]
        ]);
    }

    if (initiative.intervention) {
        addSection("Intervención", [
            ["Comuna", initiative.intervention.comuna],
            ["Sector", initiative.intervention.sector]
        ]);
    }

    if (initiative.typology) {
        addSection("Typología", [
             ["Tipo de proyecto", initiative.typology.projectType],
             ["Ámbito de inversión", initiative.typology.investmentScope],
             ["Lineamiento estratégico", initiative.typology.strategicGuideline],
             ["Programa", initiative.typology.program]
        ]);
    }

    addSection("Formulación", [
        ["Problema", initiative.formulation.problem],
        ["Beneficiarios Directos", initiative.formulation.beneficiaries?.direct || ""],
        ["Beneficiarios Indirectos", initiative.formulation.beneficiaries?.indirect || ""]
    ]);
    
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

    if (initiative.investments.length > 0) {
        initiative.investments.forEach((inv, i) => {
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
            addSection(`Plan de Inversión - Financiamiento ${i+1}`, data);
        });
    }

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
    
    if (initiative.execution?.licitaciones && initiative.execution.licitaciones.length > 0) {
        initiative.execution.licitaciones.forEach((lic, i) => {
            addSection(`Ejecución - Licitación ${i+1}`, [
                ["Tipo", lic.type],
                ["Detalle", lic.detail],
                ["Estado", lic.status],
                ["Ejecutor", lic.executor],
                ["Monto", lic.amount]
            ]);
        });
    }
    
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

    doc.save("ficha-iniciativa.pdf");
  };

  // --- Modal Handlers ---
  const openNameModal = () => setModals(prev => ({ ...prev, name: true }));
  const closeNameModal = () => setModals(prev => ({ ...prev, name: false }));
  
  const saveName = (newName: string) => {
    const newInitiative: InitiativeState = { 
        ...initiative, 
        id: Date.now().toString(), 
        name: newName,
        lastUpdate: new Date().toLocaleDateString('es-CL'),
        logs: [createLog('Nombre actualizado'), ...initiative.logs] 
    };

    setInitiativesList(prev => [newInitiative, ...prev]);
    setInitiative(newInitiative);
    setViewMode('detail'); 
    setActiveView('Identificación'); 
    closeNameModal();
  };

  const updateInitiative = (updater: (prev: InitiativeState) => InitiativeState) => {
      setInitiative(prev => {
          const updated = updater(prev);
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
    updateInitiative(prev => {
        const currentInvestments = [...(prev.investments || [])];
        if (activeInvestmentIndex < currentInvestments.length) {
            currentInvestments[activeInvestmentIndex] = data;
        } else {
            currentInvestments.push(data);
        }
        
        return {
            ...prev,
            investments: currentInvestments,
            logs: [createLog(`Plan de inversión ${activeInvestmentIndex + 1} actualizado`), ...prev.logs]
        };
    });
    closeInvestmentModal();
  };

  const handleAddInvestment = () => {
    updateInitiative(prev => {
        const currentInvestments = prev.investments || [];
        const emptyInvestment: InvestmentData = {
            type: '',
            department: '',
            inscriptionDate: '',
            postulationState: '',
            financier: '',
            fund: '',
            responsible: '',
            postulationDate: '',
            resultDate: '',
            documents: []
        };
        const newList = [...currentInvestments, emptyInvestment];
        setActiveInvestmentIndex(newList.length - 1);
        return {
            ...prev,
            investments: newList,
            logs: [createLog('Nueva fuente de financiamiento añadida'), ...prev.logs]
        };
    });
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
    updateInitiative(prev => {
        const currentLicitaciones = [...(prev.execution?.licitaciones || [])];
        if (activeLicitacionIndex < currentLicitaciones.length) {
            currentLicitaciones[activeLicitacionIndex] = data;
        } else {
            currentLicitaciones.push(data);
        }
        
        return {
            ...prev,
            execution: { ...prev.execution, licitaciones: currentLicitaciones } as any,
            logs: [createLog(`Datos de licitación ${activeLicitacionIndex + 1} actualizados`), ...prev.logs]
        };
    });
    closeExecutionLicitacionModal();
  };

  const handleAddLicitacion = () => {
    updateInitiative(prev => {
        const currentLicitaciones = prev.execution?.licitaciones || [];
        const emptyLicitacion: LicitacionData = {
            type: "",
            detail: "",
            status: "",
            link: "",
            dates: [],
            executor: "",
            resolution: "",
            amount: ""
        };
        const newList = [...currentLicitaciones, emptyLicitacion];
        setActiveLicitacionIndex(newList.length - 1);
        return {
            ...prev,
            execution: { ...prev.execution, licitaciones: newList } as any,
            logs: [createLog('Nueva licitación añadida'), ...prev.logs]
        };
    });
  };

  const openExecutionProgressModal = () => setModals(prev => ({ ...prev, executionProgress: true }));
  const closeExecutionProgressModal = () => setModals(prev => ({ ...prev, executionProgress: false }));

  const saveExecutionProgress = (data: ExecutionProgressRow[]) => {
    updateInitiative(prev => ({
        ...prev,
        execution: { ...prev.execution, progress: data } as any,
        logs: [createLog('Datos de ejecución actualizados'), ...prev.logs]
    }));
    closeExecutionProgressModal();
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

  const openFulfillmentModal = (result: ExpectedResult) => {
    setActiveResultToTrack(result);
    setModals(prev => ({ ...prev, fulfillment: true }));
  };

  const saveFulfillment = (resultId: string, status: FulfillmentStatus, comment: string) => {
    updateInitiative(prev => {
        const updatedResults = prev.formulation.expectedResults.map(r => 
            r.id === resultId ? { ...r, status, fulfillmentComment: comment } : r
        );
        return {
            ...prev,
            formulation: { ...prev.formulation, expectedResults: updatedResults },
            logs: [createLog(`Actualización de cumplimiento: ${status}`), ...prev.logs]
        };
    });
    setModals(prev => ({ ...prev, fulfillment: false }));
    setActiveResultToTrack(null);
  };

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

  const openShareModal = () => setModals(prev => ({ ...prev, share: true }));
  const closeShareModal = () => setModals(prev => ({ ...prev, share: false }));

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
              const currentInvestments = [...prev.investments];
              if (currentInvestments[activeInvestmentIndex]) {
                  const currentDocs = currentInvestments[activeInvestmentIndex].documents || [];
                  currentInvestments[activeInvestmentIndex] = {
                      ...currentInvestments[activeInvestmentIndex],
                      documents: [...currentDocs, doc]
                  };
              }
              return {
                  ...prev,
                  investments: currentInvestments,
                  logs: newLogs
              };
          } else if (activeDocumentSection === 'execution') {
               const currentDocs = prev.execution?.documents || [];
               return {
                  ...prev,
                  execution: {
                      licitaciones: prev.execution?.licitaciones || [],
                      progress: prev.execution?.progress || null,
                      documents: [...currentDocs, doc]
                  },
                  logs: newLogs
               };
          } else if (activeDocumentSection === 'participation') {
              if (activeParticipationEntry) {
                  setActiveParticipationEntry({
                      ...activeParticipationEntry,
                      documents: [...activeParticipationEntry.documents, doc]
                  });
              }
              return prev;
          }
          return prev;
      });
      closeDocumentsModal();
  };

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

  const getFulfillmentBadge = (status?: FulfillmentStatus) => {
    switch (status) {
        case 'achieved': return <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 w-fit"><CheckCircle2 size={10}/> Alcanzada</span>;
        case 'not_achieved': return <span className="bg-red-100 text-red-700 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 w-fit"><AlertTriangle size={10}/> No alcanzada</span>;
        case 'in_progress': return <span className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 w-fit"><Clock size={10}/> En proceso</span>;
        default: return <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 w-fit"><HelpCircle size={10}/> Pendiente</span>;
    }
  };

  // --- Card Menu Dropdown Component ---
  const renderCardMenu = (cardId: string) => (
    <div className="relative inline-block" ref={cardId === activeCardMenu ? cardMenuRef : null}>
        <button 
            onClick={(e) => {
                e.stopPropagation();
                setActiveCardMenu(activeCardMenu === cardId ? null : cardId);
            }}
            className="text-gray-400 hover:text-primary transition-colors p-1"
        >
            <MoreHorizontal size={18} />
        </button>
        {activeCardMenu === cardId && (
            <div className="absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-[40] py-1 animate-in fade-in zoom-in-95 duration-100">
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        handleRestoreCard(cardId);
                    }}
                    className="w-full text-left px-4 py-2 text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2 transition-colors"
                >
                    <RotateCcw size={12} /> Restaurar
                </button>
            </div>
        )}
    </div>
  );

  return (
    <div className="min-h-screen bg-bgLight font-sans text-gray-800">
      
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-50 shadow-sm">
        <div className="flex items-center gap-4" ref={menuRef}>
          <div className="relative">
              <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-600 hover:text-primary transition-colors focus:outline-none"
              >
                  <Menu size={24} />
              </button>
              
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
      
      <div className="pt-16 min-h-screen">
          
          {viewMode === 'panel0' && (
              <PanelCero onNavigateToInitiatives={() => setViewMode('dashboard')} />
          )}

          {viewMode === 'dashboard' && (
              <Dashboard 
                initiatives={initiativesList}
                onSelectInitiative={handleSelectInitiative} 
                onCreateNew={handleCreateNew} 
              />
          )}

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

                        {(activeView === 'Formulación' || activeView === 'Identificación' || activeView === 'Calendario' || activeView === 'Plan de inversión' || activeView === 'Participación ciudadana' || activeView === 'Indicadores de impacto') && (
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

                      <div className="bg-white p-2 rounded-lg border border-gray-200 flex flex-wrap gap-4 items-center shadow-sm relative z-20">
                        <div className="flex-1 border-r border-gray-100 h-8 hidden lg:block"></div>
                        <div className="flex-1 border-r border-gray-100 h-8 hidden lg:block"></div>
                        <div className="flex-1 h-8 hidden lg:block"></div>
                        
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

                    {activeView === 'Identificación' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div 
                            className={`bg-white rounded-lg border shadow-sm transition-all duration-300 flex flex-col ${initiative.identification ? 'border-gray-200' : 'border-gray-200 hover:border-primary/50 cursor-pointer'}`}
                            style={{ minHeight: '320px' }}
                            onClick={!initiative.identification ? openIdModal : undefined}
                            >
                            <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                                <h3 className="font-semibold text-gray-700">Identificación</h3>
                                {initiative.identification && (
                                    <div className="flex items-center gap-2">
                                        <button onClick={openIdModal} className="text-gray-400 hover:text-primary transition-colors"><Pencil size={14}/></button>
                                        {renderCardMenu('identification')}
                                    </div>
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
                                                Código 1: <span className="font-normal text-gray-600">{initiative.identification.code1 || emptyText}</span>
                                            </p>
                                            <p className="text-base font-semibold text-gray-700">
                                                Código 2: <span className="font-normal text-gray-600">{initiative.identification.code2 || emptyText}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex-1 flex flex-col gap-8">
                                        <div>
                                            <h4 className="text-xl font-semibold text-gray-700 mb-3">Descripción</h4>
                                            <p className="text-gray-600 text-base leading-relaxed">
                                                {initiative.identification.description || emptyText}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-semibold text-gray-700 mb-3">Responsables</h4>
                                            <div className="space-y-1">
                                                <p className="text-gray-600 text-base">
                                                    {initiative.identification.responsibleUnit || emptyText}
                                                </p>
                                                <p className="text-gray-600 text-base">
                                                    {initiative.identification.inCharge || emptyText}
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

                            <div 
                            className={`bg-white rounded-lg border shadow-sm transition-all duration-300 flex flex-col ${initiative.intervention ? 'border-gray-200' : 'border-gray-200 hover:border-primary/50 cursor-pointer'}`}
                            style={{ minHeight: '320px' }}
                            onClick={!initiative.intervention ? openInterventionModal : undefined}
                            >
                                <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                                    <div className="flex flex-col">
                                        <h3 className="font-semibold text-gray-700">Área de intervención</h3>
                                        {initiative.intervention && (
                                            <p className="text-gray-600 text-sm mt-1">{initiative.intervention.sector || emptyText}</p>
                                        )}
                                    </div>
                                    {initiative.intervention && (
                                        <div className="flex items-center gap-2">
                                            <button onClick={openInterventionModal} className="text-gray-400 hover:text-primary transition-colors"><Pencil size={14}/></button>
                                            {renderCardMenu('intervention')}
                                        </div>
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

                            <div 
                                className={`bg-white rounded-lg border shadow-sm transition-all duration-300 flex flex-col ${initiative.typology ? 'border-gray-200' : 'border-gray-200 hover:border-primary/50 cursor-pointer'}`}
                                style={{ minHeight: '320px' }}
                                onClick={!initiative.typology ? openTypologyModal : undefined}
                            >
                                <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                                    <h3 className="font-semibold text-gray-700">Tipologías</h3>
                                    {initiative.typology && (
                                        <div className="flex items-center gap-2">
                                            <button onClick={openTypologyModal} className="text-gray-400 hover:text-primary transition-colors"><Pencil size={14}/></button>
                                            {renderCardMenu('typology')}
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 flex flex-col justify-center p-6">
                                    {initiative.typology ? (
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm font-bold text-gray-700 mb-2">Tipo de proyecto</p>
                                                <span className="inline-block px-3 py-1 rounded-full border border-primary text-primary text-xs font-medium bg-white">
                                                    {initiative.typology.projectType || emptyText}
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
                                                        : emptyText
                                                    }
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-700 mb-2">Lineamiento estratégico</p>
                                                <span className="inline-block px-3 py-1 rounded-full border border-primary text-primary text-xs font-medium bg-white">
                                                    {initiative.typology.strategicGuideline || emptyText}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-700 mb-2">Programa</p>
                                                <span className="inline-block px-3 py-1 rounded-full border border-primary text-primary text-xs font-medium bg-white">
                                                    {initiative.typology.program || emptyText}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <Plus size={32} strokeWidth={1.5} className="mb-2" />
                                            <span className="text-lg font-light">Añadir información</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div 
                                onClick={() => handleNavigate('Calendario')}
                                className="bg-white rounded-lg border border-gray-200 shadow-sm min-h-[320px] flex flex-col relative hover:border-primary/50 cursor-pointer transition-colors"
                            >
                                <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                                    <h3 className="font-semibold text-gray-700">Fechas Clave</h3>
                                    <div className="flex items-center gap-2">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleNavigate('Calendario');
                                            }}
                                            className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-600 font-medium transition-colors"
                                        >
                                            Ir a calendario
                                        </button>
                                        {initiative.calendarEvents.length > 0 && renderCardMenu('calendar')}
                                    </div>
                                </div>
                                <div className="flex-1 p-6 overflow-y-auto">
                                    {initiative.calendarEvents.length > 0 ? (
                                        <div className="space-y-4">
                                            {initiative.calendarEvents
                                                .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                                                .map(event => (
                                                    <div key={event.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                                                        <h4 className="font-medium text-gray-800 text-[15px]">{event.title || emptyText}</h4>
                                                        <p className="text-gray-500 text-sm mt-1">{formatEventDate(event.startDate)}</p>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                            <Plus size={24} strokeWidth={1.5} className="mb-2" />
                                            <span className="font-light">Añadir información</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {activeView === 'Formulación' && (
                      <div className="flex flex-col gap-6 animate-fade-in-up">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              <div 
                                className={`bg-white rounded-lg border shadow-sm flex flex-col transition-all cursor-pointer ${initiative.formulation.problem ? 'border-gray-200' : 'border-gray-200 hover:border-primary/50'}`}
                                style={{ minHeight: '320px' }}
                                onClick={() => !initiative.formulation.problem && setModals(prev => ({...prev, problem: true}))}
                              >
                                  <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                                      <h3 className="font-semibold text-gray-700">Problema o brecha</h3>
                                      {initiative.formulation.problem && (
                                          <div className="flex items-center gap-2">
                                            <button onClick={() => setModals(prev => ({...prev, problem: true}))} className="text-gray-400 hover:text-primary"><Edit2 size={14}/></button>
                                            {renderCardMenu('problem')}
                                          </div>
                                      )}
                                  </div>
                                  <div className="flex-1 p-6 relative">
                                      {initiative.formulation.problem ? (
                                          <p className="text-gray-600 text-sm leading-relaxed">
                                              {initiative.formulation.problem || emptyText}
                                          </p>
                                      ) : (
                                          <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                              <Plus size={32} strokeWidth={1.5} className="mb-2" />
                                              <span className="text-lg font-light">Añadir información</span>
                                          </div>
                                      )}
                                  </div>
                              </div>

                              <div 
                                className={`bg-white rounded-lg border shadow-sm flex flex-col transition-all cursor-pointer ${initiative.formulation.beneficiaries ? 'border-gray-200' : 'border-gray-200 hover:border-primary/50'}`}
                                style={{ minHeight: '320px' }}
                                onClick={() => !initiative.formulation.beneficiaries && setModals(prev => ({...prev, beneficiaries: true}))}
                              >
                                  <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                                      <h3 className="font-semibold text-gray-700">Beneficiarios</h3>
                                      {initiative.formulation.beneficiaries && (
                                          <div className="flex items-center gap-2">
                                            <button onClick={() => setModals(prev => ({...prev, beneficiaries: true}))} className="text-gray-400 hover:text-primary"><Edit2 size={14}/></button>
                                            {renderCardMenu('beneficiaries')}
                                          </div>
                                      )}
                                  </div>
                                  <div className="flex-1 p-6 relative">
                                      {initiative.formulation.beneficiaries ? (
                                          <div className="space-y-6">
                                              <div>
                                                  <h4 className="text-sm font-bold text-gray-700 mb-1">Directo</h4>
                                                  <p className="text-gray-600 text-sm">{initiative.formulation.beneficiaries.direct || emptyText}</p>
                                              </div>
                                              <div>
                                                  <h4 className="text-sm font-bold text-gray-700 mb-1">Indirecto</h4>
                                                  <p className="text-gray-600 text-sm">{initiative.formulation.beneficiaries.indirect || emptyText}</p>
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
                          </div>

                          <div 
                            className={`bg-white rounded-lg border shadow-sm flex flex-col transition-all ${initiative.formulation.coverage ? 'border-gray-200' : 'border-gray-200'}`}
                            style={{ minHeight: '400px' }}
                          >
                                  <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                                      <h3 className="font-semibold text-gray-700">Núcleos de integración</h3>
                                      <div className="flex items-center gap-2">
                                        {initiative.formulation.coverage && (
                                          <>
                                            <button onClick={() => setModals(prev => ({...prev, coverage: true}))} className="text-gray-400 hover:text-primary"><Edit2 size={14}/></button>
                                            {renderCardMenu('coverage')}
                                          </>
                                        )}
                                      </div>
                                  </div>
                                  <div className="flex-1 p-6 relative">
                                      {initiative.formulation.coverage && initiative.formulation.coverage.nuclei.length > 0 ? (
                                          <div className="flex flex-col h-full gap-4 animate-in fade-in duration-500">
                                              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                                                <div className="flex gap-4">
                                                  {initiative.formulation.coverage.nuclei.map(n => (
                                                      <span 
                                                        key={n.id}
                                                        onClick={() => setActiveNucleusId(n.id)}
                                                        className={`text-xs font-bold cursor-pointer transition-all pb-2 -mb-2.5 ${activeNucleusId === n.id ? 'text-primary border-b-2 border-primary' : 'text-gray-400'}`}
                                                      >
                                                          {n.name}
                                                      </span>
                                                  ))}
                                                </div>
                                                <a 
                                                  href={initiative.formulation.coverage.nuclei.find(n => n.id === activeNucleusId)?.link} 
                                                  target="_blank" 
                                                  rel="noopener noreferrer"
                                                  className="bg-[#2a2aa9] text-white text-[10px] px-3 py-1.5 rounded-full flex items-center gap-1.5 font-bold hover:bg-opacity-90 transition-all shadow-sm"
                                                >
                                                  Abrir núcleo <ExternalLink size={12} />
                                                </a>
                                              </div>

                                              <div className="flex-1 mt-4">
                                                <h4 className="text-primary font-bold text-sm mb-4">
                                                    {activeNucleusId === 'n2' ? "Percepción del delito" : "Movilidad y accidentes"}
                                                </h4>
                                                
                                                <div className="grid grid-cols-12 gap-1 border border-gray-100 rounded-lg overflow-hidden h-[260px]">
                                                  <div className="col-span-4 bg-white p-3 border-r border-gray-50 flex flex-col gap-2 overflow-y-auto">
                                                    
                                                    {activeNucleusId === 'n2' ? (
                                                        <div className="border border-gray-100 rounded p-2 bg-white flex flex-col h-full">
                                                            <div className="flex justify-between items-start mb-1">
                                                                <div>
                                                                    <h5 className="text-[8px] font-bold text-gray-700 uppercase">Cuarteles carabineros</h5>
                                                                    <p className="text-[7px] text-gray-400">Cuarteles por categoría</p>
                                                                </div>
                                                                <Search size={10} className="text-gray-300" />
                                                            </div>
                                                            <div className="flex-1 flex items-end justify-between gap-1 px-1 pb-1 border-b border-gray-50 mb-2">
                                                                <div className="w-1/4 bg-[#5b4d96] h-[90%] rounded-t-sm"></div>
                                                                <div className="w-1/4 bg-[#4a72a8] h-[30%] rounded-t-sm"></div>
                                                                <div className="w-1/4 bg-[#499d9b] h-[15%] rounded-t-sm"></div>
                                                                <div className="w-1/4 bg-[#499d9b] h-[25%] rounded-t-sm"></div>
                                                            </div>
                                                            <div className="flex flex-col items-center justify-center text-center pb-2">
                                                                <span className="text-lg font-bold text-gray-800 leading-tight">28</span>
                                                                <span className="text-[7px] text-gray-400 uppercase font-bold">Total Cuarteles</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="border border-gray-100 rounded p-2 bg-white">
                                                            <div className="flex justify-between items-start mb-1">
                                                                <span className="text-[8px] font-bold text-gray-700 uppercase">Recepciones finales</span>
                                                            </div>
                                                            <div className="h-16 flex items-end justify-between gap-0.5">
                                                                <div className="w-1/6 bg-primary/30 h-[40%]"></div>
                                                                <div className="w-1/6 bg-primary/50 h-[80%]"></div>
                                                                <div className="w-1/6 bg-primary/40 h-[60%]"></div>
                                                                <div className="w-1/6 bg-primary h-[90%]"></div>
                                                                <div className="w-1/6 bg-primary/60 h-[50%]"></div>
                                                                <div className="w-1/6 bg-primary/70 h-[30%]"></div>
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    {activeNucleusId === 'n1' && (
                                                        <div className="border border-gray-100 rounded p-2 bg-white">
                                                            <span className="text-[8px] font-bold text-gray-400 block uppercase">Personas</span>
                                                            <span className="text-lg font-bold text-gray-800 block leading-tight">3.890</span>
                                                            <span className="text-[7px] text-gray-400 leading-tight block">Con dependencia moderada</span>
                                                        </div>
                                                    )}
                                                  </div>
                                                  <div className="col-span-8 bg-gray-50 relative">
                                                    <img 
                                                      src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?q=80&w=1200&auto=format&fit=crop" 
                                                      alt="Map" 
                                                      className="w-full h-full object-cover grayscale opacity-30"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                      <svg className="w-full h-full" viewBox="0 0 400 320" preserveAspectRatio="none">
                                                         {activeNucleusId === 'n1' ? (
                                                            <>
                                                                <path d="M120,60 L220,40 L310,100 L260,200 L160,230 Z" className="fill-purple-500/30 stroke-purple-600 stroke-1" />
                                                                <path d="M230,160 L290,140 L330,220 L290,260 L230,240 Z" className="fill-green-500/30 stroke-green-600 stroke-1" />
                                                            </>
                                                         ) : (
                                                            <>
                                                                <circle cx="280" cy="140" r="30" className="fill-yellow-500/30" />
                                                                <circle cx="270" cy="130" r="3" className="fill-yellow-600" />
                                                                <circle cx="290" cy="150" r="4" className="fill-yellow-600" />
                                                                <path d="M200,80 L250,70 L270,120 L220,130 Z" className="fill-purple-500/30" />
                                                                <circle cx="150" cy="200" r="4" className="fill-green-600" />
                                                                <circle cx="160" cy="180" r="3" className="fill-green-600" />
                                                            </>
                                                         )}
                                                      </svg>
                                                    </div>
                                                    <div className="absolute bottom-2 right-2 bg-white px-1.5 py-0.5 rounded border border-gray-100 flex text-[6px] font-bold">
                                                       <span className="px-1.5 py-0.5 bg-gray-50 border-r border-gray-100 uppercase">Mapa</span>
                                                       <span className="px-1.5 py-0.5 uppercase">Satélite</span>
                                                    </div>
                                                  </div>
                                                </div>
                                              </div>
                                          </div>
                                      ) : (
                                          <div className="flex flex-col items-center justify-center h-full gap-4">
                                              <button 
                                                onClick={() => setModals(prev => ({...prev, coverage: true}))}
                                                className="flex items-center gap-3 bg-indigo-50 hover:bg-indigo-100 text-primary px-8 py-3 rounded-md font-semibold transition-all shadow-sm group"
                                              >
                                                  <LinkIcon size={20} className="group-hover:rotate-12 transition-transform" />
                                                  <span>Vincular núcleo de integración</span>
                                              </button>
                                              <span className="text-gray-400 text-sm font-medium">
                                                  Podrás visualizar los indicadores clave de esta iniciativa
                                              </span>
                                          </div>
                                      )}
                                  </div>
                          </div>

                          <div 
                            className={`bg-white rounded-lg border shadow-sm flex flex-col transition-all cursor-pointer ${initiative.formulation.expectedResults.length > 0 ? 'border-gray-200' : 'border-gray-200 hover:border-primary/50'}`}
                            style={{ minHeight: '320px' }}
                            onClick={() => initiative.formulation.expectedResults.length === 0 && setModals(prev => ({...prev, expectedResults: true}))}
                          >
                                  <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                                      <h3 className="font-semibold text-gray-700">Resultados esperados</h3>
                                      {initiative.formulation.expectedResults.length > 0 && (
                                          <div className="flex items-center gap-2">
                                            <button onClick={() => setModals(prev => ({...prev, expectedResults: true}))} className="text-gray-400 hover:text-primary"><Edit2 size={14}/></button>
                                            {renderCardMenu('expectedResults')}
                                          </div>
                                      )}
                                  </div>
                                  <div className="flex-1 p-6 relative">
                                      {initiative.formulation.expectedResults.length > 0 ? (
                                          <div className="border border-gray-200 rounded-lg overflow-hidden">
                                              <div className="grid grid-cols-12 bg-gray-50 p-3 text-xs font-semibold text-gray-600 border-b border-gray-200">
                                                  <div className="col-span-4">Resultado esperado</div>
                                                  <div className="col-span-4">Indicador asociado</div>
                                                  <div className="col-span-2 text-center">Línea base</div>
                                                  <div className="col-span-2 text-center">Meta</div>
                                              </div>
                                              <div className="bg-white">
                                                  {initiative.formulation.expectedResults.map((item) => (
                                                      <div key={item.id} className="grid grid-cols-12 p-4 text-xs text-gray-700 border-b border-gray-100 last:border-0 items-center">
                                                          <div className="col-span-4 pr-2">{item.description || emptyText}</div>
                                                          <div className="col-span-4 pr-2">{item.indicator || emptyText}</div>
                                                          <div className="col-span-2 text-center font-medium">{item.baseLine || emptyText}</div>
                                                          <div className="col-span-2 text-center font-medium">{item.goal || emptyText}</div>
                                                      </div>
                                                  ))}
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
                      </div>
                    )}

                    {activeView === 'Plan de inversión' && (
                      <div className="animate-fade-in-up">
                          <div className="flex items-center gap-4 mb-6">
                              <span className="font-semibold text-gray-700">Tipo de financiamiento</span>
                              <div className="relative">
                                  <button className="flex items-center justify-between gap-3 px-4 py-1.5 bg-white border border-gray-300 rounded-full text-sm text-gray-600 hover:border-gray-400 transition-colors min-w-[140px]">
                                      {(initiative.investments || []).length > 1 ? "Mixto" : (initiative.investments?.[0]?.type || "Seleccionar")}
                                      <ChevronDown size={14} />
                                  </button>
                              </div>
                          </div>
                          <div className="flex flex-col">
                              {/* Financiamiento Tabs */}
                              <div className="flex items-center gap-1">
                                  {(initiative.investments || []).map((_, idx) => (
                                      <button 
                                          key={idx}
                                          onClick={() => setActiveInvestmentIndex(idx)}
                                          className={`bg-white border-t border-l border-r border-gray-200 rounded-t-lg px-6 py-2.5 text-sm font-semibold relative top-[1px] z-10 transition-colors ${activeInvestmentIndex === idx ? 'text-primary bg-white shadow-[0_-1px_2px_rgba(0,0,0,0.02)]' : 'text-gray-400 hover:text-gray-600 bg-gray-50/50'}`}
                                      >
                                          Financiamiento {idx + 1}
                                      </button>
                                  ))}
                                  <div 
                                      onClick={handleAddInvestment}
                                      className="px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-gray-600 cursor-pointer flex items-center gap-1 group transition-colors"
                                  >
                                      <Plus size={14} className="group-hover:scale-110 transition-transform" /> Añadir
                                  </div>
                              </div>
                              <div className="space-y-6">
                                  {/* Financiamiento Details Card */}
                                  <div className="bg-white border border-gray-200 rounded-b-lg rounded-tr-lg p-6 relative shadow-sm min-h-[220px] flex flex-col">
                                      {initiative.investments && initiative.investments[activeInvestmentIndex] && initiative.investments[activeInvestmentIndex].type ? (
                                          <>
                                              <div className="absolute top-6 right-6 flex items-center gap-2">
                                                  <button onClick={openInvestmentModal} className="text-gray-400 hover:text-primary transition-colors">
                                                      <Edit2 size={16} />
                                                  </button>
                                                  {renderCardMenu('investment')}
                                              </div>
                                              <span className="inline-block px-4 py-1 rounded-full border border-gray-300 text-gray-700 text-sm font-medium mb-6 w-fit">
                                                  {initiative.investments[activeInvestmentIndex].type || emptyText}
                                              </span>
                                              {initiative.investments[activeInvestmentIndex].type === 'Propio' && (
                                                  <div className="space-y-6">
                                                      <div>
                                                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Departamento</h4>
                                                          <p className="text-gray-600">{initiative.investments[activeInvestmentIndex].department || emptyText}</p>
                                                      </div>
                                                      <div className="border-t border-gray-100 pt-4">
                                                          <h4 className="text-sm font-semibold text-gray-700 mb-3">Fecha de inscripción</h4>
                                                          <span className="inline-block px-3 py-1.5 bg-white border border-gray-200 rounded-md text-gray-600 text-sm shadow-sm">
                                                              {initiative.investments[activeInvestmentIndex].inscriptionDate || emptyText}
                                                          </span>
                                                      </div>
                                                  </div>
                                              )}
                                              {initiative.investments[activeInvestmentIndex].type === 'Externo' && (
                                                  <div className="space-y-6">
                                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                          <div>
                                                              <h4 className="text-sm font-semibold text-gray-700 mb-1">Estado</h4>
                                                              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${initiative.investments[activeInvestmentIndex].postulationState === 'Adjudicado' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                                  {initiative.investments[activeInvestmentIndex].postulationState || emptyText}
                                                              </span>
                                                          </div>
                                                          <div>
                                                              <h4 className="text-sm font-semibold text-gray-700 mb-1">Financista</h4>
                                                              <p className="text-gray-600">{initiative.investments[activeInvestmentIndex].financier || emptyText}</p>
                                                          </div>
                                                      </div>
                                                      <div>
                                                          <h4 className="text-sm font-semibold text-gray-700 mb-1">Fondo</h4>
                                                          <p className="text-gray-600">{initiative.investments[activeInvestmentIndex].fund || emptyText}</p>
                                                      </div>
                                                  </div>
                                              )}
                                          </>
                                      ) : (
                                          <div className="flex-1 flex items-center justify-center py-10">
                                              <button 
                                                  onClick={openInvestmentModal}
                                                  className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors group"
                                              >
                                                  <Plus size={24} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                                                  <span className="text-lg font-light">Añadir información</span>
                                              </button>
                                          </div>
                                      )}
                                  </div>

                                  <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-[220px] flex flex-col shadow-sm relative">
                                      <div className="flex justify-between items-center mb-4">
                                          <h3 className="text-sm font-semibold text-gray-700">Tabla de gastos</h3>
                                          {initiative.expenses.length > 0 && (
                                              <button onClick={openExpensesModal} className="text-gray-400 hover:text-primary transition-colors">
                                                  <Edit2 size={16} />
                                              </button>
                                          )}
                                      </div>
                                      {initiative.expenses.length > 0 ? (
                                          <div className="overflow-x-auto">
                                              <table className="w-full text-left">
                                                  <thead>
                                                      <tr className="border-b border-gray-100">
                                                          <th className="pb-2 text-xs font-semibold text-gray-600">Ítem</th>
                                                          <th className="pb-2 text-xs font-semibold text-gray-600">Total</th>
                                                          <th className="pb-2 text-xs font-semibold text-gray-600">Gastado</th>
                                                          <th className="pb-2 text-xs font-semibold text-gray-600">Ejecución %</th>
                                                      </tr>
                                                  </thead>
                                                  <tbody className="text-sm text-gray-700">
                                                      {initiative.expenses.map((item) => (
                                                          <tr key={item.id} className="border-b border-gray-50 last:border-0">
                                                              <td className="py-3 pr-2">{item.item || emptyText}</td>
                                                              <td className="py-3 pr-2">{item.total || emptyText}</td>
                                                              <td className="py-3 pr-2">{item.spent || emptyText}</td>
                                                              <td className="py-3">{item.execution || emptyText}</td>
                                                          </tr>
                                                      ))}
                                                  </tbody>
                                              </table>
                                          </div>
                                      ) : (
                                          <div className="flex-1 flex items-center justify-center">
                                              <button 
                                                  onClick={openExpensesModal}
                                                  className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors group"
                                              >
                                                  <Plus size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                                                  <span className="font-light">Añadir información</span>
                                              </button>
                                          </div>
                                      )}
                                  </div>

                                  <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-[220px] flex flex-col relative shadow-sm">
                                      <div className="flex justify-between items-center mb-4">
                                          <h3 className="text-sm font-semibold text-gray-700">Documentos</h3>
                                          {initiative.investments[activeInvestmentIndex]?.documents && initiative.investments[activeInvestmentIndex].documents!.length > 0 && (
                                            <button 
                                              onClick={() => openDocumentsModal('investment')}
                                              className="text-gray-400 hover:text-primary transition-colors"
                                            >
                                                <Plus size={16} />
                                            </button>
                                          )}
                                      </div>
                                      
                                      <div className="flex-1">
                                          {initiative.investments[activeInvestmentIndex]?.documents && initiative.investments[activeInvestmentIndex].documents!.length > 0 ? (
                                            <div className="space-y-3">
                                                {initiative.investments[activeInvestmentIndex].documents!.map((doc) => (
                                                    <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-100">
                                                        <div className="flex items-center gap-3">
                                                            <div className="bg-white p-2 rounded border border-gray-200 text-primary">
                                                                {doc.type === 'link' ? <LinkIcon size={16} /> : <File size={16} />}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-medium text-gray-700">{doc.name}</p>
                                                                <p className="text-xs text-gray-500">{doc.type === 'link' ? doc.url : doc.fileName}</p>
                                                            </div>
                                                        </div>
                                                        <button className="text-gray-400 hover:text-red-500 transition-colors">
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                          ) : (
                                            <div className="h-full flex items-center justify-center">
                                                <button 
                                                  onClick={() => openDocumentsModal('investment')}
                                                  className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors group"
                                                >
                                                    <Plus size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                                                    <span className="font-light">Añadir información</span>
                                                </button>
                                            </div>
                                          )}
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                    )}

                    {activeView === 'Ejecución' && (
                      <div className="animate-fade-in-up">
                          <div className="flex flex-col">
                              {/* Dynamic Tabs for Licitaciones */}
                              <div className="flex items-center gap-1">
                                  {(initiative.execution?.licitaciones || []).map((_, idx) => (
                                      <button 
                                          key={idx}
                                          onClick={() => setActiveLicitacionIndex(idx)}
                                          className={`bg-white border-t border-l border-r border-gray-200 rounded-t-lg px-6 py-2.5 text-sm font-semibold relative top-[1px] z-10 transition-colors ${activeLicitacionIndex === idx ? 'text-primary bg-white shadow-[0_-1px_2px_rgba(0,0,0,0.02)]' : 'text-gray-400 hover:text-gray-600 bg-gray-50/50'}`}
                                      >
                                          Licitación {idx + 1}
                                      </button>
                                  ))}
                                  <div 
                                      onClick={handleAddLicitacion}
                                      className="px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-gray-600 cursor-pointer flex items-center gap-1 group transition-colors"
                                  >
                                      <Plus size={14} className="group-hover:scale-110 transition-transform" /> Añadir
                                  </div>
                              </div>
                              <div className="space-y-6">
                                  {/* Licitación Card with empty state handling */}
                                  <div className="bg-white border border-gray-200 rounded-b-lg rounded-tr-lg p-6 relative shadow-sm min-h-[300px] flex flex-col transition-all">
                                        {initiative.execution?.licitaciones && initiative.execution.licitaciones[activeLicitacionIndex] && !isLicitacionEmpty(initiative.execution.licitaciones[activeLicitacionIndex]) ? (
                                            <div className="flex-1 animate-in fade-in">
                                                <div className="absolute top-6 right-6 flex items-center gap-2">
                                                    <button onClick={openExecutionLicitacionModal} className="text-gray-400 hover:text-primary transition-colors p-1">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    {renderCardMenu('licitacion')}
                                                </div>
                                                <div className="flex items-center gap-3 mb-6">
                                                    <h3 className="font-semibold text-gray-700">Licitación {activeLicitacionIndex + 1}</h3>
                                                    <div className="flex gap-2">
                                                        {initiative.execution.licitaciones[activeLicitacionIndex].type && (
                                                            <span className="px-3 py-1 rounded-full border border-gray-300 text-gray-700 text-xs font-medium bg-white">
                                                                {initiative.execution.licitaciones[activeLicitacionIndex].type}
                                                            </span>
                                                        )}
                                                        {initiative.execution.licitaciones[activeLicitacionIndex].status && (
                                                            <span className="px-3 py-1 rounded-full border border-gray-300 text-gray-700 text-xs font-medium bg-white">
                                                                {initiative.execution.licitaciones[activeLicitacionIndex].status}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                    <div className="space-y-6">
                                                        <div>
                                                            <h4 className="text-sm font-bold text-gray-700 mb-1">Obra</h4>
                                                            <p className="text-sm text-gray-600">{initiative.name}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-gray-700 mb-1">Detalle de licitación</h4>
                                                            <p className="text-sm text-gray-600">{initiative.execution.licitaciones[activeLicitacionIndex].detail || emptyText}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-gray-700 mb-1">Estado de licitación</h4>
                                                            <p className="text-sm text-gray-600">{initiative.execution.licitaciones[activeLicitacionIndex].status || emptyText}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-gray-700 mb-1">Link</h4>
                                                            <p className="text-sm text-gray-600 truncate">{initiative.execution.licitaciones[activeLicitacionIndex].link || emptyText}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-gray-700 mb-2">Fechas importantes</h4>
                                                            <div className="space-y-1">
                                                                {(initiative.execution.licitaciones[activeLicitacionIndex].dates || []).length > 0 ? (
                                                                    initiative.execution.licitaciones[activeLicitacionIndex].dates.map((d, i) => (
                                                                        <div key={i} className="flex gap-4 text-sm">
                                                                            <span className="w-24 text-gray-500">{d.date}</span>
                                                                            <span className="text-gray-700">{d.title || emptyText}</span>
                                                                        </div>
                                                                    ))
                                                                ) : emptyText}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-6">
                                                        <div className="h-4 hidden lg:block"></div>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-gray-700 mb-1">Detalle</h4>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-gray-700 mb-1">Adjudicado / Ejecutor</h4>
                                                            <p className="text-sm text-gray-600">{initiative.execution.licitaciones[activeLicitacionIndex].executor || emptyText}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-gray-700 mb-1">Resolución</h4>
                                                            <p className="text-sm text-gray-600">{initiative.execution.licitaciones[activeLicitacionIndex].resolution || emptyText}</p>
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-bold text-gray-700 mb-1">Monto</h4>
                                                            <p className="text-sm text-gray-600">{initiative.execution.licitaciones[activeLicitacionIndex].amount || emptyText}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex-1 flex flex-col justify-start">
                                                <h3 className="font-semibold text-gray-700 mb-6">Licitación {activeLicitacionIndex + 1}</h3>
                                                <div className="flex-1 flex flex-col items-center justify-center">
                                                    <button 
                                                        onClick={openExecutionLicitacionModal}
                                                        className="flex flex-col items-center gap-2 text-gray-400 hover:text-primary transition-colors group"
                                                    >
                                                        <Plus size={32} strokeWidth={1.5} className="group-hover:scale-110 transition-transform mb-2" />
                                                        <span className="text-lg font-light">Añadir información</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                  </div>

                                  {/* Ejecución Details Card */}
                                  <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-[220px] flex flex-col shadow-sm relative">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-sm font-semibold text-gray-700">Ejecución</h3>
                                            {initiative.execution?.progress && (
                                              <button onClick={openExecutionProgressModal} className="text-gray-400 hover:text-primary transition-colors">
                                                <Edit2 size={16} />
                                              </button>
                                            )}
                                        </div>
                                        
                                        <div className="flex-1 flex flex-col">
                                          {initiative.execution?.progress ? (
                                            <div className="space-y-4 animate-in fade-in">
                                              <div className="grid grid-cols-12 gap-4">
                                                <div className="col-span-4 text-[10px] font-bold text-gray-400 uppercase">Obra</div>
                                                <div className="col-span-4 text-[10px] font-bold text-gray-400 uppercase">Detalle</div>
                                                <div className="col-span-4 text-[10px] font-bold text-gray-400 uppercase">Comentario</div>
                                              </div>
                                              {initiative.execution.progress.map((row) => (
                                                <div key={row.id} className="grid grid-cols-12 gap-4 items-start border-b border-gray-50 pb-2 last:border-0">
                                                  <div className="col-span-4 text-xs font-bold text-gray-700">{row.label}</div>
                                                  <div className="col-span-4 text-xs text-gray-600">{row.detail || emptyText}</div>
                                                  <div className="col-span-4 text-xs text-gray-500 italic">
                                                    {row.comment ? `"${row.comment}"` : emptyText}
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          ) : (
                                            <div className="flex-1 flex items-center justify-center">
                                                <button 
                                                  onClick={openExecutionProgressModal}
                                                  className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors group"
                                                >
                                                    <Plus size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform mb-1" />
                                                    <span className="font-light">Añadir información</span>
                                                </button>
                                            </div>
                                          )}
                                        </div>
                                  </div>

                                  {/* Documentos Card (Ejecución) */}
                                  <div className="bg-white border border-gray-200 rounded-lg p-6 min-h-[100px] shadow-sm">
                                        <div className="flex justify-between items-center mb-4">
                                            <h3 className="text-sm font-semibold text-gray-700">Documentos</h3>
                                            {initiative.execution?.documents && initiative.execution.documents.length > 0 && (
                                                <button 
                                                  onClick={() => openDocumentsModal('execution')}
                                                  className="text-gray-400 hover:text-primary transition-colors"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            )}
                                        </div>
                                        
                                        <div className={initiative.execution?.documents && initiative.execution.documents.length > 0 ? "" : "flex justify-center py-4"}>
                                            {initiative.execution?.documents && initiative.execution.documents.length > 0 ? (
                                                <div className="space-y-3">
                                                    {initiative.execution.documents.map((doc) => (
                                                        <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-100">
                                                            <div className="flex items-center gap-3">
                                                                <div className="bg-white p-2 rounded border border-gray-200 text-primary">
                                                                    {doc.type === 'link' ? <LinkIcon size={16} /> : <File size={16} />}
                                                                </div>
                                                                <div>
                                                                    <p className="text-sm font-medium text-gray-700">{doc.name}</p>
                                                                    <p className="text-xs text-gray-500">{doc.type === 'link' ? doc.url : doc.fileName}</p>
                                                                </div>
                                                            </div>
                                                            <button className="text-gray-400 hover:text-red-500 transition-colors">
                                                                <Trash2 size={14} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <button 
                                                  onClick={() => openDocumentsModal('execution')}
                                                  className="flex flex-col items-center gap-1 text-gray-400 hover:text-primary transition-colors group"
                                                >
                                                    <Plus size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
                                                    <span className="font-light">Añadir información</span>
                                                </button>
                                            )}
                                        </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                    )}
                    
                    {activeView === 'Indicadores de impacto' && (
                        <div className="animate-fade-in-up space-y-8">
                            <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                                <div className="p-6 border-b border-gray-50 flex items-center gap-3">
                                    <Target className="text-primary" size={24} />
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-lg">Seguimiento de Metas (Formulación)</h3>
                                        <p className="text-xs text-gray-500 mt-1">Avance real de los resultados esperados definidos en la etapa de formulación.</p>
                                    </div>
                                </div>
                                
                                <div className="p-0">
                                    {initiative.formulation.expectedResults.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                        <th className="px-6 py-4 border-b">Resultado / Indicador</th>
                                                        <th className="px-6 py-4 border-b text-center">Meta</th>
                                                        <th className="px-6 py-4 border-b text-center">Estado Real</th>
                                                        <th className="px-6 py-4 border-b">Comentario de Logro</th>
                                                        <th className="px-6 py-4 border-b text-right">Acción</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {initiative.formulation.expectedResults.map((res) => (
                                                        <tr key={res.id} className="hover:bg-gray-50/50 transition-colors group">
                                                            <td className="px-6 py-4">
                                                                <p className="text-sm font-bold text-gray-800 leading-snug mb-1">{res.description || emptyText}</p>
                                                                <p className="text-xs text-gray-500 italic">{res.indicator || emptyText}</p>
                                                            </td>
                                                            <td className="px-6 py-4 text-center">
                                                                <span className="text-sm font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">{res.goal || emptyText}</span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex justify-center">
                                                                    {getFulfillmentBadge(res.status)}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {res.fulfillmentComment ? (
                                                                    <p className="text-xs text-gray-600 line-clamp-2 italic" title={res.fulfillmentComment}>"{res.fulfillmentComment}"</p>
                                                                ) : (
                                                                    <span className="text-[10px] text-gray-400">Sin comentarios registrados</span>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <button 
                                                                    onClick={() => openFulfillmentModal(res)}
                                                                    className="text-xs font-bold text-primary border border-primary px-3 py-1.5 rounded hover:bg-primary hover:text-white transition-all flex items-center gap-1 ml-auto"
                                                                >
                                                                    Evaluar <Edit2 size={12}/>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    ) : (
                                        <div className="p-12 text-center text-gray-400">
                                            <Target size={40} className="mx-auto mb-3 opacity-20" />
                                            <p className="text-sm">No se han definido resultados esperados en la formulación.</p>
                                            <button 
                                                onClick={() => setActiveView('Formulación')}
                                                className="text-primary hover:underline text-xs font-bold mt-2"
                                            >
                                                Ir a Formulación para añadir metas
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeView === 'Participación ciudadana' && (
                      <div className="animate-fade-in-up">
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col min-h-[400px]">
                          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                            <h3 className="font-semibold text-gray-700">Encuentros participativos</h3>
                            <button 
                              onClick={() => openParticipationModal()}
                              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-md text-sm hover:bg-opacity-90 transition-colors"
                            >
                              <Plus size={16} /> Nuevo registro
                            </button>
                          </div>
                          
                          {initiative.participation.length > 0 ? (
                            <div className="p-0">
                              <table className="w-full text-left border-collapse">
                                <thead>
                                  <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                                    <th className="px-6 py-3 font-semibold">Fecha</th>
                                    <th className="px-6 py-3 font-semibold">Actividad</th>
                                    <th className="px-6 py-3 font-semibold text-center">Participantes</th>
                                    <th className="px-6 py-3 font-semibold text-center">Evidencias</th>
                                    <th className="px-6 py-3 font-semibold text-center">Comentarios</th>
                                    <th className="px-6 py-3 font-semibold text-right">Acciones</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                  {initiative.participation.map((entry) => (
                                    <tr 
                                      key={entry.id} 
                                      onClick={() => openParticipationModal(entry)}
                                      className="hover:bg-gray-50 transition-colors group cursor-pointer"
                                    >
                                      <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">
                                        {entry.date || emptyText}
                                      </td>
                                      <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                                        {entry.activityName || emptyText}
                                      </td>
                                      <td className="px-6 py-4 text-sm text-gray-600 text-center">
                                        {entry.participantsCount || emptyText}
                                      </td>
                                      <td className="px-6 py-4 text-sm text-gray-600 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Paperclip size={14} /> {entry.documents.length}
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 text-sm text-gray-600 text-center">
                                         <div className="flex items-center justify-center gap-1">
                                            <MessageSquare size={14} /> {entry.comments.length}
                                        </div>
                                      </td>
                                      <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button 
                                            onClick={(e) => { e.stopPropagation(); openParticipationModal(entry); }}
                                            className="p-1 text-gray-400 hover:text-primary transition-colors"
                                            title="Editar"
                                          >
                                            <Edit2 size={16} />
                                          </button>
                                          <button 
                                            onClick={(e) => { e.stopPropagation(); deleteParticipation(entry.id); }}
                                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                            title="Eliminar"
                                          >
                                            <Trash2 size={16} />
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-10">
                              <Users size={48} strokeWidth={1} className="mb-3 opacity-20" />
                              <p className="text-sm mb-4">No se han registrado encuentros participativos.</p>
                              <button 
                                onClick={() => openParticipationModal()}
                                className="flex items-center gap-2 text-primary hover:underline text-sm font-medium"
                              >
                                Registrar el primero
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {activeView === 'Calendario' && (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up">
                          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 min-h-[600px] flex flex-col">
                              <div className="flex flex-col items-center mb-6 space-y-2">
                                  <div className="relative">
                                      <select 
                                          value={currentDate.getMonth()}
                                          onChange={handleMonthChange}
                                          className="appearance-none bg-white border border-gray-300 rounded-full px-6 py-2 text-xl font-medium text-gray-700 hover:border-gray-400 focus:outline-none cursor-pointer text-center min-w-[160px]"
                                      >
                                          {months.map((m, i) => (
                                              <option key={m} value={i}>{m}</option>
                                          ))}
                                      </select>
                                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
                                  </div>
                                  <div className="relative">
                                      <select 
                                          value={currentDate.getFullYear()}
                                          onChange={handleYearChange}
                                          className="appearance-none bg-white border border-gray-300 rounded-full px-6 py-1 text-sm text-gray-600 hover:border-gray-400 focus:outline-none cursor-pointer text-center min-w-[100px]"
                                      >
                                          {Array.from({length: 10}, (_, i) => 2024 + i).map(year => (
                                              <option key={year} value={year}>{year}</option>
                                          ))}
                                      </select>
                                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                                  </div>
                              </div>
                              <div className="flex-1 flex flex-col">
                                  <div className="grid grid-cols-7 mb-2">
                                      {daysOfWeek.map(day => (
                                          <div key={day} className="text-xs font-semibold text-primary text-center">
                                              {day}
                                          </div>
                                      ))}
                                  </div>
                                  <div className="grid grid-cols-7 border-t border-l border-gray-200 flex-1">
                                      {(() => {
                                          const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
                                          const firstDay = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());
                                          const days = [];
                                          const prevMonthDays = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth() - 1);
                                          for (let i = 0; i < firstDay; i++) {
                                              days.push(
                                                  <div key={`prev-${i}`} className="border-r border-b border-gray-200 p-2 min-h-[80px]">
                                                      <span className="text-gray-300 text-sm">{prevMonthDays - firstDay + i + 1}</span>
                                                  </div>
                                              );
                                          }
                                          for (let i = 1; i <= daysInMonth; i++) {
                                              const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
                                              const daysEvents = initiative.calendarEvents.filter(e => e.startDate === dateStr);
                                              days.push(
                                                  <div key={`curr-${i}`} className="border-r border-b border-gray-200 p-2 min-h-[80px] hover:bg-gray-50 transition-colors relative group">
                                                      <span className="text-gray-700 text-sm font-medium">{i}</span>
                                                      {daysEvents.map(event => (
                                                          <div key={event.id} className="mt-1 text-[10px] leading-tight text-gray-600 bg-gray-100 p-1 rounded truncate border border-gray-200" title={event.title}>
                                                              {event.title}
                                                          </div>
                                                      ))}
                                                      <button 
                                                          onClick={() => {
                                                              setNewEventData(prev => ({ ...prev, startDate: dateStr }));
                                                              setShowEventForm(true);
                                                          }}
                                                          className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 p-1 bg-primary text-white rounded shadow-sm hover:scale-110 transition-all"
                                                          title="Añadir evento"
                                                      >
                                                          <Plus size={10} />
                                                      </button>
                                                  </div>
                                              );
                                          }
                                          const totalCells = 42;
                                          const remainingCells = totalCells - days.length;
                                          for (let i = 1; i <= remainingCells; i++) {
                                              days.push(
                                                  <div key={`next-${i}`} className="border-r border-b border-gray-200 p-2 min-h-[80px]">
                                                      <span className="text-gray-300 text-sm">{i}</span>
                                                  </div>
                                              );
                                          }
                                          return days;
                                      })()}
                                  </div>
                              </div>
                          </div>
                          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 min-h-[600px] flex flex-col">
                              <div className="flex justify-between items-center mb-6">
                                  <h2 className="text-lg font-semibold text-gray-700">Próximos eventos</h2>
                                  <button 
                                      onClick={() => setShowEventForm(!showEventForm)}
                                      className="flex items-center gap-1 bg-primary text-white text-xs px-3 py-1.5 rounded-md hover:bg-opacity-90 transition-colors"
                                  >
                                      <Plus size={14} /> Nuevo evento
                                  </button>
                              </div>
                              {showEventForm && (
                                  <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm animate-in fade-in slide-in-from-right-4 mb-6">
                                      <h3 className="font-medium text-gray-700 mb-4">Título del evento</h3>
                                      <div className="space-y-4">
                                          <input 
                                              type="text" 
                                              placeholder="Título"
                                              value={newEventData.title}
                                              onChange={(e) => setNewEventData({...newEventData, title: e.target.value})}
                                              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                          />
                                          <div className="grid grid-cols-2 gap-4">
                                              <div>
                                                  <label className="block text-xs font-semibold text-gray-600 mb-1">Fecha inicio</label>
                                                  <div className="relative">
                                                      <input 
                                                          type="date"
                                                          value={newEventData.startDate}
                                                          onChange={(e) => setNewEventData({...newEventData, startDate: e.target.value})}
                                                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                                      />
                                                  </div>
                                              </div>
                                              <div>
                                                  <label className="block text-xs font-semibold text-gray-600 mb-1">Fecha término</label>
                                                  <div className="relative">
                                                      <input 
                                                          type="date"
                                                          value={newEventData.endDate}
                                                          onChange={(e) => setNewEventData({...newEventData, endDate: e.target.value})}
                                                          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                                      />
                                                  </div>
                                              </div>
                                          </div>
                                          <div className="flex justify-end gap-2 pt-2">
                                              <button 
                                                  onClick={() => setShowEventForm(false)}
                                                  className="text-gray-500 text-sm px-3 py-1.5 hover:bg-gray-50 rounded"
                                              >
                                                  Cancelar
                                              </button>
                                              <button 
                                                  onClick={handleCreateEvent}
                                                  className="bg-primary text-white text-sm px-4 py-1.5 rounded hover:bg-opacity-90"
                                              >
                                                  Crear
                                              </button>
                                          </div>
                                      </div>
                                  </div>
                              )}
                              <div className="space-y-4 flex-1 overflow-y-auto">
                                  {initiative.calendarEvents.length === 0 ? (
                                      <p className="text-gray-400 text-sm text-center py-8">No hay eventos programados.</p>
                                  ) : (
                                      initiative.calendarEvents
                                          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                                          .map(event => (
                                          <div key={event.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary/30 hover:shadow-sm transition-all group">
                                              <div className="flex justify-between items-start">
                                                  <div>
                                                      <h4 className="font-semibold text-gray-700 text-sm mb-1">{event.title || emptyText}</h4>
                                                      <p className="text-gray-500 text-xs">
                                                          {formatEventDate(event.startDate)}
                                                          {event.endDate && ` - ${formatEventDate(event.endDate)}`}
                                                      </p>
                                                  </div>
                                                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                      <button className="text-gray-400 hover:text-primary"><Edit2 size={14} /></button>
                                                      <button 
                                                          onClick={() => deleteEvent(event.id)}
                                                          className="text-gray-400 hover:text-red-500"
                                                      >
                                                          <Trash2 size={14} />
                                                      </button>
                                                  </div>
                                              </div>
                                          </div>
                                      ))
                                  )}
                              </div>
                          </div>
                      </div>
                    )}

                    {activeView === 'Bitácora' && (
                      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 min-h-[600px] animate-fade-in-up">
                          <h2 className="text-xl font-semibold text-gray-800 mb-6">Bitácora de seguimiento</h2>
                          <div className="mb-10 bg-gray-50 p-6 rounded-lg border border-gray-100">
                              <label className="block text-sm font-medium text-gray-700 mb-2">Registrar nueva actualización</label>
                              <div className="relative">
                                  <textarea 
                                      value={newLogText}
                                      onChange={(e) => setNewLogText(e.target.value)}
                                      placeholder="Describe los cambios, avances o notas importantes..."
                                      className="w-full border border-gray-300 rounded-md p-4 min-h-[100px] focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none bg-white"
                                  />
                                  <button 
                                      onClick={handleAddLog}
                                      disabled={!newLogText.trim()}
                                      className="absolute bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                  >
                                      <Send size={14} /> Registrar
                                  </button>
                              </div>
                          </div>
                          <div className="relative border-l-2 border-gray-200 ml-3 space-y-10 pb-4">
                              {initiative.logs.map((log) => (
                                  <div key={log.id} className="pl-8 relative group">
                                      <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-sm transition-colors ${
                                          log.type === 'creation' ? 'bg-green-500' :
                                          log.type === 'status_change' ? 'bg-blue-500' :
                                          'bg-gray-400 group-hover:bg-primary'
                                      }`}></div>
                                      <div className="flex flex-col gap-1">
                                          <div className="flex items-center gap-2 mb-1">
                                              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                                                  <Clock size={12} />
                                                  {formatDate(log.timestamp)}
                                              </span>
                                              <span className="text-gray-300">|</span>
                                              <span className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                                  <User size={12} />
                                                  {log.user}
                                              </span>
                                          </div>
                                          <div className="bg-white">
                                              <h4 className="text-base font-semibold text-gray-800">{log.action || emptyText}</h4>
                                              {log.details && (
                                                  <p className="text-gray-600 mt-1 text-sm leading-relaxed">{log.details}</p>
                                              )}
                                          </div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                          {initiative.logs.length === 0 && (
                              <div className="text-center py-10 text-gray-400">
                                  <FileText size={48} className="mx-auto mb-3 opacity-20" />
                                  <p>No hay registros en la bitácora aún.</p>
                              </div>
                          )}
                      </div>
                    )}

                  </div>
                </main>
             </div>
          )}

      </div>

      {/* Modals */}
      <NameModal 
        isOpen={modals.name} 
        onClose={closeNameModal} 
        currentName={initiative.name}
        onSave={saveName}
      />
      
      <IdentificationModal 
        isOpen={modals.identification}
        onClose={closeIdModal}
        onSave={saveIdentification}
      />

      <InterventionModal
        isOpen={modals.intervention}
        onClose={closeInterventionModal}
        onSave={saveIntervention}
      />

      <TypologyModal
        isOpen={modals.typology}
        onClose={closeTypologyModal}
        onSave={saveTypology}
      />

      <InvestmentModal
        isOpen={modals.investment}
        onClose={closeInvestmentModal}
        onSave={saveInvestment}
        initialData={initiative.investments && initiative.investments[activeInvestmentIndex] ? initiative.investments[activeInvestmentIndex] : null}
      />
      
      <ExpensesModal 
        isOpen={modals.expenses}
        onClose={closeExpensesModal}
        onSave={saveExpenses}
        initialData={initiative.expenses}
      />
      
      <ExecutionLicitacionModal 
        isOpen={modals.executionLicitacion}
        onClose={closeExecutionLicitacionModal}
        onSave={saveExecutionLicitacion}
        initialData={initiative.execution?.licitaciones ? initiative.execution.licitaciones[activeLicitacionIndex] : null}
      />

      <ExecutionProgressModal 
        isOpen={modals.executionProgress}
        onClose={closeExecutionProgressModal}
        onSave={saveExecutionProgress}
        initialData={initiative.execution?.progress}
      />

      <ImpactIndicatorsModal
        isOpen={modals.impactIndicators}
        onClose={closeImpactIndicatorsModal}
        onSave={saveImpactIndicators}
        initialData={initiative.impactIndicators}
      />

      <FulfillmentModal 
        isOpen={modals.fulfillment}
        onClose={() => setModals(prev => ({ ...prev, fulfillment: false }))}
        result={activeResultToTrack}
        onSave={saveFulfillment}
      />

      <ProblemModal
        isOpen={modals.problem}
        onClose={() => setModals(prev => ({...prev, problem: false}))}
        onSave={saveProblem}
        initialValue={initiative.formulation.problem}
      />

      <BeneficiariesModal
        isOpen={modals.beneficiaries}
        onClose={() => setModals(prev => ({...prev, beneficiaries: false}))}
        onSave={saveBeneficiaries}
        initialData={initiative.formulation.beneficiaries}
      />

      <CoverageModal
        isOpen={modals.coverage}
        onClose={() => setModals(prev => ({...prev, coverage: false}))}
        onSave={saveCoverage}
        initialData={initiative.formulation.coverage}
      />

      <ExpectedResultsModal
        isOpen={modals.expectedResults}
        onClose={() => setModals(prev => ({...prev, expectedResults: false}))}
        onSave={saveExpectedResults}
        initialData={initiative.formulation.expectedResults}
      />

      <ShareModal 
        isOpen={modals.share}
        onClose={closeShareModal}
        initiativeName={initiative.name}
      />
      
      <DocumentsModal 
        isOpen={modals.documents}
        onClose={closeDocumentsModal}
        onSave={saveDocument}
      />

      <ParticipationModal 
        isOpen={modals.participation}
        onClose={closeParticipationModal}
        onSave={saveParticipation}
        initialData={activeParticipationEntry}
        onAddDocument={() => openDocumentsModal('participation')}
        tempDocuments={activeParticipationEntry?.documents || []}
      />
    </div>
  );
};

export default App;