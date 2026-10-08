import React from "react";
import { Plus } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";

interface NavbarProps {
  onOpenAddModal: () => void;
  projectCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAddModal, projectCount = 0 }) => {
  return (
    <header className="max-w-6xl mx-auto px-4 pt-6 pb-4">
      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-neutral-200/70 px-5 py-3 flex items-center justify-between shadow-xs">
        {/* Left: Brand Icon */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-rose-50 text-[#ff385c] border border-rose-100">
            <svg
              className="w-6 h-6 stroke-current fill-none stroke-[2.5]"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M7 20V5a4 4 0 0 1 4-4h2a5 5 0 0 1 5 5v1a5 5 0 0 1-5 5H7" />
              <path d="M12 11a3 3 0 1 1-3 3" />
            </svg>
          </div>
        </div>

        {/* Center: Konichiwa Script Logo */}
        <div className="flex flex-col items-center">
          <span className="font-['Kaushan_Script','Caveat',cursive] text-2xl font-bold tracking-wide text-[#ff385c] drop-shadow-xs">
            Konichiwa
          </span>
          <svg className="w-16 h-2 -mt-1 text-[#ff385c]" viewBox="0 0 60 8" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 5.5C12 2 45 1.5 59 6.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>

        {/* Right: GitHub Stars & Add Button */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/topics/konichiwa"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-800 text-sm font-semibold transition"
            title="Projects tagged with konichiwa"
          >
            <GithubIcon className="w-4 h-4 text-neutral-900" />
            <span>{projectCount}</span>
          </a>
          <button
            onClick={onOpenAddModal}
            className="w-10 h-10 rounded-xl bg-[#ff385c] hover:bg-[#e02d4f] text-white flex items-center justify-center shadow-sm transition active:scale-95 cursor-pointer"
            title="Add Project"
            aria-label="Add Project"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </header>
  );
};
