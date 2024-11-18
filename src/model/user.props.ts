export interface User {
  id: number;
  name: string;
  email: string;
  date?: string;
  phone?: string;
  password: string;
  role_id: number;
  address?: string;
  profile_picture?: Buffer; 
  work_lines?: string;
  contact_person_name?: string;
  contact_person_phone?: string;
  contact_person_email?: string;
  blood_type?: string;
  identity_document: string;
  marital_status?: string;
  id_file?: Buffer; 
  cv_file?: Buffer; 
  academic_support_files?: Buffer; 
  id_file_name?: string; 
  cv_file_name?: string; 
  academic_support_name?: string; 
  profile_status: number; 
  role: {
    id: number;
    name: string;
    description: string;
  };
}
