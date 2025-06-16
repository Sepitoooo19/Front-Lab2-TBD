<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '~/stores/cart'
import { createOrder as createOrderService } from '~/services/ordersService'
import { createOrderDetailsForLastOrder } from '~/services/orderDetailsService'
import { getCompanyIdByProductId } from '~/services/productService'
import { getPaymentMethodByCompanyId } from '~/services/paymentMethodService'
import { getAuthenticatedClientProfile, updateClientProfile } from '~/services/clientService'
import { wktToLatLng, latLngToWKT } from '~/utils/wktUtils'
import MapPicker from '~/components/common/MapPicker.vue'
import type { PaymentMethod, Order } from '~/types/types'

const cartStore = useCartStore()
cartStore.loadFromLocalStorage()

// Estados reactivos
const cartProducts = computed(() => cartStore.products)
const paymentMethods = ref<PaymentMethod[]>([])
const selectedPaymentMethod = ref<string | null>(null)
const isUrgent = ref(false)
const errorMessage = ref<string | null>(null)
const lat = ref<number | null>(null)
const lng = ref<number | null>(null)
const isLoadingUbicacion = ref(true)

// Carga inicial
onMounted(async () => {
  await loadPaymentMethods()
  await loadClientLocation()
})

// Carga métodos de pago
const loadPaymentMethods = async () => {
  try {
    if (cartProducts.value.length === 0) {
      errorMessage.value = 'El carrito está vacío.'
      return
    }

    const firstProductId = cartProducts.value[0]?.id
    const companyId = await getCompanyIdByProductId(firstProductId)
    paymentMethods.value = await getPaymentMethodByCompanyId(companyId)
  } catch (error) {
    console.error('Error al cargar métodos de pago:', error)
    errorMessage.value = 'Error al cargar métodos de pago'
  }
}

// Carga ubicación del cliente
const loadClientLocation = async () => {
  try {
    const profile = await getAuthenticatedClientProfile()
    if (profile.ubication) {
      const coords = wktToLatLng(profile.ubication)
      if (coords) {
        lng.value = coords.lng
        lat.value = coords.lat
      }
    } else {
      setDefaultLocation()
    }
  } catch (e) {
    setDefaultLocation()
  } finally {
    isLoadingUbicacion.value = false
  }
}

const setDefaultLocation = () => {
  lat.value = -33.45
  lng.value = -70.65
}

// Manejadores de mapa
const onUpdateLat = (newLat: number) => { lat.value = newLat }
const onUpdateLng = (newLng: number) => { lng.value = newLng }

const actualizarUbicacion = async () => {
  if (!lat.value || !lng.value) {
    alert('Selecciona una ubicación en el mapa')
    return
  }
  
  try {
    const profile = await getAuthenticatedClientProfile()
    await updateClientProfile(profile.id, {
      ...profile,
      ubication: latLngToWKT(lng.value, lat.value)
    })
    alert('Ubicación actualizada correctamente')
  } catch (e) {
    alert('Error al actualizar ubicación')
  }
}

// Acciones del carrito
const removeFromCart = (productId: number) => {
  cartStore.removeProduct(productId)
}

// Creación de orden
const createOrder = async () => {
  if (!validateOrder()) return

  try {
    const productIds = cartStore.products.map(p => p.id)
    const orderData = {
      orderDate: new Date().toISOString(),
      status: isUrgent.value ? "URGENTE" : "PENDIENTE",
    }

    const createdOrder = await processOrderCreation(orderData, productIds)
    await processOrderDetails(createdOrder)
    
    handleOrderSuccess(createdOrder)
  } catch (error) {
    handleOrderError(error)
  }
}

const validateOrder = () => {
  if (!selectedPaymentMethod.value) {
    alert('Selecciona un método de pago')
    return false
  }
  
  if (!lat.value || !lng.value) {
    alert('Selecciona una ubicación de entrega')
    return false
  }
  
  return true
}

const processOrderCreation = async (orderData: Partial<Order>, productIds: number[]) => {
  try {
    const order = await createOrderService(orderData, productIds)
    console.log('Orden creada:', order)
    return order
  } catch (error) {
    console.error('Error creando orden:', error)
    throw new Error(error instanceof Error ? error.message : 'Error al crear orden')
  }
}

const processOrderDetails = async (order: Order) => {
  const totalProducts = cartProducts.value.length
  const totalPrice = cartProducts.value.reduce((sum, p) => sum + p.price, 0)
  
  await createOrderDetailsForLastOrder(
    selectedPaymentMethod.value!,
    totalProducts,
    totalPrice
  )
}

const handleOrderSuccess = (order: Order) => {
  alert(`Pedido #${order.id} creado exitosamente`)
  cartStore.clearCart()
  // navigateTo(`/orders/${order.id}`) // Redirigir si es necesario
}

const handleOrderError = (error: unknown) => {
  const message = error instanceof Error ? error.message : 'Error desconocido'
  console.error('Error en pedido:', error)
  
  if (message.includes('Sesión') || message.includes('403')) {
    localStorage.removeItem('jwt')
    navigateTo('/login')
  } else {
    alert(message)
  }
}

definePageMeta({
  layout: 'client'
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Carrito de Compras</h1>

    <!-- Tabla de productos -->
    <div v-if="cartProducts.length > 0">
      <table class="min-w-full border border-gray-300 shadow-md rounded-lg overflow-hidden">
        <thead class="bg-gray-100">
          <tr>
            <th class="px-4 py-2 text-left">Producto</th>
            <th class="px-4 py-2 text-left">Precio</th>
            <th class="px-4 py-2 text-left">Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in cartProducts" :key="product.id" class="border-t hover:bg-gray-50">
            <td class="px-4 py-2">{{ product.name }}</td>
            <td class="px-4 py-2">${{ product.price.toLocaleString() }}</td>
            <td class="px-4 py-2">
              <button
                class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                @click="removeFromCart(product.id)"
              >
                Eliminar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Sección de ubicación -->
      <div class="mt-8">
        <h2 class="text-lg font-semibold mb-2">Ubicación de entrega</h2>
        <div v-if="isLoadingUbicacion" class="text-gray-500 mb-4">Cargando mapa...</div>
        <div v-else>
          <MapPicker
            :lat="lat"
            :lng="lng"
            @update:lat="onUpdateLat"
            @update:lng="onUpdateLng"
          />
          <button
            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
            @click="actualizarUbicacion"
          >
            Guardar ubicación
          </button>
        </div>
      </div>

      <!-- Método de pago y confirmación -->
      <div class="mt-6">
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2">Método de Pago</label>
          <select
            v-model="selectedPaymentMethod"
            class="w-full border px-3 py-2 rounded text-black bg-white"
          >
            <option value="" disabled>Selecciona un método</option>
            <option
              v-for="method in paymentMethods"
              :key="method.id"
              :value="method.type"
            >
              {{ method.type }}
            </option>
          </select>
        </div>

        <div class="flex items-center mb-4">
          <input
            type="checkbox"
            id="urgent"
            v-model="isUrgent"
            class="mr-2"
          />
          <label for="urgent">Marcar como URGENTE</label>
        </div>

        <button
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
          @click="createOrder"
        >
          Confirmar Pedido
        </button>
      </div>
    </div>

    <!-- Carrito vacío -->
    <div v-else class="mt-4 text-gray-500">
      No hay productos en el carrito
    </div>
  </div>
</template>