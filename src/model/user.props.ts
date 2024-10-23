export interface User {
    id: number;
    name: string;
    email: string; 
    identity_document: string;
    password: string; 
    role: {
      id: number;
      name: string;
      description: string;
    };
  }