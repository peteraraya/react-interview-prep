import React, { useState, useEffect, useCallback } from 'react';

/**
 * MÓDULO 06: OBTENCIÓN DE DATOS MEDIANTE API
 * 
 * La obtención de datos desde APIs es una de las tareas más comunes en React.
 * Se puede hacer con fetch API nativa o con librerías como axios.
 * 
 * Conceptos clave:
 * - Usar useEffect para hacer llamadas a API al montar el componente
 * - Manejar estados de carga, éxito y error
 * - Usar async/await para código más limpio
 * - Implementar cancelación de requests
 * - Cache de datos para evitar requests redundantes
 * - Paginación y carga infinita
 */

// Ejemplo 1: Fetch básico con API pública
function ListaPost() {
  const [posts, setPosts] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  
  const POSTS_POR_PAGINA = 10;
  
  useEffect(() => {
    const obtenerPosts = async () => {
      setCargando(true);
      setError(null);
      
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/posts?_page=${pagina}&_limit=${POSTS_POR_PAGINA}`
        );
        
        if (!response.ok) {
          throw new Error('Error al obtener los posts');
        }
        
        const data = await response.json();
        setPosts(data);
        
        // Obtener total de páginas del header
        const totalItems = response.headers.get('X-Total-Count');
        setTotalPaginas(Math.ceil(totalItems / POSTS_POR_PAGINA));
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };
    
    obtenerPosts();
  }, [pagina]); // Se ejecuta cuando cambia la página
  
  if (cargando) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px'
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
        <p>Cargando posts...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#ffebee', 
        color: '#c62828',
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h3>Error</h3>
        <p>{error}</p>
        <button 
          onClick={() => setPagina(1)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
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
  
  return (
    <div className="ejemplo">
      <h3>Ejemplo 1: Lista de Posts con Paginación</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '15px'
        }}>
          <span>Página {pagina} de {totalPaginas}</span>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setPagina(p => Math.max(1, p - 1))}
              disabled={pagina === 1}
              style={{
                padding: '8px 16px',
                backgroundColor: pagina === 1 ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: pagina === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Anterior
            </button>
            
            <button
              onClick={() => setPagina(p => Math.min(totalPaginas, p + 1))}
              disabled={pagina === totalPaginas}
              style={{
                padding: '8px 16px',
                backgroundColor: pagina === totalPaginas ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: pagina === totalPaginas ? 'not-allowed' : 'pointer'
              }}
            >
              Siguiente
            </button>
          </div>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gap: '15px',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
        }}>
          {posts.map(post => (
            <div 
              key={post.id}
              style={{
                padding: '15px',
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
              }}
            >
              <h4 style={{ margin: '0 0 10px 0', color: '#333' }}>
                {post.title}
              </h4>
              <p style={{ 
                margin: 0, 
                color: '#666', 
                fontSize: '14px',
                lineHeight: '1.5'
              }}>
                {post.body}
              </p>
              <div style={{ 
                marginTop: '10px', 
                fontSize: '12px', 
                color: '#888' 
              }}>
                Post #{post.id}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Ejemplo 2: Búsqueda con debounce y cache
function BuscadorUsuarios() {
  const [termino, setTermino] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [cache, setCache] = useState(new Map());
  
  useEffect(() => {
    if (!termino.trim()) {
      setUsuarios([]);
      return;
    }
    
    const buscarUsuarios = async () => {
      // Verificar cache
      if (cache.has(termino)) {
        setUsuarios(cache.get(termino));
        return;
      }
      
      setCargando(true);
      setError(null);
      
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users?name_like=${termino}`
        );
        
        if (!response.ok) {
          throw new Error('Error al buscar usuarios');
        }
        
        const data = await response.json();
        setUsuarios(data);
        
        // Guardar en cache
        setCache(prev => new Map(prev).set(termino, data));
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };
    
    // Debounce de 300ms
    const timeoutId = setTimeout(buscarUsuarios, 300);
    
    return () => clearTimeout(timeoutId);
  }, [termino, cache]);
  
  return (
    <div className="ejemplo">
      <h3>Ejemplo 2: Búsqueda de Usuarios con Cache</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={termino}
          onChange={(e) => setTermino(e.target.value)}
          placeholder="Buscar usuarios por nombre..."
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '16px',
            border: '2px solid #ddd',
            borderRadius: '8px',
            boxSizing: 'border-box'
          }}
        />
        
        <div style={{ 
          marginTop: '10px', 
          fontSize: '14px', 
          color: '#666' 
        }}>
          {cargando ? 'Buscando...' : `${usuarios.length} usuarios encontrados`}
          {cache.size > 0 && ` | Cache: ${cache.size} búsquedas`}
        </div>
      </div>
      
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
      
      <div style={{ display: 'grid', gap: '10px' }}>
        {usuarios.map(usuario => (
          <div 
            key={usuario.id}
            style={{
              padding: '15px',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}
          >
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
              {usuario.name.charAt(0)}
            </div>
            
            <div>
              <h4 style={{ margin: '0 0 5px 0' }}>{usuario.name}</h4>
              <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                {usuario.email}
              </p>
              <p style={{ margin: 0, color: '#888', fontSize: '12px' }}>
                {usuario.company.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Ejemplo 3: CRUD completo con API
function GestorTareasAPI() {
  const [tareas, setTareas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [editandoId, setEditandoId] = useState(null);
  const [textoEditando, setTextoEditando] = useState('');
  
  // Obtener tareas
  useEffect(() => {
    const obtenerTareas = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=10');
        if (!response.ok) throw new Error('Error al obtener tareas');
        const data = await response.json();
        setTareas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };
    
    obtenerTareas();
  }, []);
  
  // Crear tarea
  const crearTarea = async (e) => {
    e.preventDefault();
    if (!nuevaTarea.trim()) return;
    
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: nuevaTarea,
          completed: false,
          userId: 1
        })
      });
      
      if (!response.ok) throw new Error('Error al crear tarea');
      
      const tareaCreada = await response.json();
      setTareas([...tareas, { ...tareaCreada, id: Date.now() }]); // ID local
      setNuevaTarea('');
    } catch (err) {
      setError(err.message);
    }
  };
  
  // Actualizar tarea
  const actualizarTarea = async (id, completada) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: completada })
      });
      
      if (!response.ok) throw new Error('Error al actualizar tarea');
      
      setTareas(tareas.map(tarea =>
        tarea.id === id ? { ...tarea, completed: completada } : tarea
      ));
    } catch (err) {
      setError(err.message);
    }
  };
  
  // Eliminar tarea
  const eliminarTarea = async (id) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Error al eliminar tarea');
      
      setTareas(tareas.filter(tarea => tarea.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };
  
  // Editar título
  const guardarEdicion = async (id) => {
    if (!textoEditando.trim()) return;
    
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: textoEditando })
      });
      
      if (!response.ok) throw new Error('Error al actualizar tarea');
      
      setTareas(tareas.map(tarea =>
        tarea.id === id ? { ...tarea, title: textoEditando } : tarea
      ));
      setEditandoId(null);
      setTextoEditando('');
    } catch (err) {
      setError(err.message);
    }
  };
  
  if (cargando) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p>Cargando tareas...</p>
      </div>
    );
  }
  
  return (
    <div className="ejemplo">
      <h3>Ejemplo 3: Gestor de Tareas con API (CRUD)</h3>
      
      <form onSubmit={crearTarea} style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={nuevaTarea}
            onChange={(e) => setNuevaTarea(e.target.value)}
            placeholder="Nueva tarea..."
            style={{
              flex: 1,
              padding: '12px',
              fontSize: '16px',
              border: '2px solid #ddd',
              borderRadius: '4px'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '12px 24px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Agregar
          </button>
        </div>
      </form>
      
      {error && (
        <div style={{
          padding: '10px',
          backgroundColor: '#ffebee',
          color: '#c62828',
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          {error}
          <button
            onClick={() => setError(null)}
            style={{
              marginLeft: '10px',
              background: 'none',
              border: 'none',
              color: '#c62828',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Cerrar
          </button>
        </div>
      )}
      
      <div style={{ display: 'grid', gap: '10px' }}>
        {tareas.map(tarea => (
          <div
            key={tarea.id}
            style={{
              padding: '15px',
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}
          >
            <input
              type="checkbox"
              checked={tarea.completed}
              onChange={(e) => actualizarTarea(tarea.id, e.target.checked)}
              style={{ width: '20px', height: '20px' }}
            />
            
            {editandoId === tarea.id ? (
              <input
                type="text"
                value={textoEditando}
                onChange={(e) => setTextoEditando(e.target.value)}
                onBlur={() => guardarEdicion(tarea.id)}
                onKeyPress={(e) => e.key === 'Enter' && guardarEdicion(tarea.id)}
                autoFocus
                style={{
                  flex: 1,
                  padding: '8px',
                  border: '1px solid #007bff',
                  borderRadius: '4px'
                }}
              />
            ) : (
              <span
                onDoubleClick={() => {
                  setEditandoId(tarea.id);
                  setTextoEditando(tarea.title);
                }}
                style={{
                  flex: 1,
                  textDecoration: tarea.completed ? 'line-through' : 'none',
                  color: tarea.completed ? '#888' : '#333',
                  cursor: 'pointer'
                }}
              >
                {tarea.title}
              </span>
            )}
            
            <button
              onClick={() => eliminarTarea(tarea.id)}
              style={{
                padding: '8px 12px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente principal
export default function APIExamples() {
  return (
    <div className="modulo">
      <h1>Módulo 06: Obtención de Datos mediante API</h1>
      <p className="descripcion">
        Las llamadas a API son esenciales para aplicaciones React que necesitan datos del servidor.
      </p>
      
      <div className="ejemplos">
        <ListaPost />
        <BuscadorUsuarios />
        <GestorTareasAPI />
      </div>
      
      <div className="explicacion">
        <h3>Conceptos Clave:</h3>
        <ul>
          <li><strong>useEffect:</strong> Para hacer llamadas a API al montar o cuando cambien dependencias</li>
          <li><strong>Async/Await:</strong> Para código asíncrono más limpio y legible</li>
          <li><strong>Estados:</strong> Manejar cargando, éxito y error por separado</li>
          <li><strong>Cancelación:</strong> Limpiar requests anteriores para evitar race conditions</li>
          <li><strong>Cache:</strong> Almacenar resultados para evitar requests redundantes</li>
          <li><strong>CRUD:</strong> Create, Read, Update, Delete - operaciones básicas con API</li>
        </ul>
      </div>
    </div>
  );
}