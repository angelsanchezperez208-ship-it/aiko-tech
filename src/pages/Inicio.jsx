import Hero from '../components/Inicio/Hero';
import Nosotros from '../components/Inicio/Nosotros';
import Servicios from '../components/Inicio/Servicios';
import Contacto from '../components/Inicio/Contacto';
import './Inicio.css'; // El CSS que hicimos en el mensaje anterior se queda intacto aquí

export default function Inicio() {
  return (
    <div className="contenedor-inicio">
      <Hero />
      <Nosotros />
      <Servicios />
      <Contacto />
    </div>
  );
}