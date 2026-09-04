import React, { useState } from 'react';

/**
 * MÓDULO 12: TYPESCRIPT CON REACT
 * 
 * TypeScript añade tipos estáticos a JavaScript, ayudando a prevenir errores
 * y mejorar la experiencia de desarrollo con autocompletado y documentación.
 * 
 * Este módulo muestra ejemplos en JSX pero explica los equivalentes en TypeScript.
 * Para ver los tipos reales, crea archivos .tsx en tu proyecto.
 */

// ============================================
// EJEMPLO 1: Props con TypeScript
// ============================================

/**
 * EN TYPESCRIPT ( UserProfile.tsx):
 * 
 * interface UserProps {
 *   name: string;
 *   email: string;
 *   age?: number;           // Opcional
 *   role: 'admin' | 'user'; // Union type
 *   onUpdate?: (id: number, data: Partial<User>) => void;
 * }
 * 
 * function UserProfile({ name, email, age, role, onUpdate }: UserProps) { ... }
 */

function UserProfile({ name, email, age, role, onUpdate }) {
  return (
    <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h4>{name}</h4>
      <p style={{ color: '#666' }}>{email}</p>
      {age && <p>Edad: {age}</p>}
      <span style={{
        padding: '3px 10px',
        borderRadius: '12px',
        backgroundColor: role === 'admin' ? '#e3f2fd' : '#f5f5f5',
        fontSize: '12px'
      }}>
        {role}
      </span>
      {onUpdate && (
        <button
          onClick={() => onUpdate(1, { name: 'Nuevo Nombre' })}
          style={{ marginTop: '10px', padding: '5px 10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Actualizar
        </button>
      )}
    </div>
  );
}

// ============================================
// EJEMPLO 2: Estado con TypeScript
// ============================================

/**
 * EN TYPESCRIPT (Counter.tsx):
 * 
 * type CounterState = {
 *   count: number;
 *   history: number[];
 * };
 * 
 * const [state, setState] = useState<CounterState>({
 *   count: 0,
 *   history: []
 * });
 * 
 * // O con useReducer:
 * type CounterAction = 
 *   | { type: 'INCREMENT' }
 *   | { type: 'DECREMENT' }
 *   | { type: 'RESET' }
 *   | { type: 'SET'; payload: number };
 */

function CounterTS() {
  const [count, setCount] = useState(0);
  const [history, setHistory] = useState([]);
  
  const increment = () => {
    setCount(prev => prev + 1);
    setHistory(prev => [...prev, count + 1]);
  };
  
  return (
    <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h4>Counter con Tipos</h4>
      <p data-testid="count">Count: {count}</p>
      <button onClick={increment} style={btnStyle}>+1</button>
      <button onClick={() => setCount(0)} style={{...btnStyle, backgroundColor: '#6c757d'}}>Reset</button>
      <p style={{ fontSize: '12px', color: '#666' }}>History: [{history.join(', ')}]</p>
    </div>
  );
}

// ============================================
// EJEMPLO 3: Generics con React
// ============================================

/**
 * EN TYPESCRIPT (List.tsx):
 * 
 * interface ListProps<T> {
 *   items: T[];
 *   renderItem: (item: T) => React.ReactNode;
 *   keyExtractor: (item: T) => string | number;
 * }
 * 
 * function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
 *   return (
 *     <ul>
 *       {items.map(item => (
 *         <li key={keyExtractor(item)}>{renderItem(item)}</li>
 *       ))}
 *     </ul>
 *   );
 * }
 */

// Simulación de componente genérico
function GenericList({ items, renderItem, keyExtractor }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {items.map((item, index) => (
        <li key={keyExtractor ? keyExtractor(item) : index} style={{ padding: '8px', borderBottom: '1px solid #eee' }}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}

function GenericsExample() {
  const users = [
    { id: 1, name: 'Ana', email: 'ana@test.com' },
    { id: 2, name: 'Carlos', email: 'carlos@test.com' }
  ];
  
  const products = [
    { id: 1, name: 'Laptop', price: 999 },
    { id: 2, name: 'Mouse', price: 29 }
  ];
  
  return (
    <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h4>Generics - Lista Reutilizable</h4>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
        <div>
          <h5>Usuarios</h5>
          <GenericList
            items={users}
            keyExtractor={(item) => item.id}
            renderItem={(user) => (
              <div>
                <strong>{user.name}</strong>
                <span style={{ color: '#666', marginLeft: '10px' }}>{user.email}</span>
              </div>
            )}
          />
        </div>
        
        <div>
          <h5>Productos</h5>
          <GenericList
            items={products}
            keyExtractor={(item) => item.id}
            renderItem={(product) => (
              <div>
                <strong>{product.name}</strong>
                <span style={{ color: '#28a745', marginLeft: '10px' }}>${product.price}</span>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================
// EJEMPLO 4: Eventos y Handlers
// ============================================

/**
 * EN TYPESCRIPT:
 * 
 * const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
 *   e.preventDefault();
 * };
 * 
 * const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 *   setValue(e.target.value);
 * };
 * 
 * const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
 *   console.log('Clicked');
 * };
 */

function EventsExample() {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
  };
  
  return (
    <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h4>Eventos Tipados</h4>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Escribe algo..."
          style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Enviar
        </button>
      </form>
      {submitted && <p style={{ color: '#28a745', marginTop: '10px' }}>¡Enviado: {value}!</p>}
    </div>
  );
}

// ============================================
// EJEMPLO 5: Tipos comunes de React
// ============================================

/**
 * TIPOS COMUNES EN REACT + TYPESCRIPT:
 * 
 * // Props de hijos
 * interface Props {
 *   children: React.ReactNode;
 * }
 * 
 * // Ref
 * const inputRef = useRef<HTMLInputElement>(null);
 * 
 * // Estado opcional
 * const [data, setData] = useState<T | null>(null);
 * 
 * // API Response
 * interface ApiResponse<T> {
 *   data: T;
 *   status: number;
 *   message: string;
 * }
 * 
 * // Props con variantes (discriminated union)
 * type ButtonProps = 
 *   | { variant: 'primary'; onClick: () => void }
 *   | { variant: 'link'; href: string };
 */

function TypePatternsExample() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const simulateFetch = () => {
    setLoading(true);
    setError(null);
    setTimeout(() => {
      if (Math.random() > 0.5) {
        setUsers([{ id: 1, name: 'Test User' }]);
        setLoading(false);
      } else {
        setError('Error al cargar');
        setLoading(false);
      }
    }, 1000);
  };
  
  return (
    <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h4>Patrones de Tipos Comunes</h4>
      <button onClick={simulateFetch} style={{ ...btnStyle, marginBottom: '10px' }}>
        Simular Fetch
      </button>
      
      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: '#dc3545' }}>{error}</p>}
      {users.length > 0 && (
        <ul>
          {users.map(u => <li key={u.id}>{u.name}</li>)}
        </ul>
      )}
      
      <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
        <strong>Patrón:</strong> useState&lt;T | null&gt;(null) para datos async
      </div>
    </div>
  );
}

const btnStyle = {
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer'
};

// Componente principal
export default function TypeScriptExamples() {
  return (
    <div className="modulo">
      <h1>Módulo 12: TypeScript con React</h1>
      <p className="descripcion">
        TypeScript añade tipos estáticos, mejorando la calidad del código y la experiencia de desarrollo.
      </p>
      
      <div className="ejemplos">
        <UserProfile 
          name="Ana García" 
          email="ana@email.com" 
          age={28} 
          role="admin"
          onUpdate={(id, data) => console.log('Update:', id, data)}
        />
        <CounterTS />
        <GenericsExample />
        <EventsExample />
        <TypePatternsExample />
      </div>
      
      <div className="explicacion">
        <h3>Tipos Comunes en React + TypeScript:</h3>
        <ul>
          <li><strong>Props:</strong> Definir interface para las props del componente</li>
          <li><strong>useState&lt;T&gt;:</strong> Tipar el estado inicial</li>
          <li><strong>useRef&lt;T&gt;:</strong> Tipar la referencia</li>
          <li><strong>Eventos:</strong> React.FormEvent, React.ChangeEvent, React.MouseEvent</li>
          <li><strong>Children:</strong> React.ReactNode o React.ReactChild</li>
          <li><strong>Generics:</strong> Componentes reutilizables con tipos flexibles</li>
          <li><strong>Discriminated Unions:</strong> Props con variantes</li>
        </ul>
      </div>
    </div>
  );
}