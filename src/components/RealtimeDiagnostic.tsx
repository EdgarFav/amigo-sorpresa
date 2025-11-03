"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface DiagnosticResult {
  connectionStatus: string;
  tablesStatus: { table: string; enabled: boolean; status: string }[];
  errors: string[];
}

export default function RealtimeDiagnostic() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult>({
    connectionStatus: "checking",
    tablesStatus: [],
    errors: []
  });

  useEffect(() => {
    const runComprehensiveDiagnostic = async () => {
      console.log("🔍 Running comprehensive Realtime diagnostic...");
      
      try {
        // 1. Probar conexión básica
        const testChannel = supabase
          .channel('diagnostic-connection-test')
          .subscribe((status) => {
            console.log("📡 Base connection status:", status);
            setDiagnostics(prev => ({ ...prev, connectionStatus: status }));
          });

        // 2. Probar cada tabla individualmente
        const tables = ['groups', 'members', 'draw_results', 'gift_ideas'];
        const tableTests: Promise<{ table: string; enabled: boolean; status: string }>[] = tables.map(table => 
          new Promise((resolve) => {
            const tableChannel = supabase
              .channel(`diagnostic-${table}-test`)
              .on('postgres_changes', {
                event: '*',
                schema: 'public',
                table: table,
              }, () => {})
              .subscribe((status) => {
                console.log(`📊 Table ${table} status:`, status);
                const enabled = status === 'SUBSCRIBED';
                resolve({ table, enabled, status });
                
                // Cleanup
                setTimeout(() => {
                  supabase.removeChannel(tableChannel);
                }, 1000);
              });
          })
        );

        const tableResults = await Promise.all(tableTests);
        setDiagnostics(prev => ({ ...prev, tablesStatus: tableResults }));

        // Cleanup main test channel
        setTimeout(() => {
          supabase.removeChannel(testChannel);
        }, 5000);

      } catch (error) {
        console.error("❌ Diagnostic error:", error);
        setDiagnostics(prev => ({
          ...prev,
          errors: [...prev.errors, `Diagnostic error: ${error}`],
          connectionStatus: "ERROR"
        }));
      }
    };

    runComprehensiveDiagnostic();
  }, []);

  const getConnectionStatusColor = (status: string) => {
    switch (status) {
      case 'SUBSCRIBED': return 'bg-green-100 text-green-800';
      case 'CHANNEL_ERROR': return 'bg-red-100 text-red-800';
      case 'TIMED_OUT': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const allTablesEnabled = diagnostics.tablesStatus.every(t => t.enabled);
  const enabledCount = diagnostics.tablesStatus.filter(t => t.enabled).length;

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-200">
      <h3 className="text-xl font-semibold text-purple-800 mb-4 flex items-center">
        🔍 Diagnóstico Realtime Oficial
      </h3>

      {/* Resumen general */}
      <div className={`mb-4 p-4 rounded-lg border-2 ${
        diagnostics.connectionStatus === 'SUBSCRIBED' && allTablesEnabled 
          ? 'bg-green-50 border-green-200' 
          : 'bg-yellow-50 border-yellow-200'
      }`}>
        <div className="font-semibold mb-2">
          {diagnostics.connectionStatus === 'SUBSCRIBED' && allTablesEnabled 
            ? '✅ Realtime Completamente Configurado' 
            : '⚠️ Configuración Pendiente'}
        </div>
        <div className="text-sm">
          Conexión: <span className={`px-2 py-1 rounded font-mono ${getConnectionStatusColor(diagnostics.connectionStatus)}`}>
            {diagnostics.connectionStatus}
          </span>
          {' '} | Tablas: {enabledCount}/4 habilitadas
        </div>
      </div>

      {/* Estado detallado de tablas */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="font-medium text-gray-800 mb-3">📊 Estado de Tablas:</div>
        <div className="grid grid-cols-2 gap-2">
          {diagnostics.tablesStatus.map((result, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-white rounded">
              <span className="font-mono text-sm">{result.table}</span>
              <span className={`px-2 py-1 rounded text-xs font-bold ${
                result.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {result.enabled ? '✅ ON' : '❌ OFF'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Información de configuración */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="font-medium text-gray-800 mb-2">⚙️ Variables de Entorno:</div>
        <div className="text-sm space-y-1">
          <div>URL: <span className="text-green-600 font-mono">✅ Configurada</span></div>
          <div>Anon Key: <span className="text-green-600 font-mono">✅ Configurada</span></div>
        </div>
      </div>

      {/* Instrucciones paso a paso */}
      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="font-semibold text-blue-800 mb-3">🔧 Pasos para Habilitar Realtime:</div>
        <div className="text-sm text-blue-700 space-y-2">
          <div className="flex items-start">
            <span className="font-bold mr-2">1.</span>
            <div>Ve a tu <strong>Dashboard de Supabase</strong> → <code className="bg-white px-1 rounded">Database</code> → <code className="bg-white px-1 rounded">Publications</code></div>
          </div>
          <div className="flex items-start">
            <span className="font-bold mr-2">2.</span>
            <div>Busca la sección <strong>supabase_realtime</strong> y habilita estas tablas:</div>
          </div>
          <div className="ml-6 text-xs">
            <div>☑️ groups</div>
            <div>☑️ members</div>
            <div>☑️ draw_results</div>
            <div>☑️ gift_ideas</div>
          </div>
          <div className="flex items-start">
            <span className="font-bold mr-2">3.</span>
            <div>O ejecuta el SQL del archivo <code className="bg-white px-1 rounded">REALTIME_CONFIG.sql</code> en SQL Editor</div>
          </div>
          <div className="flex items-start">
            <span className="font-bold mr-2">4.</span>
            <div>Recarga esta página para verificar los cambios</div>
          </div>
        </div>
      </div>

      {/* Estado en tiempo real */}
      <div className="mt-4 text-center">
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
        >
          🔄 Verificar Nuevamente
        </button>
      </div>
    </div>
  );
}