# Testing Documentation

Este proyecto utiliza Jest para realizar pruebas automatizadas.

## Ejecutar Pruebas

### Ejecutar todas las pruebas
```bash
npm test
```

### Ejecutar pruebas en modo watch (para desarrollo)
```bash
npm run test:watch
```

### Ejecutar pruebas con reporte de cobertura
```bash
npm run test:coverage
```

## Estructura de Pruebas

Las pruebas se organizan en directorios `__tests__` junto a los archivos que prueban:

```
src/
├── lib/
│   ├── __tests__/
│   │   ├── auth.test.ts
│   │   └── AuthService.test.ts
│   ├── auth.ts
│   └── supabase.ts
└── components/
    ├── __tests__/
    │   └── WelcomeMessage.test.tsx
    └── WelcomeMessage.tsx
```

## Tecnologías de Testing

- **Jest**: Framework de testing
- **@testing-library/react**: Para probar componentes React
- **@testing-library/jest-dom**: Matchers adicionales para Jest
- **@testing-library/user-event**: Para simular interacciones del usuario
- **jest-environment-jsdom**: Entorno DOM para pruebas

## Escribir Nuevas Pruebas

### Pruebas de Utilidades/Funciones
```typescript
import { generateAccessCode } from '../auth'

describe('generateAccessCode', () => {
  it('should generate a 6 character code', () => {
    const code = generateAccessCode()
    expect(code).toHaveLength(6)
  })
})
```

### Pruebas de Componentes React
```typescript
import { render, screen } from '@testing-library/react'
import MyComponent from '../MyComponent'

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />)
    expect(screen.getByText('Some text')).toBeInTheDocument()
  })
})
```

## Configuración

- `jest.config.ts`: Configuración principal de Jest
- `jest.setup.ts`: Configuración que se ejecuta antes de cada suite de pruebas
- `.gitignore`: Excluye `coverage/` y `.jest-cache/` del control de versiones

## Reporte de Cobertura

Los reportes de cobertura se generan en el directorio `coverage/` al ejecutar `npm run test:coverage`.

Para ver el reporte HTML detallado:
```bash
open coverage/lcov-report/index.html
```
