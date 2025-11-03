# 🎁 Amigo Sorpresa

Una aplicación web para organizar sorteos de regalos entre amigos (intercambio de regalos navideños o "amigo secreto").

## 🚀 Características

- ✅ **Nivel 1 (Base)**: Crear grupos y agregar miembros
- ✅ **Nivel 2 (Sorteo)**: Realizar sorteos aleatorios y mostrar resultados
- ✅ **Sistema de Privacidad**: Cada participante solo ve su propia asignación
- ✅ **Acceso por Código**: Los participantes se unen con código de 6 dígitos
- ✅ **Host Participante**: El organizador puede participar en el sorteo
- ✅ **Sugerencias de Regalos**: Subir ideas de regalos con fotos
- 🚧 **Nivel 4 (Historial)**: Historial de sorteos (próximamente)

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 14 con TypeScript
- **Base de datos**: Supabase
- **Estilos**: Tailwind CSS
- **Formularios**: React Hook Form + Zod (configurado)

## 📦 Instalación

1. **Clona el repositorio** (o usa el proyecto actual)
```bash
git clone <repository-url>
cd amigo-sorpresa
```

2. **Instala las dependencias**
```bash
npm install
```

3. **Configura Supabase**
   - Crea un proyecto en [Supabase](https://supabase.com)
   - Copia tu URL y Anon Key
   - Actualiza el archivo `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

4. **Configura la base de datos**
   - Ve a tu proyecto de Supabase
   - Abre el SQL Editor
   - Ejecuta el contenido del archivo `supabase_schema.sql`

5. **Inicia el servidor de desarrollo**
```bash
npm run dev
```

## 🗄️ Estructura de la Base de Datos

### Tablas principales:

1. **`groups`**: Grupos de intercambio de regalos
   - `id`, `name`, `host_name`, `created_at`

2. **`members`**: Miembros de cada grupo
   - `id`, `group_id`, `name`, `contact`, `created_at`

3. **`draw_results`**: Resultados de sorteos
   - `id`, `group_id`, `giver_id`, `receiver_id`, `created_at`

4. **`gift_ideas`**: Ideas de regalos con imágenes (para nivel 3)
   - `id`, `member_id`, `group_id`, `title`, `image_url`, `created_at`

## 🎯 Cómo usar la aplicación

### Para Organizadores:

1. **Crear un grupo**
   - Ve a la página principal
   - Haz clic en "Crear Nuevo Grupo"
   - Ingresa el nombre del grupo y tu nombre
   - Marca si quieres participar en el intercambio
   - Recibirás un código de acceso de 6 dígitos

2. **Invitar participantes**
   - Comparte el código de acceso con todos los participantes
   - Los miembros aparecerán automáticamente cuando se unan
   - La lista se actualiza en tiempo real

3. **Realizar el sorteo**
   - Necesitas al menos 3 miembros para el sorteo
   - Solo el organizador puede iniciar el sorteo
   - **Si participas:** Solo verás tu propia asignación
   - **Si no participas:** Verás todas las asignaciones (para resolver dudas)

### Para Participantes:

1. **Unirse a un grupo**
   - Ve a la página principal
   - Haz clic en "Unirse con Código"
   - Ingresa el código de 6 dígitos del organizador
   - Proporciona tu nombre y contacto

2. **Ver tu asignación**
   - Una vez realizado el sorteo, verás únicamente tu asignación
   - La información se mantiene privada para cada participante
   - ¡Solo tú sabes a quién le debes regalar!

## 🚧 Funcionalidades en desarrollo

### Nivel 3 - Sugerencias de regalos
- Cada miembro podrá subir hasta 3 ideas de regalo
- Incluirá fotos usando Supabase Storage
- Solo el "amigo secreto" verá las sugerencias

### Nivel 4 - Historial
- Guardar y consultar sorteos anteriores
- Historial de grupos y resultados
- Gestión de múltiples grupos por usuario

## 📁 Estructura del proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── globals.css         # Estilos globales con Tailwind
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx           # Página de inicio
│   └── group/
│       └── page.tsx       # Página de administración de grupo
├── components/            # Componentes reutilizables
│   ├── CreateGroupForm.tsx # Formulario para crear grupos
│   ├── MemberList.tsx     # Lista y gestión de miembros
│   ├── DrawButton.tsx     # Botón y lógica del sorteo
│   └── DrawResults.tsx    # Mostrar resultados del sorteo
└── lib/
    └── supabase.ts        # Cliente de Supabase y tipos
```

## 🔐 Sistema de Privacidad

### Autenticación básica:
- Cada usuario tiene una sesión local (localStorage)
- Los organizadores ven todos los resultados
- Los participantes solo ven su propia asignación
- Sistema de códigos de acceso de 6 dígitos

### Roles de usuario:
- **Organizador No Participante**: Puede crear el grupo, realizar sorteo, ver todos los resultados (para administrar)
- **Organizador Participante**: Puede crear el grupo, realizar sorteo, pero solo ve su propia asignación
- **Participante**: Puede unirse con código, ver solo su asignación individual

## 🎨 Algoritmo del sorteo

El algoritmo garantiza que:
- Nadie se regale a sí mismo
- Cada persona reciba exactamente un regalo
- Cada persona regale exactamente un regalo
- La asignación sea completamente aleatoria
- Los resultados se almacenan en la base de datos

## 🐛 Solución de problemas

### Error de Supabase URL
Si ves errores relacionados con Supabase URL:
1. Verifica que las variables en `.env.local` estén correctas
2. Asegúrate de que tu proyecto de Supabase esté activo
3. Revisa que hayas ejecutado el SQL schema

### Errores de compilación
- Ejecuta `npm run build` para verificar errores
- Los warnings de ESLint son normales y no afectan la funcionalidad

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu característica (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ve el archivo [LICENSE](LICENSE) para más detalles.

---

¡Disfruta organizando tus intercambios de regalos! 🎉
