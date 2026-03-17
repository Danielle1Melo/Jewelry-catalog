"use client";

import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: implementar autenticação
    console.log("Login attempt");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="flex w-full max-w-sm flex-col items-center">
        <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-tiffany-light">
          <Logo className="h-10 w-10" />
        </div>

        <h1 className="mb-1 text-3xl font-bold text-gray-800">Bem-Vindo</h1>
        <p className="mb-8 text-gray-400">Acesso Admin</p>

        <form
          onSubmit={handleSubmit}
          className="w-full rounded-2xl bg-white p-6 shadow-sm border border-gray-100"
        >
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-semibold text-gray-800"
          >
            Senha
          </label>

          <div className="relative mb-4">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Entre com a senha do admin"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-full border border-gray-200 py-3 pl-10 pr-10 text-sm text-gray-700 placeholder-gray-400 outline-none transition-colors focus:border-tiffany focus:ring-1 focus:ring-tiffany"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          <button
            type="submit"
            className="w-full rounded-full bg-tiffany py-3 text-sm font-semibold text-white transition-colors hover:bg-tiffany-dark cursor-pointer"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
