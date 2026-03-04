import iconoVenta from '../../assets/carrito-de-compras.png';
import iconoInstalacion from '../../assets/herramienta-de-reparacion.png';
import iconoSoporte from '../../assets/apoyo-tecnico.png';

export default function Servicios() {
  return (
    <section id="servicios" className="seccion servicios">
      <h2>Nuestros Servicios</h2>
      <div className="grid-servicios">
        <div className="tarjeta-servicio">
          <div className="icono-servicio"><img src={iconoVenta} alt="Venta de Equipos" /></div>
          <h3>Venta de Equipos</h3>
          <p>Acceso directo a las mejores marcas del mercado como Hikvision y ZKTeco, con precios competitivos y garantía de fábrica.</p>
        </div>
        
        <div className="tarjeta-servicio destacado">
          <div className="icono-servicio"><img src={iconoInstalacion} alt="Instalación Profesional" /></div>
          <h3>Instalación Profesional</h3>
          <p>Técnicos certificados que garantizan un cableado limpio, estético y configuraciones seguras para que tu sistema funcione impecable.</p>
        </div>
        
        <div className="tarjeta-servicio">
          <div className="icono-servicio"><img src={iconoSoporte} alt="Soporte y Mantenimiento" /></div>
          <h3>Soporte y Mantenimiento</h3>
          <p>Pólizas de soporte técnico y mantenimiento preventivo para asegurar que tus cámaras nunca fallen cuando más las necesitas.</p>
        </div>
      </div>
    </section>
  );
}