import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import ModalProducto from './ModalProducto';
import './TarjetaProducto.css';

export default function TarjetaProducto({ producto }) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const navigate = useNavigate();
  const { usuario } = useContext(AuthContext);

  const precioVenta = parseFloat(producto.precios.precio_especial);
  const stock = producto.existencia?.nuevo ?? producto.existencia ?? 0;

  const tituloCorto = producto.titulo.length > 60
    ? producto.titulo.substring(0, 60) + '...'
    : producto.titulo;

  const irADetalle = (e) => {
    e.stopPropagation();
    navigate(`/productos/${producto.producto_id}`, { state: { producto, precioVenta } });
  };

  return (
    <>
      <div className="tarjeta" onClick={() => setModalAbierto(true)} style={{ cursor: 'pointer' }}>

        <div className="imagen-contenedor">
          <img src={producto.img_portada} alt={producto.modelo} />
        </div>

        <div className="info-tarjeta">
          <span className="marca">{producto.marca}</span>
          <h3 className="modelo">{producto.modelo}</h3>
          <p className="descripcion" title={producto.titulo}>{tituloCorto}</p>

          {/* Precio: visible para todos */}
          <div className="tarjeta-precio-row">
            <span className="tarjeta-precio">
              ${precioVenta.toFixed(2)} <small>USD</small>
            </span>
            {usuario && (
              <span className={`tarjeta-stock ${stock > 0 ? 'en-stock' : 'sin-stock'}`}>
                {stock > 0 ? `✓ ${stock} pzs` : '✗ Agotado'}
              </span>
            )}
          </div>

          <button className="btn-ver-detalle" onClick={irADetalle}>
            Ver detalle completo →
          </button>
        </div>

      </div>

      {modalAbierto && (
        <ModalProducto
          producto={producto}
          precioVenta={precioVenta}
          onClose={() => setModalAbierto(false)}
        />
      )}
    </>
  );
}