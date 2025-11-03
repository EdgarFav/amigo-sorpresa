"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { supabase } from "@/lib/supabase";

interface SimpleGiftIdeasFormProps {
  groupId: string;
  memberId: string;
  onGiftIdeaAdded?: () => void;
}

export default function SimpleGiftIdeasForm({
  groupId,
  memberId,
  onGiftIdeaAdded,
}: SimpleGiftIdeasFormProps) {
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Por favor ingresa una idea de regalo", {
        icon: "⚠️",
        duration: 3000,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("💾 Saving gift idea without image:", {
        group_id: groupId,
        member_id: memberId,
        title: title.trim(),
      });

      // Guardar idea en la base de datos SIN imagen
      const { data, error } = await supabase
        .from("gift_ideas")
        .insert({
          group_id: groupId,
          member_id: memberId,
          title: title.trim(),
          image_url: null, // Sin imagen por ahora
        })
        .select();

      if (error) {
        console.error("❌ Error saving gift idea:", error);
        throw error;
      }

      console.log("✅ Gift idea saved successfully:", data);

      // Limpiar formulario
      setTitle("");

      // Callback
      if (onGiftIdeaAdded) {
        onGiftIdeaAdded();
      }

      toast.success("¡Idea de regalo agregada exitosamente!", {
        icon: "🎁",
        duration: 4000,
      });
    } catch (error) {
      console.error("Error adding gift idea:", error);
      toast.error("Error al agregar la idea de regalo. Intenta de nuevo.", {
        icon: "❌",
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        💡 Agregar Idea de Regalo (Solo Texto)
      </h3>

      <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
        <div className="text-sm text-blue-700">
          <strong>💡 Tip:</strong> Comparte ideas de regalos que te gustaría
          recibir. Tu amigo secreto podrá ver estas sugerencias para inspirarse.
        </div>
      </div>

      <div className="mb-4 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
        <div className="text-sm text-yellow-700">
          <strong>⚠️ Modo temporal:</strong> Las imágenes están deshabilitadas
          mientras se configura el storage.
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Campo de título */}
        <div>
          <label
            htmlFor="gift-title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Idea de regalo *
          </label>
          <input
            id="gift-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ej: Libro de cocina, Auriculares bluetooth, Planta suculenta..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={255}
            disabled={isSubmitting}
          />
          <div className="text-xs text-gray-500 mt-1">
            {title.length}/255 caracteres
          </div>
        </div>

        {/* Botón de envío */}
        <button
          type="submit"
          disabled={isSubmitting || !title.trim()}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Guardando...
            </span>
          ) : (
            "🎁 Agregar Idea"
          )}
        </button>
      </form>
    </div>
  );
}
