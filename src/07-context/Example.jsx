import React, { createContext, useContext, useState, useReducer, useCallback } from 'react';

/**
 * MÓDULO 07: CONTEXT API
 * 
 * Context API permite compartir datos entre componentes sin pasar props manualmente
 * a través de toda el árbol de componentes (prop drilling).
 * 
 * Conceptos clave:
 * - createContext: crear el contexto
 * - Provider: proveer valores a componentes hijos
 * - useContext: consumir el contexto
 * - useReducer con Context: estado complejo con reducer
 * - Separación de concerns: provider, context y hook personalizado
 */

// ============================================
// EJEMPLO 1: Tema (Theme) con Context
// ============================================

// 1. Crear el contexto
const TemaContext = createContext(undefined);

// 2. Crear el Provider
function TemaProvider({ children }) {
  const [tema, setTema] = useState('claro');
  
  const toggleTema = useCallback(() => {
    setTema(prev => prev === 'claro' ? 'oscuro' : 'claro');
  }, []);
  
  const value = {
    tema,
    toggleTema,
    esOscuro: tema === 'oscuro'
  };
  
  return (
    <TemaContext.Provider value={value}>
      {children}
    </TemaContext.Provider>
  );
}

// 3. Crear hook personalizado para usar el contexto
function useTema() {
  const context = useContext(TemaContext);
  if (context === undefined) {
    throw new Error('useTema debe ser usado dentro de un TemaProvider');
  }
  return context;
}

// 4. Componentes que consumen el contexto
function Header() {
  const { tema, toggleTema, esOscuro } = useTema();
  
  return (
    <header style={{
      padding: '20px',
      backgroundColor: esOscuro ? '#1a1a2e' : '#ffffff',
      color: esOscuro ? '#ffffff' : '#333333',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: `2px solid ${esOscuro ? '#444' : '#ddd'}`,
      transition: 'all 0.3s ease'
    }}>
      <h2 style={{ margin: 0 }}>Mi Aplicación</h2>
      <button
        onClick={toggleTema}
        style={{
          padding: '10px 20px',
          backgroundColor: esOscuro ? '#f0f0f0' : '#333',
          color: esOscuro ? '#333' : '#fff',
          border: 'none',
          borderRadius: '20px',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        {esOscuro ? '☀️ Claro' : '🌙 Oscuro'}
      </button>
    </header>
  );
}

function Contenido() {
  const { esOscuro } = useTema();
  
  return (
    <main style={{
      padding: '30px',
      backgroundColor: esOscuro ? '#16213e' : '#f8f9fa',
      color: esOscuro ? '#e0e0e0' : '#333',
      minHeight: '300px',
      transition: 'all 0.3s ease'
    }}>
      <h3>Contenido Principal</h3>
      <p>Este componente accede al tema sin recibir props.</p>
      <p>El contexto permite compartir el estado del tema globalmente.</p>
    </main>
  );
}

function Footer() {
  const { esOscuro } = useTema();
  
  return (
    <footer style={{
      padding: '20px',
      backgroundColor: esOscuro ? '#0f3460' : '#e9ecef',
      color: esOscuro ? '#ffffff' : '#666',
      textAlign: 'center',
      borderTop: `2px solid ${esOscuro ? '#444' : '#ddd'}`,
      transition: 'all 0.3s ease'
    }}>
      <p style={{ margin: 0 }}>© 2024 React Interview Prep</p>
    </footer>
  );
}

function EjemploTema() {
  return (
    <TemaProvider>
      <div style={{ border: '2px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
        <Header />
        <Contenido />
        <Footer />
      </div>
    </TemaProvider>
  );
}

// ============================================
// EJEMPLO 2: Autenticación con Context + Reducer
// ============================================

// Estados posibles
const authStates = {
  IDLE: 'idle',
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  ERROR: 'error'
};

// Acciones del reducer
const authActions = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT'
};

// Reducer para manejar estado de autenticación
function authReducer(state, action) {
  switch (action.type) {
    case authActions.LOGIN_START:
      return {
        ...state,
        estado: authStates.LOADING,
        error: null
      };
    case authActions.LOGIN_SUCCESS:
      return {
        ...state,
        estado: authStates.AUTHENTICATED,
        usuario: action.payload,
        error: null
      };
    case authActions.LOGIN_FAILURE:
      return {
        ...state,
        estado: authStates.ERROR,
        error: action.payload
      };
    case authActions.LOGOUT:
      return {
        ...state,
        estado: authStates.IDLE,
        usuario: null,
        error: null
      };
    default:
      return state;
  }
}

// Estado inicial
const initialAuthState = {
  estado: authStates.IDLE,
  usuario: null,
  error: null
};

// Contexto de autenticación
const AuthContext = createContext(undefined);

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  
  const login = useCallback(async (email, password) => {
    dispatch({ type: authActions.LOGIN_START });
    
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Validación simple
      if (email === 'error@test.com') {
        throw new Error('Credenciales inválidas');
      }
      
      const usuario = {
        id: 1,
        nombre: email.split('@')[0],
        email,
        rol: 'admin'
      };
      
      dispatch({ type: authActions.LOGIN_SUCCESS, payload: usuario });
      return true;
    } catch (error) {
      dispatch({ type: authActions.LOGIN_FAILURE, payload: error.message });
      return false;
    }
  }, []);
  
  const logout = useCallback(() => {
    dispatch({ type: authActions.LOGOUT });
  }, []);
  
  const value = {
    ...state,
    login,
    logout,
    estaAutenticado: state.estado === authStates.AUTHENTICATED,
    estaCargando: state.estado === authStates.LOADING
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}

// Componentes de autenticación
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, estaCargando, error } = useAuth();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(email, password);
  };
  
  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '300px' }}>
      <h4>Iniciar Sesión</h4>
      
      {error && (
        <div style={{
          padding: '10px',
          backgroundColor: '#ffebee',
          color: '#c62828',
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          {error}
        </div>
      )}
      
      <div style={{ marginBottom: '15px' }}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@test.com"
          required
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            boxSizing: 'border-box'
          }}
        />
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            boxSizing: 'border-box'
          }}
        />
      </div>
      
      <button
        type="submit"
        disabled={estaCargando}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: estaCargando ? '#ccc' : '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: estaCargando ? 'not-allowed' : 'pointer'
        }}
      >
        {estaCargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
      
      <p style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
        Usa "error@test.com" para simular un error
      </p>
    </form>
  );
}

function Dashboard() {
  const { usuario, logout } = useAuth();
  
  return (
    <div style={{ textAlign: 'center' }}>
      <h4>Bienvenido, {usuario.nombre}!</h4>
      <p>Email: {usuario.email}</p>
      <p>Rol: {usuario.rol}</p>
      <button
        onClick={logout}
        style={{
          padding: '10px 20px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Cerrar Sesión
      </button>
    </div>
  );
}

function EjemploAutenticacion() {
  const { estaAutenticado } = useAuth();
  
  return (
    <div style={{
      padding: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      {estaAutenticado ? <Dashboard /> : <LoginForm />}
    </div>
  );
}

// Componente principal
export default function ContextExamples() {
  return (
    <div className="modulo">
      <h1>Módulo 07: Context API</h1>
      <p className="descripcion">
        Context API permite compartir datos entre componentes sin prop drilling.
      </p>
      
      <div className="ejemplos">
        <div className="ejemplo">
          <h3>Ejemplo 1: Tema Global</h3>
          <p style={{ color: '#666', marginBottom: '15px' }}>
            Cambia el tema y observa cómo todos los componentes se actualizan.
          </p>
          <EjemploTema />
        </div>
        
        <div className="ejemplo">
          <h3>Ejemplo 2: Autenticación con Reducer</h3>
          <p style={{ color: '#666', marginBottom: '15px' }}>
            Context + useReducer para manejar estado complejo de autenticación.
          </p>
          <AuthProvider>
            <EjemploAutenticacion />
          </AuthProvider>
        </div>
      </div>
      
      <div className="explicacion">
        <h3>Conceptos Clave:</h3>
        <ul>
          <li><strong>createContext:</strong> Crea un contexto con valor por defecto</li>
          <li><strong>Provider:</strong> Componente que provee valores a toda la rama</li>
          <li><strong>useContext:</strong> Hook para consumir el contexto más cercano</li>
          <li><strong>useReducer + Context:</strong> Para estado complejo con acciones</li>
          <li><strong>Separa concerns:</strong> Provider, Context y Hook personalizado</li>
          <li><strong>Prop drilling:</strong> Context evita pasar props Through many levels</li>
        </ul>
      </div>
    </div>
  );
}