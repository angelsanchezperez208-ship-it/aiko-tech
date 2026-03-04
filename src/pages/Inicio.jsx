import { Link } from 'react-router-dom';
import './Inicio.css';

export default function Inicio() {
  const manejarEnvio = (e) => {
    e.preventDefault();
    // Por ahora solo mostramos una alerta, luego lo conectaremos a un correo real
    alert("¡Mensaje enviado con éxito! Un ingeniero de AIKO tech te contactará pronto.");
    e.target.reset();
  };

  return (
    <div className="contenedor-inicio">
      
      {/* 1. SECCIÓN HERO (El gancho visual principal) */}
      <section className="hero">
        <div className="hero-contenido">
          <h1>Seguridad inteligente para tu tranquilidad</h1>
          <p>Protege lo que más importa con equipos de última generación y nuestro servicio de instalación profesional a medida.</p>
          <div className="hero-botones">
            <Link to="/productos" className="btn-primario">Ver Catálogo</Link>
            <a href="#contacto" className="btn-secundario">Cotizar Instalación</a>
          </div>
        </div>
      </section>

      {/* 2. QUIÉNES SOMOS */}
      <section id="nosotros" className="seccion nosotros">
        <div className="seccion-texto">
          <h2>¿Quiénes Somos?</h2>
          <p>
            En <strong>AIKO tech</strong>, no solo vendemos cámaras; diseñamos ecosistemas de seguridad. 
            Somos especialistas en videovigilancia y control de acceso, comprometidos con brindarte soluciones 
            precisas, estéticas y altamente funcionales. Nos alejamos de las configuraciones complicadas para 
            ofrecerte tecnología que realmente entiendas y controles desde la palma de tu mano.
          </p>
        </div>
      </section>

      {/* 3. SERVICIOS */}
      <section id="servicios" className="seccion servicios">
        <h2>Nuestros Servicios</h2>
        <div className="grid-servicios">
          <div className="tarjeta-servicio">
            <div className="icono-servicio">🛒</div>
            <h3>Venta de Equipos</h3>
            <p>Acceso directo a las mejores marcas del mercado como Hikvision y ZKTeco, con precios competitivos y garantía de fábrica.</p>
          </div>
          
          <div className="tarjeta-servicio destacado">
            <div className="icono-servicio">🛠️</div>
            <h3>Instalación Profesional</h3>
            <p>Técnicos certificados que garantizan un cableado limpio, estético y configuraciones seguras para que tu sistema funcione impecable.</p>
          </div>
          
          <div className="tarjeta-servicio">
            <div className="icono-servicio">⚙️</div>
            <h3>Soporte y Mantenimiento</h3>
            <p>Pólizas de soporte técnico y mantenimiento preventivo para asegurar que tus cámaras nunca fallen cuando más las necesitas.</p>
          </div>
        </div>
      </section>

      {/* 4. CONTACTO Y FORMULARIO */}
      <section id="contacto" className="seccion contacto">
        <div className="contacto-contenedor">
          <div className="contacto-info">
            <h2>¿Necesitas una instalación?</h2>
            <p>Cuéntanos sobre tu proyecto. Ya sea para tu hogar, oficina o nave industrial, nuestros ingenieros te asesorarán sin compromiso.</p>
            <ul className="datos-contacto">
              <li>📍 Servicio en tu ciudad y alrededores</li>
              <li>📞 Soporte: +52 (55) 1234-5678</li>
              <li>✉️ proyectos@aikotech.com</li>
            </ul>
          </div>
          
          <form className="formulario-contacto" onSubmit={manejarEnvio}>
            <div className="grupo-input">
              <label>Nombre Completo</label>
              <input type="text" placeholder="Ej. Juan Pérez" required />
            </div>
            
            <div className="grupo-input">
              <label>Correo Electrónico o Teléfono</label>
              <input type="text" placeholder="Para contactarte..." required />
            </div>
            
            <div className="grupo-input">
              <label>¿En qué podemos ayudarte?</label>
              <textarea rows="4" placeholder="Ej. Necesito instalar 4 cámaras y un control de acceso en mi negocio..." required></textarea>
            </div>
            
            <button type="submit" className="btn-enviar-contacto">Enviar Cotización 🚀</button>
          </form>
        </div>
      </section>

    </div>
  );
}