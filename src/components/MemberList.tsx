"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { supabase, Member } from "@/lib/supabase";

interface MemberListProps {
  groupId: string;
  onMembersChanged: () => void;
}

export default function MemberList({
  groupId,
  onMembersChanged,
}: MemberListProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberContact, setNewMemberContact] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, [groupId]);

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("group_id", groupId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching members:", error);
    } else {
      setMembers(data || []);
    }
  };

  const addMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.from("members").insert([
        {
          group_id: groupId,
          name: newMemberName,
          contact: newMemberContact,
        },
      ]);

      if (error) throw error;

      setNewMemberName("");
      setNewMemberContact("");
      fetchMembers();
      onMembersChanged();
    } catch (error) {
      console.error("Error adding member:", error);
      toast.error("Error al agregar miembro. Intenta de nuevo.", {
        icon: "❌",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeMember = async (memberId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este miembro?")) return;

    try {
      const { error } = await supabase
        .from("members")
        .delete()
        .eq("id", memberId);

      if (error) throw error;

      fetchMembers();
      onMembersChanged();
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Error al eliminar miembro. Intenta de nuevo.", {
        icon: "❌",
        duration: 4000,
      });
    }
  };

  return (
    <div className="bg-white rounded-xl p-8 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">
        👨‍👩‍👧‍👦 Miembros del Grupo ({members.length})
      </h3>

      {/* Lista de miembros */}
      <div className="space-y-3 mb-6">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <div className="font-medium text-gray-800">{member.name}</div>
              <div className="text-sm text-gray-600">{member.contact}</div>
            </div>
            <button
              onClick={() => removeMember(member.id)}
              className="text-red-500 hover:text-red-700 p-2"
              title="Eliminar miembro"
            >
              ❌
            </button>
          </div>
        ))}
        {members.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No hay miembros aún. ¡Agrega el primero!
          </div>
        )}
      </div>

      {/* Formulario para agregar miembro */}
      <form onSubmit={addMember} className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="memberName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Nombre
            </label>
            <input
              type="text"
              id="memberName"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Nombre completo"
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
              value={newMemberContact}
              onChange={(e) => setNewMemberContact(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Email o teléfono"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          {isLoading ? "Agregando..." : "Agregar Miembro"}
        </button>
      </form>
    </div>
  );
}
