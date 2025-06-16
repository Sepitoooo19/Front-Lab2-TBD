const config = useRuntimeConfig();
import type { CoverageArea, CoverageCheckDTO } from '~/types/types';

export const getAllCoverageAreas = async (): Promise<CoverageArea[]> => {
  const response = await fetch(`${config.public.apiBase}/coverage-areas`);
  
  if (!response.ok) {
    throw new Error('Error al obtener las áreas de cobertura');
  }
  
  return await response.json();
};

export const getClientCoverages = async (clientId: number): Promise<CoverageCheckDTO[]> => {
  // Validación básica para coincidir con el backend
  if (clientId <= 0) {
    throw new Error('El ID de cliente debe ser mayor a cero');
  }

  const response = await fetch(
    `${config.public.apiBase}/coverage-areas/client-coverage/${clientId}`
  );

  if (!response.ok) {
    if (response.status === 400) {
      throw new Error('ID de cliente inválido');
    }
    if (response.status === 404) {
      return []; // Retorna array vacío si no hay coberturas
    }
    throw new Error('Error al obtener las coberturas del cliente');
  }

  const data = await response.json();
  
  // Maneja el caso cuando el backend retorna un mensaje (array vacío)
  if (typeof data === 'string') {
    return [];
  }
  
  return data as CoverageCheckDTO[];
};