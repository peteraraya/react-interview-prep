import React, { useState, useMemo, useCallback, memo, lazy, Suspense, useEffect, useRef } from 'react';

/**
 * MÓDULO 14: PERFORMANCE EN REACT
 * 
 * Optimizar el rendimiento es crucial para aplicaciones grandes.
 * 
 * Conceptos clave:
 * - React.memo: Evitar re-renders innecesarios
 * - useMemo: Memorizar valores calculados
 * - useCallback: Memorizar funciones
 * - React.lazy + Suspense: Code splitting
 * - Virtualización: Renderizar solo lo visible
 * - Keys correctas: Optimizar listas
 */

// ============================================
// EJEMPLO 1: React.memo
// ============================================

// Componente SIN memo - se re-renderiza con cada cambio del padre
function ExpensiveComponentSinMemo({ data, onClick }) {
  console.log('ExpensiveComponentSinMemo renderizado');
  
  // Simular renderizado costoso
  const processedData = data.map(item => ({
    ...item,
    processed: true
  }));
  
  return (
    <div style={{ padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
      <p>Sin memo - renders: {processedData.length} items</p>
      <button onClick={onClick} style={btnSmall}>Click</button>
    </div>
  );
}

// Componente CON memo - solo se re-renderiza si cambian sus props
const ExpensiveComponentConMemo = memo(function ExpensiveComponentConMemo({ data, onClick }) {
  console.log('ExpensiveComponentConMemo renderizado');
  
  const processedData = data.map(item => ({
    ...item,
    processed: true
  }));
  
  return (
    <div style={{ padding: '10px', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
      <p>Con memo - renders: {processedData.length} items</p>
      <button onClick={onClick} style={btnSmall}>Click</button>
    </div>
  );
});

function MemoExample() {
  const [count, setCount] = useState(0);
  const [otherState, setOtherState] = useState(0);
  
  const data = useMemo(() => [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' }
  ], []);
  
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []);
  
  return (
    <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h4>React.memo</h4>
      <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
        Abre la consola para ver cuándo se renderizan los componentes
      </p>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button onClick={() => setCount(c => c + 1)} style={btnSmall}>
          Count: {count}
        </button>
        <button onClick={() => setOtherState(s => s + 1)} style={{...btnSmall, backgroundColor: '#6c757d'}}>
          Other: {otherState}
        </button>
      </div>
      
      <div style={{ display: 'grid', gap: '10px' }}>
        <ExpensiveComponentSinMemo data={data} onClick={handleClick} />
        <ExpensiveComponentConMemo data={data} onClick={handleClick} />
      </div>
    </div>
  );
}

// ============================================
// EJEMPLO 2: useMemo y useCallback
// ============================================

function MemoizationExample() {
  const [items] = useState([
    { id: 1, name: 'React', price: 100 },
    { id: 2, name: 'Vue', price: 80 },
    { id: 3, name: 'Angular', price: 90 }
  ]);
  const [filter, setFilter] = useState('');
  const [renderCount, setRenderCount] = useState(0);
  
  // SIN useMemo - se recalcula en cada render
  const filteredItemsBad = items.filter(item => 
    item.name.toLowerCase().includes(filter.toLowerCase())
  );
  
  // CON useMemo - solo se recalcula cuando cambian items o filter
  const filteredItemsGood = useMemo(() => {
    console.log('Recalculando filtro...');
    return items.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);
  
  // CON useCallback - función estable entre renders
  const handleFilterChange = useCallback((e) => {
    setFilter(e.target.value);
  }, []);
  
  useEffect(() => {
    setRenderCount(c => c + 1);
  });
  
  return (
    <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h4>useMemo y useCallback</h4>
      <p style={{ fontSize: '12px', color: '#666' }}>
        Renders totales: {renderCount}
      </p>
      
      <input
        type="text"
        value={filter}
        onChange={handleFilterChange}
        placeholder="Filtrar..."
        style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }}
      />
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div>
          <h5 style={{ color: '#dc3545' }}>Sin useMemo</h5>
          <ul style={{ fontSize: '14px' }}>
            {filteredItemsBad.map(item => (
              <li key={item.id}>{item.name} - ${item.price}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h5 style={{ color: '#28a745' }}>Con useMemo</h5>
          <ul style={{ fontSize: '14px' }}>
            {filteredItemsGood.map(item => (
              <li key={item.id}>{item.name} - ${item.price}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ============================================
// EJEMPLO 3: React.lazy + Suspense
// ============================================

// Componente "pesado" que se carga bajo demanda
const HeavyComponent = lazy(() => 
  new Promise(resolve => {
    setTimeout(() => {
      resolve({
        default: function HeavyComponent() {
          return (
            <div style={{ padding: '20px', backgroundColor: '#e3f2fd', borderRadius: '8px' }}>
              <h4>Componente Cargado under Demand</h4>
              <p>Este componente se cargó solo cuando se necesitó.</p>
              <p>En producción, esto reduce el tamaño del bundle inicial.</p>
            </div>
          );
        }
      });
    }, 1500);
  })
);

function LazyLoadingExample() {
  const [showHeavy, setShowHeavy] = useState(false);
  
  return (
    <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h4>React.lazy + Suspense</h4>
      
      <button
        onClick={() => setShowHeavy(!showHeavy)}
        style={{ ...btnSmall, marginBottom: '15px' }}
      >
        {showHeavy ? 'Ocultar' : 'Mostrar'} Componente Pesado
      </button>
      
      {showHeavy && (
        <Suspense fallback={
          <div style={{ padding: '20px', textAlign: 'center', backgroundColor: '#fff3e0', borderRadius: '8px' }}>
            <div style={{ 
              width: '30px', height: '30px', border: '3px solid #f3f3f3', borderTop: '3px solid #ff9800',
              borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 10px'
            }}></div>
            Cargando componente...
          </div>
        }>
          <HeavyComponent />
        </Suspense>
      )}
      
      <div style={{ marginTop: '15px', fontSize: '12px', color: '#666' }}>
        <strong>Beneficio:</strong> El componente solo se descarga cuando el usuario lo solicita.
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

// ============================================
// EJEMPLO 4: Lista Virtualizada (simulada)
// ============================================

function LargeListExample() {
  const [items] = useState(() => 
    Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      value: Math.random() * 100
    }))
  );
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 20 });
  const containerRef = useRef(null);
  
  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, clientHeight } = containerRef.current;
      const itemHeight = 50;
      const start = Math.floor(scrollTop / itemHeight);
      const visible = Math.ceil(clientHeight / itemHeight);
      setVisibleRange({ start, end: start + visible + 5 });
    }
  };
  
  const visibleItems = items.slice(visibleRange.start, visibleRange.end);
  
  return (
    <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h4>Virtualización de Lista</h4>
      <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
        Mostrando {visibleRange.start + 1}-{Math.min(visibleRange.end, items.length)} de {items.length} items
      </p>
      
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{ 
          height: '250px', 
          overflow: 'auto', 
          border: '1px solid #ddd', 
          borderRadius: '4px',
          backgroundColor: 'white'
        }}
      >
        <div style={{ height: items.length * 50, position: 'relative' }}>
          {visibleItems.map((item, index) => (
            <div
              key={item.id}
              style={{
                position: 'absolute',
                top: (visibleRange.start + index) * 50,
                left: 0,
                right: 0,
                height: '50px',
                padding: '15px',
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between'
              }}
            >
              <span>{item.name}</span>
              <span style={{ color: '#666' }}>{item.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const btnSmall = {
  padding: '8px 16px',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '14px'
};

// Componente principal
export default function PerformanceExamples() {
  return (
    <div className="modulo">
      <h1>Módulo 14: Performance en React</h1>
      <p className="descripcion">
        Optimizar renders, memoria y carga de la aplicación para mejor experiencia de usuario.
      </p>
      
      <div className="ejemplos">
        <MemoExample />
        <MemoizationExample />
        <LazyLoadingExample />
        <LargeListExample />
      </div>
      
      <div className="explicacion">
        <h3>Conceptos Clave:</h3>
        <ul>
          <li><strong>React.memo:</strong> Evita re-renders si las props no cambian</li>
          <li><strong>useMemo:</strong> Memoriza valores calculados costosos</li>
          <li><strong>useCallback:</strong> Memoriza funciones para pasarlas como props</li>
          <li><strong>React.lazy:</strong> Carga componentes bajo demanda (code splitting)</li>
          <li><strong>Suspense:</strong> Muestra fallback mientras carga un lazy component</li>
          <li><strong>Virtualización:</strong> Renderiza solo lo visible en listas grandes</li>
          <li><strong>Keys:</strong> Usa IDs únicos, nunca índices para listas dinámicas</li>
          <li><strong>Profiler:</strong> React DevTools para medir rendimiento</li>
        </ul>
      </div>
    </div>
  );
}