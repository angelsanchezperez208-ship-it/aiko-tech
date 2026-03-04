import Facebook from '../../assets/facebook.png';
import Whatsapp from '../../assets/whatsapp.png';

export default function Contacto() {
  const manejarEnvio = (e) => {
    e.preventDefault();
    alert("¡Mensaje enviado con éxito! Un ingeniero de AIKO tech te contactará pronto.");
    e.target.reset();
  };

  return (
    <section id="contacto" className="seccion contacto">
      <div className="contacto-contenedor">
        <div className="contacto-info">
          <h2>¿Necesitas una instalación?</h2>
          <p>Cuéntanos sobre tu proyecto. Ya sea para tu hogar, oficina o nave industrial, nuestros ingenieros te asesorarán sin compromiso.</p>
          <ul className="datos-contacto">
            <li>📍 Servicio en Mérida, Yucatán</li>
            <li><img src={Whatsapp} alt="WhatsApp" width="20" height="20" /> Whatsapp: +52 (999) 390 0054</li>
            <li>✉️ tecnoaiko@gmail.com</li>
            
            {/* 👇 Aquí está el enlace a Facebook 👇 */}
            <li>
              <a 
                href="https://www.facebook.com/aikotecnologia?locale=es_LA" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}
              >
                <img src={Facebook} alt="Facebook" width="20" height="20" /> AIKO Tecnología
              </a>
            </li>

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
          
          <button type="submit" className="btn-enviar-contacto">Enviar Cotización</button>
        </form>
      </div>
    </section>
  );
}