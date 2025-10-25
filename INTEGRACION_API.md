# 🔌 Integración con API del Hotel

## 📡 Endpoint de Habitaciones

**URL**: `http://localhost:8069/api/hotel/cuartos`

### Estructura Esperada de la API

La API debe devolver un array de objetos con la siguiente estructura:

```typescript
interface HotelRoom {
  id: number;
  name: string;
  type: string;
  capacity: number;
  price: number;
  status: 'available' | 'occupied' | 'maintenance';
}
```

### Ejemplo de Respuesta Esperada

```json
[
  {
    "id": 1,
    "name": "Habitación 101",
    "type": "Standard",
    "capacity": 2,
    "price": 100,
    "status": "available"
  },
  {
    "id": 2,
    "name": "Suite 201",
    "type": "Deluxe",
    "capacity": 4,
    "price": 200,
    "status": "available"
  }
]
```

## 🛠️ Implementación

### 1. **Archivo de API** (`src/api/hotelApi.ts`)

```typescript
export const getHotelRooms = async (): Promise<HotelRoom[]> => {
  try {
    const response = await fetch('http://localhost:8069/api/hotel/cuartos');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Manejo flexible de diferentes estructuras de respuesta
    if (Array.isArray(data)) {
      return data;
    }
    
    if (data.rooms && Array.isArray(data.rooms)) {
      return data.rooms;
    }
    
    if (data.data && Array.isArray(data.data)) {
      return data.data;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching hotel rooms:', error);
    // Fallback a habitaciones por defecto
    return [/* habitaciones por defecto */];
  }
};
```

### 2. **Integración en el Componente**

```typescript
const { data: HotelRooms, isLoading, isError } = useQuery({
  queryKey: ['HotelRooms'],
  queryFn: getHotelRooms,
});

// Convertir a formato de strings para el calendario
const roomNames = HotelRooms?.map(room => room.name) || [];
```

### 3. **Estados de Carga**

**Loading State**:
```jsx
if (isLoading) {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      <p>Cargando habitaciones...</p>
    </div>
  );
}
```

**Error State**:
```jsx
if (isError) {
  return (
    <div className="text-center">
      <div className="text-red-500 text-6xl">⚠️</div>
      <h2>Error al cargar habitaciones</h2>
      <button onClick={() => window.location.reload()}>
        Reintentar
      </button>
    </div>
  );
}
```

## 🔄 Flujo de Datos

1. **Inicialización**: El componente se monta
2. **Query**: React Query ejecuta `getHotelRooms()`
3. **Fetch**: Se hace la petición a `http://localhost:8069/api/hotel/cuartos`
4. **Procesamiento**: Se convierte la respuesta a formato esperado
5. **Renderizado**: Se muestran las habitaciones en el calendario

## 🛡️ Manejo de Errores

### Errores de Red
- **Timeout**: La query se reintenta automáticamente (3 veces)
- **CORS**: Verificar configuración del servidor
- **404/500**: Se muestran habitaciones por defecto

### Fallback de Datos
Si la API falla, se usan habitaciones por defecto:
```typescript
const defaultRooms = [
  { id: 1, name: "Habitación 1", type: "Standard", capacity: 2, price: 100, status: "available" },
  { id: 2, name: "Habitación 2", type: "Standard", capacity: 2, price: 100, status: "available" },
  // ... más habitaciones
];
```

## ⚡ Optimizaciones

### React Query Configuration
```typescript
const { data: HotelRooms, isLoading, isError } = useQuery({
  queryKey: ['HotelRooms'],
  queryFn: getHotelRooms,
  staleTime: 5 * 60 * 1000, // 5 minutos
  retry: 3,
  refetchOnWindowFocus: false,
});
```

### Caching
- **staleTime**: 5 minutos (los datos se consideran frescos)
- **retry**: 3 intentos automáticos en caso de error
- **refetchOnWindowFocus**: No recargar al cambiar de ventana

## 🔧 Configuración del Servidor

### CORS
Asegúrate de que tu servidor permita requests desde `localhost:5173`:

```javascript
// Ejemplo para Express.js
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
```

### Headers
```javascript
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});
```

## 📊 Monitoreo y Debugging

### Console Logs
```typescript
export const getHotelRooms = async (): Promise<HotelRoom[]> => {
  console.log('🔄 Fetching hotel rooms from API...');
  
  try {
    const response = await fetch('http://localhost:8069/api/hotel/cuartos');
    console.log('✅ API Response:', response.status);
    
    const data = await response.json();
    console.log('📦 Data received:', data);
    
    return data;
  } catch (error) {
    console.error('❌ API Error:', error);
    throw error;
  }
};
```

### Network Tab
- Verificar que la petición se haga correctamente
- Revisar el status code (200, 404, 500, etc.)
- Comprobar la estructura de la respuesta

## 🚀 Próximos Pasos

1. **Reservas**: Integrar endpoint para crear reservas
2. **Sincronización**: Actualizar calendario cuando se crean reservas
3. **Filtros**: Filtrar habitaciones por tipo o estado
4. **Paginación**: Manejar grandes cantidades de habitaciones
5. **Real-time**: WebSockets para actualizaciones en tiempo real

## 🔍 Testing

### Test de la API
```bash
# Verificar que el endpoint responde
curl http://localhost:8069/api/hotel/cuartos

# Verificar estructura de respuesta
curl http://localhost:8069/api/hotel/cuartos | jq
```

### Test en el Navegador
1. Abrir DevTools → Network
2. Recargar la página
3. Verificar que se haga la petición a `/api/hotel/cuartos`
4. Revisar la respuesta en la pestaña Response
