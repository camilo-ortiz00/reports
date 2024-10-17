// models/reports.props.ts

export interface FormData {
  status: GLfloat;
  id?: number;
  summary: string;
  technicalSummary: TechnicalSummaryData[]; // Usando la interfaz TechnicalSummary
  deliverables: DeliverableData[]; // Usando la interfaz DeliverableData
  annexes: AnnexData[]; // Usando la interfaz AnnexData
  user: {
    id: number;
    name: string;
  };
  project: {
    id: number;
    name: string;
  };
}

export interface ReportFormProps {
  onSubmit: (formData: FormData) => void;
  initialData?: FormData;
  handleClose: () => void;
}

export interface DeliverableData {
  id?: number;
  report_id: number;
  description: string;
  date: string;
  approved_changes: string;
  contingency_plan: string;
}

export interface AnnexData {
  id?: number;
  report_id: number;
  description: string;
  url: string;
}

export interface TechnicalSummaryData {
  id?: number;
  report_id: number;
  obtained_result: string;
  product_description: string;
  support_annex: string;
  observations: string;
}

export interface TechnicalFormProps {
  onSubmit: (data: TechnicalSummaryData) => void;
  initialData?: TechnicalSummaryData;
  handleClose: () => void;
}

export interface DeliverableFormProps {
  onSubmit: (data: DeliverableData) => void;
  initialData?: DeliverableData;
  handleClose: () => void;
}

export interface AnnexFormProps {
  onSubmit: (data: AnnexData) => void;
  initialData?: AnnexData;
  handleClose: () => void;
}