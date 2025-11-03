"use client";

import { useState } from "react";
import { AuthService } from "@/lib/auth";
import { useRealtimeGiftIdeas } from "@/hooks/useRealtimeGiftIdeas";
import GiftIdeasForm from "@/components/GiftIdeasForm";
import GiftIdeasDisplay from "@/components/GiftIdeasDisplay";

interface MyGiftIdeasSectionProps {
  groupId: string;
}

export default function MyGiftIdeasSection({
  groupId,
}: MyGiftIdeasSectionProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const currentMemberId = AuthService.getCurrentMemberId();
  const session = AuthService.getSession();

  if (!currentMemberId || !session) {
    return null;
  }

  const handleGiftIdeaAdded = () => {
    // Forzar refresh incrementando la key
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Formulario para agregar ideas */}
      <GiftIdeasForm
        groupId={groupId}
        memberId={currentMemberId}
        onGiftIdeaAdded={handleGiftIdeaAdded}
        key={`form-${refreshKey}`}
      />

      {/* Mostrar mis ideas actuales */}
      <div key={`display-${refreshKey}`}>
        <MyGiftIdeasList
          groupId={groupId}
          memberId={currentMemberId}
          memberName={session.memberName}
        />
      </div>
    </div>
  );
}

// Componente separado para la lista de ideas propias
function MyGiftIdeasList({
  groupId,
  memberId,
  memberName,
}: {
  groupId: string;
  memberId: string;
  memberName: string;
}) {
  const { giftIdeas, loading } = useRealtimeGiftIdeas(groupId, memberId);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <div className="text-center text-gray-500">Cargando tus ideas...</div>
      </div>
    );
  }

  if (giftIdeas.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          📝 Mis Ideas de Regalo
        </h3>
        <div className="text-center text-gray-500 py-6">
          <div className="text-4xl mb-4">💭</div>
          <p className="text-sm">
            Aún no has agregado ideas de regalo. ¡Agrega algunas arriba para
            ayudar a tu amigo secreto!
          </p>
        </div>
      </div>
    );
  }

  return (
    <GiftIdeasDisplay
      groupId={groupId}
      memberId={memberId}
      memberName={`${memberName} (tus ideas)`}
      showTitle={true}
    />
  );
}
