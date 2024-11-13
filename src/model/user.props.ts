export interface User {
  id: number;
  name: string;
  email: string;
  date?: string;
  phone?: string;
  password: string;
  role_id: number;
  address?: string;
  profile_picture?: string;
  work_lines?: string;
  contact_person_name?: string;
  contact_person_phone?: string;
  contact_person_email?: string;
  blood_type?: string;
  identity_document: string;
  marital_status?: string;
  id_file?: string;
  cv_file?: string;
  academic_support_files?: string;
  profile_status: number; 
    role: {
      id: number;
      name: string;
      description: string;
    };
  }