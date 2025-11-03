"use client";

import { AuthService } from "@/lib/auth";

interface WelcomeMessageProps {
  groupName: string;
  hostName: string;
}

export default function WelcomeMessage({
  groupName,
  hostName,
}: WelcomeMessageProps) {
  const session = AuthService.getSession();
  const isHost = AuthService.isHost();

  if (!session) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
      <div className="text-center">
        {isHost ? (
          <>
            <div className="text-4xl mb-4">👑</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              ¡Bienvenido, Organizador!
            </h2>
            <p className="text-gray-600">
              Desde aquí puedes administrar tu grupo &ldquo;{groupName}&rdquo;.
              Agrega participantes y realiza el sorteo cuando estén todos
              listos.
            </p>
          </>
        ) : (
          <>
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              ¡Hola, {session.memberName}!
            </h2>
            <p className="text-gray-600">
              Te has unido exitosamente al grupo &ldquo;{groupName}&rdquo;
              organizado por {hostName}. Aquí podrás ver tu asignación una vez
              que se realice el sorteo.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
