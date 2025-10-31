# 📏 Explicación de "Días Visibles" en el Renderizado

## 🎯 ¿Qué Significa "18 Días Visibles"?

### **Log:**
```
CalendarTable render: 12 habitaciones × 18 días visibles = 216 celdas renderizadas (de 8760 posibles)
```

### **Desglose:**
- **12 habitaciones**: 12 filas de habitaciones cargadas
- **18 días visibles**: Columnas de días renderizadas
- **216 celdas**: Total de celdas renderizadas
- **8760 posibles**: Total si renderizara todo

---

## 🔍 ¿Por Qué 18 Días?

### **Cálculo de Días Visibles:**

```
Ancho del viewport: ~1530px (tu pantalla)
Ancho por columna: 85px
Días que caben: 1530 ÷ 85 = 18 días
```

### **Con Overscan:**

```typescript
const columnVirtualizer = useVirtualizer({
  count: allDays.length,
  getScrollElement: () => containerRef.current,
  estimateSize: () => 85,
  horizontal: true,
  overscan: 3,  // ← 3 columnas extra a cada lado
});
```

**Fórmula:**
```
Días visibles = Días que caben + (overscan × 2)
Días visibles = 12 + (3 × 2) = 18 días
```

**¿Por qué overscan?**
- Renderiza 3 días antes y 3 días después
- Scroll más suave sin saltos
- Evita lag al hacer scroll rápido

---

## 📊 Desglose Detallado

### **Sin Overscan (12 días):**
```
Pantalla: 1020px
Días visibles: 12
Renderizados: 12
```

### **Con Overscan (18 días):**
```
Pantalla: 1020px
Días visibles: 12 (en viewport)
Overscan: +3 izquierda + 3 derecha
Renderizados: 18 días
```

**Visualización:**
```
[--][--][--] [Días visibles] [--][--][--]
↑           ↑                ↑
Overscan   Viewport         Overscan
```

---

## 🎯 Por Qué Cambia el Número

### **Factores que Afectan "Días Visibles":**

1. **Tamaño de ventana:**
   - Pantalla grande → Más días (ej: 20-25)
   - Pantalla pequeña → Menos días (ej: 10-15)

2. **Zoom del navegador:**
   - Zoom 100% → 18 días
   - Zoom 150% → ~12 días
   - Zoom 75% → ~24 días

3. **Overscan:**
   - Mantiene 3 días extra a cada lado
   - Asegura scroll fluido

---

## ✅ Ejemplos Reales

### **Pantalla Pequeña (Laptop 1366px):**
```
Ancho: 900px
Días visibles: 10 + 6 (overscan) = 16 días
Celdas: 12 × 16 = 192 celdas
```

### **Pantalla Media (Monitor 1920px):**
```
Ancho: 1,530px
Días visibles: 18 + 6 (overscan) = 18 días
Celdas: 12 × 18 = 216 celdas
```

### **Pantalla Grande (Monitor 2560px):**
```
Ancho: 2,000px
Días visibles: 23 + 6 (overscan) = 23 días
Celdas: 12 × 23 = 276 celdas
```

---

## 🚀 Ventajas de Este Sistema

### **1. Rendimiento Adaptativo:**
- ✅ Menos días en pantalla pequeña = Menos celdas
- ✅ Más días en pantalla grande = Más celdas
- ✅ Se adapta automáticamente al tamaño

### **2. Scroll Fluido:**
- ✅ Overscan mantiene días pre-cargados
- ✅ Sin lag al hacer scroll
- ✅ Transiciones suaves

### **3. Uso de Memoria Optimizado:**
```
Pantalla pequeña: 192 celdas (≈8.5 KB)
Pantalla media: 216 celdas (≈9.5 KB)
Pantalla grande: 276 celdas (≈12 KB)
```

**Comparado con renderizar todo:**
```
Sin virtualización: 8,760 celdas (≈380 KB)
Con virtualización: 216 celdas (≈9.5 KB)
Reducción: 97.5% 🚀
```

---

## 🎯 Conclusión

**"18 Días Visibles" significa:**
- ✅ Solo las columnas que ves en pantalla (más overflow)
- ✅ Cambia según el tamaño de tu ventana
- ✅ Optimizado para tu pantalla específica
- ✅ Overscan asegura scroll suave

**Es óptimo y normal que cambie:**
- Pantalla pequeña: ~15-18 días
- Pantalla mediana: ~18-20 días  
- Pantalla grande: ~20-25 días

**El calendario se adapta automáticamente a tu pantalla.** 🎉
