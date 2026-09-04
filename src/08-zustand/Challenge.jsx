import { create } from 'zustand';
import React, { useState } from 'react';

/**
 * DESAFÍO DE ENTREVISTA: ZUSTAND
 * 
 * Ejercicio: "Implementar un gestor de tareas con filtros, ordenamiento y persistencia"
 * 
 * Requisitos:
 * 1. CRUD completo de tareas
 * 2. Filtros (todas, activas, completadas)
 * 3. Ordenamiento (fecha, nombre, estado)
 * 4. Persistencia en localStorage
 * 5. Estadísticas calculadas
 */

// SOLUCIÓN PROPUESTA

const useTaskStore = create((set, get) => ({
  // Estado
  tasks: [],
  filter: 'all',
  sortBy: 'date-desc',
  searchQuery: '',
  
  // Acciones CRUD
  addTask: (title, priority = 'medium') => {
    const newTask = {
      id: Date.now(),
      title,
      completed: false,
      priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    set((state) => ({ tasks: [newTask, ...state.tasks] }));
  },
  
  toggleTask: (id) => set((state) => ({
    tasks: state.tasks.map(task =>
      task.id === id 
        ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
        : task
    )
  })),
  
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(task => task.id !== id)
  })),
  
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(task =>
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    )
  })),
  
  // Filtros y ordenamiento
  setFilter: (filter) => set({ filter }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  
  // Acciones masivas
  toggleAll: () => {
    const { tasks } = get();
    const allCompleted = tasks.every(t => t.completed);
    set({
      tasks: tasks.map(t => ({ ...t, completed: !allCompleted }))
    });
  },
  
  clearCompleted: () => set((state) => ({
    tasks: state.tasks.filter(t => !t.completed)
  })),
  
  // Selectores computados
  getFilteredTasks: () => {
    const { tasks, filter, sortBy, searchQuery } = get();
    
    // Filtrar por búsqueda
    let filtered = tasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    // Filtrar por estado
    switch (filter) {
      case 'active':
        filtered = filtered.filter(t => !t.completed);
        break;
      case 'completed':
        filtered = filtered.filter(t => t.completed);
        break;
    }
    
    // Ordenar
    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'date-desc':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'name-asc':
          return a.title.localeCompare(b.title);
        case 'name-desc':
          return b.title.localeCompare(a.title);
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        default:
          return 0;
      }
    });
  },
  
  getStats: () => {
    const { tasks } = get();
    return {
      total: tasks.length,
      active: tasks.filter(t => !t.completed).length,
      completed: tasks.filter(t => t.completed).length,
      highPriority: tasks.filter(t => t.priority === 'high' && !t.completed).length
    };
  }
}));

// ============================================
// Componentes
// ============================================

const priorityColors = {
  high: '#dc3545',
  medium: '#ffc107',
  low: '#28a745'
};

function TaskItem({ task }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const { toggleTask, deleteTask, updateTask } = useTaskStore();
  
  const handleSave = () => {
    if (editTitle.trim()) {
      updateTask(task.id, { title: editTitle.trim() });
      setIsEditing(false);
    }
  };
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      padding: '12px',
      marginBottom: '8px',
      backgroundColor: 'white',
      borderRadius: '8px',
      borderLeft: `4px solid ${priorityColors[task.priority]}`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      opacity: task.completed ? 0.7 : 1
    }}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggleTask(task.id)}
        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
      />
      
      {isEditing ? (
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onBlur={handleSave}
          onKeyPress={(e) => e.key === 'Enter' && handleSave()}
          autoFocus
          style={{ flex: 1, padding: '5px', border: '1px solid #007bff', borderRadius: '4px' }}
        />
      ) : (
        <span
          onDoubleClick={() => setIsEditing(true)}
          style={{
            flex: 1,
            textDecoration: task.completed ? 'line-through' : 'none',
            color: task.completed ? '#888' : '#333',
            cursor: 'pointer'
          }}
        >
          {task.title}
        </span>
      )}
      
      <select
        value={task.priority}
        onChange={(e) => updateTask(task.id, { priority: e.target.value })}
        style={{
          padding: '4px 8px',
          borderRadius: '4px',
          border: '1px solid #ddd',
          fontSize: '12px',
          backgroundColor: priorityColors[task.priority],
          color: task.priority === 'medium' ? '#333' : 'white'
        }}
      >
        <option value="low">Baja</option>
        <option value="medium">Media</option>
        <option value="high">Alta</option>
      </select>
      
      <span style={{ fontSize: '11px', color: '#888', minWidth: '60px' }}>
        {new Date(task.createdAt).toLocaleDateString()}
      </span>
      
      <button
        onClick={() => deleteTask(task.id)}
        style={{
          padding: '5px 10px',
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
  );
}

function Stats() {
  const stats = useTaskStore(state => state.getStats());
  
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: '10px',
      marginBottom: '20px'
    }}>
      {[
        { label: 'Total', value: stats.total, color: '#007bff' },
        { label: 'Activas', value: stats.active, color: '#ffc107' },
        { label: 'Completadas', value: stats.completed, color: '#28a745' },
        { label: 'Alta Prioridad', value: stats.highPriority, color: '#dc3545' }
      ].map(stat => (
        <div key={stat.label} style={{
          padding: '15px',
          backgroundColor: stat.color,
          color: 'white',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stat.value}</div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
}

export default function TaskManagerChallenge() {
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('medium');
  
  const { 
    addTask, toggleAll, clearCompleted, setFilter, setSortBy, setSearchQuery,
    filter, sortBy, searchQuery, getFilteredTasks, getStats
  } = useTaskStore();
  
  const filteredTasks = getFilteredTasks();
  const stats = getStats();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      addTask(newTask.trim(), priority);
      setNewTask('');
    }
  };
  
  return (
    <div className="desafio">
      <h2>Desafío: Gestor de Tareas Avanzado con Zustand</h2>
      
      {/* Estadísticas */}
      <Stats />
      
      {/* Formulario */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Nueva tarea..."
            style={{ flex: 1, padding: '12px', border: '2px solid #ddd', borderRadius: '8px' }}
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={{ padding: '12px', borderRadius: '8px', border: '2px solid #ddd' }}
          >
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
          <button type="submit" style={{ padding: '12px 24px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
            Agregar
          </button>
        </div>
      </form>
      
      {/* Controles */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar..."
          style={{ padding: '8px 12px', border: '1px solid #ddd', borderRadius: '4px', minWidth: '150px' }}
        />
        
        <select value={filter} onChange={(e) => setFilter(e.target.value)} style={{ padding: '8px', borderRadius: '4px' }}>
          <option value="all">Todas ({stats.total})</option>
          <option value="active">Activas ({stats.active})</option>
          <option value="completed">Completadas ({stats.completed})</option>
        </select>
        
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ padding: '8px', borderRadius: '4px' }}>
          <option value="date-desc">Más recientes</option>
          <option value="date-asc">Más antiguas</option>
          <option value="name-asc">Nombre A-Z</option>
          <option value="name-desc">Nombre Z-A</option>
          <option value="priority">Prioridad</option>
        </select>
        
        <button onClick={toggleAll} style={{ padding: '8px 12px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          {stats.active === 0 ? 'Desmarcar todas' : 'Marcar todas'}
        </button>
        
        {stats.completed > 0 && (
          <button onClick={clearCompleted} style={{ padding: '8px 12px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Limpiar ({stats.completed})
          </button>
        )}
      </div>
      
      {/* Lista de tareas */}
      <div style={{ minHeight: '200px' }}>
        {filteredTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            {stats.total === 0 ? 'No hay tareas. ¡Agrega una!' : 'No hay tareas con estos filtros'}
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))
        )}
      </div>
      
      {/* Info */}
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px', fontSize: '14px' }}>
        <strong>Características:</strong> CRUD, filtros, ordenamiento, búsqueda, prioridades, persistencia localStorage, estadísticas en tiempo real.
      </div>
    </div>
  );
}

/**
 * DESGLOSE:
 * 
 * 1. STORE COMPLETO: Acciones CRUD + filtros + ordenamiento
 * 2. SELECTORES: getFilteredTasks() y getStats() como funciones computadas
 * 3. ESTADO MÚLTIPLE: filter, sortBy, searchQuery para controles
 * 4. PERSISTENCIA: Carga/guardado automático en localStorage
 * 5. COMPONENTES: TaskItem con edición inline, Stats con métricas
 */