import React, { useState } from 'react';

/**
 * MÓDULO 03: ESTADO (State)
 * 
 * El estado es la forma en que React maneja datos que cambian a lo largo del tiempo.
 * A diferencia de las props, el estado es mutable y pertenece al componente.
 * 
 * Conceptos clave:
 * - useState retorna [valorActual, funcionParaActualizar]
 * - Las actualizaciones de estado son asincrónicas
 * - Nunca mutar el estado directamente, siempre crear nuevo objeto
 * - React re-renderiza el componente cuando el estado cambia
 * - Se pueden tener múltiples estados en un componente
 */

// Ejemplo 1: Contador básico con estado
function ContadorBasico() {
  const [contador, setContador] = useState(0);
  
  const incrementar = () => {
    setContador(contador + 1);
    // Nota: contador aún tiene el valor anterior aquí
    console.log('Valor actual:', contador);
  };
  
  const decrementar = () => {
    if (contador > 0) {
      setContador(contador - 1);
    }
  };
  
  const reiniciar = () => {
    setContador(0);
  };
  
  return (
    <div className="ejemplo">
      <h3>Ejemplo 1: Contador Básico</h3>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px'
      }}>
        <button 
          onClick={decrementar}
          disabled={contador === 0}
          style={{
            padding: '10px 20px',
            fontSize: '18px',
            backgroundColor: contador === 0 ? '#ccc' : '#ff4444',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: contador === 0 ? 'not-allowed' : 'pointer'
          }}
        >
          -
        </button>
        
        <span style={{ 
          fontSize: '24px', 
          fontWeight: 'bold',
          minWidth: '50px',
          textAlign: 'center'
        }}>
          {contador}
        </span>
        
        <button 
          onClick={incrementar}
          style={{
            padding: '10px 20px',
            fontSize: '18px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          +
        </button>
        
        <button 
          onClick={reiniciar}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Reiniciar
        </button>
      </div>
      <p>Contador: {contador}</p>
    </div>
  );
}

// Ejemplo 2: Formulario con múltiples estados
function FormularioUsuario() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);
  
  const validarFormulario = () => {
    const nuevosErrores = {};
    
    if (!nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es requerido';
    } else if (nombre.length < 2) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 2 caracteres';
    }
    
    if (!email.trim()) {
      nuevosErrores.email = 'El email es requerido';
    } else if (!email.includes('@')) {
      nuevosErrores.email = 'Email inválido';
    }
    
    if (!aceptaTerminos) {
      nuevosErrores.terminos = 'Debes aceptar los términos';
    }
    
    return nuevosErrores;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const erroresValidacion = validarFormulario();
    
    if (Object.keys(erroresValidacion).length === 0) {
      // Formulario válido
      console.log('Datos enviados:', { nombre, email, aceptaTerminos });
      setEnviado(true);
      setErrores({});
    } else {
      setErrores(erroresValidacion);
    }
  };
  
  const handleReset = () => {
    setNombre('');
    setEmail('');
    setAceptaTerminos(false);
    setErrores({});
    setEnviado(false);
  };
  
  if (enviado) {
    return (
      <div style={{ 
        padding: '20px', 
        backgroundColor: '#e8f5e8', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h3>¡Formulario Enviado!</h3>
        <p>Gracias, {nombre}. Hemos enviado un email a {email}</p>
        <button 
          onClick={handleReset}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Enviar otro
        </button>
      </div>
    );
  }
  
  return (
    <div className="ejemplo">
      <h3>Ejemplo 2: Formulario con Múltiples Estados</h3>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Nombre:
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: `1px solid ${errores.nombre ? '#ff4444' : '#ddd'}`,
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
          {errores.nombre && (
            <p style={{ color: '#ff4444', margin: '5px 0 0', fontSize: '14px' }}>
              {errores.nombre}
            </p>
          )}
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Email:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              border: `1px solid ${errores.email ? '#ff4444' : '#ddd'}`,
              borderRadius: '4px',
              boxSizing: 'border-box'
            }}
          />
          {errores.email && (
            <p style={{ color: '#ff4444', margin: '5px 0 0', fontSize: '14px' }}>
              {errores.email}
            </p>
          )}
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={aceptaTerminos}
              onChange={(e) => setAceptaTerminos(e.target.checked)}
            />
            Acepto los términos y condiciones
          </label>
          {errores.terminos && (
            <p style={{ color: '#ff4444', margin: '5px 0 0', fontSize: '14px' }}>
              {errores.terminos}
            </p>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Enviar
          </button>
          
          <button 
            type="button"
            onClick={handleReset}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
}

// Ejemplo 3: Estado con objetos y arrays
function GestorTareas() {
  const [tareas, setTareas] = useState([
    { id: 1, texto: 'Aprender React', completada: false },
    { id: 2, texto: 'Hacer ejercicios', completada: true }
  ]);
  const [nuevaTarea, setNuevaTarea] = useState('');
  const [filtro, setFiltro] = useState('todas'); // 'todas', 'completadas', 'pendientes'
  
  const agregarTarea = (e) => {
    e.preventDefault();
    if (!nuevaTarea.trim()) return;
    
    const nuevaTareaObj = {
      id: Date.now(), // ID único basado en timestamp
      texto: nuevaTarea,
      completada: false
    };
    
    // Siempre crear nuevo array, no mutar el existente
    setTareas([...tareas, nuevaTareaObj]);
    setNuevaTarea('');
  };
  
  const toggleTarea = (id) => {
    // Crear nuevo array con la tarea modificada
    setTareas(tareas.map(tarea => 
      tarea.id === id 
        ? { ...tarea, completada: !tarea.completada }
        : tarea
    ));
  };
  
  const eliminarTarea = (id) => {
    // Filtrar para crear nuevo array sin la tarea
    setTareas(tareas.filter(tarea => tarea.id !== id));
  };
  
  const tareasFiltradas = tareas.filter(tarea => {
    if (filtro === 'completadas') return tarea.completada;
    if (filtro === 'pendientes') return !tarea.completada;
    return true;
  });
  
  const totalCompletadas = tareas.filter(t => t.completada).length;
  
  return (
    <div className="ejemplo">
      <h3>Ejemplo 3: Gestor de Tareas con Objetos y Arrays</h3>
      
      {/* Formulario para agregar tareas */}
      <form onSubmit={agregarTarea} style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={nuevaTarea}
            onChange={(e) => setNuevaTarea(e.target.value)}
            placeholder="Nueva tarea..."
            style={{
              flex: 1,
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
          <button 
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Agregar
          </button>
        </div>
      </form>
      
      {/* Filtros */}
      <div style={{ marginBottom: '20px' }}>
        <span>Filtrar: </span>
        {['todas', 'completadas', 'pendientes'].map(f => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            style={{
              padding: '5px 10px',
              margin: '0 5px',
              backgroundColor: filtro === f ? '#007bff' : '#e9ecef',
              color: filtro === f ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {f}
          </button>
        ))}
        <span style={{ marginLeft: '20px' }}>
          Completadas: {totalCompletadas} de {tareas.length}
        </span>
      </div>
      
      {/* Lista de tareas */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tareasFiltradas.map(tarea => (
          <li 
            key={tarea.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px',
              margin: '5px 0',
              backgroundColor: tarea.completada ? '#e8f5e8' : '#fff',
              borderLeft: `4px solid ${tarea.completada ? '#4CAF50' : '#ddd'}`,
              borderRadius: '4px'
            }}
          >
            <span 
              onClick={() => toggleTarea(tarea.id)}
              style={{ 
                cursor: 'pointer',
                textDecoration: tarea.completada ? 'line-through' : 'none',
                flex: 1
              }}
            >
              {tarea.completada ? '✓' : '○'} {tarea.texto}
            </span>
            <button
              onClick={() => eliminarTarea(tarea.id)}
              style={{
                padding: '5px 10px',
                backgroundColor: '#ff4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                marginLeft: '10px'
              }}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
      
      {tareasFiltradas.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
          No hay tareas para mostrar
        </p>
      )}
    </div>
  );
}

// Componente principal
export default function StateExamples() {
  return (
    <div className="modulo">
      <h1>Módulo 03: Estado (State)</h1>
      <p className="descripcion">
        El estado permite a los componentes mantener y gestionar datos que cambian con el tiempo.
      </p>
      
      <div className="ejemplos">
        <ContadorBasico />
        <FormularioUsuario />
        <GestorTareas />
      </div>
      
      <div className="explicacion">
        <h3>Conceptos Clave:</h3>
        <ul>
          <li><strong>Inmutabilidad:</strong> Nunca mutar el estado directamente, siempre crear nuevo objeto/array</li>
          <li><strong>Actualizaciones asíncronas:</strong> El estado no se actualiza inmediatamente después de setEstado</li>
          <li><strong>Múltiples estados:</strong> Se pueden usar múltiples useState en un componente</li>
          <li><strong>Función de actualización:</strong> Usar función cuando el nuevo estado depende del anterior</li>
          <li><strong>Re-renderizado:</strong> React re-renderiza cuando el estado cambia</li>
        </ul>
      </div>
    </div>
  );
}