import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';

/**
 * MÓDULO 15: CUSTOM HOOKS AVANZADOS
 * 
 * Los custom hooks permiten reutilizar lógica con estado entre componentes.
 * 
 * Conceptos clave:
 * - Convención: use al inicio del nombre
 * - Pueden usar otros hooks
 * - Retornan valores o funciones
 * - Composición de hooks
 */

// ============================================
// HOOK 1: useLocalStorage
// ============================================

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });
  
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  
  return [value, setValue];
}

// ============================================
// HOOK 2: useFetch
// ============================================

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const controller = new AbortController();
    
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error('Error en la petición');
        const json = await response.json();
        setData(json);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    return () => controller.abort();
  }, [url]);
  
  return { data, loading, error };
}

// ============================================
// HOOK 3: useDebounce
// ============================================

function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}

// ============================================
// HOOK 4: useToggle
// ============================================

function useToggle(initial = false) {
  const [value, setValue] = useState(initial);
  
  const toggle = useCallback(() => setValue(v => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  
  return { value, toggle, setTrue, setFalse };
}

// ============================================
// HOOK 5: useEventListener
// ============================================

function useEventListener(eventName, handler, element = null) {
  const savedHandler = useRef();
  
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);
  
  useEffect(() => {
    const targetElement = element || window;
    const eventListener = (event) => savedHandler.current(event);
    
    targetElement.addEventListener(eventName, eventListener);
    return () => targetElement.removeEventListener(eventName, eventListener);
  }, [eventName, element]);
}

// ============================================
// HOOK 6: useKeyPress
// ============================================

function useKeyPress(targetKey) {
  const [keyPressed, setKeyPressed] = useState(false);
  
  useEffect(() => {
    const downHandler = ({ key }) => {
      if (key === targetKey) setKeyPressed(true);
    };
    
    const upHandler = ({ key }) => {
      if (key === targetKey) setKeyPressed(false);
    };
    
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, [targetKey]);
  
  return keyPressed;
}

// ============================================
// HOOK 7: useWindowSize
// ============================================

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return windowSize;
}

// ============================================
// COMPONENTES DE DEMO
// ============================================

function LocalStorageDemo() {
  const [name, setName] = useLocalStorage('demo-name', '');
  const [theme, setTheme] = useLocalStorage('demo-theme', 'light');
  
  return (
    <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h4>useLocalStorage</h4>
      <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
        Persiste valores en localStorage automáticamente
      </p>
      
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Tu nombre (persiste)"
        style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
      />
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          style={{ padding: '8px 16px', backgroundColor: theme === 'dark' ? '#333' : '#fff', color: theme === 'dark' ? '#fff' : '#333', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}
        >
          Theme: {theme}
        </button>
      </div>
      
      {name && (
        <p style={{ marginTop: '10px', padding: '10px', backgroundColor: 'white', borderRadius: '4px' }}>
          Hola, <strong>{name}</strong>!
        </p>
      )}
    </div>
  );
}

function FetchDemo() {
  const [userId, setUserId] = useState(1);
  const { data, loading, error } = useFetch(
    `https://jsonplaceholder.typicode.com/users/${userId}`
  );
  
  return (
    <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h4>useFetch</h4>
      <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
        Hook genérico para peticiones HTTP
      </p>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        {[1, 2, 3].map(id => (
          <button
            key={id}
            onClick={() => setUserId(id)}
            style={{ 
              padding: '8px 16px', 
              backgroundColor: userId === id ? '#007bff' : '#e9ecef',
              color: userId === id ? 'white' : '#333',
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer' 
            }}
          >
            User {id}
          </button>
        ))}
      </div>
      
      {loading && <p style={{ color: '#666' }}>Cargando...</p>}
      {error && <p style={{ color: '#dc3545' }}>Error: {error}</p>}
      {data && (
        <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '4px' }}>
          <p><strong>{data.name}</strong></p>
          <p style={{ color: '#666', fontSize: '14px' }}>{data.email}</p>
          <p style={{ color: '#666', fontSize: '14px' }}>{data.company?.name}</p>
        </div>
      )}
    </div>
  );
}

function DebounceDemo() {
  const [input, setInput] = useState('');
  const debouncedValue = useDebounce(input, 300);
  
  return (
    <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h4>useDebounce</h4>
      <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
        Retrasa la actualización del valor (útil para búsquedas)
      </p>
      
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Escribe algo..."
        style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
      />
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '4px' }}>
          <small style={{ color: '#666' }}>Input (inmediato):</small>
          <p style={{ margin: '5px 0 0' }}>{input || '-'}</p>
        </div>
        <div style={{ padding: '10px', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
          <small style={{ color: '#666' }}>Debounced (300ms):</small>
          <p style={{ margin: '5px 0 0' }}>{debouncedValue || '-'}</p>
        </div>
      </div>
    </div>
  );
}

function ToggleDemo() {
  const modal = useToggle(false);
  const notifications = useToggle(true);
  const { width } = useWindowSize();
  
  return (
    <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h4>useToggle + useWindowSize</h4>
      <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
        Ventana: {width}px
      </p>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button
          onClick={modal.toggle}
          style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {modal.value ? 'Cerrar' : 'Abrir'} Modal
        </button>
        
        <button
          onClick={notifications.toggle}
          style={{ 
            padding: '8px 16px', 
            backgroundColor: notifications.value ? '#28a745' : '#dc3545', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          Notificaciones: {notifications.value ? 'ON' : 'OFF'}
        </button>
      </div>
      
      {modal.value && (
        <div style={{ padding: '15px', backgroundColor: '#fff3e0', borderRadius: '4px', border: '1px solid #ff9800' }}>
          <p>Modal abierto!</p>
          <button onClick={modal.setFalse} style={{ marginTop: '10px', padding: '5px 10px', backgroundColor: '#ff9800', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
}

function KeyPressDemo() {
  const spacePressed = useKeyPress(' ');
  const enterPressed = useKeyPress('Enter');
  
  return (
    <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h4>useKeyPress</h4>
      <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
        Presiona las teclas para ver el efecto
      </p>
      
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ 
          padding: '20px 40px', 
          backgroundColor: spacePressed ? '#28a745' : '#e9ecef',
          color: spacePressed ? 'white' : '#333',
          borderRadius: '8px',
          textAlign: 'center',
          transition: 'all 0.1s'
        }}>
          <div style={{ fontSize: '24px' }}>Space</div>
          <div style={{ fontSize: '12px' }}>{spacePressed ? 'PRESSED' : 'Not pressed'}</div>
        </div>
        
        <div style={{ 
          padding: '20px 40px', 
          backgroundColor: enterPressed ? '#007bff' : '#e9ecef',
          color: enterPressed ? 'white' : '#333',
          borderRadius: '8px',
          textAlign: 'center',
          transition: 'all 0.1s'
        }}>
          <div style={{ fontSize: '24px' }}>Enter</div>
          <div style={{ fontSize: '12px' }}>{enterPressed ? 'PRESSED' : 'Not pressed'}</div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function CustomHooksExamples() {
  return (
    <div className="modulo">
      <h1>Módulo 15: Custom Hooks Avanzados</h1>
      <p className="descripcion">
        Reutilizar lógica con estado entre componentes de forma elegante.
      </p>
      
      <div className="ejemplos">
        <LocalStorageDemo />
        <FetchDemo />
        <DebounceDemo />
        <ToggleDemo />
        <KeyPressDemo />
      </div>
      
      <div className="explicacion">
        <h3>Conceptos Clave:</h3>
        <ul>
          <li><strong>useLocalStorage:</strong> Persistencia automática en localStorage</li>
          <li><strong>useFetch:</strong> Manejo de peticiones HTTP con cleanup</li>
          <li><strong>useDebounce:</strong> Retrasar actualizaciones (búsquedas en tiempo real)</li>
          <li><strong>useToggle:</strong> Estado booleano con funciones helper</li>
          <li><strong>useKeyPress:</strong> Listener de teclado reutilizable</li>
          <li><strong>useWindowSize:</strong> Dimensiones de la ventana reactivas</li>
          <li><strong>Convención:</strong> Siempre empezar con "use"</li>
          <li><strong>Retorno:</strong> Puede ser valor, objeto o array destructurable</li>
        </ul>
      </div>
    </div>
  );
}