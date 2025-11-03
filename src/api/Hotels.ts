import axios from 'axios'

const api = axios.create({
  baseURL: '', // Usar proxy de Vite
})

export interface Hotel {
  id: number;
  name: string;
  partner_id: [number, string];
  address: string;
  tagline: string;
  image: boolean | string;
  banner: boolean | string;
  policies: string;
  hotel_type_id: [number, string];
  company_id: [number, string];
  description: string;
  is_published: boolean;
}

export interface HotelsResponse {
  success: boolean;
  count: number;
  data: Hotel[];
}

export const getHotels = async (): Promise<Hotel[]> => {
  try {
    const response = await api.get<HotelsResponse>('/api/hotel/hoteles');
    const apiData = response.data;
    
    // Validar que la respuesta tenga el formato esperado
    if (apiData.success && Array.isArray(apiData.data)) {
      console.log(`✅ Total de hoteles cargados: ${apiData.count}`);
      return apiData.data;
    }
    
    // Si la respuesta es un array directamente (formato alternativo)
    if (Array.isArray(apiData)) {
      console.log(`✅ Total de hoteles cargados: ${apiData.length}`);
      return apiData;
    }
    
    console.warn('⚠️ La respuesta del backend no tiene el formato esperado:', apiData);
    return [];
  } catch (error) {
    console.error('❌ Error fetching hotels:', error);
    return [];
  }
};
