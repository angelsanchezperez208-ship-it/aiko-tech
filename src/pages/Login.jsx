import { useState, useContext } from 'react';
import { supabase } from '../supabase/client';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const { usuario } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [mensajeError, setMensajeError] = useState('');

  if (usuario) {
    navigate('/productos');
    return null;
  }

  const manejarLogin = async (e) => {
    e.preventDefault();
    setCargando(true);
    setMensajeError('');
    
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setMensajeError('Credenciales inválidas. Revisa tu correo o contraseña.');
    } else {
      navigate('/productos');
    }
    setCargando(false);
  };

  // 👇 AQUÍ ESTÁ EL TRUCO NINJA PARA EL LOGIN DUAL 👇
  const loginConGoogle = async () => {
    await supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: {
        redirectTo: window.location.origin // Detecta si estás en localhost o en Netlify automáticamente
      }
    });
  };

  return (
    <div className="contenedor-login">
      <form className="formulario-login" onSubmit={manejarLogin}>
        <h2>Bienvenido de nuevo</h2>
        <p className="subtitulo-login">Inicia sesión para continuar</p>
        
        {mensajeError && <p className="error-alerta">{mensajeError}</p>}
        
        <div className="grupo-input">
          <label>Correo Electrónico</label>
          <input type="email" placeholder="tu@correo.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="grupo-input">
          <label>Contraseña</label>
          <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <div className="acciones-login">
          <button type="submit" className="btn-principal" disabled={cargando}>
            {cargando ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
          
          <div className="separador">O</div>
          
          <button type="button" onClick={loginConGoogle} className="btn-google">
            <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" alt="Google logo" />
            Continuar con Google
          </button>
        </div>

        <p className="link-alterno">
          ¿No tienes cuenta? <Link to="/registro">Regístrate aquí</Link>
        </p>
      </form>
    </div>
  );
}