// services/ordersService.ts (frontend)
import type { Product, Order, TopSpender, OrderTotalProductsDTO, OrderNameAddressDTO  } from '~/types/types';
const config = useRuntimeConfig();

// Función para obtener todos los pedidos
// Entrada : Ninguna
// Salida : Lista de pedidos
export const getAllOrders = async (): Promise<Order[]> => {
  const config = useRuntimeConfig();
  const response = await fetch(`${config.public.apiBase}/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener las órdenes');
  }

  return await response.json();
};

// Función para obtener un pedido por su id
// Entrada : id del pedido
// Salida : Objeto del pedido
export const getOrderById = async (id: number) => {
  const response = await fetch(`${config.public.apiBase}/orders/${id}`);
  if (!response.ok) throw new Error("Error al obtener la orden");
  return await response.json();
};

// Función para actualizar un pedido
// Entrada : id del pedido y objeto del pedido
// Salida : Objeto del pedido actualizado
export const updateOrder = async (id: number, order: any) => {
  const response = await fetch(`${config.public.apiBase}/orders/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  });
  if (!response.ok) throw new Error("Error al actualizar la orden");
  return await response.json();
};

// Función para actualizar el estado de un pedido por el id del dealer
// Entrada : id del pedido, id del dealer y nuevo estado
// Salida : Objeto del pedido actualizado
export const updateOrderStatusByDealerId = async (
  orderId: number,
  dealerId: number,
  newStatus: string,
  deliveryDate?: string // <-- Nuevo parámetro opcional
) => {
  const token = localStorage.getItem('jwt');
  if (!token) throw new Error('No se encontró el token de autenticación');

  // Body: incluye deliveryDate solo si está presente
  const body: any = { status: newStatus };
  if (newStatus === 'ENTREGADO' && deliveryDate) {
    body.deliveryDate = deliveryDate;
  }

  const response = await fetch(`${config.public.apiBase}/orders/${orderId}/dealer/${dealerId}/status`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    if (response.status === 403) throw new Error('No tienes permiso para actualizar esta orden');
    throw new Error('Error al actualizar el estado de la orden');
  }

  if (response.status === 204) {
    return null;
  }

  return await response.json().catch(() => null);
};
// Función para eliminar un cliente por su id
// Entrada : id del cliente
// Salida : Objeto del cliente eliminado
export const deleteClientById = async (id: number) => {
    const response = await fetch(`${config.public.apiBase}/clients/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Error al eliminar el cliente");
    return true;
  };

// Función para obtener las órdenes de un cliente
// Entrada : token de autenticación
// Salida : Lista de órdenes del cliente
export const getOrdersByClient = async (): Promise<Order[]> => {
  const config = useRuntimeConfig();
  const token = localStorage.getItem('jwt'); // Obtén el token del localStorage

  if (!token) {
    throw new Error('No se encontró el token de autenticación');
  }

  const response = await fetch(`${config.public.apiBase}/orders/client/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Envía el token en el encabezado
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener las órdenes del cliente');
  }

  return await response.json();
};

// Función para obtener las órdenes de un cliente por su id
// Entrada : id del cliente
// Salida : Lista de órdenes del cliente
export const getOrdersByClientId = async (clientId: number) => {
  const response = await fetch(`${config.public.apiBase}/orders/client/${clientId}`);
  if (!response.ok) throw new Error("Error al obtener las órdenes del cliente");
  return await response.json();
};

// Función para obtener las órdenes de un dealer por su id
// Entrada : id del dealer
// Salida : Lista de órdenes del dealer
export const getOrdersByDealerId = async (dealerId: number) => {
  const response = await fetch(`${config.public.apiBase}/orders/dealer/${dealerId}`);
  console.log("Petición a:", response.url);
  if (!response.ok) throw new Error("Error al obtener las órdenes del dealer");
  const data = await response.json();
  console.log("Órdenes recibidas:", data);
  return data;
};

// Función para obtener las órdenes de una compañía por su id
// Entrada : id de la compañía
// Salida : Lista de órdenes de la compañía
export const getOrdersByCompanyId = async (companyId: number) => {
    const response = await fetch(`${config.public.apiBase}/orders/company/${companyId}`);
    if (!response.ok) throw new Error("Error al obtener las órdenes de la compañía");
    return await response.json();
};

// Función para obtener las entregas fallidas de una compañía por su id
// Entrada : id de la compañía
// Salida : Lista de entregas fallidas de la compañía
export const getFailedDeliveriesByCompanyId = async (companyId: number) => {
  const response = await fetch(`${config.public.apiBase}/orders/failed/company/${companyId}`);
  if (!response.ok) {
    throw new Error('Error al obtener las entregas fallidas');
  }
  return await response.json();
};

// Función para obtener las órdenes entregadas de una compañía por su id
// Entrada : id de la compañía
// Salida : Lista de órdenes entregadas de la compañía
export const getDeliveredOrdersByCompanyId = async (companyId: number) => {
  const response = await fetch(`${config.public.apiBase}/orders/delivered/company/${companyId}`);
  if (!response.ok) {
    throw new Error('Error al obtener las órdenes entregadas');
  }
  return await response.json();
};
  
// Función para obtener los productos de un pedido por su id y token de autenticación
// Entrada : id del pedido y token de autenticación
// Salida : Lista de productos del pedido
export const getProductsByOrderId = async (orderId: number): Promise<Product[]> => {
  const config = useRuntimeConfig();
  const token = localStorage.getItem('jwt'); // Obtén el token de localStorage

  const response = await fetch(`${config.public.apiBase}/orders/${orderId}/products`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener los productos del pedido');
  }

  return await response.json();
};

// Función para crear un pedido
// Entrada : objeto del pedido, lista de ids de productos y token de autenticación
// Salida : pedido creado
export const createOrder = async (order: { orderDate: string; status: string }, productIds: string): Promise<void> => {
  const token = localStorage.getItem('jwt'); // Obtén el token del localStorage

  if (!token) {
    throw new Error('No se encontró el token de autenticación');
  }

  const response = await fetch(`${config.public.apiBase}/orders/create?productIds=${productIds}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
    },
    body: JSON.stringify(order), // Enviar el cuerpo de la orden
  });

  if (!response.ok) {
    throw new Error('Error al crear el pedido');
  }
};

// Función para obtener la dirección del cliente
// Entrada : token de autenticación
// Salida : dirección del cliente
export const getClientAddress = async (): Promise<string> => {
  const config = useRuntimeConfig();
  const token = localStorage.getItem('jwt');

  if (!token) {
    console.error('No se encontró el token de autenticación');
    throw new Error('No se encontró el token de autenticación');
  }

  const url = `${config.public.apiBase}/orders/address`;
  console.log('URL del endpoint:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error en la respuesta:', errorText);
    throw new Error('Error al obtener la dirección del cliente');
  }

  return await response.text(); // La dirección se devuelve como texto
};

// Función para obtener el cliente con mayor gasto
// Entrada : Ninguna
// Salida : objeto del cliente con mayor gasto
export const getTopSpender = async (): Promise<TopSpender> => {
  const response = await fetch(`${config.public.apiBase}/orders/top-spender`);
  if (!response.ok) {
    throw new Error('Error al obtener el cliente con mayor gasto');
  }
  return await response.json();
};

// Función para marcar un pedido como urgente
// Entrada : id del pedido y token de autenticación
// Salida : Ninguna
export const markOrderAsUrgent = async (orderId: number): Promise<void> => {
  const token = localStorage.getItem('jwt'); // Obtén el token del localStorage

  if (!token) {
    throw new Error('No se encontró el token de autenticación');
  }

  const response = await fetch(`${config.public.apiBase}/orders/${orderId}/urgent`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
    },
  });

  if (!response.ok) {
    throw new Error('Error al marcar el pedido como URGENTE');
  }
};

// Función para obtener las órdenes de un dealer
// Entrada : token de autenticación
// Salida : lista de órdenes del dealer
export const getOrdersByDealer = async () => {
  const token = localStorage.getItem('jwt'); // Obtén el token del localStorage

  if (!token) {
    throw new Error('No se encontró el token de autenticación');
  }

  const response = await fetch(`${config.public.apiBase}/orders/dealer/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener las órdenes del dealer');
  }

  return await response.json();
};

// Función para obtener la orden activa de un dealer
// Entrada : token de autenticación
// Salida : objeto de la orden activa del dealer
export const getActiveOrderByDealer = async () => {
  const token = localStorage.getItem('jwt');

  if (!token) {
    throw new Error('No se encontró el token de autenticación');
  }

  const response = await fetch(`${config.public.apiBase}/orders/dealer/active-order`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    // Si no hay orden activa (404), devolver null en lugar de lanzar error
    if (response.status === 404) {
      return null;
    }
    throw new Error('Error al obtener la orden activa del dealer');
  }

  // Verificar si la respuesta tiene contenido antes de parsear
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

// Función para actualizar el estado de un pedido
// Entrada : id del pedido y objeto con el nuevo estado
// Salida : objeto del pedido actualizado
export const updateOrderStatus = async (orderId: number, body: { status: string, deliveryDate?: null }) => {
  const token = localStorage.getItem('jwt');
  
  if (!token) {
    throw new Error('No se encontró el token de autenticación');
  }

  const response = await fetch(`${config.public.apiBase}/orders/${orderId}/status`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('No tienes permiso para actualizar esta orden');
    }
    throw new Error('Error al actualizar el estado de la orden');
  }

  if (response.status === 204) {
    return null;
  }

  return await response.json().catch(() => null);
};

export const getOrdersByDealerDto = async (): Promise<OrderTotalProductsDTO[]> => {
  const config = useRuntimeConfig();
  const token = localStorage.getItem('jwt'); // Obtén el token JWT del almacenamiento local

  const response = await fetch(`${config.public.apiBase}/orders/dealer/dto/orders`, {
    headers: {
      Authorization: `Bearer ${token}`, // Agrega el token JWT al encabezado
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener las órdenes del repartidor autenticado');
  }

  return await response.json();
};

export const getActiveOrderNameAddresDTOByDealer = async (): Promise<OrderNameAddressDTO> => {
  const config = useRuntimeConfig();
  const token = localStorage.getItem('jwt'); // Obtén el token JWT del almacenamiento local

  const response = await fetch(`${config.public.apiBase}/orders/dealer/dto/active-order`, {
    headers: {
      Authorization: `Bearer ${token}`, // Agrega el token JWT al encabezado
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener la orden activa del repartidor');
  }

  return await response.json();
};

export const getFailedOrdersByClient = async (): Promise<Order[]> => {
  const config = useRuntimeConfig();
  const token = localStorage.getItem('jwt');

  if (!token) {
    throw new Error('No se encontró el token de autenticación');
  }

  const response = await fetch(`${config.public.apiBase}/orders/client/failed`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error('Error al obtener órdenes fallidas del cliente');
  }

  return await response.json();
};

/**
 * Obtiene los pedidos cuya ruta estimada cruza más de 2 zonas de reparto
 * @returns Lista de OrderNameAddressDTO con información de pedidos y clientes
 */
export const getOrdersCrossingMultipleZones = async (): Promise<OrderNameAddressDTO[]> => {
  const token = localStorage.getItem('jwt'); // Obtener token si es necesario
  
  const response = await fetch(`${config.public.apiBase}/orders/crossing-multiple-zones`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }), // Incluir token si existe
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage = errorData?.message || 'Error al obtener pedidos que cruzan múltiples zonas';
    throw new Error(errorMessage);
  }

  return await response.json();
};