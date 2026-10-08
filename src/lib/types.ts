export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  githubUrl?: string | null;
  projectUrl?: string | null;
  createdAt?: string;
}

export interface ProjectsResponse {
  projects: Project[];
  total: number;
  totalPages: number;
  currentPage: number;
  error?: string;
}
