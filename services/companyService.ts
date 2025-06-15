const config = useRuntimeConfig();
 
import type { Company , NearestDeliveryPointDTO} from '~/types/types';

// Funcion para obtener todas las empresas
// Entrada : Ninguna
// Salida : Lista de empresas
export const getAllCompanies = async (): Promise<Company[]> => {
  const response = await fetch(`${config.public.apiBase}/companies`);
  if (!response.ok) {
    throw new Error('Error al obtener las empresas');
  }
  return await response.json();
};

// Funcion para crear una empresa por su id
// Entrada : id de la empresa
// Salida : Objeto de la empresa
export const getCompanyById = async (companyId: string) => {
  const config = useRuntimeConfig();
  const token = localStorage.getItem('jwt'); // Obtén el token de localStorage

  if (!token) {
    throw new Error('No se encontró el token de autenticación');
  }

  const response = await fetch(`${config.public.apiBase}/companies/${companyId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener la compañía');
  }

  return await response.json();
};

// Funcion para actualizar una empresa
// Entrada : id de la empresa y objeto de la empresa
// Salida : Objeto de la empresa actualizada
export const updateCompanyMetrics = async (): Promise<void> => {
  const response = await fetch(`${config.public.apiBase}/companies/update-metrics`, {
    method: 'POST',
  });
  if (!response.ok) {
    throw new Error('Error al actualizar las métricas de las empresas');
  }
};

// Funcion para obtener las empresas con más entregas fallidas
// Entrada : Ninguna
// Salida : Lista de empresas con más entregas fallidas
export const getCompaniesWithMostFailedDeliveries = async (): Promise<any[]> => {
  const response = await fetch(`${config.public.apiBase}/companies/failed-deliveries`);
  if (!response.ok) {
    throw new Error('Error al obtener las empresas con más entregas fallidas');
  }
  return await response.json();
};

// Funcion para obtener las empresas con más volumen de comida entregada
// Entrada : Ninguna
// Salida : Lista de empresas con más volumen de comida entregada
export const getCompaniesByDeliveredFoodVolume = async (): Promise<any[]> => {
  const response = await fetch(`${config.public.apiBase}/companies/delivered-food-volume`);
  if (!response.ok) {
    throw new Error('Error al obtener las empresas por volumen de comida entregada');
  }
  return await response.json();
};


export const getNearestDeliveryPoints = async (companyId: number): Promise<NearestDeliveryPointDTO[]> => {
  const config = useRuntimeConfig();
  const response = await fetch(`${config.public.apiBase}/companies/nearest/${companyId}`);
  
  if (!response.ok) {
    throw new Error('Error al obtener los puntos de entrega cercanos');
  }
  
  return await response.json();
};


export async function getCompanyIdByName(name: string): Promise<number> {
  const res = await fetch(`/companies/by-name/${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error('No se pudo obtener el ID');
  const data = await res.json();
  return data.id;
}