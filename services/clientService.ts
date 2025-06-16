import { useRuntimeConfig } from '#app';
import type { Client } from '~/types/types';

const config = useRuntimeConfig();

/**
 * Obtiene todos los clientes.
 * Entrada : Ninguna
 * Salida : Lista de clientes
 */
export const getAllClients = async () => {
  const response = await fetch(`${config.public.apiBase}/clients`);
  if (!response.ok) throw new Error("Error al obtener los clientes");
  return await response.json();
};

/**
 * Obtiene un cliente por su id.
 * Entrada : id del cliente
 * Salida : Objeto del cliente
 */
export const getClientById = async (id: number) => {
  const response = await fetch(`${config.public.apiBase}/clients/${id}`);
  if (!response.ok) throw new Error("Error al obtener el cliente");
  return await response.json();
};

/**
 * Crea un cliente.
 * Entrada : Objeto del cliente
 * Salida : Objeto del cliente creado
 */
export const createClient = async (client: any) => {
  const response = await fetch(`${config.public.apiBase}/clients`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(client),
  });
  if (!response.ok) throw new Error("Error al crear el cliente");
  return await response.json();
};

/**
 * Actualiza un cliente.
 * Entrada : id del cliente y objeto del cliente
 * Salida : Objeto del cliente actualizado
 */
export const updateClient = async (id: number, client: any) => {
  const response = await fetch(`${config.public.apiBase}/clients/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(client),
  });
  if (!response.ok) throw new Error("Error al actualizar el cliente");
  return await response.json();
};

/**
 * Elimina un cliente por su id.
 * Entrada : id del cliente
 * Salida : Objeto del cliente eliminado
 */
export const deleteClientById = async (id: number) => {
  const response = await fetch(`${config.public.apiBase}/clients/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar el cliente");
  return await response.json();
};

/**
 * Obtiene el nombre de un cliente por su id.
 * Entrada : id del cliente
 * Salida : Nombre del cliente
 */
export const getNameByClientId = async (clientId: number): Promise<string> => {
  const config = useRuntimeConfig();
  const response = await fetch(`${config.public.apiBase}/clients/name/${clientId}`);

  if (!response.ok) {
    throw new Error("Error al obtener el nombre del cliente");
  }

  return await response.text(); // Usa text() en lugar de json()
};

/**
 * Obtiene el perfil del CLIENTE autenticado actualmente.
 * Llama a un endpoint genérico de usuario y lo trata como Cliente.
 */
export async function getAuthenticatedClientProfile(): Promise<Client> {
  const token = localStorage.getItem('jwt');
  if (!token) throw new Error('No hay sesión activa.');

  // Este endpoint devuelve los datos básicos del usuario logueado
  const res = await $fetch<any>('/clients/me', {
    baseURL: config.public.apiBase,
    headers: { 'Authorization': `Bearer ${token}` }
  });

  // Aquí asumimos que el backend devuelve todos los campos necesarios para un Cliente
  // y los mapeamos a nuestro tipo Client del frontend.
  return {
    id: res.id,
    name: res.name,
    rut: res.rut,
    email: res.email,
    phone: res.phone,
    address: res.address,
    ubication: res.ubication,
  };
}

/**
 * Actualiza el perfil de un CLIENTE por su ID.
 * Llama al endpoint específico de /clients/{id}
 */
export async function updateClientProfile(id: number, profileData: Partial<Client>): Promise<Client> {
  const token = localStorage.getItem('jwt');
  if (!token) throw new Error('No hay sesión activa.');

  return await $fetch<Client>(`/clients/${id}`, {
    baseURL: config.public.apiBase,
    method: 'PUT',
    body: profileData,
    headers: { 'Authorization': `Bearer ${token}` }
  });
}

/**
 * Obtiene el perfil del usuario autenticado.
 * Llama a un endpoint genérico de usuario.
 */
export async function getClient(): Promise<Client> {
  const token = localStorage.getItem('jwt');
  if (!token) throw new Error('No hay sesión activa.');

  return await $fetch<Client>('/clients/me', {
    baseURL: config.public.apiBase,
    headers: { 'Authorization': `Bearer ${token}` }
  });
}

/**
 * Obtiene clientes ubicados a más de 5km de cualquier empresa
 * @returns Promise<Client[]> Lista de clientes con sus datos completos
 * @throws Error cuando falla la solicitud al servidor
 */
export const getClientsBeyond5Km = async (): Promise<Client[]> => {
  try {
    const response = await fetch(`${config.public.apiBase}/clients/beyond-5km`);
    
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    
    const data: Client[] = await response.json();
    return data;
    
  } catch (error) {
    console.error('Error en getClientsBeyond5Km:', error);
    throw new Error('No se pudieron obtener los clientes lejanos');
  }
};