import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, ExternalLink, Loader2 } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";

interface AddProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    name: string;
    description: string;
    techStack: string[];
    githubUrl?: string;
    projectUrl?: string;
  }) => Promise<void>;
  isLoading?: boolean;
}

export const AddProjectDialog: React.FC<AddProjectDialogProps> = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [techInput, setTechInput] = useState("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [githubUrl, setGithubUrl] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const resetForm = () => {
    setName("");
    setDescription("");
    setTechInput("");
    setTechStack([]);
    setGithubUrl("");
    setProjectUrl("");
    setError(null);
  };

  const handleAddTech = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const trimmed = techInput.trim().replace(/^,+|,+$/g, "");
      if (trimmed && !techStack.includes(trimmed)) {
        setTechStack([...techStack, trimmed]);
        setTechInput("");
      }
    }
  };

  const removeTech = (itemToRemove: string) => {
    setTechStack(techStack.filter((t) => t !== itemToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) {
      setError("Please fill in both project name and description.");
      return;
    }

    try {
      setError(null);
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
        techStack,
        githubUrl: githubUrl.trim() || undefined,
        projectUrl: projectUrl.trim() || undefined,
      });
      resetForm();
      onOpenChange(false);
    } catch (err: any) {
      setError(err?.message || "Failed to add project. Please try again.");
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={(val) => {
      if (!val) resetForm();
      onOpenChange(val);
    }}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs z-50 animate-in fade-in" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-3xl p-7 shadow-2xl z-50 border border-neutral-100 focus:outline-none max-h-[90vh] overflow-y-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center justify-between pb-4">
            <Dialog.Title className="text-xl font-bold text-neutral-900 tracking-tight">
              Add Project
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 transition cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Project Name */}
            <div>
              <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                Project Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter project name"
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff385c]/20 focus:border-[#ff385c] transition placeholder:text-neutral-400"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Write a short description about your project..."
                rows={3}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff385c]/20 focus:border-[#ff385c] transition placeholder:text-neutral-400 resize-y"
                required
              />
            </div>

            {/* Techstack */}
            <div>
              <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                Techstack
              </label>
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                onKeyDown={handleAddTech}
                placeholder="Add a technology and press enter..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff385c]/20 focus:border-[#ff385c] transition placeholder:text-neutral-400"
              />

              {techStack.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {techStack.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 text-neutral-700 rounded-full text-xs font-medium"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTech(tech)}
                        className="hover:text-red-500 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* GitHub URL */}
            <div>
              <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                Github Url
              </label>
              <div className="relative flex items-center">
                <GithubIcon className="w-4 h-4 text-neutral-800 absolute left-3.5 pointer-events-none" />
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username/project"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff385c]/20 focus:border-[#ff385c] transition placeholder:text-neutral-400"
                />
              </div>
            </div>

            {/* Project URL */}
            <div>
              <label className="block text-sm font-semibold text-neutral-800 mb-1.5">
                Project Url
              </label>
              <div className="relative flex items-center">
                <ExternalLink className="w-4 h-4 text-[#ff385c] absolute left-3.5 pointer-events-none" />
                <input
                  type="url"
                  value={projectUrl}
                  onChange={(e) => setProjectUrl(e.target.value)}
                  placeholder="https://yourproject.com"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff385c]/20 focus:border-[#ff385c] transition placeholder:text-neutral-400"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className="px-5 py-2 rounded-xl border border-neutral-200 text-neutral-700 text-sm font-medium hover:bg-neutral-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2 rounded-xl bg-[#ff385c] hover:bg-[#e02d4f] text-white text-sm font-medium shadow-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>Add Project</span>
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
