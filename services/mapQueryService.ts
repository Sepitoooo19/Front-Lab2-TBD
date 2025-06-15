 
import type { NearestDeliveryPointDTO} from '~/types/types';

/**
 * Obtiene los 5 puntos de entrega más cercanos a una empresa
 * Entrada: ID de la empresa
 * Salida: Lista de puntos de entrega cercanos con sus distancias
 */
export const getNearestDeliveryPoints = async (companyId: number): Promise<NearestDeliveryPointDTO[]> => {
  try {
    const config = useRuntimeConfig();
    const response = await fetch(`${config.public.apiBase}/companies/nearest/${companyId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error; // Re-lanzar para manejo en el componente
  }
};


export const getFarthestDeliveryPoints = async () => {
  const response = await fetch('http://localhost:8090/companies/reports/farthest-deliveries');
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return await response.json();
};