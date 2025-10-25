# 📅 Sistema de Calendario con Barras Dinámicas

## 🎯 Descripción General

Este es un sistema de calendario avanzado que permite crear barras continuas mediante arrastrar y soltar (drag & drop) en una tabla de habitaciones y fechas. El sistema incluye funcionalidades de scroll horizontal, navegación por fechas, y gestión de reservas visuales.

## 🏗️ Arquitectura del Proyecto

### Estructura de Componentes

```
src/
├── App.tsx                          # Componente raíz con MantineProvider
├── Components/
│   ├── YearlyScrollableCalendar.tsx # Componente principal del calendario
│   ├── CalendarTable/
│   │   └── CalendarTable.tsx        # Tabla principal del calendario
│   ├── CalendarHeader/
│   │   ├── CalendarTitle.tsx        # Título con mes/año visible
│   │   ├── CalendarControls.tsx     # Controles de navegación
│   │   └── MonthSelect.tsx          # Selector de mes
│   ├── DaysCalendar.tsx             # Celda individual del calendario
│   ├── BarSegment.tsx               # Segmento de barra individual
│   └── DayHeaderCell.tsx            # Encabezado de día
├── hooks/
│   ├── useCalendarScroll.ts         # Hook para scroll horizontal
│   └── useBarStyles.ts              # Hook para gestión de barras
└── utils/
    └── calendarHelpers.ts           # Utilidades de calendario
```

## 🔧 Componentes Principales

### 1. **YearlyScrollableCalendar** - Componente Principal

**Propósito**: Orquesta todo el calendario y maneja el estado global.

**Funcionalidades**:
- Genera 2 años de días (desde el año actual)
- Maneja el scroll horizontal con `useCalendarScroll`
- Coordina el encabezado y la tabla
- Gestiona la navegación por fechas

**Props**: Ninguna (componente raíz)

**Estado Interno**:
```typescript
const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
const [selectedDay, setSelectedDay] = useState(today.getDate());
```

### 2. **CalendarTable** - Tabla Principal

**Propósito**: Renderiza la tabla del calendario con habitaciones y días.

**Funcionalidades**:
- Renderiza filas de habitaciones
- Integra el hook `useBarStyles` para gestión de barras
- Maneja eventos de mouse para crear barras
- Aplica estilos condicionales a las celdas

**Props**:
```typescript
interface CalendarTableProps {
  containerRef: RefObject<HTMLDivElement | null>;
  allDays: CalendarDay[];
  today: Date;
  rooms?: string[];
}
```

### 3. **DaysCalendar** - Celda Individual

**Propósito**: Representa una celda individual del calendario.

**Funcionalidades**:
- Maneja eventos de mouse (down, enter, up)
- Renderiza `BarSegment` cuando hay una barra
- Aplica clases CSS condicionales

**Props**:
```typescript
interface DaysCalendarProps {
  rowIndex: number;
  dayIndex: number;
  cellClasses: string;
  barInfo: {
    position: 'head' | 'body' | 'tail' | 'single';
    isActive: boolean;
  } | null;
  onMouseDown: (rowIndex: number, dayIndex: number) => void;
  onMouseEnter: (rowIndex: number, dayIndex: number) => void;
  onMouseUp: () => void;
}
```

### 4. **BarSegment** - Segmento de Barra

**Propósito**: Componente visual para cada segmento de una barra continua.

**Funcionalidades**:
- Renderiza con estilos redondeados según posición
- Maneja eventos de mouse
- Aplica colores diferentes para barras activas vs creadas

**Props**:
```typescript
interface BarSegmentProps {
  roomIndex: number;
  dayIndex: number;
  isActive: boolean;
  position: 'head' | 'body' | 'tail' | 'single';
  onMouseDown: (roomIndex: number, dayIndex: number) => void;
  onMouseEnter: (roomIndex: number, dayIndex: number) => void;
  onMouseUp: () => void;
}
```

## 🎣 Hooks Personalizados

### 1. **useCalendarScroll** - Gestión de Scroll

**Propósito**: Maneja el scroll horizontal y sincroniza el mes/año visible.

**Funcionalidades**:
- Detecta el mes visible basado en la posición del scroll
- Proporciona funciones para navegar a fechas específicas
- Throttling con `requestAnimationFrame` para rendimiento
- Auto-scroll al día actual al inicializar

**Retorna**:
```typescript
{
  containerRef,
  visibleMonth,
  visibleYear,
  setVisibleMonth,
  setVisibleYear,
  scrollToToday,
  scrollToDate
}
```

### 2. **useBarStyles** - Gestión de Barras

**Propósito**: Maneja toda la lógica de creación, visualización y validación de barras.

**Funcionalidades**:
- **Creación de barras**: Drag & drop para crear barras continuas
- **Validación**: Previene fechas pasadas y celdas ocupadas
- **Posicionamiento**: Determina si una celda es 'head', 'body', 'tail' o 'single'
- **Estilos**: Aplica clases CSS condicionales
- **Bloqueo**: Previene modificación de barras existentes

**Estado**:
```typescript
const [bars, setBars] = useState<Bar[]>([]);
const [selection, setSelection] = useState<{
  active: boolean;
  room: number | null;
  start: number | null;
  end: number | null;
}>({ active: false, room: null, start: null, end: null });
```

**Funciones Principales**:
- `startSelection()`: Inicia una nueva selección
- `updateSelection()`: Actualiza la selección durante el arrastre
- `endSelection()`: Finaliza la selección y crea la barra
- `getBarPosition()`: Determina la posición de una celda en la barra
- `getCellClasses()`: Aplica estilos CSS condicionales

## 🎨 Sistema de Estilos

### Clases CSS Principales

**Celdas Normales**:
```css
.relative.h-12.select-none.overflow-hidden.border.border-gray-100.hover:bg-slate-50.transition-colors.duration-150.cursor-crosshair
```

**Celdas con Barras**:
```css
.bg-emerald-50.border-t.border-b.border-emerald-200.cursor-not-allowed
```

**Celdas Bloqueadas**:
```css
.border.border-gray-100.bg-gray-100.cursor-not-allowed
```

**Celdas de Fechas Pasadas**:
```css
.border.border-gray-100.bg-gray-200.cursor-not-allowed
```

### Barras Visuales

**BarSegment Activo (durante creación)**:
```css
.absolute.top-2.bottom-2.z-10.cursor-crosshair.bg-blue-500
```

**BarSegment Creado**:
```css
.absolute.top-2.bottom-2.z-10.cursor-crosshair.bg-emerald-500
```

**Posiciones de Barras**:
- `head`: `left-2.right-0.rounded-l-full` (cabeza izquierda)
- `tail`: `left-0.right-2.rounded-r-full` (cola derecha)
- `single`: `left-2.right-2.rounded-full` (barra única)
- `body`: `left-0.right-0.rounded-none` (cuerpo central)

## 🔄 Flujo de Funcionamiento

### 1. **Inicialización**
1. `App.tsx` renderiza `YearlyScrollableCalendar`
2. Se generan 2 años de días con `generateAllDays()`
3. Se inicializa el scroll al día actual
4. Se configuran los controles de navegación

### 2. **Creación de Barras**
1. **Mouse Down**: `startSelection()` verifica si la celda es válida
2. **Mouse Enter**: `updateSelection()` actualiza la selección
3. **Mouse Up**: `endSelection()` crea la barra y la guarda en el estado

### 3. **Validaciones**
- **Fechas Pasadas**: No se pueden seleccionar
- **Celdas Ocupadas**: No se pueden modificar barras existentes
- **Rangos Válidos**: Solo fechas futuras y disponibles

### 4. **Renderizado Visual**
1. `getCellClasses()` determina el estilo de cada celda
2. `getBarInfo()` determina si hay una barra y su posición
3. `BarSegment` se renderiza con los estilos apropiados

## 🛠️ Utilidades

### **calendarHelpers.ts**

**generateAllDays()**: Genera un array plano con todos los días de 2 años
```typescript
export const generateAllDays = (startYear: number): CalendarDay[] => {
  return Array.from({ length: 2 }, (_, yearOffset) => {
    const y = startYear + yearOffset;
    return Array.from({ length: 12 }, (_, month) => {
      const daysInMonth = new Date(y, month + 1, 0).getDate();
      return Array.from({ length: daysInMonth }, (_, dayIndex) => {
        const day = dayIndex + 1;
        const date = new Date(y, month, day);
        const weekday = date.toLocaleDateString("es-ES", { weekday: "short" });
        return { day, weekday, month, monthName: months[month], year: y };
      });
    }).flat();
  }).flat();
};
```

## 🎯 Características Principales

### ✅ **Funcionalidades Implementadas**

1. **Scroll Horizontal**: Navegación fluida por 2 años de fechas
2. **Barras Dinámicas**: Creación mediante drag & drop
3. **Validaciones**: Fechas pasadas y celdas ocupadas bloqueadas
4. **Navegación**: Botón "Hoy" y selectores de fecha
5. **Responsive**: Adaptable a diferentes tamaños de pantalla
6. **Performance**: Throttling y memoización para rendimiento

### 🎨 **Diseño Visual**

1. **Barras Continuas**: Sin separaciones entre celdas
2. **Colores Distintivos**: Azul para selección activa, verde para barras creadas
3. **Bordes Redondeados**: Diseño elegante con esquinas redondeadas
4. **Estados Visuales**: Diferentes estilos para cada estado de celda
5. **Transiciones**: Animaciones suaves para mejor UX

### 🔧 **Arquitectura Técnica**

1. **Hooks Personalizados**: Lógica reutilizable y separada
2. **Componentes Memoizados**: Optimización de re-renders
3. **TypeScript**: Tipado fuerte para mejor mantenibilidad
4. **Event Handling**: Gestión eficiente de eventos de mouse
5. **State Management**: Estado local optimizado

## 🚀 Uso del Sistema

### **Crear una Barra**
1. Haz clic y arrastra desde una celda válida
2. La barra se muestra en azul durante la selección
3. Suelta el mouse para crear la barra (se vuelve verde)
4. La barra bloquea las celdas ocupadas

### **Navegar por Fechas**
1. Usa el botón "Hoy" para ir al día actual
2. Selecciona mes y día en los controles
3. Haz clic en "Ir" para navegar a esa fecha
4. El scroll se actualiza automáticamente

### **Restricciones**
- No se pueden crear barras en fechas pasadas
- No se pueden modificar barras existentes
- Las celdas ocupadas se muestran con fondo gris

## 📝 Notas Técnicas

- **Performance**: Usa `requestAnimationFrame` para throttling del scroll
- **Memoria**: Las barras se almacenan en estado local del componente
- **Accesibilidad**: Incluye `aria-label` en controles importantes
- **Responsive**: Diseño adaptable con clases de Tailwind CSS
- **Mantenibilidad**: Código bien documentado y tipado con TypeScript

Este sistema proporciona una interfaz intuitiva y eficiente para la gestión visual de reservas en un calendario de habitaciones.
