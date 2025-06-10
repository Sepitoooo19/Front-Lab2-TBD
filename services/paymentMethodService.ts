
const config = useRuntimeConfig();

// Funcion para obtener todos los metodos de pago
// Entrada : Ninguna
// Salida : Lista de metodos de pago
export const getAllPaymentMethods = async () => {
  const response = await fetch(`${config.public.apiBase}/paymentmethod`);
  if (!response.ok) throw new Error("Error al obtener los métodos de pago");
  return await response.json();
};

// Funcion para obtener un metodo de pago por id de compañia
// Entrada : id compañia
// Salida : Objeto del metodo de pago
export const getPaymentMethodByCompanyId = async (companyId: number) => {
  const response = await fetch(`${config.public.apiBase}/paymentmethod/company/${companyId}`);
  if (!response.ok) throw new Error("Error al obtener los métodos de pago por empresa");
  return await response.json();
}