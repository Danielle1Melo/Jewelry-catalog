"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Logo } from "../Logo";

export function AdminHeader() {
  const router = useRouter();

  async function handleLogout() {
    try {
      const res = await fetch("/api/admin/logout", { method: "POST" });
      if (!res.ok) return;
    } catch {
      return;
    }
    router.push("/admin/login");
  }

  return (
    <header className="flex items-center justify-between bg-white px-5 py-4 border-b border-gray-100">
      <div className="flex items-center gap-2">
        <Logo className="h-5 w-5" />
        <h1>
          DM PRATAS
        </h1>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="text-tiffany hover:text-tiffany-dark cursor-pointer"
        title="Sair"
        aria-label="Sair"
      >
        <LogOut className="h-5 w-5" />
      </button>
    </header>
  );
}
