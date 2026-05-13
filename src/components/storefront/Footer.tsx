import Link from "next/link";
import { InstagramIcon, FacebookIcon } from "lucide-react";
import { Logo } from "../Logo";

export function Footer() {
  return (
    <footer className="bg-footer px-5 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center gap-2">
          <Logo className="h-5 w-5" />
          <span className="text-lg font-bold tracking-wide">DM PRATAS</span>
        </div>

        <p className="mb-8 max-w-sm text-sm text-white/70">
          Joias em prata para a mulher moderna. Cada peça conta uma história de
          elegância e arte.
        </p>

        <div className="mb-8 grid grid-cols-2 gap-8">
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/50">
              Info
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-white/70 transition-colors hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/catalogo" className="text-sm text-white/70 transition-colors hover:text-white">
                  Catálogo
                </Link>
              </li>
              <li>
                <Link href="/cuidados" className="text-sm text-white/70 transition-colors hover:text-white">
                  Cuidados com a peça
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/50">
              Siga-nos
            </h3>
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/dm_pratasemijoias"
                aria-label="Instagram"
                className="text-white/70 transition-colors hover:text-white"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href="https://www.facebook.com/"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 transition-colors hover:text-white"
              >
                <FacebookIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 text-center">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} DM Pratas. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
