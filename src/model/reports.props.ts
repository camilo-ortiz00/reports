export interface ReportData {
  status: number;
  id?: number;
  summary: string;
  technicalSummary: TechnicalSummaryData[]; 
  deliverables: DeliverableData[]; 
  annexes: AnnexData[]; 
  user: {
    id: number;
    name: string;
  };
  project: {
    id: number;
    name: string;
  };
  created_at: string; 
  updated_at: string;
}

export interface ReportFormProps {
  onSubmit: (formData: ReportData) => void;
  initialData?: ReportData;
  handleClose: () => void;
}

export interface DeliverableData {
  id?: number;
  report_id: number;
  description: string;
  date: string;
  percent_month: number;
  percent_cumulative: number;  
  support_annex: Buffer;
  support_name: string;
  approved_changes: string;
  contingency_plan: string;
}

export interface AnnexData {
  id: number;
  report_id: number;
  description: string;
  file: Buffer;
  file_name: string;
}

export interface TechnicalSummaryData {
  id?: number;
  report_id: number;
  name_technical: string;
  obtained_result: string;
  product_description: string;
  support_annex_id: string;
  observations: string;
  support_annex: {
    id: number;
    description: string;
  };
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

export interface ReportTracking {
  id: number;
  report_id: number;
  note: string;
  report: {
    id: number;
    status: number;
    created_at: string;
    updated_at: string;
    user: {
      id: number;
      name: string;
    };
  };
}

export interface ReportTrackingProps {
  onSubmit: (data: ReportTracking) => void;
  initialData?: ReportTracking;
  handleClose: () => void;
}
