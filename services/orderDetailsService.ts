const config = useRuntimeConfig();
import type { OrderDetails } from "~/types/types";

// Funcion para crear los detalles de la ultima orden
// Entrada : metodo de pago, total de productos y precio
// Salida : Objeto de los detalles de la orden
export const createOrderDetailsForLastOrder = async (paymentMethod: string, totalProducts: number, price: number): Promise<void> => {
  const response = await fetch(`${config.public.apiBase}/order-details/create-for-last-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      paymentMethod,
      totalProducts,
      price,
    }),
  });

  if (!response.ok) {
    throw new Error("Error al crear los detalles de la orden");
  }

  // Solo intenta analizar JSON si hay un cuerpo en la respuesta
  if (response.headers.get("Content-Type")?.includes("application/json")) {
    return await response.json();
  }

  return; // Si no hay cuerpo, simplemente retorna
};

// Funcion para obtener los detalles de un pedido por su ID
// Entrada : id del pedido
// Salida : Objeto de los detalles del pedido
export const getOrderDetailsByOrderId = async (orderId: number): Promise<OrderDetails[]> => {
  const config = useRuntimeConfig();
  const token = localStorage.getItem('authToken'); // Obtén el token del localStorage

  const response = await fetch(`${config.public.apiBase}/order-details/order/${orderId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
    },
  });

  if (!response.ok) {
    throw new Error('Error al obtener los detalles del pedido');
  }

  return await response.json();
};

// Funcion para obtener el método de pago más utilizado en pedidos urgentes
// Entrada : Ninguna
// Salida : Objeto con el método de pago y el conteo
export const getMostUsedPaymentMethodForUrgentOrders = async (): Promise<{ method: string; count: number }> => {
  const response = await fetch(`${config.public.apiBase}/order-details/urgent/payment-method`);
  if (!response.ok) {
    throw new Error('Error al obtener el método de pago más utilizado en pedidos urgentes');
  }
  const data = await response.json();
  const [method, count] = Object.entries(data)[0]; // Extraer el método y el conteo
  return { method, count: Number(count) };
};