import React, { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
} from "@tanstack/react-query";
import { Navbar } from "./Navbar";
import { ProjectCard } from "./ProjectCard";
import { PaginationBar } from "./PaginationBar";
import { AddProjectDialog } from "./AddProjectDialog";
import type { Project, ProjectsResponse } from "@/lib/types";
import { Loader2, Plus, AlertCircle } from "lucide-react";

const PAGE_SIZE = 6;

// Fallback seed projects matching the reference UI if DB is freshly created or empty
const DEFAULT_PROJECTS: Project[] = [
  {
    id: "1",
    name: "Paramcode",
    description: "A platform to practice Blind 75 problems with progress tracking, clean UI and user accounts.",
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS"],
    githubUrl: "https://github.com",
    projectUrl: "https://example.com",
  },
  {
    id: "2",
    name: "Evolve",
    description: "AI powered resume analyzer that provides ATS score, detailed feedback and improvement tips.",
    techStack: ["Next.js", "Gemini API", "Tailwind CSS", "Prisma"],
    githubUrl: "https://github.com",
    projectUrl: "https://example.com",
  },
  {
    id: "3",
    name: "Taurus",
    description: "A modern AI chat application with multi-provider support, clean UI and real-time streaming.",
    techStack: ["Next.js", "OpenAI", "WebSockets", "Tailwind CSS"],
    githubUrl: "https://github.com",
    projectUrl: "https://example.com",
  },
  {
    id: "4",
    name: "Dokedex",
    description: "A RAG based document assistant for PDFs, images and web content with source citations.",
    techStack: ["Python", "LangChain", "pgvector", "Jina"],
    githubUrl: "https://github.com",
    projectUrl: "https://example.com",
  },
  {
    id: "5",
    name: "Atlas",
    description: "Production ready RAG API for multi-format ingestion with hybrid retrieval and observability.",
    techStack: ["Python", "FastAPI", "PostgreSQL", "RAPTOR"],
    githubUrl: "https://github.com",
    projectUrl: "https://example.com",
  },
  {
    id: "6",
    name: "Counter Timer",
    description: "A simple and beautiful Pomodoro timer to boost productivity with customizable sessions.",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "PWA"],
    githubUrl: "https://github.com",
    projectUrl: "https://example.com",
  },
];

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2, // 2 minutes cache
      refetchOnWindowFocus: false,
    },
  },
});

// The POST response carries the row it wrote, so the cache can be updated from it. Refetching
// instead would read the edge-cached GET, which can predate this write and make the new project
// disappear from the grid until that copy expires.
function applyWrite(
  current: ProjectsResponse | undefined,
  written: Project,
  created: boolean
): ProjectsResponse | undefined {
  if (!current) return undefined;
  if (!created) {
    return { ...current, projects: current.projects.map((p) => (p.id === written.id ? written : p)) };
  }
  const projects = [written, ...current.projects.filter((p) => p.id !== written.id)].slice(0, PAGE_SIZE);
  const total = current.total + 1;
  return { ...current, projects, total, totalPages: Math.ceil(total / PAGE_SIZE) || 1 };
}

function PortfolioView() {
  const [page, setPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { data, isLoading, isError, error } = useQuery<ProjectsResponse>({
    queryKey: ["projects", page],
    retry: 1,
    retryDelay: 500,
    queryFn: async () => {
      const res = await fetch(`/api/projects?page=${page}&limit=${PAGE_SIZE}`);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.details || "Failed to load projects");
      }
      return res.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newProject: Omit<Project, "id">) => {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProject),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.error || "Failed to save project");
      }
      return res.json() as Promise<{ project: Project; created: boolean }>;
    },
    onSuccess: (result) => {
      queryClient.setQueryData<ProjectsResponse>(["projects", 1], (current) =>
        applyWrite(current, result.project, result.created)
      );
      // refetchType "none" marks the other pages stale so they reload when opened, without
      // refetching the page the visitor is looking at.
      queryClient.invalidateQueries({ queryKey: ["projects"], refetchType: "none" });
      setPage(1);
    },
  });

  // Use database projects or fallback if database is empty/fresh
  const isDbEmpty = !isLoading && !isError && data?.projects?.length === 0;
  const usingFallback = isError || isDbEmpty;
  const displayProjects = usingFallback ? DEFAULT_PROJECTS : data?.projects || [];
  const fallbackPages = Math.ceil(DEFAULT_PROJECTS.length / PAGE_SIZE);
  const totalPages = usingFallback ? fallbackPages : data?.totalPages || 1;
  const projectCount = data?.total !== undefined ? data.total : (isError ? DEFAULT_PROJECTS.length : 0);

  return (
    <div className="min-h-screen bg-[#f7f7f8] pb-16">
      <Navbar onOpenAddModal={() => setIsAddOpen(true)} projectCount={projectCount} />
      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 mt-2">
        {isError && (
          <div className="mb-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span>MongoDB status: </span>
              <span className="font-mono">
                {import.meta.env.DEV ? (error instanceof Error ? error.message : "Not connected") : "Unavailable"}
              </span>
              <span>. </span>
              <span className="ml-1 text-neutral-600">Showing preview templates below. Set `DATABASE_URL` in .env to connect your database.</span>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl border border-neutral-200/80 p-8 md:p-12 shadow-xs">
          {/* Header Title */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-neutral-900 tracking-tight">
              Things I’ve Built
            </h1>
            <p className="text-neutral-500 text-sm md:text-base mt-2">
              A collection of projects I’ve worked on — exploring ideas, solving real problems, and learning along the way.
            </p>
          </div>

          {/* Projects Grid */}
          {isLoading ? (
            <div className="min-h-[400px] flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-[#ff385c] animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>

        {/* Pagination Bar */}
        <PaginationBar
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      </main>

      {/* Add Project Dialog */}
      <AddProjectDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSubmit={async (projectData) => {
          await createMutation.mutateAsync(projectData);
        }}
        isLoading={createMutation.isPending}
      />
    </div>
  );
}

export default function ProjectsApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <PortfolioView />
    </QueryClientProvider>
  );
}
