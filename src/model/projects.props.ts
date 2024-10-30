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
    project_id: number;
    work_lines: string;
    name: string;
    description: string;
    project:{
      id: number;
      name: string;
    }
  }
  