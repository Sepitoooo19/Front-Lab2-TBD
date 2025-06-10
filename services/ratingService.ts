
// Funcion para agregar una calificación
// Entrada : Objeto de calificación
// Salida : void
export const addRating = async (rating: {
  rating: number;
  comment: string;
  date: string;
  clientId: number;
  dealerId: number;
  orderId: number;
}): Promise<void> => {
  const config = useRuntimeConfig();
  const response = await fetch(`${config.public.apiBase}/ratings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(rating),
  });

  if (!response.ok) {
    throw new Error('Error al guardar la calificación');
  }
};

// Funcion para obtener todas las calificaciones de un dealer
// Entrada : id del dealer
// Salida : Lista de calificaciones
export const getDealerRatings = async (dealerId: number): Promise<any[]> => {
  const config = useRuntimeConfig();
  const response = await fetch(`${config.public.apiBase}/ratings/dealer/${dealerId}`);

  if (!response.ok) {
    throw new Error('Error al obtener las calificaciones del repartidor');
  }

  return await response.json();
};