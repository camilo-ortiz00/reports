export interface Project {
    id: number;
    component_id: number;
    name: string;
    description: string;
  }
  
  export interface Component {
    id: number;
    project_id: number;
    work_lines: string;
    name: string;
    description: string;
  }
  