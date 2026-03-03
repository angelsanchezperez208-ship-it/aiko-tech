import { useContext } from 'react';
import { CarritoContext } from '../context/CarritoContext';
import './Carrito.css';

export default function Carrito() {
  // NUEVO: Traemos la función de actualizarCantidad
  const { carrito, eliminarDelCarrito, actualizarCantidad } = useContext(CarritoContext);

  const totalPagar = carrito.reduce((suma, item) => suma + (item.precioVenta * item.cantidad), 0);

  return (
    <div className="contenedor-carrito">
      <h2 className="titulo-carrito">Tu Carrito de Compras</h2>

      {carrito.length === 0 ? (
        <div className="carrito-vacio">
          <p>Aún no has agregado productos de seguridad a tu carrito.</p>
          <a href="/productos" className="btn-volver-tienda">Ir al Catálogo</a>
        </div>
      ) : (
        <div className="carrito-contenido">
          
          <div className="lista-productos">
            {carrito.map((item) => (
              <div key={item.producto_id} className="item-carrito">
                <img src={item.img_portada} alt={item.modelo} className="item-imagen" />
                
                <div className="item-detalles">
                  <h4>{item.modelo}</h4>
                  <p className="item-marca">{item.marca}</p>
                  <p className="item-precio">${item.precioVenta.toFixed(2)} USD c/u</p>
                </div>

                {/* NUEVO: Controles de cantidad en el carrito */}
                <div className="control-cantidad-carrito">
                  <button 
                    onClick={() => actualizarCantidad(item.producto_id, item.cantidad - 1)}
                    disabled={item.cantidad <= 1}
                  >
                    -
                  </button>
                  <span>{item.cantidad}</span>
                  <button 
                    onClick={() => actualizarCantidad(item.producto_id, item.cantidad + 1)}
                  >
                    +
                  </button>
                </div>

                <div className="item-subtotal">
                  <p className="subtotal-texto">${(item.precioVenta * item.cantidad).toFixed(2)} USD</p>
                  <button onClick={() => eliminarDelCarrito(item.producto_id)} className="btn-eliminar" title="Eliminar producto">
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="resumen-compra">
            <h3>Resumen del Pedido</h3>
            <div className="resumen-fila">
              <span>Subtotal:</span>
              <span>${totalPagar.toFixed(2)} USD</span>
            </div>
            <div className="resumen-fila">
              <span>Envío:</span>
              <span>Por calcular</span>
            </div>
            <div className="resumen-total">
              <span>Total a Pagar:</span>
              <span>${totalPagar.toFixed(2)} USD</span>
            </div>
            
            <button className="btn-pagar">Proceder al Pago 🔒</button>
            <p className="nota-seguridad">Tus datos están protegidos.</p>
          </div>

        </div>
      )}
    </div>
  );
}