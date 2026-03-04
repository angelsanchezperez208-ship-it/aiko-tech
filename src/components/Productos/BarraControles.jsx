export default function BarraControles({
  textoInput,
  setTextoInput,
  ejecutarBusqueda,
  ordenPrecio,
  setOrdenPrecio,
  setPaginaActual
}) {
  return (
    <div className="barra-controles">
      <div className="grupo-busqueda">
        <input 
          type="text" 
          placeholder="Buscar modelo o palabra clave..." 
          value={textoInput}
          onChange={(e) => setTextoInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && ejecutarBusqueda()}
          className="input-busqueda"
        />
        <button onClick={ejecutarBusqueda} className="btn-buscar">Buscar 🔍</button>
      </div>

      <div className="grupo-filtros">
        <select 
          value={ordenPrecio} 
          onChange={(e) => { setOrdenPrecio(e.target.value); setPaginaActual(1); }} 
          className="select-filtro"
        >
          <option value="normal">Orden recomendado</option>
          <option value="baratos">Menor a mayor precio</option>
          <option value="caros">Mayor a menor precio</option>
        </select>
      </div>
    </div>
  );
}