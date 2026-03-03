import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabase/client';
import { AuthContext } from './AuthContext'; // NUEVO: Importamos a nuestro usuario

export const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState([]);
  
  // Leemos en tiempo real quién tiene la sesión iniciada
  const { usuario } = useContext(AuthContext); 

  // 1. Efecto: Descargar el carrito cuando el usuario inicia sesión
  useEffect(() => {
    if (usuario) {
      cargarCarritoNube();
    } else {
      // Si cierra sesión, limpiamos la memoria local por seguridad
      setCarrito([]); 
    }
  }, [usuario]); // Se vuelve a ejecutar cada que el "usuario" cambia

  const cargarCarritoNube = async () => {
    const { data, error } = await supabase
      .from('carrito')
      .select('*')
      .eq('user_id', usuario.id); // Pedimos solo LOS SUYOS
    
    if (error) {
      console.error("Error al descargar carrito:", error);
    } else if (data) {
      // Formateamos los datos para que React los entienda igual que antes
      const carritoFormateado = data.map(item => ({
        producto_id: item.producto_id,
        cantidad: item.cantidad,
        precioVenta: parseFloat(item.precio_venta),
        modelo: item.modelo,
        marca: item.marca,
        img_portada: item.img_portada
      }));
      setCarrito(carritoFormateado);
    }
  };

  // 2. Agregar un producto: Primero a la nube, luego a la pantalla
  const agregarAlCarrito = async (producto, precioVenta, cantidadAgregada = 1) => {
    if (!usuario) return; // Si no hay usuario, cancelamos

    // Convertimos a texto por si Syscom manda números
    const prodId = String(producto.producto_id); 
    const productoExistente = carrito.find(item => item.producto_id === prodId);

    if (productoExistente) {
      // Ya existe: Actualizamos la CANTIDAD en la nube
      const nuevaCantidad = productoExistente.cantidad + cantidadAgregada;
      const { error } = await supabase
        .from('carrito')
        .update({ cantidad: nuevaCantidad })
        .eq('user_id', usuario.id)
        .eq('producto_id', prodId);
        
      if (!error) {
        setCarrito(carrito.map(item => 
          item.producto_id === prodId ? { ...item, cantidad: nuevaCantidad } : item
        ));
      }
    } else {
      // Es nuevo: Lo INSERTAMOS en la nube
      const nuevoItemDB = {
        user_id: usuario.id,
        producto_id: prodId,
        cantidad: cantidadAgregada,
        precio_venta: precioVenta,
        modelo: producto.modelo,
        marca: producto.marca,
        img_portada: producto.img_portada
      };

      const { error } = await supabase.from('carrito').insert([nuevoItemDB]);

      if (!error) {
        // Si la nube dice "OK", lo mostramos en la pantalla
        setCarrito([...carrito, { 
          producto_id: prodId, 
          precioVenta, 
          cantidad: cantidadAgregada,
          modelo: producto.modelo,
          marca: producto.marca,
          img_portada: producto.img_portada
        }]);
      } else {
        console.error("No se pudo guardar en la base de datos:", error);
      }
    }
  };

  // 3. Eliminar: Borramos de la nube y luego de la pantalla
  const eliminarDelCarrito = async (id) => {
    if (!usuario) return;
    
    const { error } = await supabase
      .from('carrito')
      .delete()
      .eq('user_id', usuario.id)
      .eq('producto_id', String(id));

    if (!error) {
      setCarrito(carrito.filter(item => item.producto_id !== String(id)));
    }
  };

  // 4. Actualizar botones + y - : Guardamos el cambio en la nube
  const actualizarCantidad = async (id, nuevaCantidad) => {
    if (!usuario || nuevaCantidad < 1) return;
    
    const { error } = await supabase
      .from('carrito')
      .update({ cantidad: nuevaCantidad })
      .eq('user_id', usuario.id)
      .eq('producto_id', String(id));

    if (!error) {
      setCarrito(carrito.map(item => 
        item.producto_id === String(id) ? { ...item, cantidad: nuevaCantidad } : item
      ));
    }
  };

  return (
    <CarritoContext.Provider value={{ carrito, agregarAlCarrito, eliminarDelCarrito, actualizarCantidad }}>
      {children}
    </CarritoContext.Provider>
  );
}