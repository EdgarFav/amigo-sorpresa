"use client";

import { useRealtimeMembers } from "@/hooks/useRealtimeMembers";

interface MembersDisplayProps {
  groupId: string;
}

export default function MembersDisplay({ groupId }: MembersDisplayProps) {
  const { members, loading } = useRealtimeMembers(groupId);

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-lg">
        <div className="text-center text-gray-500">Cargando miembros...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        👨‍👩‍👧‍👦 Participantes ({members.length})
      </h3>

      {members.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <div className="text-4xl mb-4">👥</div>
          <p className="text-lg font-medium mb-2">Esperando participantes</p>
          <p className="text-sm">
            Comparte el código de acceso para que se unan al grupo
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {members.map((member, index) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-gray-800">{member.name}</div>
                  <div className="text-sm text-gray-600">{member.contact}</div>
                </div>
              </div>
              <div className="text-green-500 text-xl">✓</div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
        <div className="flex items-start">
          <div className="text-blue-600 mr-2">💡</div>
          <div>
            <div className="font-medium text-blue-800">Información:</div>
            <div className="text-blue-700 text-sm">
              Los participantes se unen automáticamente usando el código de
              acceso. Esta lista se actualiza en tiempo real.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
