import { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabase/client';
import TarjetaProducto from '../components/Productos/TarjetaProducto';
import SidebarFiltros from '../components/Productos/SidebarFiltros';
import BarraControles from '../components/Productos/BarraControles';
import Paginacion from '../components/Productos/Paginacion';
import './Productos.css';

export default function Productos() {
  const [productosReales, setProductosReales] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [categoriasActivas, setCategoriasActivas] = useState(['camara']);
  const [productosPorPagina, setProductosPorPagina] = useState(12);

  const cacheCategorias = useRef({}); 

  const [textoInput, setTextoInput] = useState('');
  const [busquedaActiva, setBusquedaActiva] = useState('');
  const [marcaSeleccionada, setMarcaSeleccionada] = useState('Todas');
  const [ordenPrecio, setOrdenPrecio] = useState('normal');
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginasReact, setTotalPaginasReact] = useState(1);

  const pestañasCategorias = [
    { id: 'camara', nombre: 'Cámaras' },
    { id: 'videovigilancia', nombre: 'Videovigilancia' },
    { id: 'accesorios videovigilancia', nombre: 'Accesorios' },
    { id: 'control de acceso', nombre: 'Control de Acceso' }
  ];

  // 🧮 MATEMÁTICA ELÁSTICA: Calculamos el tamaño del bloque según cuántas cosas busques
  const terminosDeBusqueda = busquedaActiva !== '' ? [busquedaActiva] : categoriasActivas;
  const multiplicador = terminosDeBusqueda.length || 1;
  const itemsPorLote = 60 * multiplicador; // Si son 2 categorías, el lote es de 120
  
  const paginaSyscom = Math.ceil((paginaActual * productosPorPagina) / itemsPorLote) || 1;

  useEffect(() => {
    const descargarCatalogo = async () => {
      if (terminosDeBusqueda.length === 0) {
        setProductosReales([]); 
        setCargando(false);
        setTotalPaginasReact(1);
        return;
      }

      setCargando(true);
      try {
        let sumaPaginasSyscom = 0; // Sumaremos todas las páginas de todas las categorías

        const promesas = terminosDeBusqueda.map(async (termino) => {
          const llaveCache = `${termino}-sysPag${paginaSyscom}`;

          if (cacheCategorias.current[llaveCache]) {
            const datosCacheados = cacheCategorias.current[llaveCache];
            sumaPaginasSyscom += datosCacheados.paginasSyscom; // Sumamos al caché
            return datosCacheados.productos;
          }
          
          const { data, error } = await supabase.functions.invoke('catalogo-syscom', {
            body: { 
              busqueda: termino,
              pagina: paginaSyscom 
            }
          });
          
          if (error) throw error;
          
          if (data) {
            const totalPaginasAPI = data.paginas || 1;
            sumaPaginasSyscom += totalPaginasAPI; // Acumulamos las páginas de esta categoría

            if (data.productos) {
              cacheCategorias.current[llaveCache] = { 
                productos: data.productos, 
                paginasSyscom: totalPaginasAPI 
              };
              return data.productos;
            }
          }
          return [];
        });

        const resultados = await Promise.all(promesas);

        // 📏 Calculamos el TOTAL EXACTO de páginas para tus botones de abajo
        const totalProductosGlobal = sumaPaginasSyscom * 60;
        setTotalPaginasReact(Math.ceil(totalProductosGlobal / productosPorPagina));

        const productosCombinados = resultados.flat();
        const productosUnicos = Array.from(new Map(productosCombinados.map(p => [p.producto_id, p])).values());
        
        setProductosReales(productosUnicos);
      } catch (err) {
        console.error("Error al conectar:", err);
      } finally {
        setCargando(false);
      }
    };

    descargarCatalogo();
  }, [categoriasActivas, busquedaActiva, paginaSyscom, productosPorPagina]);

  const toggleCategoria = (idCategoria) => {
    setCategoriasActivas((prev) => {
      if (prev.includes(idCategoria)) return prev.filter(c => c !== idCategoria);
      return [...prev, idCategoria];
    });
    setBusquedaActiva(''); 
    setTextoInput('');
    setPaginaActual(1);
  };

  const ejecutarBusqueda = () => {
    setBusquedaActiva(textoInput.toLowerCase());
    setCategoriasActivas([]); 
    setPaginaActual(1);
  };

  let productosFiltrados = productosReales.filter((producto) => {
    const marca = producto.marca || '';
    return marcaSeleccionada === 'Todas' || marca === marcaSeleccionada;
  });

  if (ordenPrecio === 'baratos') {
    productosFiltrados.sort((a, b) => parseFloat(a.precios?.precio_especial || 0) - parseFloat(b.precios?.precio_especial || 0));
  } else if (ordenPrecio === 'caros') {
    productosFiltrados.sort((a, b) => parseFloat(b.precios?.precio_especial || 0) - parseFloat(a.precios?.precio_especial || 0));
  }

  // ✂️ TIJERA ELÁSTICA: Corta usando el tamaño de lote dinámico (60, 120, 180...)
  const indiceInicioLocal = ((paginaActual - 1) * productosPorPagina) % itemsPorLote;
  const indiceFinLocal = indiceInicioLocal + productosPorPagina;
  
  const productosPaginados = productosFiltrados.slice(indiceInicioLocal, indiceFinLocal);
  const marcasDisponibles = [...new Set(productosReales.map(p => p.marca))].filter(Boolean);

  return (
    <div className="contenedor-productos">
      <div className="encabezado-tienda">
        <h2>Catálogo de Seguridad en Vivo</h2>
      </div>
      
      <div className="layout-catalogo">
        <SidebarFiltros 
          pestañasCategorias={pestañasCategorias}
          categoriasActivas={categoriasActivas}
          toggleCategoria={toggleCategoria}
          productosPorPagina={productosPorPagina}
          setProductosPorPagina={setProductosPorPagina}
          setPaginaActual={setPaginaActual}
          marcaSeleccionada={marcaSeleccionada}
          setMarcaSeleccionada={setMarcaSeleccionada}
          marcasDisponibles={marcasDisponibles}
        />

        <main className="contenido-principal">
          <BarraControles 
            textoInput={textoInput}
            setTextoInput={setTextoInput}
            ejecutarBusqueda={ejecutarBusqueda}
            ordenPrecio={ordenPrecio}
            setOrdenPrecio={setOrdenPrecio}
            setPaginaActual={setPaginaActual}
          />
          
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

          {!cargando && (
            <Paginacion 
              paginaActual={paginaActual} 
              setPaginaActual={setPaginaActual} 
              totalPaginas={totalPaginasReact} 
            />
          )}
        </main>
      </div>
    </div>
  );
}