 
import type { NearestDeliveryPointDTO} from '~/types/types';

/**
 * Obtiene los 5 puntos de entrega más cercanos a una empresa
 * Entrada: ID de la empresa
 * Salida: Lista de puntos de entrega cercanos con sus distancias
 */
export const getNearestDeliveryPoints = async (companyId: number): Promise<NearestDeliveryPointDTO[]> => {
  const config = useRuntimeConfig();
  const response = await fetch(`${config.public.apiBase}/companies/nearest/${companyId}`);
  
  if (!response.ok) {
    throw new Error('Error al obtener los puntos de entrega cercanos');
  }
  
  return await response.json();
};