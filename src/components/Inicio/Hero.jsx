import { Link } from 'react-router-dom';
import logoAiko from '../../assets/logo.jpeg';

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-grid">
        
        {/* COLUMNA IZQUIERDA: Texto y Botones */}
        <div className="hero-contenido">
          <h1>Seguridad inteligente para tu tranquilidad</h1>
          <p>Protege lo que más importa con equipos de última generación y nuestro servicio de instalación profesional a medida.</p>
          <div className="hero-botones">
            <Link to="/productos" className="btn-primario">Ver Catálogo</Link>
            <a href="#contacto" className="btn-secundario">Cotizar Instalación</a>
          </div>
        </div>
        
        {/* COLUMNA DERECHA: Tu Imagen */}
        <div className="hero-imagen-contenedor">
          {/* 👇 AQUÍ ABAJO PON LA RUTA DE TU IMAGEN CUANDO LA TENGAS 👇 */}
          <img 
            src={logoAiko} 
            alt="Cámaras de seguridad AIKO tech" 
            className="hero-imagen-derecha" 
          />
        </div>

      </div>
    </section>
  );
}