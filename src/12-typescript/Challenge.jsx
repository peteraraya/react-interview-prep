import React, { useState } from 'react';

/**
 * DESAFÍO DE ENTREVISTA: TYPESCRIPT
 * 
 * Ejercicio: "Convertir componentes JavaScript a TypeScript"
 * 
 * Se proporciona código en JS y el estudiante debe escribir la versión TS.
 */

// SOLUCIÓN: CÓDIGO ORIGINAL EN JS

function UserCardJS({ user, onSelect }) {
  return (
    <div onClick={() => onSelect(user.id)} style={{ 
      padding: '15px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      cursor: 'pointer'
    }}>
      <h4>{user.name}</h4>
      <p style={{ color: '#666' }}>{user.email}</p>
      <span style={{ 
        padding: '3px 8px', 
        backgroundColor: user.isActive ? '#e8f5e8' : '#ffebee',
        borderRadius: '4px',
        fontSize: '12px'
      }}>
        {user.isActive ? 'Activo' : 'Inactivo'}
      </span>
    </div>
  );
}

// ============================================
// SOLUCIÓN EN TYPESCRIPT
// ============================================

/**
 * // interfaces.ts
 * 
 * export interface User {
 *   id: number;
 *   name: string;
 *   email: string;
 *   isActive: boolean;
 *   role: 'admin' | 'user' | 'editor';
 * }
 * 
 * export interface UserCardProps {
 *   user: User;
 *   onSelect: (id: number) => void;
 * }
 * 
 * export interface UserListProps {
 *   users: User[];
 *   onUserSelect: (id: number) => void;
 *   filter?: 'all' | 'active' | 'inactive';
 * }
 * 
 * // pages/UsersPage.tsx
 * 
 * export function UsersPage() {
 *   const [users, setUsers] = useState<User[]>([]);
 *   const [selectedId, setSelectedId] = useState<number | null>(null);
 *   const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
 *   
 *   const handleSelect = (id: number) => {
 *     setSelectedId(id);
 *   };
 *   
 *   const filteredUsers = users.filter(user => {
 *     if (filter === 'active') return user.isActive;
 *     if (filter === 'inactive') return !user.isActive;
 *     return true;
 *   });
 *   
 *   return (
 *     <div>
 *       <h1>Users</h1>
 *       <select 
 *         value={filter} 
 *         onChange={(e) => setFilter(e.target.value as typeof filter)}
 *       >
 *         <option value="all">All</option>
 *         <option value="active">Active</option>
 *         <option value="inactive">Inactive</option>
 *       </select>
 *       <UserList 
 *         users={filteredUsers} 
 *         onUserSelect={handleSelect} 
 *       />
 *       {selectedId && <UserDetail userId={selectedId} />}
 *     </div>
 *   );
 * }
 */

// Componente funcional que simula la versión TS
function UserList({ users, onUserSelect, filter = 'all' }) {
  const filteredUsers = users.filter(user => {
    if (filter === 'active') return user.isActive;
    if (filter === 'inactive') return !user.isActive;
    return true;
  });
  
  return (
    <div style={{ display: 'grid', gap: '10px' }}>
      {filteredUsers.map(user => (
        <UserCardJS key={user.id} user={user} onSelect={onUserSelect} />
      ))}
    </div>
  );
}

// ============================================
// EJERCICIO: Tipar estos componentes
// ============================================

/**
 * EJERCICIO 1: Tipar el componente SearchBar
 * 
 * function SearchBar({ value, onChange, placeholder, onSearch }) {
 *   return (
 *     <form onSubmit={(e) => { e.preventDefault(); onSearch(value); }}>
 *       <input
 *         type="text"
 *         value={value}
 *         onChange={(e) => onChange(e.target.value)}
 *         placeholder={placeholder}
 *       />
 *       <button type="submit">Buscar</button>
 *     </form>
 *   );
 * }
 * 
 * SOLUCIÓN:
 * 
 * interface SearchBarProps {
 *   value: string;
 *   onChange: (value: string) => void;
 *   placeholder?: string;
 *   onSearch: (query: string) => void;
 * }
 * 
 * function SearchBar({ value, onChange, placeholder = 'Search...', onSearch }: SearchBarProps) { ... }
 */

function SearchBar({ value, onChange, placeholder, onSearch }) {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSearch(value); }} style={{ display: 'flex', gap: '10px' }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
      />
      <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
        Buscar
      </button>
    </form>
  );
}

/**
 * EJERCICIO 2: Tipar useLocalStorage hook
 * 
 * function useLocalStorage(key, initialValue) {
 *   const [value, setValue] = useState(() => {
 *     try {
 *       const item = window.localStorage.getItem(key);
 *       return item ? JSON.parse(item) : initialValue;
 *     } catch {
 *       return initialValue;
 *     }
 *   });
 *   
 *   useEffect(() => {
 *     window.localStorage.setItem(key, JSON.stringify(value));
 *   }, [key, value]);
 *   
 *   return [value, setValue];
 * }
 * 
 * SOLUCIÓN:
 * 
 * function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
 *   ...
 * }
 */

function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });
  
  React.useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  
  return [value, setValue];
}

// ============================================
// DEMO INTERACTIVA
// ============================================

const mockUsers = [
  { id: 1, name: 'Ana García', email: 'ana@test.com', isActive: true, role: 'admin' },
  { id: 2, name: 'Carlos López', email: 'carlos@test.com', isActive: false, role: 'user' },
  { id: 3, name: 'Elena Martínez', email: 'elena@test.com', isActive: true, role: 'editor' },
  { id: 4, name: 'Pedro Sánchez', email: 'pedro@test.com', isActive: true, role: 'user' }
];

export default function TypeScriptChallenge() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [savedSearch, setSavedSearch] = useLocalStorage('ts-demo-search', '');
  const [showSolution, setShowSolution] = useState(false);
  
  return (
    <div className="desafio">
      <h2>Desafío: TypeScript con React</h2>
      
      <div style={{ display: 'grid', gap: '20px' }}>
        {/* Demo interactiva */}
        <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h4>Demo Interactiva</h4>
          
          <div style={{ marginBottom: '15px' }}>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ padding: '8px', marginRight: '10px', borderRadius: '4px' }}
            >
              <option value="all">Todos</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
            <span style={{ color: '#666', fontSize: '14px' }}>
              Filter type: '{filter}' (string literal union)
            </span>
          </div>
          
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Buscar usuarios..."
            onSearch={(q) => setSavedSearch(q)}
          />
          
          <p style={{ fontSize: '12px', color: '#666', marginTop: '10px' }}>
            Última búsqueda guardada: {savedSearch || 'ninguna'}
          </p>
          
          <UserList
            users={mockUsers.filter(u => 
              u.name.toLowerCase().includes(search.toLowerCase()) ||
              u.email.toLowerCase().includes(search.toLowerCase())
            )}
            onUserSelect={(id) => console.log('Selected:', id)}
            filter={filter}
          />
        </div>
        
        {/* Solución */}
        <div>
          <button
            onClick={() => setShowSolution(!showSolution)}
            style={{ 
              padding: '10px 20px', 
              backgroundColor: showSolution ? '#6c757d' : '#6f42c1', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              marginBottom: '15px'
            }}
          >
            {showSolution ? 'Ocultar' : 'Ver'} Solución TypeScript
          </button>
          
          {showSolution && (
            <pre style={{ 
              backgroundColor: '#1e1e1e', 
              color: '#d4d4d4', 
              padding: '15px', 
              borderRadius: '8px', 
              overflow: 'auto', 
              fontSize: '12px',
              maxHeight: '400px'
            }}>{`// types.ts
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
  role: 'admin' | 'user' | 'editor';
}

interface UserCardProps {
  user: User;
  onSelect: (id: number) => void;
}

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onSearch: (query: string) => void;
}

// useLocalStorage.ts
function useLocalStorage<T>(
  key: string, 
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
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

// UserCard.tsx
function UserCard({ user, onSelect }: UserCardProps) {
  return (
    <div onClick={() => onSelect(user.id)}>
      <h4>{user.name}</h4>
      <p>{user.email}</p>
      <span>{user.isActive ? 'Active' : 'Inactive'}</span>
    </div>
  );
}`}</pre>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * DESGLOSE:
 * 
 * 1. INTERFACES: Definir la forma de los objetos
 * 2. UNION TYPES: 'admin' | 'user' | 'editor' para valores limitados
 * 3. OPTIONAL: age?: number para props opcionales
 * 4. CALLBACKS: (id: number) => void para funciones
 * 5. GENERICS: useLocalStorage<T> para hooks reutilizables
 * 6. TYPE ASSERTION: e.target.value as typeof filter
 */