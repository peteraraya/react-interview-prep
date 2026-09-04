import React, { useState, createContext, useContext } from 'react';
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Link, 
  NavLink,
  useParams, 
  useNavigate,
  Outlet,
  Navigate,
  useSearchParams
} from 'react-router-dom';

/**
 * DESAFÍO DE ENTREVISTA: REACT ROUTER
 * 
 * Ejercicio: "Implementar un dashboard con rutas protegidas y navegación"
 * 
 * Requisitos:
 * 1. Rutas anidadas con layout
 * 2. Rutas protegidas (auth)
 * 3. Parámetros de URL
 * 4. Query params
 * 5. Navegación programática
 */

// SOLUCIÓN PROPUESTA

// ============================================
// CONTEXTO DE AUTENTICACIÓN
// ============================================

const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  
  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);
  
  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  return useContext(AuthContext);
}

// ============================================
// COMPONENTES DE RUTAS
// ============================================

// Layout del dashboard
function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div style={{ display: 'flex', minHeight: '400px' }}>
      {/* Sidebar */}
      <aside style={{ 
        width: '220px', 
        backgroundColor: '#1a1a2e', 
        color: 'white', 
        padding: '20px',
        borderRadius: '8px 0 0 8px'
      }}>
        <h3 style={{ marginBottom: '20px' }}>Dashboard</h3>
        <p style={{ fontSize: '12px', color: '#888', marginBottom: '20px' }}>
          Hola, {user?.name}
        </p>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <NavLink to="/dashboard" end style={({ isActive }) => linkStyle(isActive)}>
            📊 Overview
          </NavLink>
          <NavLink to="/dashboard/analytics" style={({ isActive }) => linkStyle(isActive)}>
            📈 Analytics
          </NavLink>
          <NavLink to="/dashboard/settings" style={({ isActive }) => linkStyle(isActive)}>
            ⚙️ Settings
          </NavLink>
          <NavLink to="/dashboard/users" style={({ isActive }) => linkStyle(isActive)}>
            👥 Users
          </NavLink>
        </nav>
        
        <button onClick={handleLogout} style={{ 
          marginTop: '30px', 
          width: '100%', 
          padding: '10px', 
          backgroundColor: '#dc3545', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: 'pointer' 
        }}>
          Logout
        </button>
      </aside>
      
      {/* Main content */}
      <main style={{ flex: 1, padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '0 8px 8px 0' }}>
        <Outlet />
      </main>
    </div>
  );
}

const linkStyle = (isActive) => ({
  padding: '10px 15px',
  backgroundColor: isActive ? '#007bff' : 'transparent',
  color: isActive ? 'white' : '#ccc',
  borderRadius: '4px',
  textDecoration: 'none',
  fontSize: '14px'
});

// Protected Route component
function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Login page
function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simular login
    login({ name: email.split('@')[0], email });
    navigate('/dashboard');
  };
  
  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '30px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
          />
        </div>
        
        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Iniciar Sesión
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '15px', color: '#666', fontSize: '12px' }}>
        Usa cualquier email/password para entrar
      </p>
    </div>
  );
}

// Dashboard pages
function OverviewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const period = searchParams.get('period') || '7d';
  
  return (
    <div>
      <h2>Overview</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <span style={{ marginRight: '10px' }}>Periodo:</span>
        {['7d', '30d', '90d'].map(p => (
          <button
            key={p}
            onClick={() => setSearchParams({ period: p })}
            style={{
              padding: '5px 10px',
              marginRight: '5px',
              backgroundColor: period === p ? '#007bff' : '#e9ecef',
              color: period === p ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {p}
          </button>
        ))}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
        {[
          { label: 'Users', value: '1,234', change: '+12%' },
          { label: 'Revenue', value: '$12,345', change: '+8%' },
          { label: 'Orders', value: '456', change: '+5%' }
        ].map(stat => (
          <div key={stat.label} style={{ padding: '20px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #ddd' }}>
            <p style={{ color: '#666', margin: '0 0 5px' }}>{stat.label}</p>
            <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '0 0 5px' }}>{stat.value}</p>
            <p style={{ color: '#28a745', margin: 0, fontSize: '14px' }}>{stat.change}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsPage() {
  return (
    <div>
      <h2>Analytics</h2>
      <p>Página de analytics con gráficos (simulada)</p>
    </div>
  );
}

function SettingsPage() {
  return (
    <div>
      <h2>Settings</h2>
      <p>Configuración de la cuenta</p>
    </div>
  );
}

function UsersPage() {
  const users = [
    { id: 1, name: 'Ana', role: 'Admin' },
    { id: 2, name: 'Carlos', role: 'User' },
    { id: 3, name: 'Elena', role: 'Editor' }
  ];
  
  return (
    <div>
      <h2>Users</h2>
      <div style={{ display: 'grid', gap: '10px' }}>
        {users.map(user => (
          <Link 
            key={user.id} 
            to={`/dashboard/users/${user.id}`}
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              padding: '15px', 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              border: '1px solid #ddd',
              textDecoration: 'none',
              color: '#333'
            }}
          >
            <span>{user.name}</span>
            <span style={{ color: '#666' }}>{user.role} →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  return (
    <div>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '15px', padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        ← Volver
      </button>
      
      <h2>User Detail</h2>
      <p>Viendo usuario con ID: <strong>{id}</strong></p>
      <p style={{ color: '#666', fontSize: '14px' }}>URL: /dashboard/users/{id}</p>
    </div>
  );
}

// ============================================
// APP PRINCIPAL
// ============================================

export default function RouterChallenge() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="desafio">
          <h2>Desafío: Dashboard con React Router</h2>
          
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              <Route index element={<OverviewPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="users/:id" element={<UserDetailPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

/**
 * DESGLOSE:
 * 
 * 1. AUTH CONTEXT: Maneja estado de autenticación global
 * 2. PROTECTED ROUTE: Componente que verifica auth antes de renderizar
 * 3. NESTED ROUTES: DashboardLayout con Outlet para contenido anidado
 * 4. DYNAMIC ROUTES: /users/:id con useParams
 * 5. QUERY PARAMS: useSearchParams para filtros
 * 6. PROGRAMMATIC NAV: useNavigate para redirecciones
 * 7. 404 ROUTE: wildcard * para rutas no encontradas
 */