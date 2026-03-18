import { LogOut } from "lucide-react";
import { Logo } from "./Logo";

export function AdminHeader() {
  return (
    <header className="flex items-center justify-between bg-white px-5 py-4 border-b border-gray-100">
      <div className="flex items-center gap-2">
        <Logo className="h-5 w-5" />
        <span className="text-sm font-bold tracking-wide text-gray-800">
          DM PRATAS
        </span>
      </div>

      <button
        className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        title="Sair"
      >
        <LogOut className="h-5 w-5" />
      </button>
    </header>
  );
}
