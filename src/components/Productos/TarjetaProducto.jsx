import { useState } from 'react'; // Quitamos useContext y CarritoContext
import ModalProducto from './ModalProducto';
import './TarjetaProducto.css';

export default function TarjetaProducto({ producto }) {
  // Estado para controlar el modal
  const [modalAbierto, setModalAbierto] = useState(false);

  // Tomamos el precio especial directo
  const precioVenta = parseFloat(producto.precios.precio_especial);

  const tituloCorto = producto.titulo.length > 60 
    ? producto.titulo.substring(0, 60) + '...' 
    : producto.titulo;

  return (
    <>
      {/* Al dar clic en la tarjeta, abrimos el modal */}
      <div className="tarjeta" onClick={() => setModalAbierto(true)} style={{cursor: 'pointer'}}>
        
        <div className="imagen-contenedor">
          <img src={producto.img_portada} alt={producto.modelo} />
        </div>
        
        <div className="info-tarjeta">
          <span className="marca">{producto.marca}</span>
          <h3 className="modelo">{producto.modelo}</h3>
          <p className="descripcion" title={producto.titulo}>{tituloCorto}</p>
          
          {/* NUEVO: Ya no hay sección de compra ni precio aquí. 
              Mantenemos el precioVenta solo para pasárselo al modal */}
        </div>
      </div>

      {/* Renderizamos el Modal si está abierto */}
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