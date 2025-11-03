"use client";

export default function RealtimeBanner() {
  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
      <div className="flex items-start">
        <div className="text-green-600 mr-2 text-lg">🔥</div>
        <div>
          <div className="font-medium text-green-800 text-sm">
            Sistema en Tiempo Real Activo ⚡
          </div>
          <div className="text-green-700 text-xs mt-1">
            Los cambios aparecen instantáneamente sin necesidad de recargar.
            ¡Prueba agregar miembros o ideas desde otro navegador!
          </div>
        </div>
      </div>
    </div>
  );
}
