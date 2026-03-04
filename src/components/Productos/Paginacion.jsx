export default function Paginacion({ paginaActual, setPaginaActual, totalPaginas }) {
  if (totalPaginas <= 1) return null;

  // NUEVO: Función que cambia la página y sube la pantalla automáticamente
  const manejarCambioPagina = (nuevaPagina) => {
    setPaginaActual(nuevaPagina);
    
    // Hace un scroll suave hacia la parte más alta de la página
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="controles-paginacion">
      <button 
        onClick={() => manejarCambioPagina(paginaActual - 1)} 
        disabled={paginaActual === 1} 
        className="btn-paginacion"
      >
        ← Anterior
      </button>
      
      <span className="info-paginacion">
        Página <strong>{paginaActual}</strong> de {totalPaginas}
      </span>
      
      <button 
        onClick={() => manejarCambioPagina(paginaActual + 1)} 
        disabled={paginaActual === totalPaginas} 
        className="btn-paginacion"
      >
        Siguiente →
      </button>
    </div>
  );
}