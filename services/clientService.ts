const config = useRuntimeConfig();

// Funcion para obtener todos los clientes
// Entrada : Ninguna
// Salida : Lista de clientes
export const getAllClients = async () => {
  const response = await fetch(`${config.public.apiBase}/clients`);
  if (!response.ok) throw new Error("Error al obtener los clientes");
  return await response.json();
};

// Funcion para obtener un cliente por su id
// Entrada : id del cliente
// Salida : Objeto del cliente
export const getClientById = async (id: number) => {
  const response = await fetch(`${config.public.apiBase}/clients/${id}`);
  if (!response.ok) throw new Error("Error al obtener el cliente");
  return await response.json();
};

// Funcion para crear un cliente
// Entrada : Objeto del cliente
// Salida : Objeto del cliente creado
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

// Funcion para actualizar un cliente
// Entrada : id del cliente y objeto del cliente
// Salida : Objeto del cliente actualizado
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

// Funcion para eliminar un cliente por su id
// Entrada : id del cliente
// Salida : Objeto del cliente eliminado
export const deleteClientById = async (id: number) => {
  const response = await fetch(`${config.public.apiBase}/clients/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Error al eliminar el cliente");
  return await response.json();
};

// Funcion para obtener el nombre de un cliente por su id
// Entrada : id del cliente
// Salida : Nombre del cliente
export const getNameByClientId = async (clientId: number): Promise<string> => {
  const config = useRuntimeConfig();
  const response = await fetch(`${config.public.apiBase}/clients/name/${clientId}`);

  if (!response.ok) {
    throw new Error("Error al obtener el nombre del cliente");
  }

  return await response.text(); // Usa text() en lugar de json()
};


