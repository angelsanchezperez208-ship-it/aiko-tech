import { useContext, useState } from 'react';
import { CarritoContext } from '../../context/CarritoContext';
import { AuthContext } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './ModalProducto.css';

export default function ModalProducto({ producto, precioVenta, onClose }) {
  const { agregarAlCarrito } = useContext(CarritoContext);
  const { usuario } = useContext(AuthContext);

  const [cantidad, setCantidad] = useState(1);
  const navigate = useNavigate();

  const irADetalle = () => {
    onClose();
    navigate(`/productos/${producto.producto_id}`, { state: { producto, precioVenta } });
  };

  const manejarClicInterno = (e) => {
    e.stopPropagation();
  };

  const stock = producto.existencia?.nuevo || producto.existencia || 0;

  const sumar = () => { if (cantidad < stock) setCantidad(cantidad + 1); };
  const restar = () => { if (cantidad > 1) setCantidad(cantidad - 1); };

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

            {/* Botón ver detalle: visible para todos */}
            <button className="btn-detalle-modal" onClick={irADetalle}>
              Ver página de detalle completo →
            </button>

            {/* PRECIO: visible para todos */}
            <div className="modal-compra">
              <span className="modal-precio">
                ${precioVenta.toFixed(2)}{' '}
                <small style={{ fontSize: '1rem', color: '#64748b', fontWeight: 'normal' }}>USD</small>
              </span>

              {usuario ? (
                /* Con sesión: controles de cantidad y botón agregar */
                <div className="grupo-controles-compra">
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
              ) : (
                /* Sin sesión: solo botón de login */
                <Link to="/login" className="btn-ir-login" onClick={onClose}>
                  Iniciar sesión para comprar
                </Link>
              )}
            </div>

            {/* STOCK Y PESO: solo con sesión */}
            {usuario && (
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
            )}

          </div>
        </div>
      </div>
    </div>
  );
}