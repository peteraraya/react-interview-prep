import React from 'react';

/**
 * MÓDULO 02: PROPS (Propiedades)
 * 
 * Las props son la forma en que los componentes se comunican entre sí.
 * Son inmutables (el componente hijo no puede modificarlas) y se pasan de padre a hijo.
 * 
 * Conceptos clave:
 * - Las props son read-only
 * - Se pueden pasar cualquier tipo de dato: strings, numbers, arrays, objects, functions
 * - Se pueden usar destructuring para extraer props
 * - Se pueden establecer valores por defecto
 * - Los children son un prop especial que representa el contenido entre las etiquetas
 */

// Ejemplo 1: Componente con props básicas
function TarjetaProducto({ nombre, precio, descripcion, imagen, enStock = true }) {
  // Props con valores por defecto
  const estilos = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '16px',
    maxWidth: '300px',
    margin: '10px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };
  
  return (
    <div style={estilos}>
      <img 
        src={imagen} 
        alt={nombre}
        style={{ width: '100%', height: '150px', objectFit: 'cover' }}
      />
      <h3>{nombre}</h3>
      <p>{descripcion}</p>
      <p><strong>Precio: ${precio}</strong></p>
      <p style={{ color: enStock ? 'green' : 'red' }}>
        {enStock ? 'En stock' : 'Agotado'}
      </p>
    </div>
  );
}

// Ejemplo 2: Componente con children prop
function Contenedor({ titulo, children, colorFondo = '#f5f5f5' }) {
  const estilosContenedor = {
    backgroundColor: colorFondo,
    padding: '20px',
    borderRadius: '8px',
    margin: '10px 0'
  };
  
  return (
    <div style={estilosContenedor}>
      <h2>{titulo}</h2>
      {/* children representa el contenido anidado */}
      <div className="contenido">
        {children}
      </div>
    </div>
  );
}

// Ejemplo 3: Componente con props de función (callbacks)
function BotonAccion({ texto, onClick, variante = 'primario', deshabilitado = false }) {
  const estilosBoton = {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    cursor: deshabilitado ? 'not-allowed' : 'pointer',
    fontSize: '16px',
    fontWeight: 'bold',
    opacity: deshabilitado ? 0.6 : 1,
    backgroundColor: variante === 'primario' ? '#007bff' : 
                    variante === 'exito' ? '#28a745' : 
                    variante === 'peligro' ? '#dc3545' : '#6c757d',
    color: 'white'
  };
  
  return (
    <button 
      style={estilosBoton}
      onClick={onClick}
      disabled={deshabilitado}
    >
      {texto}
    </button>
  );
}

// Ejemplo 4: Componente con props de objeto y arrays
function ListaTareas({ tareas, onToggleTarea, onEliminarTarea }) {
  const estilosTarea = (completada) => ({
    textDecoration: completada ? 'line-through' : 'none',
    padding: '8px',
    margin: '4px 0',
    backgroundColor: completada ? '#e8f5e8' : '#fff',
    borderLeft: `4px solid ${completada ? '#4CAF50' : '#ddd'}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  });
  
  return (
    <div>
      <h3>Lista de Tareas</h3>
      {tareas.length === 0 ? (
        <p>No hay tareas pendientes</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {tareas.map(tarea => (
            <li key={tarea.id} style={estilosTarea(tarea.completada)}>
              <span 
                onClick={() => onToggleTarea(tarea.id)}
                style={{ cursor: 'pointer', flex: 1 }}
              >
                {tarea.completada ? '✓' : '○'} {tarea.texto}
              </span>
              <button 
                onClick={() => onEliminarTarea(tarea.id)}
                style={{ 
                  marginLeft: '10px',
                  padding: '4px 8px',
                  backgroundColor: '#ff4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Componente principal que demuestra el uso de todos los componentes
export default function PropsExamples() {
  const tareas = [
    { id: 1, texto: 'Aprender React', completada: false },
    { id: 2, texto: 'Hacer ejercicios', completada: true },
    { id: 3, texto: 'Practicar entrevistas', completada: false }
  ];
  
  const handleToggleTarea = (id) => {
    console.log('Toggle tarea:', id);
    // En una app real, aquí actualizarías el estado
  };
  
  const handleEliminarTarea = (id) => {
    console.log('Eliminar tarea:', id);
    // En una app real, aquí eliminarías la tarea
  };
  
  return (
    <div className="modulo">
      <h1>Módulo 02: Props (Propiedades)</h1>
      <p className="descripcion">
        Las props permiten la comunicación entre componentes de padres a hijos.
      </p>
      
      {/* Ejemplo de children prop */}
      <Contenedor titulo="Productos Destacados" colorFondo="#e3f2fd">
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          <TarjetaProducto 
            nombre="Laptop Pro"
            precio={1299}
            descripcion="Laptop de alta especificación"
            imagen="https://via.placeholder.com/300x200?text=Laptop"
            enStock={true}
          />
          <TarjetaProducto 
            nombre="Mouse Inalámbrico"
            precio={29}
            descripcion="Mouse ergonómico inalámbrico"
            imagen="https://via.placeholder.com/300x200?text=Mouse"
            enStock={false}
          />
        </div>
        
        {/* Uso de props de función */}
        <div style={{ marginTop: '20px' }}>
          <BotonAccion 
            texto="Agregar al Carrito" 
            onClick={() => alert('Agregado al carrito')}
            variante="primario"
          />
          <BotonAccion 
            texto="Comprar Ahora" 
            onClick={() => alert('Procesando compra')}
            variante="exito"
          />
          <BotonAccion 
            texto="Agotado" 
            onClick={() => {}}
            variante="secundario"
            deshabilitado={true}
          />
        </div>
      </Contenedor>
      
      {/* Ejemplo con props de objeto y arrays */}
      <Contenedor titulo="Gestor de Tareas" colorFondo="#f3e5f5">
        <ListaTareas 
          tareas={tareas}
          onToggleTarea={handleToggleTarea}
          onEliminarTarea={handleEliminarTarea}
        />
      </Contenedor>
      
      <div className="explicacion">
        <h3>Conceptos Clave:</h3>
        <ul>
          <li><strong>Inmutabilidad:</strong> Las props no pueden ser modificadas por el componente hijo</li>
          <li><strong>Desestructuring:</strong> Extraer props directamente en los parámetros de la función</li>
          <li><strong>Valores por defecto:</strong> Asignar valores cuando la prop no se pasa</li>
          <li><strong>Children:</strong> Prop especial para contenido anidado</li>
          <li><strong>Callbacks:</strong> Funciones pasadas como props para comunicación ascendente</li>
        </ul>
      </div>
    </div>
  );
}