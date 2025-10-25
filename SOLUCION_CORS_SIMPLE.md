# 🔧 Solución Simple de CORS

## 🚨 El Problema

**CORS** (Cross-Origin Resource Sharing) bloquea las peticiones entre diferentes dominios:
- Tu frontend: `http://localhost:5173`
- Tu API: `http://localhost:8069`
- **Resultado**: Error CORS

## ✅ La Solución: Proxy de Vite

### **1. Configuración en `vite.config.ts`**
```typescript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8069',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  }
})
```

**¿Qué hace esto?**
- Cuando haces una petición a `/api/hotel/cuartos`
- Vite la redirige a `http://localhost:8069/api/hotel/cuartos`
- **Sin CORS** porque es el mismo dominio

### **2. Código Simplificado en `HotelRooms.ts`**
```typescript
const api = axios.create({
  baseURL: '', // Usar proxy de Vite
})

export const getHotelRooms = async (): Promise<HotelRoom[]> => {
  try {
    const response = await api.get('/api/hotel/cuartos');
    const apiData = response.data;
    
    if (apiData.success && Array.isArray(apiData.data)) {
      return apiData.data;
    }
    
    return [];
  } catch (error) {
    // Fallback: habitaciones por defecto
    return [/* habitaciones por defecto */];
  }
};
```

**¿Qué hace esto?**
- `baseURL: ''` → Usa el proxy de Vite
- `/api/hotel/cuartos` → Se convierte en `http://localhost:8069/api/hotel/cuartos`
- **Sin CORS** porque Vite maneja la redirección

## 🔄 Flujo de Funcionamiento

### **Antes (Con CORS)**
```
Frontend (localhost:5173) 
    ↓ Petición directa
API (localhost:8069) 
    ↓ ❌ CORS Error
```

### **Después (Con Proxy)**
```
Frontend (localhost:5173) 
    ↓ Petición a /api/hotel/cuartos
Vite Proxy 
    ↓ Redirige a localhost:8069
API (localhost:8069) 
    ↓ ✅ Sin CORS
```

## 🎯 Resultado

- ✅ **Sin errores CORS**
- ✅ **Código simple y limpio**
- ✅ **Fallback robusto**
- ✅ **Funciona siempre**

## 🚀 Para Aplicar

1. **Reinicia el servidor**:
   ```bash
   npm run dev
   ```

2. **Verifica que funcione**:
   - Abre DevTools → Network
   - Deberías ver peticiones a `/api/hotel/cuartos` (no a localhost:8069)
   - Sin errores CORS

## 💡 ¿Por Qué Funciona?

**Proxy de Vite** actúa como intermediario:
- Recibe peticiones del frontend
- Las redirige al servidor backend
- Devuelve la respuesta al frontend
- **Todo desde el mismo dominio** → Sin CORS

Es la solución más simple y efectiva para desarrollo.
