import React, { useState, useMemo, useCallback, memo, useRef, useEffect } from 'react';

/**
 * DESAFÍO DE ENTREVISTA: PERFORMANCE
 * 
 * Ejercicio: "Optimizar una lista de 10,000 items con filtros"
 * 
 * El componente original es lento. El estudiante debe identificar
 * y aplicar optimizaciones de performance.
 */

// ============================================
// VERSIÓN ORIGINAL (LENTA) - Para identificar problemas
// ============================================

function SlowList({ items, filter, onItemSelect }) {
  console.log('SlowList renderizado');
  
  // PROBLEMA 1: Filtrado sin useMemo
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(filter.toLowerCase()) ||
    item.category.toLowerCase().includes(filter.toLowerCase())
  );
  
  return (
    <div style={{ maxHeight: '300px', overflow: 'auto' }}>
      {filteredItems.map((item, index) => (
        // PROBLEMA 2: key con index
        <div
          key={index}
          // PROBLEMA 3: Estilo inline crea nuevo objeto en cada render
          style={{ 
            padding: '10px', 
            borderBottom: '1px solid #eee',
            cursor: 'pointer'
          }}
          onClick={() => onItemSelect(item)}
        >
          <div>{item.name}</div>
          <div style={{ color: '#666', fontSize: '12px' }}>{item.category}</div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// VERSIÓN OPTIMIZADA
// ============================================

// PROBLEMA 4: onItemSelect se crea nueva en cada render del padre
// Solución: useCallback en el padre + memo en el hijo

const OptimizedListItem = memo(function OptimizedListItem({ item, onSelect }) {
  return (
    <div
      style={{ 
        padding: '10px', 
        borderBottom: '1px solid #eee',
        cursor: 'pointer'
      }}
      onClick={() => onSelect(item)}
    >
      <div>{item.name}</div>
      <div style={{ color: '#666', fontSize: '12px' }}>{item.category}</div>
    </div>
  );
});

function OptimizedList({ items, filter, onItemSelect }) {
  console.log('OptimizedList renderizado');
  
  // SOLUCIÓN 1: useMemo para filtrado
  const filteredItems = useMemo(() => {
    console.log('Recalculando filtro...');
    return items.filter(item => 
      item.name.toLowerCase().includes(filter.toLowerCase()) ||
      item.category.toLowerCase().includes(filter.toLowerCase())
    );
  }, [items, filter]);
  
  return (
    <div style={{ maxHeight: '300px', overflow: 'auto' }}>
      {filteredItems.map(item => (
        // SOLUCIÓN 2: Key con ID único
        <OptimizedListItem 
          key={item.id} 
          item={item} 
          onSelect={onItemSelect}
        />
      ))}
    </div>
  );
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

function PerformanceChallenge() {
  const [items] = useState(() => 
    Array.from({ length: 10000 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      category: ['Tech', 'Design', 'Business', 'Marketing'][i % 4],
      value: Math.floor(Math.random() * 1000)
    }))
  );
  const [filter, setFilter] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showOptimized, setShowOptimized] = useState(false);
  const [renderCount, setRenderCount] = useState(0);
  
  // SOLUCIÓN 3: useCallback para función estable
  const handleItemSelect = useCallback((item) => {
    setSelectedItem(item);
  }, []);
  
  // SOLUCIÓN 4: useCallback para handler de input
  const handleFilterChange = useCallback((e) => {
    setFilter(e.target.value);
  }, []);
  
  useEffect(() => {
    setRenderCount(c => c + 1);
  });
  
  return (
    <div className="desafio">
      <h2>Desafío: Optimizar Lista de 10,000 Items</h2>
      
      <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <strong>Renders totales:</strong> {renderCount}
      </div>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <input
          type="text"
          value={filter}
          onChange={handleFilterChange}
          placeholder="Filtrar items..."
          style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        
        <button
          onClick={() => setShowOptimized(!showOptimized)}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: showOptimized ? '#28a745' : '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer' 
          }}
        >
          {showOptimized ? 'Optimizada' : 'Original'}
        </button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        <div style={{ 
          padding: '15px', 
          backgroundColor: showOptimized ? '#e8f5e8' : '#ffebee', 
          borderRadius: '8px' 
        }}>
          <h4>{showOptimized ? '✅ Versión Optimizada' : '❌ Versión Original'}</h4>
          
          {showOptimized ? (
            <OptimizedList 
              items={items} 
              filter={filter} 
              onItemSelect={handleItemSelect}
            />
          ) : (
            <SlowList 
              items={items} 
              filter={filter} 
              onItemSelect={handleItemSelect}
            />
          )}
        </div>
        
        <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <h4>Item Seleccionado</h4>
          {selectedItem ? (
            <div style={{ padding: '10px', backgroundColor: 'white', borderRadius: '4px' }}>
              <p><strong>{selectedItem.name}</strong></p>
              <p style={{ color: '#666' }}>{selectedItem.category}</p>
              <p>Value: {selectedItem.value}</p>
            </div>
          ) : (
            <p style={{ color: '#666' }}>Selecciona un item</p>
          )}
        </div>
      </div>
      
      {/* Solución */}
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h4>Optimizaciones Aplicadas:</h4>
        <ol style={{ paddingLeft: '20px', fontSize: '14px' }}>
          <li><strong>useMemo:</strong> Memorizar resultado de filter()</li>
          <li><strong>useCallback:</strong> Estabilizar funciones onItemSelect y onFilterChange</li>
          <li><strong>React.memo:</strong> Evitar re-renders de OptimizedListItem</li>
          <li><strong>Keys correctas:</strong> Usar ID único en vez de index</li>
          <li><strong>Estilos:</strong> No crear objetos inline en cada render</li>
        </ol>
      </div>
    </div>
  );
}

export default PerformanceChallenge;