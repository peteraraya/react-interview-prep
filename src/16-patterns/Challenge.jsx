import React, { useState, Component, createContext, useContext, useCallback } from 'react';

/**
 * DESAFÍO DE ENTREVISTA: PATRONES AVANZADOS
 * 
 * Ejercicio: "Crear un sistema de notificaciones con patrones"
 * 
 * Requisitos:
 * - Error Boundary para capturar errores
 * - Context para estado global
 * - Compound Components para la UI
 * - Render props para contenido personalizado
 */

// SOLUCIÓN PROPUESTA

// ============================================
// ERROR BOUNDARY PERSONALIZADO
// ============================================

class NotificationErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Notification Error:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#ffebee', 
          border: '1px solid #f44336', 
          borderRadius: '8px' 
        }}>
          <p style={{ color: '#c62828' }}>Error en las notificaciones</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{ 
              marginTop: '10px', 
              padding: '8px 16px', 
              backgroundColor: '#c62828', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reintentar
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// ============================================
// CONTEXTO DE NOTIFICACIONES
// ============================================

const NotificationContext = createContext();

function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  
  const addNotification = useCallback((notification) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { ...notification, id }]);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);
  
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);
  
  return (
    <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
      {children}
    </NotificationContext.Provider>
  );
}

function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications debe usarse dentro de NotificationProvider');
  }
  return context;
}

// ============================================
// COMPOUND COMPONENTS: NOTIFICATION LIST
// ============================================

function NotificationList({ children }) {
  const { notifications } = useNotifications();
  
  if (notifications.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f8f9fa', borderRadius: '8px', color: '#666' }}>
        No hay notificaciones
      </div>
    );
  }
  
  return (
    <div style={{ display: 'grid', gap: '10px' }}>
      {children(notifications)}
    </div>
  );
}

function NotificationItem({ notification, children }) {
  const { removeNotification } = useNotifications();
  
  const bgColor = {
    success: '#e8f5e8',
    error: '#ffebee',
    warning: '#fff3e0',
    info: '#e3f2fd'
  }[notification.type] || '#f8f9fa';
  
  const borderColor = {
    success: '#4caf50',
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3'
  }[notification.type] || '#ddd';
  
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      padding: '15px', 
      backgroundColor: bgColor,
      border: `1px solid ${borderColor}`,
      borderRadius: '8px'
    }}>
      <div style={{ flex: 1 }}>
        {children ? children(notification) : (
          <>
            <strong>{notification.title}</strong>
            {notification.message && (
              <p style={{ margin: '5px 0 0', color: '#666', fontSize: '14px' }}>{notification.message}</p>
            )}
          </>
        )}
      </div>
      
      <button
        onClick={() => removeNotification(notification.id)}
        style={{ 
          padding: '5px 10px', 
          backgroundColor: 'transparent', 
          border: 'none', 
          cursor: 'pointer',
          fontSize: '18px',
          color: '#666'
        }}
      >
        ×
      </button>
    </div>
  );
}

// ============================================
// COMPONENTE DE DEMO
// ============================================

function PatternsChallenge() {
  const { addNotification } = useNotifications();
  
  const addSuccess = () => {
    addNotification({ type: 'success', title: 'Éxito', message: 'Operación completada' });
  };
  
  const addError = () => {
    addNotification({ type: 'error', title: 'Error', message: 'Algo falló' });
  };
  
  const addWarning = () => {
    addNotification({ type: 'warning', title: 'Advertencia', message: 'Revisa la configuración' });
  };
  
  const addInfo = () => {
    addNotification({ type: 'info', title: 'Info', message: 'Nueva actualización disponible' });
  };
  
  // Simular error
  const [shouldError, setShouldError] = useState(false);
  if (shouldError) {
    throw new Error('Error simulado en la aplicación');
  }
  
  return (
    <div className="desafio">
      <h2>Desafío: Sistema de Notificaciones</h2>
      
      {/* Botones para agregar notificaciones */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <button onClick={addSuccess} style={{ ...btnStyle, backgroundColor: '#4caf50' }}>
          + Success
        </button>
        <button onClick={addError} style={{ ...btnStyle, backgroundColor: '#f44336' }}>
          + Error
        </button>
        <button onClick={addWarning} style={{ ...btnStyle, backgroundColor: '#ff9800' }}>
          + Warning
        </button>
        <button onClick={addInfo} style={{ ...btnStyle, backgroundColor: '#2196f3' }}>
          + Info
        </button>
        <button 
          onClick={() => setShouldError(true)} 
          style={{ ...btnStyle, backgroundColor: '#9c27b0' }}
        >
          Lanzar Error
        </button>
      </div>
      
      {/* Lista de notificaciones con Compound Components */}
      <NotificationList>
        {(notifications) => 
          notifications.map(notification => (
            <NotificationItem key={notification.id} notification={notification} />
          ))
        }
      </NotificationList>
      
      {/* Solución */}
      <div style={{ marginTop: '30px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h4>Patrones Utilizados:</h4>
        <ol style={{ paddingLeft: '20px', fontSize: '14px' }}>
          <li><strong>Error Boundary:</strong> Captura errores sin crashear toda la app</li>
          <li><strong>Context:</strong> Estado global de notificaciones</li>
          <li><strong>Compound Components:</strong> NotificationList, NotificationItem</li>
          <li><strong>Render Props:</strong> Children como función para contenido personalizado</li>
          <li><strong>Custom Hook:</strong> useNotifications para consumir el contexto</li>
          <li><strong>useCallback:</strong> Funciones estables para agregar/remover</li>
        </ol>
      </div>
    </div>
  );
}

const btnStyle = {
  padding: '10px 20px',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

// ============================================
// APP PRINCIPAL CON ERROR BOUNDARY
// ============================================

export default function PatternsChallengeWrapper() {
  return (
    <NotificationErrorBoundary>
      <NotificationProvider>
        <PatternsChallenge />
      </NotificationProvider>
    </NotificationErrorBoundary>
  );
}

/**
 * DESGLOSE:
 * 
 * 1. ERROR BOUNDARY: Clase que captura errores en sus hijos
 * 2. CONTEXT + PROVIDER: Estado global de notificaciones
 * 3. COMPOUND COMPONENTS: NotificationList + NotificationItem
 * 4. RENDER PROPS: Children como función para contenido dinámico
 * 5. CUSTOM HOOK: useNotifications para acceso al contexto
 * 6. AUTO-REMOVE: setTimeout para notificaciones temporales
 */