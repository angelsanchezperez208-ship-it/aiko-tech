import { useContext, useState } from 'react';
import { CarritoContext } from '../../context/CarritoContext';
import { AuthContext } from '../../context/AuthContext'; // NUEVO: Importamos Auth
import { Link } from 'react-router-dom'; // NUEVO: Para el link de Log In
import './ModalProducto.css';

export default function ModalProducto({ producto, precioVenta, onClose }) {
  const { agregarAlCarrito } = useContext(CarritoContext);
  // NUEVO: Leemos si hay un usuario conectado
  const { usuario } = useContext(AuthContext);
  
  const [cantidad, setCantidad] = useState(1);

  const manejarClicInterno = (e) => {
    e.stopPropagation();
  };

  const stock = producto.existencia?.nuevo || producto.existencia || 0;

  const sumar = () => {
    if (cantidad < stock) setCantidad(cantidad + 1);
  };
  const restar = () => {
    if (cantidad > 1) setCantidad(cantidad - 1);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-contenido" onClick={manejarClicInterno}>
        <button className="btn-cerrar-modal" onClick={onClose}>✖</button>

        <div className="modal-grid">
          <div className="modal-imagen-contenedor">
            <img src={producto.img_portada} alt={producto.modelo} />
          </div>

          <div className="modal-info">
            <span className="modal-marca">{producto.marca}</span>
            <h2 className="modal-modelo">{producto.modelo}</h2>
            <p className="modal-titulo">{producto.titulo}</p>

            {/* LÓGICA DE SEGURIDAD: Mostramos detalles y compra SOLO si hay usuario */}
            {usuario ? (
              <>
                <div className="modal-detalles">
                  <div className="detalle-item">
                    <span>📦 Stock en almacén:</span>
                    <strong className={stock > 0 ? 'stock-disponible' : 'stock-agotado'}>
                      {stock > 0 ? `${stock} piezas disponibles` : 'Agotado / Bajo pedido'}
                    </strong>
                  </div>
                  <div className="detalle-item">
                    <span>⚖️ Peso del equipo:</span>
                    <strong>{producto.peso ? `${producto.peso} kg` : 'N/A'}</strong>
                  </div>
                </div>

                <div className="modal-compra">
                  <span className="modal-precio">${precioVenta.toFixed(2)} USD</span>
                  <div className="control-cantidad-modal">
                    <button onClick={restar} disabled={cantidad <= 1}>-</button>
                    <span>{cantidad}</span>
                    <button onClick={sumar} disabled={cantidad >= stock}>+</button>
                  </div>
                  <button 
                    className="btn-agregar-modal"
                    disabled={stock === 0}
                    onClick={() => {
                      agregarAlCarrito(producto, precioVenta, cantidad);
                      onClose();
                    }}
                  >
                    {stock === 0 ? 'Agotado' : 'Agregar 🛒'}
                  </button>
                </div>
              </>
            ) : (
              // NUEVO: Mensaje para visitantes anónimos
              <div className="modal-bloqueado">
                <p>🔒 Para ver precios, stock y agregar productos al carrito, debes ser cliente registrado.</p>
                <Link to="/login" className="btn-ir-login" onClick={onClose}>
                  Iniciar Sesión / Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}