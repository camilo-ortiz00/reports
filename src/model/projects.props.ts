export interface Project {
    id: number;
    component_id: number;
    name: string;
    description: string;
    component:{
      id: number;
      name: string;
    }
  }
  
export interface Component {
  id: number;
  user_id: number;
  name: string;
  description: string;
  project: {
    id: number;
    name: string;
  };
  user: {
    id: number;
    name: string;
    role_id: string;
  };
}

