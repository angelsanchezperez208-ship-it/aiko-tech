import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { CarritoContext } from '../../context/CarritoContext';
import { AuthContext } from '../../context/AuthContext'; 
import './Header.css';

// 1. Importamos tu logo desde la carpeta assets
import logoAiko from '../../assets/logo.jpeg'; 

export default function Header() {
  const { carrito } = useContext(CarritoContext);
  const { usuario, cerrarSesion } = useContext(AuthContext);

  const cantidadTotal = carrito.reduce((total, item) => total + item.cantidad, 0);

  return (
    <header className="header">
      <div className="logo">
        {/* 2. Reemplazamos el texto H2 por tu imagen */}
        <Link to="/">
          <img src={logoAiko} alt="AIKO tech" className="logo-img" />
        </Link>
      </div>

      <nav className="nav-links">
        <a href="/#nosotros">Quiénes Somos</a>
        <a href="/#servicios">Servicios</a>
        <a href="/#contacto">Contacto</a>
        <Link to="/productos" className="link-destacado">Productos</Link>
      </nav>

      <div className="user-actions">
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