# Prompt para Claude Code — Prototipo App Móvil "Intelligent Food" (v1.0)

Copiá y pegá todo el bloque de abajo como prompt inicial en Claude Code.

---

## PROMPT

Quiero que generes un **prototipo funcional de aplicación móvil** (React Native con Expo) para **Intelligent Food**, una app que conecta usuarios con heladeras inteligentes ubicadas en comercios de Tandil, donde se venden comidas saludables. Es un prototipo para una entrega académica (Análisis y Diseño de Sistemas II), por lo que **no necesita backend real ni integraciones reales** con Mercado Pago o hardware NFC/QR: todo el estado (usuarios, stock, compras, saldo) debe simularse en memoria/mock data dentro de la app, de forma que las pantallas y flujos sean completamente navegables y demostrables.

### Alcance: solo funcionalidades de la Versión 1.0

Implementá únicamente lo correspondiente al lanzamiento inicial del sistema. No incluyas funciones de versiones futuras (favoritos, mapa interactivo, suscripciones, perfil nutricional, dashboard de métricas, programa de puntos, etc.).

### 1\. Landing / Onboarding con video controlado por scroll

Antes de llegar a registro/login, agregá una pantalla de **presentación de Intelligent Food** con un video interactivo que avanza según el scroll del usuario (no se reproduce solo). Esta sección es de marketing/onboarding, no forma parte de las user stories del TPE, pero sirve para explicar la propuesta de valor antes de pedir registro.

Requisitos técnicos:

- El video avanza **frame por frame según el scroll**: hacia abajo \= avanza, hacia arriba \= retrocede.  
- Debe responder tanto a **rueda del mouse (desktop)** como a **swipe/touch (móvil)**.  
- El video **no se reproduce automáticamente**; el único control de avance es el scroll del usuario.  
- La **velocidad de avance del video es proporcional a la velocidad del scroll** (un scroll rápido avanza más frames que uno lento).  
- Cuando el usuario deja de hacer scroll, el video se **detiene** en el frame correspondiente (sin seguir reproduciéndose solo).  
- Layout a elección: full-screen o con margen lateral.  
- Mostrar un **indicador visual de progreso** del video (barra o porcentaje).  
- Transiciones suaves entre frames, sin saltos bruscos.  
- Botón opcional de **reset** para volver al inicio del video.  
- Sonido **deshabilitado por defecto**, con opción manual para activarlo.  
- Al terminar el video, el scroll puede continuar hacia el resto de la landing (texto/imágenes de contexto sobre Intelligent Food) y de ahí hacia el botón de registro/login.  
- Soportar **dark mode / light mode**, consistente con el resto de la app.  
- Responsive / mobile-first; compatible con Chrome, Safari, Firefox y Edge.

Nota de implementación (importante): el resto de este prototipo es **React Native \+ Expo** (no web), mientras que esta sección de scroll-video está pensada originalmente para **HTML5 `<video>` \+ GSAP ScrollTrigger/ScrollToPlugin**, que es tecnología web. Resolvé esto de la forma que tenga más sentido según el contexto real del proyecto:

- Si esta landing va a vivir en una **web previa** a la descarga de la app (ej. una landing page de marketing separada), implementala ahí como HTML5 `<video>` \+ GSAP, tal cual se especifica arriba, sirviendo el video local o vía CDN.  
- Si esta landing tiene que vivir **dentro de la app Expo** como primera pantalla, adaptá el mismo comportamiento usando `expo-av` o `react-native-video` para el video y un listener de gestos/scroll (`PanResponder`, `react-native-gesture-handler` o `Animated` con `ScrollView`/`onScroll`) para mapear el delta de scroll a frames del video, ya que GSAP ScrollTrigger no corre en React Native. Mantené el mismo comportamiento funcional (avance proporcional, sin autoplay, indicador de progreso, reset, mute por defecto).

Preguntame cuál de los dos escenarios aplica si no queda claro por el resto del prompt.

### 2\. Registro y autenticación de usuarios (US1, US2)

- Pantalla de **registro**: nombre, apellido, tipo y número de documento, sexo, número de celular, email, contraseña.  
  - Validar contraseña: 8 a 16 caracteres, al menos una mayúscula y un número.  
  - Validar que el email y el número de teléfono no estén ya registrados (simulado contra el mock de usuarios).  
  - Mostrar errores específicos por campo inválido o incompleto.  
  - Al confirmar, asignar un número identificatorio de cuenta y fecha de alta (simulados).  
- Pantalla de **login**: email o teléfono \+ contraseña.  
  - Simular el envío de un código de confirmación (2FA) por mail tras credenciales correctas, con una pantalla de ingreso de código de 6 dígitos antes de entrar a la app.  
  - Rechazar credenciales incorrectas con mensaje de error.  
  - La sesión queda iniciada una vez pasado el 2FA (no se vuelve a pedir hasta cerrar sesión).  
  - Link a pantalla de registro si el usuario no tiene cuenta.

### 3\. Vinculación de medio de pago y grupos (supuestos del TPE)

- La vinculación a Mercado Pago **no es obligatoria** para crear la cuenta ni para loguearse: el usuario puede navegar productos y precios sin vincular nada.  
- Pantalla de **perfil/cuenta** donde el usuario puede:  
  - Vincular su cuenta a Mercado Pago (simulado, solo UI).  
  - Ver su grupo de compras (ej. "Familia"): si pertenece a uno, ver miembros; si no, poder crear un grupo o solicitar unirse a uno existente.  
  - Si es el usuario principal de un grupo, ver y **aprobar/rechazar solicitudes** de otros usuarios para unirse.  
  - Ver el **saldo del grupo** (créditos cargados por miembros con Mercado Pago vinculado, que cualquier miembro puede usar sin tener su propia cuenta de MP vinculada).

### 4\. Catálogo, selección de productos y carrito (US3, US4)

- Pantalla de **listado de heladeras** (solo las habilitadas, no las que están en mantenimiento), mostrando nombre/ubicación y distancia simulada.  
  - Incluir la función "buscar producto → mostrarme la heladera habilitada más cercana con stock disponible" (con datos mock de geolocalización).  
- Pantalla de **catálogo de productos** por heladera, mostrando: nombre, precio, stock disponible actualizado, e indicando claramente cuando un producto está sin stock (no seleccionable).  
- Pantalla de **detalle de producto**: precio, descripción, comentarios y calificaciones de compras verificadas (ver punto 6).  
  - Selector de cantidad; debe rechazar cantidad \= 0 con mensaje de error.  
- **Carrito de compras**: guarda la selección, permite elegir el **consumidor final** de cada ítem (uno mismo u otro miembro del grupo), muestra precio por ítem y total, y permite avanzar al pago.

### 5\. Cupones (US7)

- En el carrito o checkout, campo para ingresar un código de cupón.  
  - Simular validación: cupón válido aplica el descuento; cupón inválido o vencido se rechaza con mensaje de error.  
  - No son acumulables: si ya hay un cupón aplicado, rechazar el ingreso de uno nuevo (mostrar opción de reemplazarlo).  
  - Mostrar precio final con descuento aplicado.

### 6\. Checkout y pago

- Pantalla de **confirmación de compra**: resumen de productos, consumidor final por ítem, cupón aplicado, total.  
- Pago simulado: elegir entre saldo del grupo o Mercado Pago vinculado (mock, sin pasarela real). Mostrar estado de éxito/error.  
- Al confirmar, generar una **compra** con fecha y hora, y un **token/QR de retiro** con cuenta regresiva visible de **4 horas** para retirar el producto en la heladera seleccionada.  
  - Si la compra incluye productos de heladeras distintas, generar un QR/token separado por heladera (cada una cuenta como una compra distinta).

### 7\. Retiro en heladera (simulación de apertura)

- Pantalla de **"Mi compra activa"** con el QR generado y el conteo de tiempo restante.  
- Botón "Escanear en heladera" que simula la lectura del QR y, si la compra está vigente, muestra una animación/mensaje de **apertura exitosa** (debe sentirse casi instantánea). Si ya vencieron las 4 horas, mostrar mensaje de compra expirada.

### 8\. Comentarios y calificaciones (US6, US8)

- Desde el historial de compras, permitir **comentar y calificar** únicamente productos ya comprados por el usuario.  
- Los comentarios quedan asociados al producto y visibles para todos los usuarios en la pantalla de detalle del producto.

### 9\. Historial de compras

- Pantalla con listado de compras pasadas: fecha/hora, productos, heladera, consumidor final, estado (retirada / expirada).

### Lineamientos de UI/UX (requerimientos no funcionales del TPE)

- Soportar **tema claro y oscuro** (dinámico), pensado para uso en la calle con baja iluminación o distracciones.  
- Tipografía **sans-serif**, interfaz simple y consistente, minimizando pasos y carga cognitiva en las pantallas de compra y retiro.  
- Diseño mobile-first, navegación clara entre: Landing/Video → Inicio/Heladeras cercanas → Catálogo → Detalle → Carrito → Checkout → Compra activa/QR → Historial → Perfil/Grupo.

### Datos mock necesarios

Generá datos de ejemplo realistas para: usuarios (incluido un grupo familiar de 2-3 miembros con solicitudes pendientes), 3-4 heladeras en distintos puntos de Tandil (alguna en mantenimiento, para verificar que no se muestra), productos con stock variable (incluir al menos uno sin stock), cupones (uno válido, uno vencido), y compras/comentarios previos para poblar el historial y las calificaciones.

### Entregable

Estructura de proyecto Expo/React Native navegable de punta a punta cubriendo todos los flujos anteriores, con datos mock y sin dependencias de backend real, lista para correr con `npx expo start` y demostrar el prototipo en un emulador o Expo Go.

---

## Notas para vos (no van en el prompt)

- La sección de landing/video por scroll no está en el alcance original del TPE (US1-US8): la agregué como capa de marketing/onboarding. Definí antes de correr el prompt si va a vivir en una landing web separada (ahí sí tiene sentido HTML5 \+ GSAP tal cual) o dentro de la app Expo (requiere adaptar la lógica a React Native), porque cambia bastante la implementación.  
- Dejé afuera a propósito: encargado de mantenimiento, administrador de heladeras, cocina central y auditor/gerencia — esos son paneles de **otros stakeholders** (algunos web, según el TPE), no parte de la app móvil del usuario final.  
- Si más adelante querés ampliar a V1.1 (alertas de no retiro, reportes) o V2.0 (mapa, favoritos, suscripciones), conviene pedirlo como una iteración aparte sobre este mismo proyecto, no mezclarlo en el prompt inicial.  
- Si después querés que lo prototipe yo mismo contra Lovable usando el MCP conectado, avisame y lo armamos directo ahí en lugar de pasarte el prompt para Claude Code.

