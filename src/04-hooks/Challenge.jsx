import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';

/**
 * DESAFÍO DE ENTREVISTA: HOOKS
 * 
 * Ejercicio común en entrevistas técnicas de nivel inicial:
 * "Crear un buscador de usuarios con debounce y caching"
 * 
 * Requisitos:
 * 1. Implementar búsqueda con debounce para evitar过多 requests
 * 2. Cachear resultados para búsquedas repetidas
 * 3. Mostrar estado de carga
 * 4. Manejar errores
 * 5. Limpiar búsqueda al desmontar componente
 */

// SOLUCIÓN PROPUESTA

// Simulación de API de usuarios
const usuariosSimulados = [
  { id: 1, nombre: "Ana García", email: "ana@email.com", telefono: "123-456-7890" },
  { id: 2, nombre: "Carlos López", email: "carlos@email.com", telefono: "098-765-4321" },
  { id: 3, nombre: "Elena Martínez", email: "elena@email.com", telefono: "555-123-4567" },
  { id: 4, nombre: "Pedro Sánchez", email: "pedro@email.com", telefono: "555-987-6543" },
  { id: 5, nombre: "María Rodríguez", email: "maria@email.com", telefono: "555-456-7890" },
  { id: 6, nombre: "Juan Hernández", email: "juan@email.com", telefono: "555-321-6549" },
  { id: 7, nombre: "Laura Díaz", email: "laura@email.com", telefono: "555-789-0123" },
  { id: 8, nombre: "Miguel Fernández", email: "miguel@email.com", telefono: "555-654-3210" }
];

// Simular llamada a API con retraso
const buscarUsuariosAPI = (termino) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.1) { // 90% de éxito
        const resultados = usuariosSimulados.filter(usuario =>
          usuario.nombre.toLowerCase().includes(termino.toLowerCase()) ||
          usuario.email.toLowerCase().includes(termino.toLowerCase())
        );
        resolve(resultados);
      } else {
        reject(new Error('Error al buscar usuarios'));
      }
    }, 500); // Simular retraso de red
  });
};

// Hook personalizado para debounce
function useDebounce(valor, delay) {
  const [valorDebounced, setValorDebounced] = useState(valor);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setValorDebounced(valor);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [valor, delay]);
  
  return valorDebounced;
}

// Hook personalizado para búsqueda con cache
function useBusquedaUsuarios() {
  const [termino, setTermino] = useState('');
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const cacheRef = useRef(new Map());
  
  // Debounce del término de búsqueda
  const terminoDebounced = useDebounce(termino, 300);
  
  // Buscar usuarios cuando cambia el término debounced
  useEffect(() => {
    if (!terminoDebounced.trim()) {
      setResultados([]);
      return;
    }
    
    const buscarUsuarios = async () => {
      // Verificar cache primero
      if (cacheRef.current.has(terminoDebounced)) {
        setResultados(cacheRef.current.get(terminoDebounced));
        return;
      }
      
      setCargando(true);
      setError(null);
      
      try {
        const resultadosBusqueda = await buscarUsuariosAPI(terminoDebounced);
        setResultados(resultadosBusqueda);
        
        // Guardar en cache
        cacheRef.current.set(terminoDebounced, resultadosBusqueda);
      } catch (err) {
        setError(err.message);
        setResultados([]);
      } finally {
        setCargando(false);
      }
    };
    
    buscarUsuarios();
  }, [terminoDebounced]);
  
  // Limpiar cache y resultados
  const limpiarBusqueda = useCallback(() => {
    setTermino('');
    setResultados([]);
    setError(null);
    cacheRef.current.clear();
  }, []);
  
  return {
    termino,
    setTermino,
    resultados,
    cargando,
    error,
    limpiarBusqueda,
    cacheSize: cacheRef.current.size
  };
}

function UsuarioCard({ usuario }) {
  return (
    <div style={{
      padding: '15px',
      margin: '10px 0',
      backgroundColor: 'white',
      borderRadius: '8px',
      border: '1px solid #ddd',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          backgroundColor: '#007bff',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          fontWeight: 'bold'
        }}>
          {usuario.nombre.charAt(0)}
        </div>
        
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: '0 0 5px 0' }}>{usuario.nombre}</h4>
          <p style={{ margin: '0 0 5px 0', color: '#666', fontSize: '14px' }}>
            {usuario.email}
          </p>
          <p style={{ margin: 0, color: '#888', fontSize: '12px' }}>
            {usuario.telefono}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SearchChallenge() {
  const {
    termino,
    setTermino,
    resultados,
    cargando,
    error,
    limpiarBusqueda,
    cacheSize
  } = useBusquedaUsuarios();
  
  return (
    <div className="desafio">
      <h2>Desafío: Buscador de Usuarios con Debounce y Cache</h2>
      
      <div style={{ 
        maxWidth: '600px', 
        margin: '0 auto',
        padding: '20px'
      }}>
        {/* Barra de búsqueda */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '20px' 
        }}>
          <input
            type="text"
            value={termino}
            onChange={(e) => setTermino(e.target.value)}
            placeholder="Buscar usuarios por nombre o email..."
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '16px',
              border: '2px solid #ddd',
              borderRadius: '8px',
              outline: 'none'
            }}
          />
          
          <button
            onClick={limpiarBusqueda}
            style={{
              padding: '12px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Limpiar
          </button>
        </div>
        
        {/* Información de estado */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '20px',
          padding: '10px',
          backgroundColor: '#f8f9fa',
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          <span>
            {cargando ? 'Buscando...' : `${resultados.length} resultados encontrados`}
          </span>
          <span>
            Cache: {cacheSize} términos guardados
          </span>
        </div>
        
        {/* Indicador de carga */}
        {cargando && (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            backgroundColor: '#e3f2fd',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #007bff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 10px'
            }}></div>
            <p style={{ margin: 0, color: '#666' }}>Buscando usuarios...</p>
          </div>
        )}
        
        {/* Error */}
        {error && (
          <div style={{
            padding: '15px',
            backgroundColor: '#ffebee',
            color: '#c62828',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #ffcdd2'
          }}>
            <strong>Error:</strong> {error}
          </div>
        )}
        
        {/* Resultados */}
        {!cargando && resultados.length > 0 && (
          <div>
            <h3>Resultados:</h3>
            {resultados.map(usuario => (
              <UsuarioCard key={usuario.id} usuario={usuario} />
            ))}
          </div>
        )}
        
        {/* Sin resultados */}
        {!cargando && termino && resultados.length === 0 && !error && (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            color: '#666'
          }}>
            <p style={{ margin: 0 }}>No se encontraron usuarios para "{termino}"</p>
          </div>
        )}
        
        {/* Instrucciones */}
        <div style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          fontSize: '14px'
        }}>
          <h4 style={{ margin: '0 0 10px 0' }}>Características implementadas:</h4>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            <li><strong>Debounce:</strong> Espera 300ms después de dejar de escribir</li>
            <li><strong>Cache:</strong> Almacena resultados para búsquedas repetidas</li>
            <li><strong>Estado de carga:</strong> Muestra indicador durante la búsqueda</li>
            <li><strong>Manejo de errores:</strong> Muestra mensaje si falla la búsqueda</li>
            <li><strong>Limpieza:</strong> Botón para reiniciar búsqueda y cache</li>
          </ul>
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

/**
 * DESGLOSE DE LA SOLUCIÓN:
 * 
 * 1. HOOK PERSONALIZADO useDebounce:
 *    - Usa useState y useEffect internamente
 *    - Retorna valor actualizado después del delay especificado
 *    - Limpia timeout anterior cuando el valor cambia
 * 
 * 2. HOOK PERSONALIZADO useBusquedaUsuarios:
 *    - Encapsula toda la lógica de búsqueda
 *    - Maneja estado de carga, resultados y errores
 *    - Implementa cache con useRef (persiste entre renderizados)
 *    - Usa useCallback para función de limpieza estable
 * 
 * 3. GESTIÓN DE ESTADO:
 *    - Estado local para término de búsqueda
 *    - Estado para resultados, carga y errores
 *    - useRef para cache (no causa re-renderizados)
 * 
 * 4. EFECTOS SECUNDARIOS:
 *    - useEffect para búsqueda cuando cambia el término debounced
 *    - Cleanup implícito al usar dependencias correctas
 * 
 * 5. OPTIMIZACIÓN:
 *    - Debounce evita过多 requests al usuario escribir rápido
 *    - Cache evita requests duplicados para términos ya buscados
 *    - useCallback para funciones estables
 * 
 * PREGUNTAS DE SEGUIMIENTO COMUNES EN ENTREVISTAS:
 * - ¿Cómo implementarías paginación en los resultados?
 * - ¿Cómo manejarías cancelación de requests anteriores?
 * - ¿Cómo optimizarías para listas de resultados muy grandes?
 * - ¿Cómo implementarías búsqueda en tiempo real con WebSocket?
 */