import { useState, useEffect } from 'react';
import TarjetaProducto from '../components/Productos/TarjetaProducto';
import { supabase } from '../supabase/client';
import './Productos.css';

export default function Productos() {
  const [productosReales, setProductosReales] = useState([]);
  const [cargando, setCargando] = useState(true);
  
  // NUEVO: Estado para saber qué categoría estamos viendo
  const [categoriaActiva, setCategoriaActiva] = useState('camara');

  const [textoInput, setTextoInput] = useState('');
  const [busquedaActiva, setBusquedaActiva] = useState('');
  const [marcaSeleccionada, setMarcaSeleccionada] = useState('Todas');
  const [ordenPrecio, setOrdenPrecio] = useState('normal');
  const [paginaActual, setPaginaActual] = useState(1);
  
  const PRODUCTOS_POR_PAGINA = 12; 

  // NUEVO: Lista de las categorías que quieres vender
  const pestañasCategorias = [
    { id: 'camara', nombre: 'Cámaras' },
    { id: 'videovigilancia', nombre: 'Videovigilancia' },
    { id: 'accesorios videovigilancia', nombre: 'Accesorios' },
    { id: 'control de acceso', nombre: 'Control de Acceso' }
  ];

  // NUEVO: El useEffect ahora "escucha" los cambios en 'categoriaActiva'
  useEffect(() => {
    const descargarCatalogo = async () => {
      setCargando(true);
      try {
        // Le mandamos a la nube exactamente qué buscar
        const { data, error } = await supabase.functions.invoke('catalogo-syscom', {
          body: { busqueda: categoriaActiva }
        });
        
        if (error) throw error;
        if (data && data.productos) setProductosReales(data.productos);
      } catch (err) {
        console.error("Error al conectar:", err);
      } finally {
        setCargando(false);
      }
    };

    descargarCatalogo();
  }, [categoriaActiva]); // <- Al poner 'categoriaActiva' aquí, React vuelve a descargar datos si la cambias

  const cambiarCategoria = (idCategoria) => {
    setCategoriaActiva(idCategoria);
    setPaginaActual(1);
    setBusquedaActiva(''); // Limpiamos la búsqueda manual al cambiar de categoría
    setTextoInput('');
  };

  const ejecutarBusqueda = () => {
    setBusquedaActiva(textoInput.toLowerCase());
    setPaginaActual(1);
  };

  let productosFiltrados = productosReales.filter((producto) => {
    const titulo = producto.titulo ? producto.titulo.toLowerCase() : '';
    const modelo = producto.modelo ? producto.modelo.toLowerCase() : '';
    const marca = producto.marca || '';

    const coincideBusqueda = titulo.includes(busquedaActiva) || modelo.includes(busquedaActiva);
    const coincideMarca = marcaSeleccionada === 'Todas' || marca === marcaSeleccionada;
    
    return coincideBusqueda && coincideMarca;
  });

  if (ordenPrecio === 'baratos') {
    productosFiltrados.sort((a, b) => parseFloat(a.precios?.precio_especial || 0) - parseFloat(b.precios?.precio_especial || 0));
  } else if (ordenPrecio === 'caros') {
    productosFiltrados.sort((a, b) => parseFloat(b.precios?.precio_especial || 0) - parseFloat(a.precios?.precio_especial || 0));
  }

  const indiceUltimoProducto = paginaActual * PRODUCTOS_POR_PAGINA;
  const indicePrimerProducto = indiceUltimoProducto - PRODUCTOS_POR_PAGINA;
  const productosPaginados = productosFiltrados.slice(indicePrimerProducto, indiceUltimoProducto);
  const totalPaginas = Math.ceil(productosFiltrados.length / PRODUCTOS_POR_PAGINA);

  return (
    <div className="contenedor-productos">
      <div className="encabezado-tienda">
        <h2>Catálogo de Seguridad en Vivo</h2>
        
        {/* NUEVO: Botones de Categorías */}
        <div className="tabs-categorias">
          {pestañasCategorias.map((cat) => (
            <button 
              key={cat.id}
              onClick={() => cambiarCategoria(cat.id)}
              className={`btn-categoria ${categoriaActiva === cat.id ? 'activa' : ''}`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
        
        <div className="barra-controles">
          <div className="grupo-busqueda">
            <input 
              type="text" 
              placeholder={`Buscar en ${pestañasCategorias.find(c => c.id === categoriaActiva)?.nombre}...`} 
              value={textoInput}
              onChange={(e) => setTextoInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && ejecutarBusqueda()}
              className="input-busqueda"
            />
            <button onClick={ejecutarBusqueda} className="btn-buscar">Buscar 🔍</button>
          </div>

          <div className="grupo-filtros">
            <select value={marcaSeleccionada} onChange={(e) => { setMarcaSeleccionada(e.target.value); setPaginaActual(1); }} className="select-filtro">
              <option value="Todas">Todas las marcas</option>
              {[...new Set(productosReales.map(p => p.marca))].filter(Boolean).map(marca => (
                <option key={marca} value={marca}>{marca}</option>
              ))}
            </select>

            <select value={ordenPrecio} onChange={(e) => { setOrdenPrecio(e.target.value); setPaginaActual(1); }} className="select-filtro">
              <option value="normal">Orden recomendado</option>
              <option value="baratos">Menor a mayor precio</option>
              <option value="caros">Mayor a menor precio</option>
            </select>
          </div>
        </div>
      </div>
      
      {cargando ? (
        <div style={{ textAlign: 'center', padding: '50px', fontSize: '1.5rem', color: '#64748b' }}>
          Descargando productos desde Syscom... 📡
        </div>
      ) : (
        <div className="cuadricula-productos">
          {productosPaginados.length > 0 ? (
            productosPaginados.map((prod) => (
              <TarjetaProducto key={prod.producto_id} producto={prod} />
            ))
          ) : (
            <p className="mensaje-vacio">No se encontraron productos con esos filtros.</p>
          )}
        </div>
      )}

      {!cargando && totalPaginas > 1 && (
        <div className="controles-paginacion">
          <button onClick={() => setPaginaActual(paginaActual - 1)} disabled={paginaActual === 1} className="btn-paginacion">← Anterior</button>
          <span className="info-paginacion">Página <strong>{paginaActual}</strong> de {totalPaginas}</span>
          <button onClick={() => setPaginaActual(paginaActual + 1)} disabled={paginaActual === totalPaginas} className="btn-paginacion">Siguiente →</button>
        </div>
      )}
    </div>
  );
}