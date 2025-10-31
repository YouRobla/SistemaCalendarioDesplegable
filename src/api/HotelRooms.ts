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
  product_variant_count: number;
}

export const getHotelRooms = async (): Promise<HotelRoom[]> => {
  try {
    const response = await api.get('/api/hotel/cuartos');
    const apiData = response.data;
    
    // 📊 Log de la respuesta completa del backend
    console.log('📥 Respuesta del backend (hotel/cuartos):', {
      fullResponse: response.data,
      success: apiData.success,
      dataType: Array.isArray(apiData.data) ? 'array' : typeof apiData.data,
      dataLength: Array.isArray(apiData.data) ? apiData.data.length : 'N/A',
      rawData: apiData.data
    });
    
    if (apiData.success && Array.isArray(apiData.data)) {
      console.log(`✅ Habitaciones recibidas del backend: ${apiData.data.length} habitaciones`);
      return apiData.data;
    }
    
    console.warn('⚠️ La respuesta del backend no tiene el formato esperado:', apiData);
    return [];
  } catch (error) {
    console.error('❌ Error fetching hotel rooms:', error);
    return [];
  }
};