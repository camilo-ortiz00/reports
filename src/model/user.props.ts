export interface FormData {
    id: number;
    name: string;
    email: string; 
    password: string; 
    role: {
      id: number;
      name: string;
      description: string;
    };
  }