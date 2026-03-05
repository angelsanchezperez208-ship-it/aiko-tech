import { useState, useContext } from 'react';
import { supabase } from '../supabase/client';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Login.css'; // Reutilizaremos los mismos estilos

export default function Registro() {
  const navigate = useNavigate();
  const { usuario } = useContext(AuthContext);

  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mensajeError, setMensajeError] = useState('');

  if (usuario) {
    navigate('/productos');
    return null;
  }

  const manejarRegistro = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensajeError('');
    
    // Función de Supabase para registrarse guardando metadatos (nombre y apellido)
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          first_name: nombre,
          last_name: apellido,
        }
      }
    });
    
    if (error) {
      setMensajeError('Hubo un error al registrarte: ' + error.message);
    } else {
      alert('¡Cuenta creada con éxito! Ya puedes iniciar sesión.');
      navigate('/login');
    }
    setCargando(false);
  };

  const loginConGoogle = async () => {
    await supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
  };

  return (
    <div className="contenedor-login">
      <form className="formulario-login" onSubmit={manejarRegistro}>
        <h2>Crear una Cuenta</h2>
        <p className="subtitulo-login">Únete a AIKO tech para comprar</p>
        
        {mensajeError && <p className="error-alerta">{mensajeError}</p>}
        
        <div className="grupo-input-doble">
          <div className="grupo-input">
            <label>Nombre</label>
            <input type="text" placeholder="Ej. Juan" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>
          <div className="grupo-input">
            <label>Apellido</label>
            <input type="text" placeholder="Ej. Pérez" value={apellido} onChange={(e) => setApellido(e.target.value)} required />
          </div>
        </div>

        <div className="grupo-input">
          <label>Correo Electrónico</label>
          <input type="email" placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="grupo-input">
          <label>Contraseña</label>
          <input type="password" placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="6" />
        </div>

        <div className="acciones-login">
          <button type="submit" className="btn-principal" disabled={cargando}>
            {cargando ? 'Creando cuenta...' : 'Registrarse'}
          </button>
          
          <div className="separador">O</div>
          
          <button type="button" onClick={loginConGoogle} className="btn-google">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google logo" />
            Continuar con Google
          </button>
        </div>

        <p className="link-alterno">
          ¿Ya tienes cuenta? <Link to="/login">Inicia Sesión aquí</Link>
        </p>
      </form>
    </div>
  );
}