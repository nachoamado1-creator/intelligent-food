"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  CartItem,
  Comment,
  Cupon,
  Fridge,
  Group,
  Product,
  Purchase,
  PurchaseItem,
  SaldoMovimiento,
  StockLote,
  User,
} from "./types";
import {
  seedComments,
  seedCupones,
  seedFridges,
  seedGroups,
  seedProducts,
  seedPurchases,
  seedSaldos,
  seedStock,
  seedUsers,
} from "./mock-data";
import { randomId } from "./utils";

interface AppState {
  // Datos base
  users: User[];
  groups: Group[];
  fridges: Fridge[];
  products: Product[];
  stock: StockLote[];
  cupones: Cupon[];
  purchases: Purchase[];
  comments: Comment[];
  saldos: SaldoMovimiento[];

  // Sesión
  currentUserId: string | null;
  pendingLoginUserId: string | null;
  pending2FACode: string | null;

  // Carrito
  cart: CartItem[];
  appliedCouponId: string | null;

  // ---------------- Auth ----------------
  register: (
    payload: Omit<User, "id" | "fechaAlta" | "cuentaMercadoPago">
  ) => { ok: boolean; error?: string; userId?: string; code?: string };
  loginStart: (
    identifier: string,
    password: string
  ) => { ok: boolean; error?: string };
  loginVerify: (code: string) => { ok: boolean; error?: string };
  logout: () => void;

  // ---------------- Perfil / grupo ----------------
  linkMercadoPago: () => void;
  unlinkMercadoPago: () => void;
  addBalance: (amount: number) => void;
  approveJoinRequest: (userId: string) => void;
  rejectJoinRequest: (userId: string) => void;
  createGroup: (nombre: string) => void;
  requestJoinGroup: (groupId: string) => void;
  leaveGroup: () => void;

  // ---------------- Catálogo ----------------
  getStock: (fridgeId: string, productId: string) => number;
  getFridgeProducts: (fridgeId: string) => { product: Product; stock: number }[];
  findNearestFridgeWithStock: (query: string) => Fridge | null;

  // ---------------- Carrito ----------------
  addToCart: (
    productId: string,
    fridgeId: string,
    quantity: number,
    consumerUserId: string
  ) => { ok: boolean; error?: string };
  updateCartItem: (productId: string, fridgeId: string, patch: Partial<CartItem>) => void;
  removeFromCart: (productId: string, fridgeId: string) => void;
  clearCart: () => void;
  applyCoupon: (codigo: string) => { ok: boolean; error?: string };
  removeCoupon: () => void;

  // ---------------- Checkout ----------------
  checkout: (paymentMethod: "saldo_grupo" | "mercado_pago") => {
    ok: boolean;
    error?: string;
    purchaseIds?: string[];
  };
  pickupPurchase: (id: string) => { ok: boolean; error?: string };
  refreshPurchaseStatuses: () => void;

  // ---------------- Comentarios ----------------
  addComment: (productId: string, rating: number, text: string) => { ok: boolean; error?: string };

  // ---------------- Helpers ----------------
  getUserById: (id: string) => User | undefined;
  getCurrentUser: () => User | undefined;
  getCurrentGroup: () => Group | undefined;
  getGroupBalance: (groupId: string) => number;
  getCurrentUserCupones: () => Cupon[];
}

const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,16}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?\d{8,15}$/;

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      users: seedUsers,
      groups: seedGroups,
      fridges: seedFridges,
      products: seedProducts,
      stock: seedStock,
      cupones: seedCupones,
      purchases: seedPurchases,
      comments: seedComments,
      saldos: seedSaldos,

      currentUserId: null,
      pendingLoginUserId: null,
      pending2FACode: null,

      cart: [],
      appliedCouponId: null,

      // ---------------- Auth ----------------
      // En la v2 del prototipo el 2FA se pide solo al registrar (verificación de email).
      // En login se inicia sesión directamente con email/teléfono + password.
      register: (payload) => {
        const { users } = get();
        if (!emailRegex.test(payload.mail)) return { ok: false, error: "Email inválido" };
        if (!phoneRegex.test(payload.celular))
          return { ok: false, error: "Teléfono inválido" };
        if (!passwordRegex.test(payload.password))
          return {
            ok: false,
            error: "La contraseña debe tener 8-16 caracteres, una mayúscula y un número.",
          };
        if (users.some((u) => u.mail.toLowerCase() === payload.mail.toLowerCase()))
          return { ok: false, error: "El email ya está registrado." };
        if (users.some((u) => u.celular === payload.celular))
          return { ok: false, error: "El teléfono ya está registrado." };
        if (users.some((u) => u.dni === payload.dni))
          return { ok: false, error: "El documento ya está registrado." };
        if (!payload.nombre || !payload.apellido || !payload.dni)
          return { ok: false, error: "Completá todos los campos." };

        const newUser: User = {
          ...payload,
          id: randomId("u"),
          fechaAlta: new Date().toISOString(),
          cuentaMercadoPago: null,
        };
        const code = String(Math.floor(100000 + Math.random() * 900000));
        // El usuario queda creado pero la sesión no se inicia hasta validar el código.
        set({
          users: [...users, newUser],
          pendingLoginUserId: newUser.id,
          pending2FACode: code,
        });
        return { ok: true, userId: newUser.id, code };
      },

      loginStart: (identifier, password) => {
        const id = identifier.trim().toLowerCase();
        const user = get().users.find(
          (u) => u.mail.toLowerCase() === id || u.celular === identifier.trim()
        );
        if (!user) return { ok: false, error: "Usuario no encontrado." };
        if (user.password !== password)
          return { ok: false, error: "Contraseña incorrecta." };
        // Login directo: usuarios existentes no pasan por 2FA.
        set({
          currentUserId: user.id,
          pendingLoginUserId: null,
          pending2FACode: null,
        });
        return { ok: true };
      },

      loginVerify: (code) => {
        const { pendingLoginUserId, pending2FACode } = get();
        if (!pendingLoginUserId || !pending2FACode)
          return { ok: false, error: "Sesión inválida." };
        if (code.trim() !== pending2FACode)
          return { ok: false, error: "Código incorrecto." };
        set({
          currentUserId: pendingLoginUserId,
          pendingLoginUserId: null,
          pending2FACode: null,
        });
        return { ok: true };
      },

      logout: () =>
        set({
          currentUserId: null,
          pendingLoginUserId: null,
          pending2FACode: null,
          cart: [],
          appliedCouponId: null,
        }),

      // ---------------- Perfil / grupo ----------------
      linkMercadoPago: () => {
        const u = get().getCurrentUser();
        if (!u) return;
        set({
          users: get().users.map((x) =>
            x.id === u.id ? { ...x, cuentaMercadoPago: `MP-${randomId().slice(-8).toUpperCase()}` } : x
          ),
        });
      },
      unlinkMercadoPago: () => {
        const u = get().getCurrentUser();
        if (!u) return;
        set({
          users: get().users.map((x) =>
            x.id === u.id ? { ...x, cuentaMercadoPago: null } : x
          ),
        });
      },
      addBalance: (amount) => {
        const g = get().getCurrentGroup();
        if (!g) return;
        const mov: SaldoMovimiento = {
          id: randomId("sal"),
          groupId: g.id,
          monto: amount,
          fecha: new Date().toISOString(),
          tipo: "CARGA",
        };
        set({ saldos: [...get().saldos, mov] });
      },
      approveJoinRequest: (userId) => {
        const g = get().getCurrentGroup();
        if (!g) return;
        set({
          groups: get().groups.map((x) =>
            x.id === g.id
              ? {
                  ...x,
                  memberIds: [...x.memberIds, userId],
                  pendingRequests: x.pendingRequests.filter((r) => r.userId !== userId),
                }
              : x
          ),
        });
      },
      rejectJoinRequest: (userId) => {
        const g = get().getCurrentGroup();
        if (!g) return;
        set({
          groups: get().groups.map((x) =>
            x.id === g.id
              ? { ...x, pendingRequests: x.pendingRequests.filter((r) => r.userId !== userId) }
              : x
          ),
        });
      },
      createGroup: (nombre) => {
        const u = get().getCurrentUser();
        if (!u) return;
        // Si el usuario ya está en otro grupo, primero sale
        const groups = get().groups.map((g) =>
          g.memberIds.includes(u.id)
            ? { ...g, memberIds: g.memberIds.filter((id) => id !== u.id) }
            : g
        );
        const newGroup: Group = {
          id: randomId("g"),
          nombre,
          ownerId: u.id,
          memberIds: [u.id],
          pendingRequests: [],
        };
        set({ groups: [...groups, newGroup] });
      },
      requestJoinGroup: (groupId) => {
        const u = get().getCurrentUser();
        if (!u) return;
        set({
          groups: get().groups.map((g) =>
            g.id === groupId
              ? {
                  ...g,
                  pendingRequests: [
                    ...g.pendingRequests,
                    { userId: u.id, userName: `${u.nombre} ${u.apellido}` },
                  ],
                }
              : g
          ),
        });
      },
      leaveGroup: () => {
        const u = get().getCurrentUser();
        if (!u) return;
        set({
          groups: get().groups.map((g) =>
            g.memberIds.includes(u.id)
              ? { ...g, memberIds: g.memberIds.filter((id) => id !== u.id) }
              : g
          ),
        });
      },

      // ---------------- Catálogo ----------------
      getStock: (fridgeId, productId) => {
        return get()
          .stock.filter((s) => s.fridgeId === fridgeId && s.productId === productId)
          .reduce((sum, s) => sum + s.cantidad, 0);
      },

      getFridgeProducts: (fridgeId) => {
        const map = new Map<string, number>();
        for (const s of get().stock) {
          if (s.fridgeId !== fridgeId) continue;
          map.set(s.productId, (map.get(s.productId) ?? 0) + s.cantidad);
        }
        return Array.from(map.entries())
          .map(([pid, cantidad]) => {
            const product = get().products.find((p) => p.id === pid);
            return product ? { product, stock: cantidad } : null;
          })
          .filter((x): x is { product: Product; stock: number } => x !== null);
      },

      findNearestFridgeWithStock: (query) => {
        const term = query.trim().toLowerCase();
        if (!term) return null;
        const matchingProducts = get().products.filter((p) =>
          p.nombre.toLowerCase().includes(term)
        );
        if (matchingProducts.length === 0) return null;
        const productIds = new Set(matchingProducts.map((p) => p.id));
        const fridgesWithStock = get().fridges.filter((f) => {
          if (f.estado !== "Habilitada") return false;
          return get().stock.some(
            (s) => s.fridgeId === f.id && productIds.has(s.productId) && s.cantidad > 0
          );
        });
        return fridgesWithStock.sort((a, b) => a.distanceKm - b.distanceKm)[0] ?? null;
      },

      // ---------------- Carrito ----------------
      addToCart: (productId, fridgeId, quantity, consumerUserId) => {
        if (quantity <= 0) return { ok: false, error: "La cantidad debe ser mayor a 0." };
        const product = get().products.find((p) => p.id === productId);
        if (!product) return { ok: false, error: "Producto no encontrado." };
        const stock = get().getStock(fridgeId, productId);
        if (stock < quantity)
          return { ok: false, error: "Stock insuficiente en esta heladera." };

        const existing = get().cart.find(
          (c) => c.productId === productId && c.fridgeId === fridgeId
        );
        if (existing) {
          if (existing.quantity + quantity > stock)
            return { ok: false, error: "Stock insuficiente en esta heladera." };
          set({
            cart: get().cart.map((c) =>
              c.productId === productId && c.fridgeId === fridgeId
                ? { ...c, quantity: c.quantity + quantity, consumerUserId }
                : c
            ),
          });
        } else {
          set({
            cart: [
              ...get().cart,
              {
                productId,
                fridgeId,
                quantity,
                consumerUserId,
                unitPrice: product.precio,
              },
            ],
          });
        }
        return { ok: true };
      },
      updateCartItem: (productId, fridgeId, patch) =>
        set({
          cart: get().cart.map((c) =>
            c.productId === productId && c.fridgeId === fridgeId ? { ...c, ...patch } : c
          ),
        }),
      removeFromCart: (productId, fridgeId) =>
        set({
          cart: get().cart.filter(
            (c) => !(c.productId === productId && c.fridgeId === fridgeId)
          ),
        }),
      clearCart: () => set({ cart: [], appliedCouponId: null }),

      applyCoupon: (codigo) => {
        const user = get().getCurrentUser();
        if (!user) return { ok: false, error: "Iniciá sesión." };
        if (get().appliedCouponId)
          return { ok: false, error: "Ya hay un cupón aplicado. Quitalo para usar otro." };
        const c = get().cupones.find(
          (x) => x.codigo.toLowerCase() === codigo.trim().toLowerCase()
        );
        if (!c) return { ok: false, error: "Cupón inexistente." };
        if (c.userId !== user.id)
          return { ok: false, error: "Este cupón no pertenece a tu cuenta." };
        if (c.estado === "Usado") return { ok: false, error: "Cupón ya utilizado." };
        if (c.estado === "Vencido") return { ok: false, error: "Cupón vencido." };
        if (new Date(c.fechaVencimiento).getTime() < Date.now())
          return { ok: false, error: "Cupón vencido." };
        set({ appliedCouponId: c.id });
        return { ok: true };
      },
      removeCoupon: () => set({ appliedCouponId: null }),

      // ---------------- Checkout ----------------
      checkout: (paymentMethod) => {
        const user = get().getCurrentUser();
        if (!user) return { ok: false, error: "No hay sesión activa." };
        const { cart, products, appliedCouponId, cupones } = get();
        if (cart.length === 0) return { ok: false, error: "Carrito vacío." };

        // Re-validar stock
        for (const item of cart) {
          const stock = get().getStock(item.fridgeId, item.productId);
          if (stock < item.quantity) {
            const p = products.find((pp) => pp.id === item.productId);
            return { ok: false, error: `Stock insuficiente: ${p?.nombre ?? item.productId}` };
          }
        }

        const cupon = appliedCouponId ? cupones.find((c) => c.id === appliedCouponId) : undefined;
        const subtotalAll = cart.reduce((s, c) => s + c.unitPrice * c.quantity, 0);
        const discountAll = cupon ? Math.round(subtotalAll * (cupon.porcentajeDto / 100)) : 0;
        const totalAll = subtotalAll - discountAll;

        const group = get().getCurrentGroup();

        if (paymentMethod === "saldo_grupo") {
          if (!group) return { ok: false, error: "No pertenecés a ningún grupo." };
          const balance = get().getGroupBalance(group.id);
          if (balance < totalAll)
            return { ok: false, error: "Saldo del grupo insuficiente." };
        } else {
          if (!user.cuentaMercadoPago)
            return { ok: false, error: "Vinculá Mercado Pago para pagar." };
        }

        // Split por (heladera × consumidor) — el esquema DB tiene 1 consumidor por compra
        const keyMap = new Map<string, CartItem[]>();
        for (const it of cart) {
          const key = `${it.fridgeId}|${it.consumerUserId}`;
          const arr = keyMap.get(key) ?? [];
          arr.push(it);
          keyMap.set(key, arr);
        }

        const createdAt = new Date();
        const expiresAt = new Date(createdAt.getTime() + 4 * 60 * 60 * 1000);
        const newPurchases: Purchase[] = [];

        for (const [key, items] of keyMap.entries()) {
          const [fridgeId, consumidorId] = key.split("|");
          const sub = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
          const disc = cupon ? Math.round(sub * (cupon.porcentajeDto / 100)) : 0;
          const total = sub - disc;
          const purchaseItems: PurchaseItem[] = items.map((i) => {
            const p = products.find((pp) => pp.id === i.productId)!;
            return {
              productId: i.productId,
              productName: p.nombre,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
            };
          });
          newPurchases.push({
            id: randomId("pur"),
            compradorId: user.id,
            consumidorId,
            fridgeId,
            cuponId: cupon?.id,
            items: purchaseItems,
            subtotal: sub,
            discount: disc,
            total,
            paymentMethod,
            createdAt: createdAt.toISOString(),
            expiresAt: expiresAt.toISOString(),
            status: "Pendiente",
            tokenApertura: `TOK-${randomId().slice(-8).toUpperCase()}`,
          });
        }

        // Descontar stock (del lote más viejo primero)
        const stock = [...get().stock].sort((a, b) =>
          a.fechaVencimiento.localeCompare(b.fechaVencimiento)
        );
        for (const item of cart) {
          let remaining = item.quantity;
          for (const s of stock) {
            if (remaining <= 0) break;
            if (s.fridgeId !== item.fridgeId || s.productId !== item.productId) continue;
            const take = Math.min(s.cantidad, remaining);
            s.cantidad -= take;
            remaining -= take;
          }
        }

        // Marcar cupón como Usado
        let cupones2 = get().cupones;
        if (cupon) {
          cupones2 = cupones2.map((c) =>
            c.id === cupon.id ? { ...c, estado: "Usado" as const } : c
          );
        }

        // Registrar saldo USO si corresponde
        let saldos2 = get().saldos;
        if (paymentMethod === "saldo_grupo" && group) {
          saldos2 = [
            ...saldos2,
            {
              id: randomId("sal"),
              groupId: group.id,
              monto: totalAll,
              fecha: createdAt.toISOString(),
              tipo: "USO",
            },
          ];
        }

        set({
          stock,
          cupones: cupones2,
          saldos: saldos2,
          purchases: [...newPurchases, ...get().purchases],
          cart: [],
          appliedCouponId: null,
        });

        return { ok: true, purchaseIds: newPurchases.map((p) => p.id) };
      },

      pickupPurchase: (id) => {
        const p = get().purchases.find((x) => x.id === id);
        if (!p) return { ok: false, error: "Compra inexistente." };
        if (p.status !== "Pendiente")
          return { ok: false, error: "La compra ya no está activa." };
        if (new Date(p.expiresAt).getTime() < Date.now()) {
          set({
            purchases: get().purchases.map((x) =>
              x.id === id ? { ...x, status: "Vencida-Reembolsada" } : x
            ),
          });
          return { ok: false, error: "El tiempo de retiro expiró." };
        }
        set({
          purchases: get().purchases.map((x) =>
            x.id === id ? { ...x, status: "Retirada" } : x
          ),
        });
        return { ok: true };
      },

      refreshPurchaseStatuses: () => {
        const now = Date.now();
        set({
          purchases: get().purchases.map((p) =>
            p.status === "Pendiente" && new Date(p.expiresAt).getTime() < now
              ? { ...p, status: "Vencida-Reembolsada" }
              : p
          ),
        });
      },

      // ---------------- Comentarios ----------------
      addComment: (productId, rating, text) => {
        const u = get().getCurrentUser();
        if (!u) return { ok: false, error: "Iniciá sesión para comentar." };
        const purchased = get().purchases.some(
          (p) =>
            (p.compradorId === u.id || p.consumidorId === u.id) &&
            p.items.some((i) => i.productId === productId)
        );
        if (!purchased)
          return { ok: false, error: "Solo podés calificar productos que compraste o consumiste." };
        if (rating < 1 || rating > 5)
          return { ok: false, error: "Calificación entre 1 y 5." };
        if (!text.trim()) return { ok: false, error: "Escribí un comentario." };
        const comment: Comment = {
          id: randomId("com"),
          userId: u.id,
          userName: `${u.nombre} ${u.apellido[0]}.`,
          productId,
          rating,
          text: text.trim(),
          createdAt: new Date().toISOString(),
        };
        set({ comments: [comment, ...get().comments] });
        return { ok: true };
      },

      // ---------------- Helpers ----------------
      getUserById: (id) => get().users.find((u) => u.id === id),
      getCurrentUser: () => {
        const id = get().currentUserId;
        return id ? get().users.find((u) => u.id === id) : undefined;
      },
      getCurrentGroup: () => {
        const u = get().getCurrentUser();
        if (!u) return undefined;
        return get().groups.find((g) => g.memberIds.includes(u.id));
      },
      getGroupBalance: (groupId) => {
        return get().saldos.reduce((acc, mov) => {
          if (mov.groupId !== groupId) return acc;
          return acc + (mov.tipo === "CARGA" ? mov.monto : -mov.monto);
        }, 0);
      },
      getCurrentUserCupones: () => {
        const u = get().getCurrentUser();
        if (!u) return [];
        return get().cupones.filter((c) => c.userId === u.id);
      },
    }),
    {
      name: "intelligent-food-store",
      // v3: imágenes locales por producto + logo. Bump invalida cualquier
      // localStorage previo que tenía URLs de Unsplash cacheadas.
      version: 3,
      // Solo persistimos estado mutable de usuario. Catálogo, heladeras,
      // cupones y comentarios se re-leen del seed para tomar nuevas fotos /
      // textos sin necesitar bumps adicionales.
      partialize: (state) => ({
        currentUserId: state.currentUserId,
        users: state.users,
        groups: state.groups,
        stock: state.stock,
        cart: state.cart,
        appliedCouponId: state.appliedCouponId,
        purchases: state.purchases,
        saldos: state.saldos,
      }),
    }
  )
);
