/**
 * Formatea una fecha ISO string o un objeto Date a 'YYYY-MM-DDTHH:mm',
 * que es el formato que espera el input[type="datetime-local"].
 */
export const formatDateTimeForInput = (dateValue: string | Date | undefined | null): string => {
  if (!dateValue) return '';
  
  const date = typeof dateValue === 'string' ? new Date(dateValue) : dateValue;

  if (isNaN(date.getTime())) {
    return '';
  }

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

/**
 * Convierte el valor de un input[type="datetime-local"] (string) a un ISO string completo
 * o al mismo string si ya es adecuado para el backend (LocalDateTime suele aceptar YYYY-MM-DDTHH:mm).
 */
export const parseDateTimeFromInput = (inputString: string | undefined | null): string | null => {
  if (!inputString) return null;
  // El formato del input es "YYYY-MM-DDTHH:mm".
  // Para LocalDateTime, Spring Boot suele ser flexible.
  // Si necesitas añadir segundos y 'Z' para UTC explícitamente:
  // return new Date(inputString).toISOString();
  // Por ahora, devolvemos el string tal cual si es suficiente.
  return inputString;
};

/**
 * Formatea una fecha (string ISO o Date) a un formato legible DD/MM/YYYY HH:MM.
 */
export const formatDateTime = (fechaString: string | Date | undefined | null): string => {
  if (!fechaString) return 'N/A';
  const fecha = typeof fechaString === 'string' ? new Date(fechaString) : fechaString;
  
  if (isNaN(fecha.getTime())) return 'Fecha inválida';

  const formateador = new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    // second: '2-digit', // Descomentar si se necesitan segundos
    hour12: false
  });
  
  return formateador.format(fecha).replace(',', ''); // Reemplaza la coma que a veces añade Intl
};

/**
 * Formatea una fecha (string ISO o Date) a un formato legible DD/MM/YYYY.
 */
export const formatDate = (fechaString: string | Date | undefined | null): string => {
  if (!fechaString) return 'N/A';
  const fecha = typeof fechaString === 'string' ? new Date(fechaString) : fechaString;

  if (isNaN(fecha.getTime())) return 'Fecha inválida';

  const formateador = new Intl.DateTimeFormat('es-CL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  return formateador.format(fecha).replace(',', '');
};

/**
 * Formatea un número a moneda CLP (peso chileno).
 */
export const formatCurrencyCLP = (value: number | undefined | null): string => {
  if (value === undefined || value === null) return 'N/A';
  
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0, // CLP usualmente no usa centavos
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Formatea un número con separadores de miles para Chile (punto) y comas para decimales.
 */
export const formatNumber = (value: number | undefined | null): string => {
  if (value === undefined || value === null) return '0';

  return new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Formatea un número con comas para separadores de miles y punto para decimales (formato 'en').
 */
export const formatNumberPoint = (value: number | undefined | null): string => {
  if (value === undefined || value === null) return '0';

  return new Intl.NumberFormat('en', { // 'en' para usar punto como separador decimal
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value);
};