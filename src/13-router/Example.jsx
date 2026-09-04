import React, { useState } from 'react';
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Link, 
  NavLink,
  useParams, 
  useNavigate,
  useLocation,
  Outlet,
  Navigate
} from 'react-router-dom';

/**
 * MÓDULO 13: REACT ROUTER
 * 
 * React Router permite la navegación en aplicaciones SPA (Single Page Application).
 * 
 * Conceptos clave:
 * - BrowserRouter: Envuelve la app para habilitar routing
 * - Routes/Route: Definir rutas
 * - Link/NavLink: Navegación declarativa
 * - useParams: Obtener parámetros de la URL
 * - useNavigate: Navegación programática
 * - useLocation: Información de la ubicación actual
 * - Nested Routes: Rutas anidadas con Outlet
 * - Protected Routes: Rutas protegidas
 */

// ============================================
// COMPONENTES DE EJEMPLO
// ============================================

// Layout principal
function Layout() {
  const location = useLocation();
  
  return (
    <div style={{ minHeight: '400px' }}>
      <nav style={{ 
        display: 'flex', 
        gap: '10px', 
        padding: '15px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        marginBottom: '20px',
        alignItems: 'center'
      }}>
        <strong style={{ marginRight: '10px' }}>React Router:</strong>
        <NavLink 
          to="/" 
          style={({ isActive }) => ({
            padding: '8px 16px',
            backgroundColor: isActive ? '#007bff' : '#e9ecef',
            color: isActive ? 'white' : '#333',
            borderRadius: '4px',
            textDecoration: 'none'
          })}
        >
          Inicio
        </NavLink>
        <NavLink 
          to="/users" 
          style={({ isActive }) => ({
            padding: '8px 16px',
            backgroundColor: isActive ? '#007bff' : '#e9ecef',
            color: isActive ? 'white' : '#333',
            borderRadius: '4px',
            textDecoration: 'none'
          })}
        >
          Usuarios
        </NavLink>
        <NavLink 
          to="/about" 
          style={({ isActive }) => ({
            padding: '8px 16px',
            backgroundColor: isActive ? '#007bff' : '#e9ecef',
            color: isActive ? 'white' : '#333',
            borderRadius: '4px',
            textDecoration: 'none'
          })}
        >
          Acerca de
        </NavLink>
        
        <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#666' }}>
          Ruta actual: {location.pathname}
        </span>
      </nav>
      
      <Outlet />
    </div>
  );
}

// Página de inicio
function HomePage() {
  const navigate = useNavigate();
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#e8f5e8', borderRadius: '8px' }}>
      <h2>Página de Inicio</h2>
      <p>Bienvenido a la demo de React Router</p>
      
      <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
        <button 
          onClick={() => navigate('/users')}
          style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Ir a Usuarios (programático)
        </button>
        <button 
          onClick={() => navigate('/users/1')}
          style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Ver Usuario 1
        </button>
      </div>
    </div>
  );
}

// Lista de usuarios
function UsersPage() {
  const users = [
    { id: 1, name: 'Ana García' },
    { id: 2, name: 'Carlos López' },
    { id: 3, name: 'Elena Martínez' }
  ];
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
      <h2>Lista de Usuarios</h2>
      <div style={{ display: 'grid', gap: '10px' }}>
        {users.map(user => (
          <Link 
            key={user.id} 
            to={`/users/${user.id}`}
            style={{ 
              display: 'block',
              padding: '15px',
              backgroundColor: 'white',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#333',
              border: '1px solid #ddd'
            }}
          >
            <strong>{user.name}</strong>
            <span style={{ color: '#666', marginLeft: '10px' }}>→ Ver detalle</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Detalle de usuario (con useParams)
function UserDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Simular datos de usuario
  const users = {
    '1': { name: 'Ana García', email: 'ana@test.com', role: 'Admin' },
    '2': { name: 'Carlos López', email: 'carlos@test.com', role: 'User' },
    '3': { name: 'Elena Martínez', email: 'elena@test.com', role: 'Editor' }
  };
  
  const user = users[id];
  
  if (!user) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#ffebee', borderRadius: '8px' }}>
        <h2>Usuario no encontrado</h2>
        <button onClick={() => navigate('/users')} style={{ marginTop: '10px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          ← Volver a usuarios
        </button>
      </div>
    );
  }
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#fff3e0', borderRadius: '8px' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '15px', padding: '8px 16px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        ← Volver
      </button>
      
      <h2>Detalle de Usuario</h2>
      <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
        URL actual: /users/{id}
      </p>
      
      <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '8px' }}>
        <p><strong>Nombre:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Rol:</strong> {user.role}</p>
        <p><strong>ID:</strong> {id}</p>
      </div>
    </div>
  );
}

// Página about
function AboutPage() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f3e5f5', borderRadius: '8px' }}>
      <h2>Acerca de</h2>
      <p>Esta es una demo de React Router v6.</p>
      
      <div style={{ marginTop: '15px', padding: '15px', backgroundColor: 'white', borderRadius: '8px' }}>
        <h4>Conceptos demostrados:</h4>
        <ul>
          <li> NavLink con active styles</li>
          <li>useParams para parámetros de URL</li>
          <li>useNavigate para navegación programática</li>
          <li>useLocation para obtener ubicación actual</li>
          <li>Nested Routes con Outlet</li>
        </ul>
      </div>
    </div>
  );
}

// Página 404
function NotFoundPage() {
  return (
    <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#ffebee', borderRadius: '8px' }}>
      <h2>404 - Página no encontrada</h2>
      <Link to="/" style={{ display: 'inline-block', marginTop: '15px', padding: '10px 20px', backgroundColor: '#007bff', color: 'white', borderRadius: '4px', textDecoration: 'none' }}>
        Volver al inicio
      </Link>
    </div>
  );
}

// ============================================
// COMPONENTE PRINCIPAL CON ROUTER
// ============================================

export default function RouterExamples() {
  return (
    <div className="modulo">
      <h1>Módulo 13: React Router</h1>
      <p className="descripcion">
        React Router permite la navegación en aplicaciones SPA con URLs limpias.
      </p>
      
      <div className="ejemplos">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="users/:id" element={<UserDetailPage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
      
      <div className="explicacion">
        <h3>Conceptos Clave:</h3>
        <ul>
          <li><strong>BrowserRouter:</strong> Envuelve la app para habilitar routing</li>
          <li><strong>Routes/Route:</strong> Definen las rutas y sus componentes</li>
          <li><strong>Link/NavLink:</strong> Navegación declarativa (sin recargar)</li>
          <li><strong>useParams:</strong> Obtiene parámetros :id de la URL</li>
          <li><strong>useNavigate:</strong> Navegación programática (push, replace, back)</li>
          <li><strong>useLocation:</strong> Información de la ubicación actual</li>
          <li><strong>Outlet:</strong> Renderiza rutas hijas en rutas anidadas</li>
          <li><strong>Navigate:</strong> Redirección declarativa</li>
          <li><strong>Wildcard *:</strong> Ruta por defecto para 404</li>
        </ul>
      </div>
    </div>
  );
}