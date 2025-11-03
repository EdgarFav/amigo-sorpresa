"use client";

import { useState, useEffect } from "react";
import { supabase, DrawResult, Member } from "@/lib/supabase";
import { AuthService } from "@/lib/auth";
import GiftIdeasDisplay from "@/components/GiftIdeasDisplay";

interface DrawResultsProps {
  groupId: string;
  drawResults: DrawResult[];
}

export default function DrawResults({
  groupId,
  drawResults,
}: DrawResultsProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from("members")
        .select("*")
        .eq("group_id", groupId);

      if (error) {
        console.error("Error fetching members:", error);
      } else {
        setMembers(data || []);
      }
      setLoading(false);
    };

    fetchMembers();
  }, [groupId]);

  const getMemberName = (memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    return member ? member.name : "Miembro desconocido";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-lg">
        <div className="text-center text-gray-500">Cargando resultados...</div>
      </div>
    );
  }

  if (drawResults.length === 0) {
    return null; // No mostrar nada si no hay resultados
  }

  const currentSession = AuthService.getSession();
  const isHost = AuthService.isHost();
  const currentMemberId = AuthService.getCurrentMemberId();

  // Determinar si el host participa revisando si existe como miembro
  const hostParticipates =
    isHost &&
    currentMemberId &&
    drawResults.some(
      (result) =>
        result.giver_id === currentMemberId ||
        result.receiver_id === currentMemberId
    );

  // NUEVA LÓGICA: Todos solo ven su propia asignación (incluyendo host participante)
  // Solo host no participante puede ver todos los resultados
  const canSeeAllResults = isHost && !hostParticipates;

  const visibleResults = canSeeAllResults
    ? drawResults
    : drawResults.filter((result) => result.giver_id === currentMemberId);

  if (visibleResults.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          🎯 Tu Asignación
        </h3>
        <div className="text-center text-gray-500 py-8">
          No tienes una asignación en este sorteo.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        {canSeeAllResults
          ? "🎯 Todos los Resultados del Sorteo"
          : "🎁 Tu Asignación"}
      </h3>

      <div className="space-y-4">
        {visibleResults.map((result) => (
          <div
            key={result.id}
            className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border-l-4 border-green-500"
          >
            {canSeeAllResults ? (
              // Vista completa solo para host NO participante
              <>
                <div className="text-lg font-medium text-gray-800">
                  <span className="text-green-600">
                    {getMemberName(result.giver_id)}
                  </span>
                  <span className="mx-2">→</span>
                  <span className="text-blue-600">
                    {getMemberName(result.receiver_id)}
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {getMemberName(result.giver_id)} le regalará a{" "}
                  {getMemberName(result.receiver_id)}
                </div>
              </>
            ) : (
              // Vista individual para participantes (incluyendo host participante)
              <>
                <div className="text-2xl font-bold text-center text-gray-800 mb-4">
                  🎁 Te tocó regalarle a:
                </div>
                <div className="text-3xl font-bold text-center text-blue-600 mb-4">
                  {getMemberName(result.receiver_id)}
                </div>
                <div className="text-center text-gray-600">
                  ¡Mantén esto en secreto hasta el día del intercambio!
                </div>
                {hostParticipates && (
                  <div className="text-center text-sm text-orange-600 mt-2 font-medium">
                    Como organizador participante, también mantienes el secreto
                    🤫
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      {/* Mostrar ideas de regalo del receptor (solo para vista individual) */}
      {!canSeeAllResults && visibleResults.length > 0 && (
        <div className="mt-8">
          <GiftIdeasDisplay
            groupId={groupId}
            memberId={visibleResults[0].receiver_id}
            memberName={getMemberName(visibleResults[0].receiver_id)}
            showTitle={true}
          />
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
        <div className="flex items-start">
          <div className="text-yellow-600 mr-2">⚠️</div>
          <div>
            <div className="font-medium text-yellow-800">Importante:</div>
            <div className="text-yellow-700 text-sm">
              Asegúrate de que cada participante solo vea su asignación. Cada
              persona debe saber únicamente a quién le debe regalar.
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <div className="text-sm text-gray-500">
          Sorteo realizado el{" "}
          {new Date(drawResults[0]?.created_at).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
}
