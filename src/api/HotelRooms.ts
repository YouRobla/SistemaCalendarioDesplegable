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
    console.log('🔄 Fetching hotel rooms...');
    const response = await api.get('/api/hotel/cuartos');
    const apiData = response.data;
    
    console.log('📊 API Response:', apiData);
    
    if (apiData.success && Array.isArray(apiData.data)) {
      console.log(`✅ Found ${apiData.data.length} hotel rooms`);
      return apiData.data;
    }
    
    console.log('❌ Invalid API response format');
    return [];
  } catch (error) {
    console.error('❌ Error fetching hotel rooms:', error);
    return [];
  }
};