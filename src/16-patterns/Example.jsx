import React, { useState, useEffect, Component, createContext, useContext, useRef, useCallback } from 'react';

/**
 * MÓDULO 16: ERROR BOUNDARIES Y PATRONES AVANZADOS
 * 
 * Conceptos clave:
 * - Error Boundaries: Capturar errores de renderizado
 * - Render Props: Lógica compartida via props
 * - Higher-Order Components (HOC): Reutilizar lógica
 * - Compound Components: Componentes relacionados
 * - Controlled vs Uncontrolled: Patrones de estado
 */

// ============================================
// EJEMPLO 1: Error Boundary
// ============================================

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('Error capturado:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#ffebee', 
          border: '2px solid #f44336', 
          borderRadius: '8px' 
        }}>
          <h3 style={{ color: '#c62828', margin: '0 0 10px' }}>⚠️ Error Capturado</h3>
          <p style={{ color: '#333' }}>{this.state.error?.message}</p>
          
          {this.props.fallback ? (
            this.props.fallback
          ) : (
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              style={{ 
                padding: '10px 20px', 
                backgroundColor: '#c62828', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer',
                marginTop: '10px'
              }}
            >
              Reintentar
            </button>
          )}
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Componente que lanza error
function BuggyComponent() {
  const [shouldError, setShouldError] = useState(false);
  
  if (shouldError) {
    throw new Error('¡Error simulado! Algo salió mal en el componente.');
  }
  
  return (
    <div style={{ padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '8px' }}>
      <p>Componente funcionando correctamente ✓</p>
      <button
        onClick={() => setShouldError(true)}
        style={{ 
          padding: '8px 16px', 
          backgroundColor: '#dc3545', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        Lanzar Error
      </button>
    </div>
  );
}

// ============================================
// EJEMPLO 2: Render Props
// ============================================

function MouseTracker({ render }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  return render(position);
}

function RenderPropsExample() {
  return (
    <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h4>Render Props</h4>
      <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
        Mueve el mouse para ver la posición (render prop)
      </p>
      
      <MouseTracker render={({ x, y }) => (
        <div style={{ 
          padding: '20px', 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          border: '1px solid #ddd' 
        }}>
          <p>Posición del mouse:</p>
          <p style={{ fontFamily: 'monospace', fontSize: '18px' }}>
            x: {x}, y: {y}
          </p>
          
          <div style={{ 
            width: '20px', 
            height: '20px', 
            backgroundColor: '#007bff', 
            borderRadius: '50%',
            transform: `translate(${x % 200}px, ${y % 100}px)`,
            transition: 'transform 0.1s'
          }} />
        </div>
      )} />
    </div>
  );
}

// ============================================
// EJEMPLO 3: Higher-Order Component (HOC)
// ============================================

function withLoading(WrappedComponent) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) {
      return (
        <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <div style={{ 
            width: '30px', height: '30px', border: '3px solid #f3f3f3', borderTop: '3px solid #007bff',
            borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 10px'
          }}></div>
          Cargando...
        </div>
      );
    }
    
    return <WrappedComponent {...props} />;
  };
}

function UserData({ name, email }) {
  return (
    <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '8px' }}>
      <p><strong>{name}</strong></p>
      <p style={{ color: '#666' }}>{email}</p>
    </div>
  );
}

const UserDataWithLoading = withLoading(UserData);

function HOCExample() {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h4>Higher-Order Component (HOC)</h4>
      
      <button
        onClick={() => setIsLoading(true)}
        style={{ 
          padding: '8px 16px', 
          backgroundColor: '#6c757d', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: 'pointer',
          marginBottom: '10px'
        }}
      >
        Recargar
      </button>
      
      <UserDataWithLoading
        isLoading={isLoading}
        name="Ana García"
        email="ana@test.com"
      />
    </div>
  );
}

// ============================================
// EJEMPLO 4: Compound Components
// ============================================

const TabsContext = createContext();

function Tabs({ defaultTab, children }) {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

function TabList({ children }) {
  return (
    <div style={{ 
      display: 'flex', 
      borderBottom: '1px solid #ddd', 
      backgroundColor: '#f8f9fa' 
    }}>
      {children}
    </div>
  );
}

function Tab({ value, children }) {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;
  
  return (
    <button
      onClick={() => setActiveTab(value)}
      style={{
        flex: 1,
        padding: '12px 20px',
        backgroundColor: isActive ? 'white' : 'transparent',
        border: 'none',
        borderBottom: isActive ? '2px solid #007bff' : '2px solid transparent',
        cursor: 'pointer',
        fontWeight: isActive ? 'bold' : 'normal',
        color: isActive ? '#007bff' : '#666'
      }}
    >
      {children}
    </button>
  );
}

function TabPanels({ children }) {
  const { activeTab } = useContext(TabsContext);
  
  return (
    <div style={{ padding: '20px' }}>
      {React.Children.map(children, child => {
        if (child.props.value === activeTab) {
          return child.props.children;
        }
        return null;
      })}
    </div>
  );
}

function TabPanel({ value, children }) {
  return <div>{children}</div>;
}

function CompoundComponentsExample() {
  return (
    <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h4>Compound Components</h4>
      
      <Tabs defaultTab="tab1">
        <TabList>
          <Tab value="tab1">General</Tab>
          <Tab value="tab2">Detalles</Tab>
          <Tab value="tab3">Config</Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel value="tab1">
            <h4>General</h4>
            <p>Contenido de la pestaña General</p>
          </TabPanel>
          <TabPanel value="tab2">
            <h4>Detalles</h4>
            <p>Información detallada aquí</p>
          </TabPanel>
          <TabPanel value="tab3">
            <h4>Configuración</h4>
            <p>Opciones de configuración</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}

// ============================================
// EJEMPLO 5: Controlled vs Uncontrolled
// ============================================

function ControlledInput() {
  const [value, setValue] = useState('');
  
  return (
    <div>
      <p style={{ fontSize: '12px', color: '#666' }}>Controlled (React controla el valor):</p>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Escribe algo..."
          style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <button onClick={() => alert(`Valor: ${value}`)} style={{ padding: '10px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Mostrar
        </button>
      </div>
      <p style={{ marginTop: '10px', fontSize: '14px' }}>Valor actual: <strong>{value || '(vacío)'}</strong></p>
    </div>
  );
}

function UncontrolledInput() {
  const inputRef = useRef();
  
  const handleSubmit = () => {
    alert(`Valor: ${inputRef.current.value}`);
  };
  
  return (
    <div>
      <p style={{ fontSize: '12px', color: '#666' }}>Uncontrolled (DOM controla el valor):</p>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          ref={inputRef}
          defaultValue=""
          placeholder="Escribe algo..."
          style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <button onClick={handleSubmit} style={{ padding: '10px 15px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Mostrar
        </button>
      </div>
    </div>
  );
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function PatternsExamples() {
  return (
    <div className="modulo">
      <h1>Módulo 16: Error Boundaries y Patrones Avanzados</h1>
      <p className="descripcion">
        Patrones de diseño para código mantenible y robusto.
      </p>
      
      <div className="ejemplos">
        <ErrorBoundary>
          <BuggyComponent />
        </ErrorBoundary>
        
        <RenderPropsExample />
        <HOCExample />
        <CompoundComponentsExample />
        
        <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h4>Controlled vs Uncontrolled</h4>
          <div style={{ display: 'grid', gap: '15px' }}>
            <ControlledInput />
            <UncontrolledInput />
          </div>
        </div>
      </div>
      
      <div className="explicacion">
        <h3>Conceptos Clave:</h3>
        <ul>
          <li><strong>Error Boundaries:</strong> Capturan errores en renderizado (class component)</li>
          <li><strong>Render Props:</strong> Lógica compartida pasando función como prop</li>
          <li><strong>HOC:</strong> Función que envuelve componente para añadir lógica</li>
          <li><strong>Compound Components:</strong> Componentes relacionados que trabajan juntos</li>
          <li><strong>Controlled:</strong> React controla el estado (useState)</li>
          <li><strong>Uncontrolled:</strong> DOM controla el estado (useRef)</li>
          <li><strong>Context:</strong> Compartir estado sin prop drilling</li>
          <li><strong>Composition:</strong> Preferir composición sobre herencia</li>
        </ul>
      </div>
    </div>
  );
}