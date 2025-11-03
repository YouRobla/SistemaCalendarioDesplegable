import axios from 'axios'

const api = axios.create({
  baseURL: '', // Usar proxy de Vite
})

export interface HotelRoom {
  id: number;
  name: string;
  list_price: number;
  max_adult: number;
  max_child: number;
  max_infants: number;
  base_occupancy: number;
  hotel_id: [number, string];
  service_ids: number[];
  facility_ids: number[];
  product_variant_count?: number; // Opcional para compatibilidad
}

export interface HotelRoomsResponse {
  success: boolean;
  hotel_id: number;
  hotel_name: string;
  count: number;
  data: HotelRoom[];
}

export const getHotelRooms = async (hotelId: number | null): Promise<HotelRoom[]> => {
  try {
    // Si no hay hotel seleccionado, retornar array vacío
    if (!hotelId) {
      console.log('ℹ️ No hay hotel seleccionado, retornando array vacío');
      return [];
    }

    console.log(`🔄 Iniciando petición para obtener habitaciones del hotel ID: ${hotelId}`);
    console.log(`📡 Endpoint: /api/hotel/hoteles/${hotelId}/cuartos`);

    const response = await api.get<HotelRoomsResponse>(`/api/hotel/hoteles/${hotelId}/cuartos`);
    const apiData = response.data;
    
    console.log('📥 Respuesta completa del servidor:', {
      success: apiData.success,
      hotel_id: (apiData as any).hotel_id,
      hotel_name: (apiData as any).hotel_name,
      count: (apiData as any).count,
      dataLength: Array.isArray((apiData as any).data) ? (apiData as any).data.length : 'No es array',
      fullResponse: apiData
    });
    
    // Validar el formato esperado
    if (apiData.success && Array.isArray(apiData.data)) {
      console.log(`✅ ${apiData.count} habitaciones cargadas exitosamente para ${apiData.hotel_name}`);
      console.log(`📋 Lista de habitaciones recibidas:`, apiData.data.map(room => ({
        id: room.id,
        name: room.name,
        list_price: room.list_price,
        max_adult: room.max_adult,
        max_child: room.max_child
      })));
      return apiData.data;
    }
    
    // Formato alternativo: array directo
    if (Array.isArray(apiData)) {
      console.log(`✅ ${apiData.length} habitaciones cargadas (formato array directo)`);
      console.log(`📋 Lista de habitaciones:`, apiData.map(room => ({
        id: room.id,
        name: room.name
      })));
      return apiData;
    }
    
    // Formato alternativo: objeto con data
    if (apiData.data && Array.isArray(apiData.data)) {
      console.log(`✅ ${apiData.data.length} habitaciones cargadas (formato objeto.data)`);
      console.log(`📋 Lista de habitaciones:`, apiData.data.map(room => ({
        id: room.id,
        name: room.name
      })));
      return apiData.data;
    }
    
    console.warn('⚠️ La respuesta del backend no tiene el formato esperado:', apiData);
    console.warn('⚠️ Estructura recibida:', {
      hasSuccess: 'success' in apiData,
      hasData: 'data' in apiData,
      isArray: Array.isArray(apiData),
      keys: Object.keys(apiData as any)
    });
    return [];
  } catch (error) {
    console.error('❌ Error fetching hotel rooms:', error);
    if (error instanceof Error) {
      console.error('❌ Mensaje de error:', error.message);
      console.error('❌ Stack:', error.stack);
    }
    return [];
  }
};