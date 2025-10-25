# 🔧 Solución de Problemas CORS y API

## 🚨 Problemas Identificados

1. **Error CORS**: `Access-Control-Allow-Origin` header missing
2. **Error 404**: Endpoint no encontrado
3. **Warning React**: Falta prop `key` en mapeo

## ✅ Soluciones Implementadas

### 1. **Proxy de Vite** (Solución Inmediata)

He configurado un proxy en `vite.config.ts` que evita el problema de CORS:

```typescript
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
```

**Beneficios**:
- ✅ Evita CORS completamente
- ✅ Funciona inmediatamente
- ✅ No requiere cambios en el servidor

### 2. **Múltiples Endpoints** (Robustez)

La API ahora prueba varios endpoints:
- `/api/hotel/cuartos` (proxy)
- `/api/hotel/rooms`
- `/api/cuartos`
- `/api/rooms`
- URLs directas como fallback

### 3. **Fallback de Datos** (Experiencia de Usuario)

Si la API falla, se muestran habitaciones por defecto:
```typescript
const defaultRooms = [
  { id: 1, name: "Habitación 1", type: "Standard", capacity: 2, price: 100, status: "available" },
  // ... más habitaciones
];
```

## 🔧 Configuración del Servidor (Opcional)

Si quieres configurar CORS en tu servidor, aquí tienes ejemplos:

### **Express.js**
```javascript
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### **FastAPI (Python)**
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### **Django (Python)**
```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
]

CORS_ALLOW_CREDENTIALS = True
```

## 🚀 Pasos para Solucionar

### **Paso 1: Reiniciar el Servidor de Desarrollo**
```bash
# Detener el servidor actual (Ctrl+C)
# Luego reiniciar
npm run dev
```

### **Paso 2: Verificar que tu API esté funcionando**
```bash
# Probar directamente en el navegador
curl http://localhost:8069/api/hotel/cuartos

# O en el navegador
http://localhost:8069/api/hotel/cuartos
```

### **Paso 3: Verificar la Consola**
Abre DevTools → Console y verás logs como:
```
🔄 Intentando conectar con API...
🔗 Probando endpoint: /api/hotel/cuartos
📊 Respuesta del endpoint: 200
✅ Datos recibidos: [...]
```

## 🔍 Debugging

### **Verificar Endpoints**
```bash
# Probar diferentes endpoints
curl http://localhost:8069/api/hotel/cuartos
curl http://localhost:8069/api/hotel/rooms
curl http://localhost:8069/api/cuartos
curl http://localhost:8069/api/rooms
```

### **Verificar CORS**
```bash
# Verificar headers CORS
curl -H "Origin: http://localhost:5173" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     http://localhost:8069/api/hotel/cuartos
```

## 📊 Estructura de Respuesta Esperada

Tu API debe devolver algo como:

```json
[
  {
    "id": 1,
    "name": "Habitación 101",
    "type": "Standard",
    "capacity": 2,
    "price": 100,
    "status": "available"
  }
]
```

O con wrapper:
```json
{
  "data": [
    {
      "id": 1,
      "name": "Habitación 101",
      "type": "Standard",
      "capacity": 2,
      "price": 100,
      "status": "available"
    }
  ]
}
```

## 🎯 Resultado Esperado

Después de implementar estas soluciones:

1. ✅ **No más errores CORS**
2. ✅ **No más warnings de React**
3. ✅ **Calendario funciona con datos reales o fallback**
4. ✅ **Logs informativos en consola**
5. ✅ **Experiencia de usuario fluida**

## 🆘 Si Aún Hay Problemas

1. **Verificar que tu servidor esté corriendo en puerto 8069**
2. **Verificar que el endpoint `/api/hotel/cuartos` exista**
3. **Revisar la consola del navegador para logs detallados**
4. **Probar endpoints manualmente con curl o Postman**

¿Tu servidor está corriendo? ¿Qué framework estás usando para el backend?
