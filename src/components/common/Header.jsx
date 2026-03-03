import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { CarritoContext } from '../../context/CarritoContext';
import { AuthContext } from '../../context/AuthContext'; // NUEVO
import './Header.css';

export default function Header() {
  const { carrito } = useContext(CarritoContext);
  // NUEVO: Leemos si hay un usuario conectado y traemos la función de salir
  const { usuario, cerrarSesion } = useContext(AuthContext);

  const cantidadTotal = carrito.reduce((total, item) => total + item.cantidad, 0);

  return (
    <header className="header">
      <div className="logo">
        <Link to="/"><h2>AIKO tech</h2></Link>
      </div>

      <nav className="nav-links">
        <a href="/#nosotros">Quiénes Somos</a>
        <a href="/#servicios">Servicios</a>
        <a href="/#contacto">Contacto</a>
        <Link to="/productos" className="link-destacado">Productos</Link>
      </nav>

      <div className="user-actions">
        {/* LÓGICA CONDICIONAL: Si hay usuario mostramos su correo y el carrito. Si no, mostramos Log In */}
        {usuario ? (
          <>
            <span style={{color: '#64748b', fontSize: '0.9rem', marginRight: '15px'}}>
              Hola, {usuario.email.split('@')[0]}
            </span>
            <button onClick={cerrarSesion} className="btn-login" style={{background: 'transparent', color: '#ef4444', border: '1px solid #ef4444'}}>
              Salir
            </button>
            <Link to="/carrito" className="btn-carrito">
              🛒 Carrito {cantidadTotal > 0 && <span style={{backgroundColor: '#00ffcc', color: '#0f172a', padding: '2px 8px', borderRadius: '10px', marginLeft: '5px', fontWeight: 'bold'}}>{cantidadTotal}</span>}
            </Link>
          </>
        ) : (
          <Link to="/login" className="btn-login">Log In</Link>
        )}
      </div>
    </header>
  );
}