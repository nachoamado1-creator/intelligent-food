// Tipos alineados al esquema relacional del Grupo 7 (intelligent_food_completoG7.sql).
// Se mantiene UI-friendly: ids como strings para Zustand, enriquecimientos UI (emoji,
// description) que no existen en la DB pero mejoran el prototipo.

export type TipoDoc = "DNI" | "LE" | "LC" | "Pasaporte";
export type Sexo = "Femenino" | "Masculino" | "No binario" | "Prefiero no decir";
export type EstadoHeladera = "Habilitada" | "Mantenimiento" | "Deshabilitada";
export type EstadoCupon = "Disponible" | "Usado" | "Vencido";
export type EstadoCompra = "Pendiente" | "Retirada" | "Vencida-Reembolsada";
export type TipoMovimiento = "CARGA" | "USO";

export interface User {
  id: string;
  nombre: string;
  apellido: string;
  tipoDoc: TipoDoc;
  dni: string;
  sexo: Sexo;
  mail: string;
  celular: string;
  password: string; // demo only — en la DB es contrasena_hash
  cuentaMercadoPago: string | null;
  fechaAlta: string; // ISO
}

export interface Group {
  id: string;
  nombre: string;
  ownerId: string; // usuario titular (es_titular = true)
  memberIds: string[];
  pendingRequests: { userId: string; userName: string }[];
}

export interface SaldoMovimiento {
  id: string;
  groupId: string;
  monto: number;
  fecha: string; // ISO
  tipo: TipoMovimiento;
}

export interface Fridge {
  id: string;
  nombre: string; // título corto derivado de la ubicación
  ubicacion: string; // dirección completa
  estado: EstadoHeladera;
  distanceKm: number; // simulado
  coordinates: string; // "37.3217° S, 59.1332° W" (ilustrativo)
}

export interface Product {
  id: string;
  nombre: string;
  tipo: string; // "Plato principal", "Bebida", ...
  precio: number;
  imageEmoji: string; // UI only (fallback)
  imageUrl: string; // UI only — foto Unsplash
  description: string; // UI only
  tags: string[]; // UI only
}

// Stock por (heladera, producto, lote)
export interface StockLote {
  id: string;
  fridgeId: string;
  productId: string;
  lote: string;
  cantidad: number;
  cantidadLimite: number;
  fechaVencimiento: string; // ISO date
}

export interface Cupon {
  id: string;
  userId: string;
  codigo: string;
  porcentajeDto: number;
  fechaVencimiento: string;
  estado: EstadoCupon;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  productId: string;
  detalleId?: string; // referencia a detalle_compra para reseña verificada
  rating: number;
  text: string;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  fridgeId: string;
  quantity: number;
  consumerUserId: string;
  unitPrice: number;
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface Purchase {
  id: string;
  compradorId: string;
  consumidorId: string; // 1 consumidor por compra (esquema DB)
  fridgeId: string;
  cuponId?: string;
  items: PurchaseItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: "saldo_grupo" | "mercado_pago";
  createdAt: string;
  expiresAt: string;
  status: EstadoCompra;
  tokenApertura: string;
}
