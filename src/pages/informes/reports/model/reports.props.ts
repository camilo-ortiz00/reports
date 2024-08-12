// models/reports.props.ts

export interface FormData {
  project_name: string;
  researcher_name: string;
  summary: TechnicalSummary[];
  obtained_result: string;
  product_description: string;
  observations: string;
  annexes: AnnexData[];
  description_annex: string;
  url: string;
  deliverable: DeliverableData[];
  description_deliverable: string;
  date: string;
  support_annex: string;
  approved_changes: string;
  contingency_plan: string;
}

export interface ReportFormProps {
  onSubmit: (formData: FormData) => void;
  initialData?: FormData;
  handleClose: () => void;
}

export interface DeliverableData {
  description: string;
  date: string;
  support_annex: string;
  approved_changes: string;
  contingency_plan: string;
}

export interface AnnexData {
  description: string;
  url: string;
}

export interface TechnicalSummary {
  obtained_result: string;
  product_description: string;
  support_annex: string;
  observations: string;
}
