"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { AuthService } from "@/lib/auth";

interface JoinGroupFormProps {
  onJoinSuccess: (groupId: string) => void;
  onCancel: () => void;
}

export default function JoinGroupForm({
  onJoinSuccess,
  onCancel,
}: JoinGroupFormProps) {
  const [accessCode, setAccessCode] = useState("");
  const [memberName, setMemberName] = useState("");
  const [memberContact, setMemberContact] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Buscar el grupo por código de acceso
      const { data: groupData, error: groupError } = await supabase
        .from("groups")
        .select("*")
        .eq("access_code", accessCode.toUpperCase())
        .single();

      if (groupError || !groupData) {
        toast.error(
          "Código de acceso inválido. Verifica el código e intenta de nuevo.",
          {
            icon: "🔒",
            duration: 4000,
          }
        );
        setIsLoading(false);
        return;
      }

      // Verificar si ya existe un sorteo para este grupo
      const { data: drawData } = await supabase
        .from("draw_results")
        .select("*")
        .eq("group_id", groupData.id)
        .limit(1);

      if (drawData && drawData.length > 0) {
        toast.error(
          "Ya se realizó el sorteo para este grupo. No puedes unirte.",
          {
            icon: "⚠️",
            duration: 4000,
          }
        );
        setIsLoading(false);
        return;
      }

      // Verificar si ya existe un miembro con el mismo nombre en el grupo
      const { data: existingMember } = await supabase
        .from("members")
        .select("*")
        .eq("group_id", groupData.id)
        .eq("name", memberName);

      if (existingMember && existingMember.length > 0) {
        toast.error("Ya existe un participante con ese nombre en el grupo.", {
          icon: "👥",
          duration: 4000,
        });
        setIsLoading(false);
        return;
      }

      // Agregar el miembro al grupo
      const { data: memberData, error: memberError } = await supabase
        .from("members")
        .insert([
          {
            group_id: groupData.id,
            name: memberName,
            contact: memberContact,
          },
        ])
        .select()
        .single();

      if (memberError) throw memberError;

      // Configurar sesión del miembro
      AuthService.setSession({
        memberId: memberData.id,
        memberName: memberName,
        groupId: groupData.id,
        isHost: false,
      });

      toast.success(
        `¡Te has unido exitosamente al grupo "${groupData.name}"!`,
        {
          icon: "🎉",
          duration: 5000,
        }
      );
      onJoinSuccess(groupData.id);
    } catch (error) {
      console.error("Error joining group:", error);
      toast.error("Error al unirse al grupo. Intenta de nuevo.", {
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
        🔐 Unirse a un Grupo
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="accessCode"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Código de Acceso
          </label>
          <input
            type="text"
            id="accessCode"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl font-mono tracking-widest text-slate-900"
            placeholder="ABC123"
            maxLength={6}
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Ingresa el código de 6 caracteres que te compartió el organizador
          </p>
        </div>

        <div>
          <label
            htmlFor="memberName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Tu Nombre
          </label>
          <input
            type="text"
            id="memberName"
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
            placeholder="Tu nombre completo"
            required
          />
        </div>

        <div>
          <label
            htmlFor="memberContact"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Contacto
          </label>
          <input
            type="text"
            id="memberContact"
            value={memberContact}
            onChange={(e) => setMemberContact(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
            placeholder="Email o teléfono"
            required
          />
        </div>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {isLoading ? "Uniéndose..." : "Unirse al Grupo"}
          </button>
        </div>
      </form>
    </div>
  );
}
