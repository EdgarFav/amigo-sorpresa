"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { generateAccessCode, AuthService } from "@/lib/auth";

interface CreateGroupFormProps {
  onGroupCreated: (groupId: string) => void;
}

export default function CreateGroupForm({
  onGroupCreated,
}: CreateGroupFormProps) {
  const [groupName, setGroupName] = useState("");
  const [hostName, setHostName] = useState("");
  const [hostParticipates, setHostParticipates] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const accessCode = generateAccessCode();

      const { data: groupData, error: groupError } = await supabase
        .from("groups")
        .insert([
          {
            name: groupName,
            host_name: hostName,
            access_code: accessCode,
            host_participates: hostParticipates,
          },
        ])
        .select()
        .single();

      if (groupError) throw groupError;

      // Si el host participa, agregarlo como miembro
      let hostMemberId = null;
      if (hostParticipates) {
        const { data: memberData, error: memberError } = await supabase
          .from("members")
          .insert([
            {
              group_id: groupData.id,
              name: hostName,
              contact: "Host",
            },
          ])
          .select()
          .single();

        if (memberError) throw memberError;
        hostMemberId = memberData.id;
      }

      // Configurar sesión del host
      AuthService.setSession({
        memberId: hostMemberId || "",
        memberName: hostName,
        groupId: groupData.id,
        isHost: true,
      });

      toast.success(`¡Grupo creado exitosamente! 🎉`, {
        icon: "🎉",
        duration: 6000,
      });

      toast.success(
        `Código de acceso: ${accessCode}\nComparte este código con los participantes.`,
        {
          icon: "📋",
          duration: 8000,
        }
      );

      onGroupCreated(groupData.id);
      setGroupName("");
      setHostName("");
      setHostParticipates(false);
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Error al crear el grupo. Intenta de nuevo.", {
        icon: "❌",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-8 shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        👥 Crear Nuevo Grupo
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="groupName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nombre del Grupo
          </label>
          <input
            type="text"
            id="groupName"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-slate-900"
            placeholder="Ej: Amigos de la Oficina"
            required
          />
        </div>

        <div>
          <label
            htmlFor="hostName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Tu Nombre (Organizador)
          </label>
          <input
            type="text"
            id="hostName"
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-slate-900"
            placeholder="Tu nombre completo"
            required
          />
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="hostParticipates"
            checked={hostParticipates}
            onChange={(e) => setHostParticipates(e.target.checked)}
            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
          />
          <label
            htmlFor="hostParticipates"
            className="text-sm font-medium text-gray-700"
          >
            Quiero participar en el intercambio (no solo organizar)
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {isLoading ? "Creando..." : "Crear Grupo"}
        </button>
      </form>
    </div>
  );
}
