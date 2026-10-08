import React from "react";
import { ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import type { Project } from "@/lib/types";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200/90 p-6 flex flex-col justify-between hover:shadow-md hover:border-neutral-300 transition-all duration-200">
      <div>
        <h3 className="text-xl font-bold text-neutral-900 tracking-tight mb-2">
          {project.name}
        </h3>
        <p className="text-neutral-500 text-sm leading-relaxed mb-5 line-clamp-3">
          {project.description}
        </p>

        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {project.techStack.map((tech, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-neutral-100 text-neutral-600 rounded-full text-xs font-medium"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2.5 pt-2">
        {project.githubUrl ? (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-xl border border-neutral-200 flex items-center justify-center text-neutral-800 hover:bg-neutral-50 hover:text-black transition"
            title="GitHub Repository"
          >
            <GithubIcon className="w-5 h-5" />
          </a>
        ) : (
          <div className="w-10 h-10 rounded-xl border border-neutral-100 flex items-center justify-center text-neutral-300 cursor-not-allowed">
            <GithubIcon className="w-5 h-5" />
          </div>
        )}

        {project.projectUrl ? (
          <a
            href={project.projectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-100 flex items-center justify-center text-[#ff385c] transition"
            title="Live Preview"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        ) : (
          <div className="w-10 h-10 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-300 cursor-not-allowed">
            <ExternalLink className="w-4 h-4" />
          </div>
        )}
      </div>
    </div>
  );
};
