import React, { useState } from 'react';

/**
 * DESAFÍO DE ENTREVISTA: JSX
 * 
 * Ejercicio común en entrevistas técnicas de nivel inicial:
 * "Crear un componente que renderice una lista de usuarios con condicionales"
 * 
 * Requisitos:
 * 1. Renderizar una lista de usuarios
 * 2. Mostrar badge de "Activo" o "Inactivo" según el estado del usuario
 * 3. Aplicar estilos diferentes según el estado
 * 4. Manejar el caso de lista vacía
 */

// Datos de ejemplo para el desafío
const usuariosEjemplo = [
  { id: 1, nombre: "Ana López", email: "ana@email.com", activo: true },
  { id: 2, nombre: "Carlos Ruiz", email: "carlos@email.com", activo: false },
  { id: 3, nombre: "Elena Martín", email: "elena@email.com", activo: true },
  { id: 4, nombre: "Pedro Sánchez", email: "pedro@email.com", activo: true }
];

// SOLUCIÓN PROPUESTA
export default function ListaUsuariosChallenge() {
  const [usuarios] = useState(usuariosEjemplo);
  const [filtro, setFiltro] = useState('todos'); // 'todos', 'activos', 'inactivos'
  
  // Función para filtrar usuarios según el filtro seleccionado
  const usuariosFiltrados = usuarios.filter(usuario => {
    if (filtro === 'activos') return usuario.activo;
    if (filtro === 'inactivos') return !usuario.activo;
    return true; // 'todos'
  });
  
  // Estilos para diferentes estados
  const estilosBadge = (activo) => ({
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: activo ? '#4CAF50' : '#f44336'
  });
  
  const estilosUsuario = (activo) => ({
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '12px',
    margin: '8px 0',
    backgroundColor: activo ? '#f9f9f9' : '#fff3f3',
    opacity: activo ? 1 : 0.7
  });
  
  return (
    <div className="desafio">
      <h2>Desafío: Lista de Usuarios con Filtros</h2>
      
      {/* Controles de filtrado */}
      <div className="controles">
        <label>Filtrar por: </label>
        <select 
          value={filtro} 
          onChange={(e) => setFiltro(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="activos">Activos</option>
          <option value="inactivos">Inactivos</option>
        </select>
      </div>
      
      {/* Renderizado condicional para lista vacía */}
      {usuariosFiltrados.length === 0 ? (
        <div className="lista-vacia">
          <p>No hay usuarios que mostrar con el filtro seleccionado.</p>
        </div>
      ) : (
        <div className="lista-usuarios">
          <p>Mostrando {usuariosFiltrados.length} de {usuarios.length} usuarios</p>
          
          {/* Renderizado de lista con map */}
          {usuariosFiltrados.map(usuario => (
            <div 
              key={usuario.id} 
              style={estilosUsuario(usuario.activo)}
            >
              <div className="usuario-info">
                <h3>{usuario.nombre}</h3>
                <p>Email: {usuario.email}</p>
                <span style={estilosBadge(usuario.activo)}>
                  {usuario.activo ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * DESGLOSE DE LA SOLUCIÓN:
 * 
 * 1. ESTADO LOCAL:
 *    - Usamos useState para managing el filtro seleccionado
 *    - Los usuarios se mantienen como estado estático (en una app real vendría de una API)
 * 
 * 2. RENDERIZADO CONDICIONAL:
 *    - Operador ternario para mostrar lista vacía o lista de usuarios
 *    - && para renderizado condicional simple
 * 
 * 3. RENDERIZADO DE LISTAS:
 *    - map() para iterar sobre el array de usuarios
 *    - key única (usuario.id) para optimizar el renderizado de React
 * 
 * 4. ESTILOS CONDICIONALES:
 *    - Funciones que retornan objetos de estilos basados en el estado
 *    - Estilos en línea para ejemplos claros (en producción usarías CSS modules)
 * 
 * 5. MANEJO DE EVENTOS:
 *    - onChange en el select para actualizar el filtro
 *    - Función filter() para crear nueva lista filtrada
 * 
 * PREGUNTAS DE SEGUIMIENTO COMUNES EN ENTREVISTAS:
 * - ¿Por qué usas key con id y no con index?
 * - ¿Cómo optimizarías el renderizado de listas grandes?
 * - ¿Cómo manejarías una lista que se carga desde una API?
 * - ¿Cuál es la diferencia entre filtrar en el frontend vs backend?
 */