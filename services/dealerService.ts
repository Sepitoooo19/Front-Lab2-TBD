import type { Dealer, DealerWithDistance, DealerWithDistanceDTO } from "~/types/types";
const config = useRuntimeConfig();

// Función de validación WKT en el frontend
const isValidWKT = (wkt: string): boolean => {
  const pattern = /^POINT\(\s*-?\d+\.?\d*\s+-?\d+\.?\d*\s*\)$/i;
  return pattern.test(wkt);
};


// Funcion para obtener todos los clientes
// Entrada : Ninguna
// Salida : Lista de clientes
export const getAllDealers = async () => {
  const response = await fetch(`${config.public.apiBase}/dealers`);
  if (!response.ok) throw new Error("Error al obtener los dealers");
  return await response.json();
};

// Funcion para obtener un dealer por su id
// Entrada : id del dealer
// Salida : Objeto del dealer
export const getDealerById = async (id: number) => {
  const response = await fetch(`${config.public.apiBase}/dealers/${id}`);
  if (!response.ok) throw new Error("Error al obtener el dealer");
  return await response.json();
};

// Funcion para crear un dealer
// Entrada : datos del dealer
// Salida : Objeto del dealer creado
export const createDealer = async (dealer: any) => {
  const response = await fetch(`${config.public.apiBase}/dealers`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dealer),
  });
  if (!response.ok) throw new Error("Error al crear el dealer");
  return await response.json();
};

// Funcion para actualizar un dealer
// Entrada : id del dealer y datos del dealer
// Salida : Objeto del dealer actualizado
// Función mejorada para actualizar dealer
export const updateDealer = async (id: number, dealer: any): Promise<any> => {
  try {
    // Validar que la ubicación esté en formato WKT si existe
    if (dealer.ubication && !isValidWKT(dealer.ubication)) {
      throw new Error('Formato de ubicación inválido. Use "POINT(longitud latitud)"');
    }

    const response = await fetch(`${config.public.apiBase}/dealers/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dealer),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al actualizar el dealer');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en updateDealer:', error);
    throw error;
  }
};


// Funcion para eliminar un dealer por su id
// Entrada : id del dealer
// Salida : Objeto del dealer eliminado
export const deleteDealerById = async (id: number) => {
  const response = await fetch(`${config.public.apiBase}/dealers/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar el dealer");
  return true;
};

// Funcion para obtener el nombre del dealer por su id
// Entrada : id del dealer
// Salida : Nombre del dealer
export const getDealerNameById = async (dealerId: number | null): Promise<string> => {
  if (dealerId === null) {
    return 'Sin asignar'; // Si el dealerId es null, devuelve "Sin asignar"
  }

  const config = useRuntimeConfig();
  const response = await fetch(`${config.public.apiBase}/dealers/${dealerId}/name`);

  if (!response.ok) {
    throw new Error('Error al obtener el nombre del repartidor');
  }

  return await response.text();
};

// Funcion para obtener el tiempo promedio de entrega por repartidor
// Entrada : Ninguna
// Salida : Lista de objetos con el tiempo promedio de entrega por repartidor
export const getAverageDeliveryTimeByDealer = async (): Promise<any[]> => {
  const config = useRuntimeConfig();
  const response = await fetch(`${config.public.apiBase}/dealers/average-delivery-time`);

  if (!response.ok) {
    throw new Error('Error al obtener el tiempo promedio de entrega por repartidor');
  }

  return await response.json();
};

// Funcion para obtener los repartidores con mejor rendimiento
// Entrada : Ninguna
// Salida : Lista de objetos con los repartidores con mejor rendimiento
export const getTopPerformingDealers = async (): Promise<any[]> => {
  const config = useRuntimeConfig();
  const response = await fetch(`${config.public.apiBase}/dealers/top-performers`);

  if (!response.ok) {
    throw new Error('Error al obtener los repartidores con mejor rendimiento');
  }

  return await response.json();
};

export const getAuthenticatedDealerAverageDeliveryTime = async (): Promise<number> => {
  const config = useRuntimeConfig();
  const token = localStorage.getItem('jwt'); // Obtén el token JWT del almacenamiento local

  const response = await fetch(`${config.public.apiBase}/dealers/average-delivery-time-authenticated`, {
    headers: {
      Authorization: `Bearer ${token}`, // Agrega el token JWT al encabezado
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener el tiempo promedio de espera del repartidor autenticado');
  }

  const data = await response.json();
  return typeof data === 'number' ? data : parseFloat(data);
};

export const getAuthenticatedDealerDeliveryCount = async (): Promise<number> => {
  const config = useRuntimeConfig();
  const token = localStorage.getItem('jwt'); // Obtén el token JWT del almacenamiento local

  const response = await fetch(`${config.public.apiBase}/dealers/delivery-count`, {
    headers: {
      Authorization: `Bearer ${token}`, // Agrega el token JWT al encabezado
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener el número de entregas del repartidor autenticado');
  }

  const data = await response.json();
  return typeof data === 'number' ? data : parseInt(data, 10);
};

export const getAuthenticatedDealerProfile = async (): Promise<any> => {
  const config = useRuntimeConfig();
  const token = localStorage.getItem('jwt');
  
  try {
    const response = await fetch(`${config.public.apiBase}/dealers/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al obtener perfil');
    }

    return await response.json();
  } catch (error) {
    console.error('Error en dealerService:', error);
    throw error;
  }
};

// Obtener datos completos (incluyendo ubicación)
export const getCompleteDealerData = async (): Promise<{
  id: number;
  name: string;
  rut: string;
  email: string;
  phone: string;
  vehicle: string;
  plate: string;
  ubication: string;
}> => {
  const config = useRuntimeConfig();
  const token = localStorage.getItem('jwt');
  
  const response = await fetch(`${config.public.apiBase}/dealers/me/data`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Error al obtener datos completos');
  }

  return await response.json();
};


export const getAllDealersWithDistance = async (): Promise<DealerWithDistanceDTO[]> => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${config.public.apiBase}/dealers/with-distance`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) throw new Error('Error al obtener dealers con distancia');
  return await response.json();
};
// Función auxiliar para formatear distancia
const formatDistance = (meters: number): string => {
  return meters ? `${(meters / 1000).toFixed(2)} km` : '0 km';
};