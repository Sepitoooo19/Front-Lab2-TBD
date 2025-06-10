import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    products: [] as { id: number; name: string; price: number }[], // Lista de productos en el carrito
  }),
  actions: {
    addProduct(product: { id: number; name: string; price: number }) {
      const exists = this.products.find((p) => p.id === product.id);
      if (!exists) {
        this.products.push(product);
        this.saveToLocalStorage(); // Guarda el estado en localStorage
        console.log('Producto agregado al carrito:', product);
        console.log('Estado actual del carrito:', this.products);
      }
    },
    removeProduct(productId: number) {
      this.products = this.products.filter((p) => p.id !== productId);
      this.saveToLocalStorage(); // Guarda el estado en localStorage
    },
    clearCart() {
      this.products = [];
      this.saveToLocalStorage(); // Limpia el estado en localStorage
    },
    saveToLocalStorage() {
      localStorage.setItem('cart', JSON.stringify(this.products));
    },
    loadFromLocalStorage() {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          if (Array.isArray(parsedCart)) {
            this.products = parsedCart;
            console.log('Productos cargados desde localStorage:', this.products);
          } else {
            throw new Error('Datos corruptos en localStorage');
          }
        } catch (error) {
          console.error('Error al cargar productos del carrito:', error);
          this.products = []; // Reinicia el carrito si los datos son inválidos
        }
      } else {
        console.log('No hay productos en localStorage.');
      }
    },
  },
});