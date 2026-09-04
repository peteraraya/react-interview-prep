import { create } from 'zustand';
import React from 'react';

/**
 * MÓDULO 08: ZUSTAND - State Management
 * 
 * Zustand es una librería ligera para manejo de estado global.
 * Es una alternativa simple a Redux con menos boilerplate.
 * 
 * Conceptos clave:
 * - Crear store con create()
 * - Selectores para optimizar re-renders
 * - Mutaciones inmutables con Imbiber (o spread operator)
 * - Middleware: devtools, persist, immer
 * - Fuera del componente (no necesita Provider)
 */

// ============================================
// EJEMPLO 1: Counter Store
// ============================================

const useCounterStore = create((set, get) => ({
  // Estado
  count: 0,
  history: [],
  
  // Acciones
  increment: () => set((state) => ({ 
    count: state.count + 1,
    history: [...state.history, { action: 'increment', value: state.count + 1 }]
  })),
  
  decrement: () => set((state) => ({ 
    count: state.count - 1,
    history: [...state.history, { action: 'decrement', value: state.count - 1 }]
  })),
  
  reset: () => set({ count: 0, history: [] }),
  
  // Acción con lógica asíncrona
  incrementAsync: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    set((state) => ({ 
      count: state.count + 1, 
      isLoading: false,
      history: [...state.history, { action: 'incrementAsync', value: state.count + 1 }]
    }));
  },
  
  // Getter (no es acción, pero usa get)
  getDouble: () => get().count * 2
}));

function CounterEjemplo() {
  // Selectores individuales para optimizar re-renders
  const count = useCounterStore(state => state.count);
  const history = useCounterStore(state => state.history);
  const increment = useCounterStore(state => state.increment);
  const decrement = useCounterStore(state => state.decrement);
  const reset = useCounterStore(state => state.reset);
  const incrementAsync = useCounterStore(state => state.incrementAsync);
  const isLoading = useCounterStore(state => state.isLoading);
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h4>Contador con Zustand</h4>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '15px',
        marginBottom: '20px'
      }}>
        <button onClick={decrement} style={btnStyle}>-</button>
        <span style={{ fontSize: '32px', fontWeight: 'bold', minWidth: '60px', textAlign: 'center' }}>
          {count}
        </span>
        <button onClick={increment} style={btnStyle}>+</button>
        <button onClick={incrementAsync} disabled={isLoading} style={{...btnStyle, backgroundColor: isLoading ? '#ccc' : '#17a2b8'}}>
          {isLoading ? '...' : '+ Async'}
        </button>
        <button onClick={reset} style={{...btnStyle, backgroundColor: '#6c757d'}}>Reset</button>
      </div>
      
      <div style={{ fontSize: '14px', color: '#666' }}>
        <strong>Doble:</strong> {count * 2}
      </div>
      
      <div style={{ marginTop: '10px', fontSize: '12px', maxHeight: '100px', overflow: 'auto' }}>
        <strong>Historial:</strong>
        {history.slice(-5).reverse().map((entry, i) => (
          <div key={i}>{entry.action}: {entry.value}</div>
        ))}
      </div>
    </div>
  );
}

const btnStyle = {
  padding: '10px 20px',
  fontSize: '18px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

// ============================================
// EJEMPLO 2: Todo Store con Persist
// ============================================

const useTodoStore = create((set, get) => ({
  todos: [],
  filter: 'all', // 'all', 'active', 'completed'
  
  // Acciones
  addTodo: (text) => set((state) => ({
    todos: [...state.todos, {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString()
    }]
  })),
  
  toggleTodo: (id) => set((state) => ({
    todos: state.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  })),
  
  deleteTodo: (id) => set((state) => ({
    todos: state.todos.filter(todo => todo.id !== id)
  })),
  
  setFilter: (filter) => set({ filter }),
  
  clearCompleted: () => set((state) => ({
    todos: state.todos.filter(todo => !todo.completed)
  })),
  
  // Getters computados
  getFilteredTodos: () => {
    const { todos, filter } = get();
    switch (filter) {
      case 'active':
        return todos.filter(t => !t.completed);
      case 'completed':
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  },
  
  getStats: () => {
    const { todos } = get();
    return {
      total: todos.length,
      active: todos.filter(t => !t.completed).length,
      completed: todos.filter(t => t.completed).length
    };
  }
}));

function TodoApp() {
  const [inputValue, setInputValue] = React.useState('');
  
  // Selectores
  const todos = useTodoStore(state => state.todos);
  const filter = useTodoStore(state => state.filter);
  const addTodo = useTodoStore(state => state.addTodo);
  const toggleTodo = useTodoStore(state => state.toggleTodo);
  const deleteTodo = useTodoStore(state => state.deleteTodo);
  const setFilter = useTodoStore(state => state.setFilter);
  const clearCompleted = useTodoStore(state => state.clearCompleted);
  const getFilteredTodos = useTodoStore(state => state.getFilteredTodos);
  const getStats = useTodoStore(state => state.getStats);
  
  const filteredTodos = getFilteredTodos();
  const stats = getStats();
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addTodo(inputValue.trim());
      setInputValue('');
    }
  };
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h4>Todo App con Zustand</h4>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Nueva tarea..."
          style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Agregar
        </button>
      </form>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        {['all', 'active', 'completed'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: '5px 15px',
              backgroundColor: filter === f ? '#007bff' : '#e9ecef',
              color: filter === f ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {f} ({f === 'all' ? stats.total : f === 'active' ? stats.active : stats.completed})
          </button>
        ))}
        
        {stats.completed > 0 && (
          <button onClick={clearCompleted} style={{ padding: '5px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Limpiar completados
          </button>
        )}
      </div>
      
      <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {filteredTodos.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>No hay tareas</p>
        ) : (
          filteredTodos.map(todo => (
            <div
              key={todo.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px',
                marginBottom: '5px',
                backgroundColor: 'white',
                borderRadius: '4px',
                borderLeft: `4px solid ${todo.completed ? '#28a745' : '#007bff'}`
              }}
            >
              <span
                onClick={() => toggleTodo(todo.id)}
                style={{
                  cursor: 'pointer',
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? '#888' : '#333',
                  flex: 1
                }}
              >
                {todo.completed ? '✓' : '○'} {todo.text}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                style={{ padding: '5px 10px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ============================================
// EJEMPLO 3: Store con Middleware (devtools)
// ============================================

const useBearStore = create((set) => ({
  bears: 0,
  fishes: 0,
  
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
  updateBears: (newBears) => set({ bears: newBears }),
  
  increaseFishes: () => set((state) => ({ fishes: state.fishes + 1 })),
  
  // Acción compuesta
  addBearAndFish: () => set((state) => ({ 
    bears: state.bears + 1, 
    fishes: state.fishes + 1 
  }))
}));

function BearStoreEjemplo() {
  const bears = useBearStore(state => state.bears);
  const fishes = useBearStore(state => state.fishes);
  const increasePopulation = useBearStore(state => state.increasePopulation);
  const removeAllBears = useBearStore(state => state.removeAllBears);
  const updateBears = useBearStore(state => state.updateBears);
  const increaseFishes = useBearStore(state => state.increaseFishes);
  const addBearAndFish = useBearStore(state => state.addBearAndFish);
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h4>Multi-Store con Zustand</h4>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '8px' }}>
          <h5 style={{ marginTop: 0 }}>Oso (🐻): {bears}</h5>
          <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
            <button onClick={increasePopulation} style={smallBtn}>+1</button>
            <button onClick={() => updateBears(bears + 5)} style={smallBtn}>+5</button>
            <button onClick={removeAllBears} style={{...smallBtn, backgroundColor: '#dc3545'}}>Reset</button>
          </div>
        </div>
        
        <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '8px' }}>
          <h5 style={{ marginTop: 0 }}>Pez (🐟): {fishes}</h5>
          <button onClick={increaseFishes} style={smallBtn}>+1</button>
        </div>
      </div>
      
      <button onClick={addBearAndFish} style={{ marginTop: '15px', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Agregar Oso y Pez
      </button>
    </div>
  );
}

const smallBtn = {
  padding: '5px 10px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '12px'
};

// Componente principal
export default function ZustandExamples() {
  return (
    <div className="modulo">
      <h1>Módulo 08: Zustand - State Management</h1>
      <p className="descripcion">
        Zustand es una solución ligera y flexible para estado global sin boilerplate.
      </p>
      
      <div className="ejemplos">
        <CounterEjemplo />
        <TodoApp />
        <BearStoreEjemplo />
      </div>
      
      <div className="explicacion">
        <h3>Conceptos Clave:</h3>
        <ul>
          <li><strong>create():</strong> Crea un store con estado y acciones</li>
          <li><strong>Selectores:</strong> Obtener solo las partes del estado que necesitas</li>
          <li><strong>Sin Provider:</strong> No necesita envolver la app (a diferencia de Context)</li>
          <li><strong>Middleware:</strong> devtools, persist, immer para funcionalidad extra</li>
          <li><strong>Optimización:</strong> Selectores evitan re-renders innecesarios</li>
          <li><strong>Tipo:</strong> GetState y SetState para acceso completo</li>
        </ul>
      </div>
    </div>
  );
}