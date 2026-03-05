import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabase/client';
import { CarritoContext } from '../context/CarritoContext';
import { AuthContext } from '../context/AuthContext';
import './DetalleProducto.css';

export default function DetalleProducto() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { agregarAlCarrito } = useContext(CarritoContext);
  const { usuario } = useContext(AuthContext);

  const [cantidad, setCantidad] = useState(1);
  const [agregado, setAgregado] = useState(false);
  const [detalleExtra, setDetalleExtra] = useState(null);
  const [cargandoDetalle, setCargandoDetalle] = useState(false);
  const [imagenActiva, setImagenActiva] = useState(0);

  if (!state?.producto) {
    return (
      <div className="detalle-error">
        <h2>Producto no encontrado</h2>
        <p>Vuelve al catálogo para seleccionar un producto.</p>
        <Link to="/productos" className="btn-volver-catalogo">← Ir al Catálogo</Link>
      </div>
    );
  }

  const { producto, precioVenta } = state;
  const stock = producto.existencia?.nuevo ?? producto.existencia ?? 0;

  // Cargamos el detalle completo de Syscom al entrar a la página
  useEffect(() => {
    const cargarDetalle = async () => {
      setCargandoDetalle(true);
      try {
        const { data, error } = await supabase.functions.invoke('catalogo-syscom', {
          body: { modo: 'detalle', producto_id: producto.producto_id }
        });
        if (!error && data && !data.error) {
          setDetalleExtra(data);
        }
      } catch (e) {
        console.error('No se pudo cargar detalle extra:', e);
      } finally {
        setCargandoDetalle(false);
      }
    };
    cargarDetalle();
  }, [producto.producto_id]);

  const handleAgregar = async () => {
    await agregarAlCarrito(producto, precioVenta, cantidad);
    setAgregado(true);
    setTimeout(() => setAgregado(false), 2000);
  };

  // Imágenes: usamos las del detalle si existen, si no la portada
  const imagenes = detalleExtra?.imgs?.length > 0
    ? detalleExtra.imgs
    : [producto.img_portada];

  // Especificaciones técnicas del detalle de Syscom
  const especificaciones = detalleExtra?.especificaciones || [];

  // Specs del título como fallback
  const specsDelTitulo = producto.titulo?.split('/').map(s => s.trim()).filter(Boolean) || [];

  return (
    <div className="detalle-contenedor">

      <nav className="detalle-breadcrumb">
        <Link to="/">Inicio</Link>
        <span>›</span>
        <Link to="/productos">Catálogo</Link>
        <span>›</span>
        <span>{producto.modelo}</span>
      </nav>

      <div className="detalle-grid">

        {/* COLUMNA IZQUIERDA: Imágenes */}
        <div className="detalle-imagen-wrap">
          <div className="detalle-imagen-contenedor">
            <img src={imagenes[imagenActiva]} alt={producto.modelo} />
          </div>

          {/* Miniaturas si hay más de una imagen */}
          {imagenes.length > 1 && (
            <div className="detalle-miniaturas">
              {imagenes.map((img, i) => (
                <div
                  key={i}
                  className={`miniatura ${i === imagenActiva ? 'activa' : ''}`}
                  onClick={() => setImagenActiva(i)}
                >
                  <img src={img} alt={`${producto.modelo} ${i + 1}`} />
                </div>
              ))}
            </div>
          )}

          <div className="detalle-marca-badge">{producto.marca}</div>
        </div>

        {/* COLUMNA DERECHA: Info */}
        <div className="detalle-info">
          <span className="detalle-marca-label">{producto.marca}</span>
          <h1 className="detalle-modelo">{producto.modelo}</h1>
          <p className="detalle-titulo">
            {detalleExtra?.titulo || producto.titulo}
          </p>

          {/* PRECIO: visible para todos */}
          <div className="detalle-compra">
            <div className="detalle-precio-stock">
              <span className="detalle-precio">
                ${precioVenta.toFixed(2)} <small>USD</small>
              </span>
              <span className={`detalle-stock ${stock > 0 ? 'en-stock' : 'sin-stock'}`}>
                {stock > 0 ? `✓ ${stock} en existencia` : '✗ Agotado / Bajo pedido'}
              </span>
            </div>

            {usuario ? (
              <>
                {stock > 0 && (
                  <div className="detalle-acciones">
                    <div className="control-cantidad-detalle">
                      <button onClick={() => setCantidad(c => Math.max(1, c - 1))} disabled={cantidad <= 1}>−</button>
                      <span>{cantidad}</span>
                      <button onClick={() => setCantidad(c => Math.min(stock, c + 1))} disabled={cantidad >= stock}>+</button>
                    </div>
                    <button
                      className={`btn-agregar-detalle ${agregado ? 'agregado' : ''}`}
                      onClick={handleAgregar}
                      disabled={agregado}
                    >
                      {agregado ? '✓ Agregado al Carrito' : 'Agregar al Carrito 🛒'}
                    </button>
                  </div>
                )}

                <div className="detalle-datos-extra">
                  {(detalleExtra?.peso || producto.peso) && (
                    <div className="dato-extra">
                      <span className="dato-label">⚖️ Peso</span>
                      <span>{detalleExtra?.peso || producto.peso} kg</span>
                    </div>
                  )}
                  <div className="dato-extra">
                    <span className="dato-label">🏷️ SKU</span>
                    <span>{producto.producto_id}</span>
                  </div>
                  {detalleExtra?.garantia && (
                    <div className="dato-extra">
                      <span className="dato-label">🛡️ Garantía</span>
                      <span>{detalleExtra.garantia}</span>
                    </div>
                  )}
                  {detalleExtra?.unidad_de_medida && (
                    <div className="dato-extra">
                      <span className="dato-label">📦 Unidad</span>
                      <span>{detalleExtra.unidad_de_medida}</span>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="detalle-aviso-login">
                <p>🔐 Inicia sesión para agregar al carrito y ver stock detallado.</p>
                <Link to="/login" className="btn-login-detalle">Iniciar Sesión / Registrarse</Link>
              </div>
            )}
          </div>

          {/* ESPECIFICACIONES TÉCNICAS */}
          {cargandoDetalle ? (
            <div className="detalle-cargando-specs">
              <div className="spinner-specs"></div>
              <span>Cargando especificaciones...</span>
            </div>
          ) : especificaciones.length > 0 ? (
            <div className="detalle-specs-tabla">
              <h3>Especificaciones Técnicas</h3>
              <table>
                <tbody>
                  {especificaciones.map((spec, i) => (
                    <tr key={i}>
                      <td className="spec-nombre">{spec.nombre || spec.tipo}</td>
                      <td className="spec-valor">{spec.valor || spec.descripcion}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : specsDelTitulo.length > 1 && (
            <div className="detalle-specs">
              <h3>Características</h3>
              <ul>
                {specsDelTitulo.map((spec, i) => (
                  <li key={i}>
                    <span className="spec-icono">✓</span>
                    {spec}
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>

      <button className="btn-regresar" onClick={() => navigate(-1)}>
        ← Regresar al Catálogo
      </button>

    </div>
  );
}