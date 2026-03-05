import { Link, useLocation } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { CarritoContext } from '../../context/CarritoContext';
import { AuthContext } from '../../context/AuthContext'; 
import './Header.css';
import logoAiko from '../../assets/logo.jpeg'; 

export default function Header() {
  const { carrito } = useContext(CarritoContext);
  const { usuario, cerrarSesion } = useContext(AuthContext);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const location = useLocation();

  // Cierra el menú al cambiar de ruta
  useEffect(() => {
    setMenuAbierto(false);
  }, [location]);

  // Cierra el menú al hacer click fuera
  useEffect(() => {
    const cerrar = (e) => {
      if (!e.target.closest('.header')) setMenuAbierto(false);
    };
    if (menuAbierto) document.addEventListener('click', cerrar);
    return () => document.removeEventListener('click', cerrar);
  }, [menuAbierto]);

  const cantidadTotal = carrito.reduce((total, item) => total + item.cantidad, 0);
  const nombreUsuario = usuario?.user_metadata?.first_name 
    || usuario?.user_metadata?.name?.split(' ')[0] 
    || usuario?.email?.split('@')[0];

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">
          <img src={logoAiko} alt="AIKO tech" className="logo-img" />
        </Link>
      </div>

      {/* Nav escritorio */}
      <nav className="nav-links">
        <a href="/#nosotros">Quiénes Somos</a>
        <a href="/#servicios">Servicios</a>
        <a href="/#contacto">Contacto</a>
        <Link to="/productos" className="link-destacado">Productos</Link>
      </nav>

      {/* Acciones escritorio */}
      <div className="user-actions">
        {usuario ? (
          <>
            <span className="saludo-usuario">Hola, {nombreUsuario}</span>
            <Link to="/pedidos" className="btn-login">Mis Pedidos</Link>
            <button onClick={cerrarSesion} className="btn-salir">Salir</button>
            <Link to="/carrito" className="btn-carrito">
              🛒 {cantidadTotal > 0 && <span className="badge-carrito">{cantidadTotal}</span>}
            </Link>
          </>
        ) : (
          <Link to="/login" className="btn-login">Log In</Link>
        )}
      </div>

      {/* Botón hamburguesa */}
      <button 
        className={`btn-hamburguesa ${menuAbierto ? 'abierto' : ''}`}
        onClick={() => setMenuAbierto(!menuAbierto)}
        aria-label="Abrir menú"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Menú móvil */}
      <div className={`menu-movil ${menuAbierto ? 'visible' : ''}`}>
        <nav className="nav-movil">
          <a href="/#nosotros">Quiénes Somos</a>
          <a href="/#servicios">Servicios</a>
          <a href="/#contacto">Contacto</a>
          <Link to="/productos">Productos</Link>
        </nav>
        <div className="acciones-movil">
          {usuario ? (
            <>
              <span className="saludo-movil">Hola, {nombreUsuario}</span>
              <Link to="/pedidos" className="btn-carrito-movil" style={{backgroundColor: '#1e293b', color: 'white'}}>
                📦 Mis Pedidos
              </Link>
              <Link to="/carrito" className="btn-carrito-movil">
                🛒 Carrito {cantidadTotal > 0 && <span className="badge-carrito">{cantidadTotal}</span>}
              </Link>
              <button onClick={cerrarSesion} className="btn-salir-movil">Cerrar Sesión</button>
            </>
          ) : (
            <Link to="/login" className="btn-login-movil">Iniciar Sesión</Link>
          )}
        </div>
      </div>
    </header>
  );
}