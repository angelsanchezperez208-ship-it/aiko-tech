export default function SidebarFiltros({
  pestañasCategorias,
  categoriasActivas,
  toggleCategoria,
  productosPorPagina,
  setProductosPorPagina,
  setPaginaActual,
  marcaSeleccionada,
  setMarcaSeleccionada,
  marcasDisponibles
}) {
  return (
    <aside className="sidebar-filtros">
      <div className="bloque-filtro">
        <h3>Categorías</h3>
        <div className="lista-checkbox">
          {pestañasCategorias.map((cat) => (
            <label key={cat.id} className="checkbox-label">
              <input 
                type="checkbox" 
                checked={categoriasActivas.includes(cat.id)} 
                onChange={() => toggleCategoria(cat.id)} 
              />
              <span>{cat.nombre}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="bloque-filtro">
        <h3>Mostrar por página</h3>
        <select 
          value={productosPorPagina} 
          onChange={(e) => { setProductosPorPagina(Number(e.target.value)); setPaginaActual(1); }} 
          className="select-sidebar"
        >
          <option value={12}>12 productos</option>
          <option value={24}>24 productos</option>
          <option value={48}>48 productos</option>
        </select>
      </div>

      <div className="bloque-filtro">
        <h3>Marca</h3>
        <select 
          value={marcaSeleccionada} 
          onChange={(e) => { setMarcaSeleccionada(e.target.value); setPaginaActual(1); }} 
          className="select-sidebar"
        >
          <option value="Todas">Todas las marcas</option>
          {marcasDisponibles.map(marca => (
            <option key={marca} value={marca}>{marca}</option>
          ))}
        </select>
      </div>
    </aside>
  );
}