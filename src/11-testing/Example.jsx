import React from 'react';

/**
 * MÓDULO 11: TESTING CON JEST + REACT TESTING LIBRARY
 * 
 * Jest: Framework de testing para JavaScript
 * React Testing Library: Librería para testear componentes React
 * 
 * Conceptos clave:
 * - render: renderizar componentes
 * - screen: acceder a elementos del DOM
 * - fireEvent: simular eventos
 * - userEvent: interacciones más realistas
 * - waitFor: esperar cambios asíncronos
 * - queries: getBy, queryBy, findBy
 * - matchers: toBeInTheDocument, toHaveTextContent, etc.
 */

// ============================================
// COMPONENTES PARA TESTEAR
// ============================================

// Componente 1: Contador simple
export function Counter({ initialCount = 0, step = 1 }) {
  const [count, setCount] = React.useState(initialCount);
  
  return (
    <div>
      <h2>Contador</h2>
      <p data-testid="count-display">Count: {count}</p>
      <button onClick={() => setCount(c => c + step)}>Incrementar</button>
      <button onClick={() => setCount(c => c - step)}>Decrementar</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// Componente 2: Formulario de login
export function LoginForm({ onSubmit }) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Todos los campos son requeridos');
      return;
    }
    
    setLoading(true);
    try {
      await onSubmit({ email, password });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      
      {error && <div role="alert" style={{ color: 'red' }}>{error}</div>}
      
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
        />
      </div>
      
      <div>
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
      </button>
    </form>
  );
}

// Componente 3: Lista con búsqueda
export function SearchableList({ items }) {
  const [query, setQuery] = React.useState('');
  
  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );
  
  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar..."
        aria-label="Buscar items"
      />
      
      <ul>
        {filteredItems.length === 0 ? (
          <li>No se encontraron resultados</li>
        ) : (
          filteredItems.map(item => (
            <li key={item.id}>{item.name}</li>
          ))
        )}
      </ul>
      
      <p data-testid="results-count">{filteredItems.length} resultados</p>
    </div>
  );
}

// Componente 4: Botón con contador y callback
export function LikeButton({ onLike }) {
  const [liked, setLiked] = React.useState(false);
  const [likes, setLikes] = React.useState(0);
  
  const handleClick = () => {
    if (!liked) {
      setLiked(true);
      setLikes(l => l + 1);
      onLike?.();
    }
  };
  
  return (
    <button onClick={handleClick} disabled={liked}>
      {liked ? `❤️ ${likes}` : `🤍 ${likes}`}
    </button>
  );
}

// ============================================
// EJEMPLOS DE TESTS (en comentarios para referencia)
// ============================================

/**
 * ARCHIVO: counter.test.jsx
 * 
 * import { render, screen, fireEvent } from '@testing-library/react';
 * import { Counter } from './Example';
 * 
 * describe('Counter Component', () => {
 *   test('renders with initial count of 0', () => {
 *     render(<Counter />);
 *     expect(screen.getByText('Count: 0')).toBeInTheDocument();
 *   });
 * 
 *   test('increments count when clicking increment button', () => {
 *     render(<Counter />);
 *     fireEvent.click(screen.getByText('Incrementar'));
 *     expect(screen.getByText('Count: 1')).toBeInTheDocument();
 *   });
 * 
 *   test('decrements count when clicking decrement button', () => {
 *     render(<Counter />);
 *     fireEvent.click(screen.getByText('Decrementar'));
 *     expect(screen.getByText('Count: -1')).toBeInTheDocument();
 *   });
 * 
 *   test('resets count to 0', () => {
 *     render(<Counter initialCount={10} />);
 *     fireEvent.click(screen.getByText('Reset'));
 *     expect(screen.getByText('Count: 0')).toBeInTheDocument();
 *   });
 * 
 *   test('uses custom step value', () => {
 *     render(<Counter step={5} />);
 *     fireEvent.click(screen.getByText('Incrementar'));
 *     expect(screen.getByText('Count: 5')).toBeInTheDocument();
 *   });
 * });
 * 
 * 
 * ARCHIVO: loginform.test.jsx
 * 
 * import { render, screen, fireEvent, waitFor } from '@testing-library/react';
 * import userEvent from '@testing-library/user-event';
 * import { LoginForm } from './Example';
 * 
 * describe('LoginForm Component', () => {
 *   test('renders login form correctly', () => {
 *     render(<LoginForm onSubmit={() => {}} />);
 *     expect(screen.getByText('Login')).toBeInTheDocument();
 *     expect(screen.getByLabelText('Email')).toBeInTheDocument();
 *     expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
 *   });
 * 
 *   test('shows error when submitting empty fields', async () => {
 *     render(<LoginForm onSubmit={() => {}} />);
 *     fireEvent.click(screen.getByText('Iniciar Sesión'));
 *     expect(await screen.findByText('Todos los campos son requeridos')).toBeInTheDocument();
 *   });
 * 
 *   test('calls onSubmit with form data', async () => {
 *     const mockSubmit = jest.fn().mockResolvedValue({});
 *     render(<LoginForm onSubmit={mockSubmit} />);
 *     
 *     await userEvent.type(screen.getByLabelText('Email'), 'test@email.com');
 *     await userEvent.type(screen.getByLabelText('Contraseña'), 'password123');
 *     await userEvent.click(screen.getByText('Iniciar Sesión'));
 *     
 *     expect(mockSubmit).toHaveBeenCalledWith({
 *       email: 'test@email.com',
 *       password: 'password123'
 *     });
 *   });
 * 
 *   test('displays error message when onSubmit fails', async () => {
 *     const mockSubmit = jest.fn().mockRejectedValue(new Error('Credenciales inválidas'));
 *     render(<LoginForm onSubmit={mockSubmit} />);
 *     
 *     await userEvent.type(screen.getByLabelText('Email'), 'test@email.com');
 *     await userEvent.type(screen.getByLabelText('Contraseña'), 'wrong');
 *     await userEvent.click(screen.getByText('Iniciar Sesión'));
 *     
 *     expect(await screen.findByText('Credenciales inválidas')).toBeInTheDocument();
 *   });
 * });
 * 
 * 
 * ARCHIVO: searchablelist.test.jsx
 * 
 * import { render, screen, fireEvent } from '@testing-library/react';
 * import { SearchableList } from './Example';
 * 
 * const items = [
 *   { id: 1, name: 'React' },
 *   { id: 2, name: 'Vue' },
 *   { id: 3, name: 'Angular' },
 *   { id: 4, name: 'Svelte' }
 * ];
 * 
 * describe('SearchableList Component', () => {
 *   test('renders all items initially', () => {
 *     render(<SearchableList items={items} />);
 *     expect(screen.getByText('4 resultados')).toBeInTheDocument();
 *   });
 * 
 *   test('filters items based on search query', () => {
 *     render(<SearchableList items={items} />);
 *     fireEvent.change(screen.getByLabelText('Buscar items'), { target: { value: 'react' } });
 *     expect(screen.getByText('1 resultados')).toBeInTheDocument();
 *     expect(screen.getByText('React')).toBeInTheDocument();
 *   });
 * 
 *   test('shows no results message when no matches', () => {
 *     render(<SearchableList items={items} />);
 *     fireEvent.change(screen.getByLabelText('Buscar items'), { target: { value: 'xyz' } });
 *     expect(screen.getByText('No se encontraron resultados')).toBeInTheDocument();
 *   });
 * });
 */

// ============================================
// GUÍA VISUAL DE TESTING
// ============================================

export default function TestingGuide() {
  return (
    <div className="modulo">
      <h1>Módulo 11: Testing con Jest + React Testing Library</h1>
      <p className="descripcion">
        Los tests garantizan que tu código funcione correctamente y previene regresiones.
      </p>
      
      <div className="ejemplos">
        {/* Ejemplo interactivo */}
        <div className="ejemplo">
          <h3>Ejemplo Interactivo: Prueba los componentes</h3>
          <p style={{ color: '#666', marginBottom: '15px' }}>
            Interactúa con estos componentes para entender cómo se testearían.
          </p>
          
          <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
            <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <Counter />
            </div>
            
            <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <SearchableList items={[
                { id: 1, name: 'React' },
                { id: 2, name: 'Vue' },
                { id: 3, name: 'Angular' },
                { id: 4, name: 'Svelte' }
              ]} />
            </div>
            
            <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <LikeButton onLike={() => console.log('Liked!')} />
            </div>
          </div>
        </div>
        
        {/* Guía de testing */}
        <div className="ejemplo">
          <h3>Guía de Testing</h3>
          
          <div style={{ display: 'grid', gap: '15px' }}>
            <div style={{ padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 10px', color: '#1976d2' }}>Queries (Cómo encontrar elementos)</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                <li><strong>getByText:</strong> Encuentra por texto visible</li>
                <li><strong>getByLabelText:</strong> Encuentra por label (formularios)</li>
                <li><strong>getByRole:</strong> Encuentra por rol ARIA</li>
                <li><strong>getByTestId:</strong> Encuentra por data-testid</li>
                <li><strong>queryByText:</strong> Retorna null si no existe (no falla)</li>
                <li><strong>findByText:</strong> Espera a que aparezca (async)</li>
              </ul>
            </div>
            
            <div style={{ padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 10px', color: '#2e7d32' }}>Eventos</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                <li><strong>fireEvent.click:</strong> Simula click</li>
                <li><strong>fireEvent.change:</strong> Simula cambio de input</li>
                <li><strong>userEvent.type:</strong> Simula escritura realista</li>
                <li><strong>userEvent.click:</strong> Click más realista</li>
              </ul>
            </div>
            
            <div style={{ padding: '15px', backgroundColor: '#fff3e0', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 10px', color: '#e65100' }}>Assertions (Matchers)</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                <li><strong>toBeInTheDocument:</strong> Elemento existe en DOM</li>
                <li><strong>toHaveTextContent:</strong> Tiene cierto texto</li>
                <li><strong>toBeDisabled:</strong> Está deshabilitado</li>
                <li><strong>toHaveValue:</strong> Input tiene cierto valor</li>
                <li><strong>toHaveBeenCalled:</strong> Mock fue llamado</li>
              </ul>
            </div>
            
            <div style={{ padding: '15px', backgroundColor: '#f3e5f5', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 10px', color: '#7b1fa2' }}>Async Testing</h4>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                <li><strong>waitFor:</strong> Espera condición</li>
                <li><strong>findBy:*:</strong> Queries async (reintentan)</li>
                <li><strong>async/await:</strong> Para operaciones asíncronas</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Mocking */}
        <div className="ejemplo">
          <h3>Mocking Patterns</h3>
          <pre style={{ backgroundColor: '#f4f4f4', padding: '15px', borderRadius: '8px', overflow: 'auto', fontSize: '12px' }}>{`// Mock de función
const mockFn = jest.fn();
render(<Component onAction={mockFn} />);
fireEvent.click(screen.getByRole('button'));
expect(mockFn).toHaveBeenCalledTimes(1);

// Mock de módulo
jest.mock('./api', () => ({
  fetchData: jest.fn()
}));

// Mock de fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: 'test' })
  })
);

// Spy on console
jest.spyOn(console, 'log');
expect(console.log).toHaveBeenCalledWith('msg');`}</pre>
        </div>
      </div>
      
      <div className="explicacion">
        <h3>Conceptos Clave:</h3>
        <ul>
          <li><strong>AAA Pattern:</strong> Arrange, Act, Assert</li>
          <li><strong>Testear comportamiento,</strong> no implementación</li>
          <li><strong>data-testid:</strong> Último recurso para seleccionar</li>
          <li><strong>Cleanup:</strong> RTL limpia automáticamente después de cada test</li>
          <li><strong>userEvent vs fireEvent:</strong> userEvent es más realista</li>
          <li><strong>Tests de integración:</strong> Testear componentes juntos</li>
        </ul>
      </div>
    </div>
  );
}