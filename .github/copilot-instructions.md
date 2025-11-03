# Amigo Sorpresa - Next.js + Supabase Project

Este proyecto es una aplicación web para organizar sorteos de regalos entre amigos (intercambio de regalos navideños o "amigo secreto").

## Stack Tecnológico
- Next.js 14+ con TypeScript
- Supabase (Base de datos + Autenticación + Storage)
- Tailwind CSS para estilos
- React Hook Form para formularios

## Estructura de Base de Datos

### Tablas principales:
1. `groups`: Grupos de intercambio de regalos
2. `members`: Miembros de cada grupo
3. `draw_results`: Resultados de sorteos
4. `gift_ideas`: Ideas de regalos con imágenes

## Funcionalidades por Nivel

### Nivel 1 (Base): ✅ Completado
- Crear grupos anfitrión
- Agregar miembros
- Integración con Supabase

### Nivel 2 (Sorteo): 🚧 En desarrollo
- Realizar sorteo aleatorio
- Mostrar asignaciones
- Guardar resultados

### Nivel 3 (Sugerencias): 📋 Pendiente
- Subir ideas de regalo
- Gestión de imágenes
- Mostrar sugerencias al amigo secreto

### Nivel 4 (Historial): 📋 Pendiente
- Historial de sorteos
- Consulta de resultados anteriores
- Gestión de múltiples grupos

## Instrucciones de Desarrollo
- Usar TypeScript estricto
- Implementar validación de formularios
- Seguir patrones de Next.js App Router
- Mantener código limpio y comentado