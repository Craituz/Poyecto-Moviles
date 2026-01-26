/**
 * Servicio para crear notificaciones in-app automáticas basadas en cambios de estado de órdenes
 * Proporciona funciones para:
 * - Detectar cambios de estado
 * - Crear notificaciones con mensajes personalizados según el nuevo estado
 */

const ORDER_STATUS_MESSAGES = {
  pendiente: {
    title: '📋 Pedido Recibido',
    body: 'Tu pedido ha sido confirmado. Estamos procesando tu solicitud.',
    emoji: '⏳'
  },
  preparando: {
    title: '👨‍🍳 Preparando tu Pedido',
    body: 'Tu pedido está siendo preparado en la cocina. ¡Falta poco!',
    emoji: '👨‍🍳'
  },
  enviado: {
    title: '🚗 Tu Pedido está en Camino',
    body: 'Tu pedido ha salido en camino. Llegaremos pronto a tu puerta.',
    emoji: '🚗'
  },
  entregado: {
    title: '✅ Pedido Entregado',
    body: '¡Tu pedido ha sido entregado! Esperamos que disfrutes tu orden.',
    emoji: '✅'
  },
  cancelado: {
    title: '❌ Pedido Cancelado',
    body: 'Tu pedido ha sido cancelado. Contacta con nosotros si tienes dudas.',
    emoji: '❌'
  }
};

/**
 * Crear una notificación in-app para un cambio de estado de orden
 * @param {Object} order - Objeto de orden con id, status, total, items
 * @param {string} newStatus - El nuevo estado del pedido
 * @param {Function} addInAppNotification - Función del contexto para agregar notificación
 */
export const createOrderStatusNotification = (order, newStatus, addInAppNotification) => {
  if (!ORDER_STATUS_MESSAGES[newStatus]) {
    console.warn(`⚠️ Estado de pedido desconocido: ${newStatus}`);
    return;
  }

  const message = ORDER_STATUS_MESSAGES[newStatus];
  
  try {
    addInAppNotification({
      type: 'order',
      title: `${message.emoji} Pedido #${order.id}`,
      body: message.body
    });
    
    console.log(`✅ Notificación creada: ${newStatus}`);
  } catch (error) {
    console.error(`❌ Error creando notificación para estado ${newStatus}:`, error);
  }
};

/**
 * Detectar cambios de estado entre dos listas de órdenes
 * y crear notificaciones automáticas
 * @param {Array} oldOrders - Lista anterior de órdenes
 * @param {Array} newOrders - Lista nueva de órdenes
 * @param {Function} addInAppNotification - Función del contexto para agregar notificación
 */
export const detectAndNotifyOrderStatusChanges = (oldOrders, newOrders, addInAppNotification) => {
  if (!oldOrders || oldOrders.length === 0) {
    // Primera carga, no crear notificaciones
    return;
  }

  const oldOrderMap = new Map(oldOrders.map(o => [o.id, o]));

  newOrders.forEach(newOrder => {
    const oldOrder = oldOrderMap.get(newOrder.id);
    
    // Si la orden existía antes y su estado cambió
    if (oldOrder && oldOrder.status !== newOrder.status) {
      console.log(`🔔 Cambio detectado: Pedido #${newOrder.id} pasó de ${oldOrder.status} a ${newOrder.status}`);
      createOrderStatusNotification(newOrder, newOrder.status, addInAppNotification);
    }
  });
};
