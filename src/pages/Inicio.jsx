import './Inicio.css';

export default function Inicio() {
  return (
    <div>
      {/* Sección Hero / Banner Principal */}
      <section id="inicio" className="hero-section">
        <h1>Protección <span className="highlight">Inteligente</span> para tu Negocio</h1>
        <p>Soluciones de seguridad tecnológica de vanguardia. Instalación de cámaras, control de acceso y monitoreo 24/7 para que tengas tranquilidad total.</p>
        
        <div className="hero-buttons">
          <a href="#contacto" className="btn-primary">Solicitar Cotización</a>
          <a href="#servicios" className="btn-secondary">Ver Servicios</a>
        </div>
      </section>

      {/* ... Deja el resto de las secciones (Nosotros, Servicios, Contacto) como las tenías por ahora ... */}
      <section id="nosotros" style={{ minHeight: '100vh', padding: '50px', backgroundColor: '#e0e0e0' }}>
        <h2>Quiénes Somos</h2>
        <p>En AIKO tech nos especializamos en proteger lo que más te importa.</p>
      </section>

      <section id="servicios" style={{ minHeight: '100vh', padding: '50px', backgroundColor: '#ffffff' }}>
        <h2>Nuestros Servicios</h2>
        <p>Instalación de cámaras, biometría, alarmas inteligentes y control de acceso.</p>
      </section>

      <section id="contacto" style={{ minHeight: '100vh', padding: '50px', backgroundColor: '#e0e0e0' }}>
        <h2>Contacto</h2>
        <p>Cotiza tu proyecto con nosotros hoy mismo.</p>
      </section>
    </div>
  );
}