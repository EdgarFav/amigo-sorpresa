"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { AuthService } from "@/lib/auth";

interface GiftIdeasFormProps {
  groupId: string;
  memberId: string;
  onGiftIdeaAdded?: () => void;
}

export default function GiftIdeasForm({
  groupId,
  memberId,
  onGiftIdeaAdded,
}: GiftIdeasFormProps) {
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La imagen debe ser menor a 5MB", {
          icon: "📸",
        });
        return;
      }

      // Validar tipo
      if (!file.type.startsWith("image/")) {
        toast.error("Solo se permiten archivos de imagen", {
          icon: "⚠️",
        });
        return;
      }

      setImageFile(file);

      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Por favor ingresa una idea de regalo", {
        icon: "✏️",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = null;

      // Subir imagen si existe
      if (imageFile) {
        try {
          const fileExt = imageFile.name.split(".").pop();
          const fileName = `${memberId}-${Date.now()}.${fileExt}`;
          const filePath = `gift-ideas/${fileName}`;

          console.log("📤 Uploading image:", {
            filePath,
            fileName,
            fileSize: imageFile.size,
            fileType: imageFile.type,
          });

          // Subir imagen directamente (bucket ya está configurado)
          const { data: uploadData, error: uploadError } =
            await supabase.storage
              .from("gift-images")
              .upload(filePath, imageFile, {
                cacheControl: "3600",
                upsert: false,
              });

          if (uploadError) {
            console.error("❌ Upload error details:", {
              error: uploadError,
              message: uploadError.message,
            });

            let errorMessage = "No se pudo subir la imagen.";

            if (uploadError.message?.includes("Duplicate")) {
              errorMessage = "Ya existe un archivo con ese nombre.";
            } else if (uploadError.message?.includes("policy")) {
              errorMessage = "Sin permisos para subir archivos.";
            } else if (uploadError.message?.includes("size")) {
              errorMessage = "El archivo es demasiado grande.";
            }

            toast.error(errorMessage, {
              icon: "📸",
            });
            // Continuar sin imagen
            toast.loading("Guardando idea sin imagen...", {
              id: "saving-idea",
            });
          } else {
            // Obtener URL pública
            const { data: urlData } = supabase.storage
              .from("gift-images")
              .getPublicUrl(filePath);

            imageUrl = urlData.publicUrl;
            console.log("✅ Image uploaded successfully:", {
              path: uploadData.path,
              publicUrl: imageUrl,
            });
          }
        } catch (error) {
          console.error("❌ Unexpected error uploading image:", error);
          const errorMessage =
            error instanceof Error ? error.message : "Error desconocido";
          toast.error(`Error al subir imagen: ${errorMessage}`, {
            icon: "⚠️",
          });
          // Continuar sin imagen
          toast.loading("Guardando idea sin imagen...", {
            id: "saving-idea",
          });
        }
      }

      // Guardar idea en la base de datos
      const { data, error } = await supabase
        .from("gift_ideas")
        .insert({
          group_id: groupId,
          member_id: memberId,
          title: title.trim(),
          image_url: imageUrl,
        })
        .select();

      if (error) {
        console.error("❌ Error saving gift idea:", error);
        throw error;
      }

      console.log("✅ Gift idea saved:", data);

      // Limpiar formulario
      setTitle("");
      setImageFile(null);
      setImagePreview(null);

      // Callback
      if (onGiftIdeaAdded) {
        onGiftIdeaAdded();
      }

      toast.dismiss("saving-idea");
      toast.success("¡Idea de regalo agregada exitosamente!", {
        icon: "🎁",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error adding gift idea:", error);
      toast.dismiss("saving-idea");
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
        💡 Agregar Idea de Regalo
      </h3>

      <div className="mb-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
        <div className="text-sm text-blue-700">
          <strong>💡 Tip:</strong> Comparte ideas de regalos que te gustaría
          recibir. Tu amigo secreto podrá ver estas sugerencias para inspirarse.
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
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
            maxLength={255}
            disabled={isSubmitting}
          />
          <div className="text-xs text-gray-500 mt-1">
            {title.length}/255 caracteres
          </div>
        </div>

        {/* Campo de imagen */}
        <div>
          <label
            htmlFor="gift-image"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Imagen (opcional)
          </label>

          {!imagePreview ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                id="gift-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={isSubmitting}
              />
              <label
                htmlFor="gift-image"
                className="cursor-pointer flex flex-col items-center"
              >
                <div className="text-4xl text-gray-400 mb-2">📷</div>
                <div className="text-sm text-gray-600 mb-1">
                  Click para subir una imagen
                </div>
                <div className="text-xs text-gray-500">PNG, JPG hasta 5MB</div>
              </label>
            </div>
          ) : (
            <div className="relative">
              <Image
                src={imagePreview}
                alt="Preview"
                width={400}
                height={192}
                className="w-full h-48 object-cover rounded-lg border"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                disabled={isSubmitting}
              >
                ✕
              </button>
            </div>
          )}
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
