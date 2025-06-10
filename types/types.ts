export interface Client {
  id: number;
  name: string;
  rut: string;
  email: string;
  phone: string;
  address: string;
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
}

export interface Dealer {
  id: number
  name: string
  rut: string
  phone: string
  email: string
  plate: string
  vehicle: string
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


