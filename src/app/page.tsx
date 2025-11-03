"use client";

import { useState } from "react";
import CreateGroupForm from "@/components/CreateGroupForm";
import JoinGroupForm from "@/components/JoinGroupForm";

export default function HomePage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);

  const handleGroupCreated = (groupId: string) => {
    // Redirigir a la página del grupo
    window.location.href = `/group?id=${groupId}`;
  };

  const handleJoinSuccess = (groupId: string) => {
    // Redirigir a la página del grupo
    window.location.href = `/group?id=${groupId}`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 to-green-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            🎁 Amigo Sorpresa
          </h1>
          <p className="text-xl text-gray-600">
            Organiza sorteos de regalos entre amigos de manera fácil y divertida
          </p>
        </header>

        {showCreateForm ? (
          <div className="mb-8">
            <CreateGroupForm onGroupCreated={handleGroupCreated} />
            <div className="text-center mt-4">
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ← Cancelar
              </button>
            </div>
          </div>
        ) : showJoinForm ? (
          <div className="mb-8">
            <JoinGroupForm
              onJoinSuccess={handleJoinSuccess}
              onCancel={() => setShowJoinForm(false)}
            />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                👥 Crear Grupo
              </h2>
              <p className="text-gray-600 mb-6">
                Organiza un nuevo grupo de intercambio de regalos
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Crear Nuevo Grupo
              </button>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                � Unirse a Grupo
              </h2>
              <p className="text-gray-600 mb-6">
                Únete a un grupo existente con el código de acceso
              </p>
              <button
                onClick={() => setShowJoinForm(true)}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Unirse con Código
              </button>
            </div>
          </div>
        )}

        <div className="mt-12 bg-white rounded-xl p-8 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            ¿Cómo funciona?
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">1️⃣</div>
              <h4 className="font-semibold text-gray-800">Crear Grupo</h4>
              <p className="text-sm text-gray-600">
                Crea un grupo y recibe un código de acceso
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">2️⃣</div>
              <h4 className="font-semibold text-gray-800">Compartir Código</h4>
              <p className="text-sm text-gray-600">
                Los participantes se unen con el código
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">3️⃣</div>
              <h4 className="font-semibold text-gray-800">Sortear</h4>
              <p className="text-sm text-gray-600">
                El organizador realiza el sorteo
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">4️⃣</div>
              <h4 className="font-semibold text-gray-800">¡Intercambiar!</h4>
              <p className="text-sm text-gray-600">
                Cada uno ve solo su asignación secreta
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <div className="flex items-start">
              <div className="text-blue-600 mr-2">🔐</div>
              <div>
                <div className="font-medium text-blue-800">
                  Privacidad Total:
                </div>
                <div className="text-blue-700 text-sm">
                  Cada participante solo puede ver a quién debe regalar. ¡Ni
                  siquiera el organizador ve tu asignación si también participa!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
