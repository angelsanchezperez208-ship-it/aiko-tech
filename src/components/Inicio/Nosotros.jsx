import { useState, useEffect } from 'react';

// 👇 AQUÍ ABAJO PONDRÁS LAS RUTAS DE TUS IMÁGENES DE INSTALACIONES 👇
const imagenesCarrusel = [
  "https://images.unsplash.com/photo-1581092918056-0c4c3acd37be?q=80&w=800", // Imagen 1 temporal
  "https://images.unsplash.com/photo-1508344928928-7165b67de128?q=80&w=800", // Imagen 2 temporal
  "https://images.unsplash.com/photo-1557597774-9d273605dfa9?q=80&w=800"  // Imagen 3 temporal
];

export default function Nosotros() {
  const [indiceActual, setIndiceActual] = useState(0);

  // Efecto para cambiar la imagen cada 3 segundos automáticamente
  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndiceActual((prev) => (prev === imagenesCarrusel.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <section id="nosotros" className="seccion nosotros">
      <div className="nosotros-grid">

        {/* COLUMNA IZQUIERDA: Carrusel Automático */}
        <div className="carrusel-contenedor">
          <img 
            src={imagenesCarrusel[indiceActual]} 
            alt={`Instalación AIKO tech ${indiceActual + 1}`} 
            className="imagen-carrusel" 
          />
          {/* Puntitos indicadores abajo de la imagen */}
          <div className="indicadores-carrusel">
            {imagenesCarrusel.map((_, index) => (
              <span 
                key={index} 
                className={`indicador ${index === indiceActual ? 'activo' : ''}`}
                onClick={() => setIndiceActual(index)}
              ></span>
            ))}
          </div>
        </div>

        {/* COLUMNA DERECHA: Texto descriptivo */}
        <div className="seccion-texto derecha">
          <h2>¿Quiénes Somos?</h2>
          <p>
            En <strong>AIKO tech</strong>, no solo vendemos cámaras; diseñamos ecosistemas de seguridad. 
            Somos especialistas en videovigilancia y control de acceso, comprometidos con brindarte soluciones 
            precisas, estéticas y altamente funcionales. Nos alejamos de las configuraciones complicadas para 
            ofrecerte tecnología que realmente entiendas y controles desde la palma de tu mano.
          </p>
        </div>

      </div>
    </section>
  );
}