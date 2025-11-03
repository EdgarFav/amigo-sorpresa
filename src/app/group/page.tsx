"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";
import { supabase, Group } from "@/lib/supabase";
import { AuthService } from "@/lib/auth";
import { useRealtimeDrawResults } from "@/hooks/useRealtimeDrawResults";
import MembersDisplay from "@/components/MembersDisplay";
import DrawButton from "@/components/DrawButton";
import DrawResults from "@/components/DrawResults";
import WelcomeMessage from "@/components/WelcomeMessage";
import CopyableAccessCode from "@/components/CopyableAccessCode";
import MyGiftIdeasSection from "@/components/MyGiftIdeasSection";

function GroupPageContent() {
  const searchParams = useSearchParams();
  const groupId = searchParams.get("id");

  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  // Usar hooks de polling (mientras no hay realtime)
  const { drawResults } = useRealtimeDrawResults(groupId || "");

  useEffect(() => {
    const fetchGroupData = async () => {
      if (!groupId) return;

      try {
        // Solo obtener información del grupo (miembros y sorteos los manejan los hooks)
        const { data: groupData, error: groupError } = await supabase
          .from("groups")
          .select("*")
          .eq("id", groupId)
          .single();

        if (groupError) throw groupError;
        setGroup(groupData);
      } catch (error) {
        console.error("Error fetching group data:", error);
        toast.error("Error al cargar la información del grupo.", {
          icon: "❌",
          duration: 4000,
        });
      } finally {
        setLoading(false);
      }
    };

    if (groupId) {
      fetchGroupData();
    }
  }, [groupId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-green-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center text-gray-500">Cargando...</div>
        </div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-green-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Grupo no encontrado
            </h1>
            <a href="/" className="text-blue-500 hover:text-blue-700">
              Volver al inicio
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-green-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎁 {group.name}
          </h1>
          <p className="text-lg text-gray-600">
            Organizado por:{" "}
            <span className="font-semibold">{group.host_name}</span>
          </p>
          <div className="text-sm text-gray-500 mt-2">
            Creado el {new Date(group.created_at).toLocaleDateString("es-ES")}
          </div>

          {/* Mostrar código de acceso solo al host con funcionalidad de copiado */}
          {AuthService.isHost() && (
            <CopyableAccessCode accessCode={group.access_code} />
          )}
        </div>

        {/* Navigation */}
        <div className="mb-8 text-center">
          <a
            href="/"
            className="inline-flex items-center text-blue-500 hover:text-blue-700 font-medium"
          >
            ← Volver al inicio
          </a>
        </div>

        {/* Welcome Message */}
        <WelcomeMessage groupName={group.name} hostName={group.host_name} />

        {/* Content */}
        <div className="space-y-8">
          {/* Lista de participantes (para todos) */}
          <MembersDisplay groupId={groupId!} />

          {/* Ideas de regalo - Antes del sorteo */}
          {drawResults.length === 0 && (
            <MyGiftIdeasSection groupId={groupId!} />
          )}

          {/* Sorteo - Solo el host puede realizar el sorteo */}
          {drawResults.length === 0 ? (
            AuthService.isHost() && <DrawButton groupId={groupId!} />
          ) : (
            <DrawResults groupId={groupId!} drawResults={drawResults} />
          )}

          {/* Mensaje para participantes si no hay sorteo aún */}
          {drawResults.length === 0 && !AuthService.isHost() && (
            <div className="bg-white rounded-xl p-8 shadow-lg text-center">
              <div className="text-6xl mb-4">⏳</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Esperando el sorteo
              </h3>
              <p className="text-gray-600">
                El organizador aún no ha realizado el sorteo. Mientras tanto,
                puedes agregar ideas de regalo arriba para ayudar a tu amigo
                secreto.
              </p>
            </div>
          )}
        </div>

        {/* Footer con información */}
        <div className="mt-12 bg-white rounded-xl p-6 shadow-lg">
          <h3 className="font-semibold text-gray-800 mb-4">
            💡 Consejos para el intercambio:
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Establece un presupuesto límite antes del sorteo</li>
            <li>• Comparte la fecha y lugar del intercambio con todos</li>
            <li>
              • Considera crear una lista de gustos o intereses de cada
              participante
            </li>
            <li>
              • ¡Mantén en secreto a quién le regalas hasta el día del
              intercambio!
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function GroupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-green-50 p-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="text-gray-500">Cargando...</div>
          </div>
        </div>
      }
    >
      <GroupPageContent />
    </Suspense>
  );
}
