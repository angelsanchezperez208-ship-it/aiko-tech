import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Inicio from './pages/Inicio';
import Productos from './pages/Productos';
import Carrito from './pages/Carrito';
import Login from './pages/Login';
import Registro from './pages/Registro';
import { CarritoProvider } from './context/CarritoContext';
// NUEVO: Importamos el cerebro de usuarios
import { AuthProvider } from './context/AuthContext'; 

function App() {
  return (
    // NUEVO: Envolvemos todo con el AuthProvider
    <AuthProvider>
      <CarritoProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/carrito" element={<Carrito />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Registro />} />
          </Routes>
        </BrowserRouter>
      </CarritoProvider>
    </AuthProvider>
  );
}

export default App;