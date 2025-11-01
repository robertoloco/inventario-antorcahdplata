import Dexie from 'dexie';
import { supabase, isSupabaseEnabled } from './supabaseClient';

// IndexedDB local (fallback)
export const db = new Dexie('InventarioAntorcaDB');

db.version(2).stores({
  productos: '++id, nombre, categoria, precio, stock, imagen, createdAt',
  ventas: '++id, productoId, cantidad, precioVenta, fecha, tipo, metodoPago',
  caja: '++id, fecha, tipo, monto, descripcion, ventaId, metodoPago'
});

// Helper para convertir nombres de columnas (camelCase <-> snake_case)
const toSnakeCase = (obj) => {
  const result = {};
  for (const key in obj) {
    const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
    result[snakeKey] = obj[key];
  }
  return result;
};

const toCamelCase = (obj) => {
  const result = {};
  for (const key in obj) {
    const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
    result[camelKey] = obj[key];
  }
  return result;
};

// Funciones helper para productos (híbrido Supabase + IndexedDB)
export const productosDB = {
  async getAll() {
    if (isSupabaseEnabled()) {
      try {
        const { data, error } = await supabase.from('productos').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data.map(toCamelCase);
      } catch (error) {
        console.warn('Supabase error, usando IndexedDB local:', error);
      }
    }
    return await db.productos.toArray();
  },
  
  async add(producto) {
    if (isSupabaseEnabled()) {
      try {
        const productoData = { ...toSnakeCase(producto), created_at: new Date().toISOString() };
        const { data, error } = await supabase.from('productos').insert([productoData]).select();
        if (error) throw error;
        return data[0].id;
      } catch (error) {
        console.warn('Supabase error, usando IndexedDB local:', error);
      }
    }
    return await db.productos.add({ ...producto, createdAt: new Date().toISOString() });
  },
  
  async update(id, producto) {
    if (isSupabaseEnabled()) {
      try {
        const productoData = { ...toSnakeCase(producto), updated_at: new Date().toISOString() };
        const { error } = await supabase.from('productos').update(productoData).eq('id', id);
        if (error) throw error;
        return;
      } catch (error) {
        console.warn('Supabase error, usando IndexedDB local:', error);
      }
    }
    return await db.productos.update(id, producto);
  },
  
  async delete(id) {
    if (isSupabaseEnabled()) {
      try {
        const { error } = await supabase.from('productos').delete().eq('id', id);
        if (error) throw error;
        return;
      } catch (error) {
        console.warn('Supabase error, usando IndexedDB local:', error);
      }
    }
    return await db.productos.delete(id);
  },
  
  async getById(id) {
    if (isSupabaseEnabled()) {
      try {
        const { data, error } = await supabase.from('productos').select('*').eq('id', id).single();
        if (error) throw error;
        return toCamelCase(data);
      } catch (error) {
        console.warn('Supabase error, usando IndexedDB local:', error);
      }
    }
    return await db.productos.get(id);
  },
  
  async updateStock(id, cantidad) {
    const producto = await this.getById(id);
    if (producto) {
      const nuevoStock = (parseInt(producto.stock) || 0) + cantidad;
      return await this.update(id, { stock: nuevoStock });
    }
  }
};

// Funciones helper para ventas (híbrido)
export const ventasDB = {
  async getAll() {
    if (isSupabaseEnabled()) {
      try {
        const { data, error } = await supabase.from('ventas').select('*').order('fecha', { ascending: false });
        if (error) throw error;
        return data.map(toCamelCase);
      } catch (error) {
        console.warn('Supabase error, usando IndexedDB local:', error);
      }
    }
    return await db.ventas.orderBy('fecha').reverse().toArray();
  },
  
  async add(venta) {
    const fecha = new Date().toISOString();
    if (isSupabaseEnabled()) {
      try {
        const ventaData = { ...toSnakeCase(venta), fecha };
        const { data, error } = await supabase.from('ventas').insert([ventaData]).select();
        if (error) throw error;
        return data[0].id;
      } catch (error) {
        console.warn('Supabase error, usando IndexedDB local:', error);
      }
    }
    return await db.ventas.add({ ...venta, fecha });
  },
  
  async getByFecha(fecha) {
    const startOfDay = new Date(fecha);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(fecha);
    endOfDay.setHours(23, 59, 59, 999);
    
    if (isSupabaseEnabled()) {
      try {
        const { data, error } = await supabase
          .from('ventas')
          .select('*')
          .gte('fecha', startOfDay.toISOString())
          .lte('fecha', endOfDay.toISOString());
        if (error) throw error;
        return data.map(toCamelCase);
      } catch (error) {
        console.warn('Supabase error, usando IndexedDB local:', error);
      }
    }
    return await db.ventas.where('fecha').between(startOfDay.toISOString(), endOfDay.toISOString()).toArray();
  }
};

// Funciones helper para caja (híbrido)
export const cajaDB = {
  async getAll() {
    if (isSupabaseEnabled()) {
      try {
        const { data, error } = await supabase.from('caja').select('*').order('fecha', { ascending: false });
        if (error) throw error;
        return data.map(toCamelCase);
      } catch (error) {
        console.warn('Supabase error, usando IndexedDB local:', error);
      }
    }
    return await db.caja.orderBy('fecha').reverse().toArray();
  },
  
  async add(movimiento) {
    const fecha = new Date().toISOString();
    if (isSupabaseEnabled()) {
      try {
        const cajaData = { ...toSnakeCase(movimiento), fecha };
        const { data, error } = await supabase.from('caja').insert([cajaData]).select();
        if (error) throw error;
        return data[0].id;
      } catch (error) {
        console.warn('Supabase error, usando IndexedDB local:', error);
      }
    }
    return await db.caja.add({ ...movimiento, fecha });
  },
  
  async getBalance() {
    const movimientos = await this.getAll();
    return movimientos.reduce((total, mov) => {
      const monto = parseFloat(mov.monto) || 0;
      return mov.tipo === 'ingreso' ? total + monto : total - monto;
    }, 0);
  },
  
  async getBalanceByFecha(fecha) {
    const startOfDay = new Date(fecha);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(fecha);
    endOfDay.setHours(23, 59, 59, 999);
    
    if (isSupabaseEnabled()) {
      try {
        const { data, error } = await supabase
          .from('caja')
          .select('*')
          .gte('fecha', startOfDay.toISOString())
          .lte('fecha', endOfDay.toISOString());
        if (error) throw error;
        return data.map(toCamelCase).reduce((total, mov) => {
          const monto = parseFloat(mov.monto) || 0;
          return mov.tipo === 'ingreso' ? total + monto : total - monto;
        }, 0);
      } catch (error) {
        console.warn('Supabase error, usando IndexedDB local:', error);
      }
    }
    
    const movimientos = await db.caja.where('fecha').between(startOfDay.toISOString(), endOfDay.toISOString()).toArray();
    return movimientos.reduce((total, mov) => {
      const monto = parseFloat(mov.monto) || 0;
      return mov.tipo === 'ingreso' ? total + monto : total - monto;
    }, 0);
  }
};

// Función para registrar una venta completa (actualiza stock, caja y ventas)
export const registrarVenta = async (productoId, cantidad, precioVenta, metodoPago = 'efectivo') => {
  try {
    const producto = await productosDB.getById(productoId);
    
    if (!producto) {
      throw new Error('Producto no encontrado');
    }
    
    if (producto.stock < cantidad) {
      throw new Error('Stock insuficiente');
    }
    
    // Registrar venta
    const ventaId = await ventasDB.add({
      productoId,
      cantidad,
      precioVenta,
      tipo: 'venta',
      metodoPago
    });
    
    // Actualizar stock
    await productosDB.updateStock(productoId, -cantidad);
    
    // Registrar en caja
    await cajaDB.add({
      tipo: 'ingreso',
      monto: precioVenta * cantidad,
      descripcion: `Venta: ${producto.nombre} x${cantidad}`,
      ventaId,
      metodoPago
    });
    
    return ventaId;
  } catch (error) {
    console.error('Error al registrar venta:', error);
    throw error;
  }
};

// Función para registrar producción (aumenta stock)
export const registrarProduccion = async (productoId, cantidad) => {
  try {
    await productosDB.updateStock(productoId, cantidad);
    
    const producto = await productosDB.getById(productoId);
    await ventasDB.add({
      productoId,
      cantidad,
      precioVenta: 0,
      tipo: 'produccion'
    });
    
    return true;
  } catch (error) {
    console.error('Error al registrar producción:', error);
    throw error;
  }
};
