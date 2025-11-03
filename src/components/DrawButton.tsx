"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { supabase, DrawResult } from "@/lib/supabase";
import { useRealtimeMembers } from "@/hooks/useRealtimeMembers";

interface DrawButtonProps {
  groupId: string;
}

export default function DrawButton({ groupId }: DrawButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { members } = useRealtimeMembers(groupId);

  const performDraw = async () => {
    console.log(
      "🎲 Starting draw process with",
      members.length,
      "members:",
      members
    );

    if (members.length < 3) {
      toast.error("Necesitas al menos 3 miembros para realizar el sorteo.", {
        icon: "⚠️",
        duration: 4000,
      });
      return;
    }

    if (
      !confirm(
        "¿Estás seguro de realizar el sorteo? Esta acción no se puede deshacer."
      )
    ) {
      return;
    }

    setIsLoading(true);
    console.log("🔄 Draw loading state set to true");

    try {
      // Verificar si ya existe un sorteo para este grupo
      console.log("🔍 Checking for existing draw for group:", groupId);
      const { data: existingDraw, error: checkError } = await supabase
        .from("draw_results")
        .select("*")
        .eq("group_id", groupId)
        .limit(1);

      if (checkError) {
        console.error("❌ Error checking existing draw:", checkError);
        throw checkError;
      }

      if (existingDraw && existingDraw.length > 0) {
        console.log("⚠️ Draw already exists for this group:", existingDraw);
        toast.error("Ya se realizó un sorteo para este grupo.", {
          icon: "⚠️",
          duration: 4000,
        });
        setIsLoading(false);
        return;
      }

      console.log("✅ No existing draw found, proceeding with new draw");

      // Crear una copia del array de miembros para los receptores
      const receivers = [...members];
      const results: DrawResult[] = [];

      // Algoritmo de sorteo: asegurar que nadie se regale a sí mismo
      for (const giver of members) {
        // Filtrar receptores disponibles (no el mismo giver y no ya asignados)
        const availableReceivers = receivers.filter(
          (receiver) =>
            receiver.id !== giver.id &&
            !results.some((result) => result.receiver_id === receiver.id)
        );

        if (availableReceivers.length === 0) {
          // Si no hay receptores disponibles, reiniciar el sorteo
          throw new Error(
            "Error en el algoritmo de sorteo. Intentando de nuevo..."
          );
        }

        // Seleccionar un receptor aleatorio
        const randomIndex = Math.floor(
          Math.random() * availableReceivers.length
        );
        const selectedReceiver = availableReceivers[randomIndex];

        results.push({
          id: "", // Se generará automáticamente
          group_id: groupId,
          giver_id: giver.id,
          receiver_id: selectedReceiver.id,
          created_at: new Date().toISOString(),
        });
      }

      // Guardar los resultados en la base de datos
      console.log("💾 Saving draw results to database:", results);
      const resultsToInsert = results.map(({ id, ...result }) => result);

      const { data, error } = await supabase
        .from("draw_results")
        .insert(resultsToInsert)
        .select();

      if (error) {
        console.error("❌ Error saving draw results:", error);
        throw error;
      }

      console.log("✅ Draw results saved successfully:", data);
      toast.success("¡Sorteo realizado exitosamente!", {
        icon: "🎉",
        duration: 5000,
      });
    } catch (error) {
      console.error("Error performing draw:", error);
      toast.error("Error al realizar el sorteo. Intenta de nuevo.", {
        icon: "❌",
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-8 shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        🎲 Realizar Sorteo
      </h3>

      <p className="text-gray-600 mb-6">
        {members.length < 3
          ? `Necesitas al menos 3 miembros para realizar el sorteo. Actualmente tienes ${members.length}.`
          : `Todo listo para el sorteo con ${members.length} participantes.`}
      </p>

      <button
        onClick={performDraw}
        disabled={isLoading || members.length < 3}
        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        {isLoading ? "Realizando sorteo..." : "🎯 Realizar Sorteo"}
      </button>
    </div>
  );
}
