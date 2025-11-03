"use client";

import { useState } from "react";

interface CopyableAccessCodeProps {
  accessCode: string;
}

export default function CopyableAccessCode({
  accessCode,
}: CopyableAccessCodeProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(accessCode);
      setCopied(true);

      // Reset después de 2 segundos
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Error al copiar:", error);
    }
  };

  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="text-sm font-medium text-blue-800 mb-1">
        Código de acceso del grupo:
      </div>

      <div className="flex items-center justify-center gap-3">
        <div className="text-2xl font-mono font-bold text-blue-600 tracking-widest">
          {accessCode}
        </div>

        <button
          onClick={copyToClipboard}
          className={`
            flex items-center justify-center px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200
            ${
              copied
                ? "bg-green-500 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white hover:shadow-md active:scale-95"
            }
          `}
          title="Copiar código al portapapeles"
        >
          {copied ? (
            <>
              <span className="text-lg mr-1">✓</span>
              Copiado
            </>
          ) : (
            <>
              <span className="text-lg mr-1">📋</span>
              Copiar
            </>
          )}
        </button>
      </div>

      <div className="text-xs text-blue-600 mt-2 text-center">
        Comparte este código con los participantes
      </div>
    </div>
  );
}
