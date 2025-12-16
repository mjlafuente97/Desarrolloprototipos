
export interface IdentificationData {
  imagePreview: string | null;
  description: string;
  responsibleUnit: string;
  inCharge: string;
  code1: string;
  code2: string;
}

export interface InterventionData {
  comuna: string;
  sector: string;
}

export interface TypologyData {
  projectType: string;
  investmentScope: string;
  strategicGuideline: string;
  program: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: 'file' | 'link';
  url?: string; // For links
  fileName?: string; // For files
  fileType?: string; // pdf, image, etc.
}

export interface InvestmentData {
  type: 'Propio' | 'Externo' | '';
  // Propio fields
  department?: string;
  inscriptionDate?: string;
  // Externo fields
  postulationState?: string;
  financier?: string;
  fund?: string;
  responsible?: string;
  postulationDate?: string;
  resultDate?: string;
  documents?: DocumentItem[];
}

export interface ExpenseItem {
  id: string;
  item: string;
  total: string;
  spent: string;
  execution: string;
}

export interface LicitacionDate {
  date: string;
  title: string;
}

export interface LicitacionData {
  type: string;
  detail: string;
  status: string;
  link: string;
  dates: LicitacionDate[];
  executor: string;
  resolution: string;
  amount: string;
}

export interface ExecutionData {
  licitacion: LicitacionData | null;
  documents?: DocumentItem[];
}

export interface ImpactIndicator {
  id: string;
  name: string;
  percentage: string;
  description: string;
}

// --- Formulation Interfaces ---
export interface BeneficiariesData {
  direct: string;
  indirect: string;
}

export interface CoverageData {
  link: string;
  hasMap: boolean; // boolean to toggle the visual map state
}

export interface ExpectedResult {
  id: string;
  description: string;
  indicator: string;
  baseLine: string;
  goal: string;
}

export interface FormulationData {
  problem: string;
  beneficiaries: BeneficiariesData | null;
  coverage: CoverageData | null;
  expectedResults: ExpectedResult[];
}
// -----------------------------

// --- Participation Interfaces ---
export interface CommentItem {
  id: string;
  author: string;
  text: string;
  date: Date;
}

export interface ParticipationEntry {
  id: string;
  date: string;
  activityName: string;
  participantsCount: string;
  description: string;
  documents: DocumentItem[];
  comments: CommentItem[];
}
// -----------------------------

export interface LogEntry {
  id: string;
  timestamp: Date;
  user: string;
  action: string;
  details?: string;
  type: 'update' | 'status_change' | 'creation';
}

export interface CalendarEvent {
  id: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate?: string; // YYYY-MM-DD
}

export interface InitiativeState {
  id?: string; // Added for list management
  name: string;
  status: string;
  stage?: string; 
  priority: string;
  lastUpdate?: string; // Added for dashboard
  isFavorite?: boolean; // Added for dashboard
  image?: string | null; // Added for dashboard thumbnail
  
  identification: IdentificationData | null;
  intervention: InterventionData | null;
  typology: TypologyData | null;
  formulation: FormulationData;
  investment?: InvestmentData | null;
  execution?: ExecutionData | null;
  participation: ParticipationEntry[]; // Added participation array
  expenses: ExpenseItem[]; 
  impactIndicators: ImpactIndicator[]; 
  logs: LogEntry[];
  calendarEvents: CalendarEvent[];
}

export interface InitiativeSummary {
  id: string;
  name: string;
  strategicLine: string;
  code: string;
  lastUpdate: string;
  status: string;
  isFavorite: boolean;
}