"use client";

import Image from "next/image";
import { useRealtimeGiftIdeas } from "@/hooks/useRealtimeGiftIdeas";

interface GiftIdeasDisplayProps {
  groupId: string;
  memberId: string;
  memberName: string;
  showTitle?: boolean;
}

export default function GiftIdeasDisplay({
  groupId,
  memberId,
  memberName,
  showTitle = true,
}: GiftIdeasDisplayProps) {
  const { giftIdeas, loading } = useRealtimeGiftIdeas(groupId, memberId);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="text-center text-gray-500">
          Cargando ideas de regalo...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      {showTitle && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          🎁 Ideas de Regalo de {memberName}
        </h3>
      )}

      {giftIdeas.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <div className="text-4xl mb-4">💭</div>
          <p className="text-lg font-medium mb-2">Sin ideas aún</p>
          <p className="text-sm">
            {memberName} aún no ha compartido ideas de regalo
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {giftIdeas.map((idea) => (
            <div
              key={idea.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                {/* Imagen */}
                {idea.image_url ? (
                  <div className="flex-shrink-0">
                    <Image
                      src={idea.image_url}
                      alt={idea.title}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                  </div>
                ) : (
                  <div className="flex-shrink-0 w-20 h-20 bg-gray-100 rounded-lg border flex items-center justify-center">
                    <span className="text-2xl text-gray-400">🎁</span>
                  </div>
                )}

                {/* Contenido */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-lg font-medium text-gray-800 mb-1">
                    {idea.title}
                  </h4>
                  <div className="text-xs text-gray-500">
                    Agregado el{" "}
                    {new Date(idea.created_at).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
        <div className="flex items-start">
          <div className="text-green-600 mr-2">💡</div>
          <div>
            <div className="font-medium text-green-800 text-sm">
              Ideas de Regalo
            </div>
            <div className="text-green-700 text-xs mt-1">
              Estas son las sugerencias que {memberName} ha compartido para
              ayudarte a elegir el regalo perfecto.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
