// models/reports.props.ts

export interface FormData {
  id?: string;
  project_name: string;
  researcher_name: string;
  summary: string;
  technicalSummary: TechnicalSummary[]; // Usando la interfaz TechnicalSummary
  deliverables: DeliverableData[]; // Usando la interfaz DeliverableData
  annexes: AnnexData[]; // Usando la interfaz AnnexData
}

export interface ReportFormProps {
  onSubmit: (formData: FormData) => void;
  initialData?: FormData;
  handleClose: () => void;
}

export interface DeliverableData {
  id?: number;
  description: string;
  date: string;
  approved_changes: string;
  contingency_plan: string;
}

export interface AnnexData {
  id?: number;
  description: string;
  url: string;
}

export interface TechnicalSummary {
  id?: number;
  obtained_result: string;
  product_description: string;
  support_annex: string;
  observations: string;
}
