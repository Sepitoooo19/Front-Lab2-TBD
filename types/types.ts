export interface Client {
  id: number;
  name: string;
  rut: string;
  email: string;
  phone: string;
  address: string;
  ubication: string
}

declare module 'geojson' {
  interface LineString {
    type: 'LineString';
    coordinates: number[][]; // [longitud, latitud][]
  }
}

export interface Order {
  id: number
  address: string
  orderDate: string
  deliveryDate: string
  status: string
  products: number
  clientId: number
  nameClient: string
  dealerId: number
  dealerName: string
  totalPrice: number
  totalProducts: number
  estimatedRoute: string | null; // Ruta estimada (equivalente a estimated_route)
}

export interface Dealer {
  id: number | null;
  name: string;
  rut: string;
  email: string;
  phone: string;
  vehicle: string;
  plate: string;
  rating: string;
  avgWaitTime: string;
  deliveryCount: number;
  ubication: string;
}

export interface Company {
  id: number
  name: string
  phone: string
  email: string
  type: string
}

export type Product = {
  id: number;
  name: string;
  stock: number;
  price: number;
  category: string;
  companyId: number;
}


export interface OrderDetails {
  id: number
  orderId: number
  totalProducts: number
  price: number
  paymentMethod: string
}

export interface PaymentMethod {
  id: number
  type: string
}

export interface TopSpender{
  id: number
  name: string
  rut: string
  email: string
  phone: string
  address: string
  totalSpent: number

}

export interface OrderTotalProductsDTO{
  id: number
     orderDate: string;
     deliveryDate: string;
     status: string;
     totalPrice: number;
    totalProducts: number;

}


export interface OrderNameAddressDTO {
   id: number;
      orderDate: string;
      deliveryDate: string;
      status: string;
      totalPrice: number;
      clientId: number;
      nameClient: string // Nombre del cliente
      address: string // Dirección del cliente
}

export interface NearestDeliveryPointDTO {
  clientId: number;
  clientName: string;
  clientAddress: string;
  clientLocation: string; // WKT del punto
  companyName: string;
  distanceMeters: number;
}

export type EmergencyReport = {
  id: number;
  orderId: number;
  dealerId: number;
  ubication: string; // WKT
};

export interface CoverageArea {
  coverageId: number;
  name: string;
  coverageArea: string; // WKT del polígono (ej: "POLYGON((...))")
}

export interface CoverageCheckDTO {
  clientId: number;
  clientName: string;
  companyId: number;
  companyName: string;
  coverageId: number | null;  // Nullable
  coverageName: string | null; // Nullable
  isCovered: boolean;
  distanceMeters: number;
}

export interface DealerWithDistanceDTO {
  id: number;
  distanceMeters: number;
}

export interface DealerWithDistance extends Dealer {
  distanceMeters: number;
  distanceFormatted: string;
}