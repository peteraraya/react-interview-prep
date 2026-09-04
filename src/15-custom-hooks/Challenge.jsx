import React, { useState, useEffect, useCallback, useRef } from 'react';

/**
 * DESAFÍO DE ENTREVISTA: CUSTOM HOOKS
 * 
 * Ejercicio: "Crear un hook usePagination completo"
 * 
 * Requisitos:
 * - Paginación con página actual
 * - Jump a página específica
 * - Total de páginas calculado
 * - Botones prev/next
 */

// SOLUCIÓN PROPUESTA

// ============================================
// HOOK: usePagination
// ============================================

function usePagination({ totalItems, itemsPerPage = 10, initialPage = 1 }) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPageState] = useState(itemsPerPage);
  
  const totalPages = Math.ceil(totalItems / itemsPerPageState);
  
  const goToPage = useCallback((page) => {
    const pageNum = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNum);
  }, [totalPages]);
  
  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);
  
  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);
  
  const firstPage = useCallback(() => goToPage(1), [goToPage]);
  const lastPage = useCallback(() => goToPage(totalPages), [goToPage, totalPages]);
  
  // Items visibles para la página actual
  const startIndex = (currentPage - 1) * itemsPerPageState;
  const endIndex = startIndex + itemsPerPageState;
  
  const getPageItems = useCallback((items) => {
    return items.slice(startIndex, endIndex);
  }, [startIndex, endIndex]);
  
  return {
    currentPage,
    totalPages,
    itemsPerPage: itemsPerPageState,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    getPageItems,
    hasNext: currentPage < totalPages,
    hasPrev: currentPage > 1,
    startIndex: startIndex + 1,
    endIndex: Math.min(endIndex, totalItems),
    totalItems
  };
}

// ============================================
// HOOK: useInfiniteScroll
// ============================================

function useInfiniteScroll(callback, options = {}) {
  const { threshold = 100 } = options;
  const observerRef = useRef();
  const loadingRef = useRef(false);
  
  const lastElementRef = useCallback((node) => {
    if (observerRef.current) observerRef.current.disconnect();
    
    observerRef.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && !loadingRef.current) {
        loadingRef.current = true;
        callback().then(() => {
          loadingRef.current = false;
        });
      }
    }, { threshold });
    
    if (node) observerRef.current.observe(node);
  }, [callback, threshold]);
  
  return lastElementRef;
}

// ============================================
// COMPONENTE DE DEMO: PAGINATION
// ============================================

function PaginationDemo() {
  const [allItems] = useState(() => 
    Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      description: `Descripción del item ${i + 1}`
    }))
  );
  
  const pagination = usePagination({
    totalItems: allItems.length,
    itemsPerPage: 8
  });
  
  const visibleItems = pagination.getPageItems(allItems);
  
  return (
    <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h4>usePagination</h4>
      
      {/* Stats */}
      <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: 'white', borderRadius: '4px', fontSize: '14px' }}>
        Mostrando {pagination.startIndex}-{pagination.endIndex} de {pagination.totalItems} items
      </div>
      
      {/* Items */}
      <div style={{ display: 'grid', gap: '8px', marginBottom: '15px' }}>
        {visibleItems.map(item => (
          <div key={item.id} style={{ padding: '10px 15px', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #ddd' }}>
            <strong>{item.name}</strong>
            <span style={{ color: '#666', marginLeft: '10px', fontSize: '12px' }}>{item.description}</span>
          </div>
        ))}
      </div>
      
      {/* Pagination controls */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
        <button
          onClick={pagination.firstPage}
          disabled={!pagination.hasPrev}
          style={paginationBtn(!pagination.hasPrev)}
        >
          ««
        </button>
        <button
          onClick={pagination.prevPage}
          disabled={!pagination.hasPrev}
          style={paginationBtn(!pagination.hasPrev)}
        >
          «
        </button>
        
        <span style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', borderRadius: '4px' }}>
          {pagination.currentPage} / {pagination.totalPages}
        </span>
        
        <button
          onClick={pagination.nextPage}
          disabled={!pagination.hasNext}
          style={paginationBtn(!pagination.hasNext)}
        >
          »
        </button>
        <button
          onClick={pagination.lastPage}
          disabled={!pagination.hasNext}
          style={paginationBtn(!pagination.hasNext)}
        >
          »»
        </button>
      </div>
      
      {/* Jump to page */}
      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <span style={{ marginRight: '10px' }}>Ir a página:</span>
        {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => pagination.goToPage(page)}
            style={{
              padding: '5px 10px',
              margin: '0 2px',
              backgroundColor: pagination.currentPage === page ? '#007bff' : '#e9ecef',
              color: pagination.currentPage === page ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}

const paginationBtn = (disabled) => ({
  padding: '8px 15px',
  backgroundColor: disabled ? '#e9ecef' : '#007bff',
  color: disabled ? '#999' : 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: disabled ? 'not-allowed' : 'pointer'
});

// ============================================
// COMPONENTE DE DEMO: INFINITE SCROLL
// ============================================

function InfiniteScrollDemo() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const loadMore = useCallback(async () => {
    if (!hasMore) return;
    
    setLoading(true);
    
    // Simular carga de datos
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setItems(prev => {
      const newItems = Array.from({ length: 20 }, (_, i) => ({
        id: prev.length + i + 1,
        name: `Item ${prev.length + i + 1}`
      }));
      
      // Parar después de 100 items
      if (prev.length + newItems.length >= 100) {
        setHasMore(false);
      }
      
      return [...prev, ...newItems];
    });
    
    setLoading(false);
  }, [hasMore]);
  
  // Cargar primeros items
  useEffect(() => {
    loadMore();
  }, []);
  
  const lastItemRef = useInfiniteScroll(loadMore);
  
  return (
    <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h4>useInfiniteScroll</h4>
      <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
        Items cargados: {items.length} (scroll hacia abajo para cargar más)
      </p>
      
      <div style={{ height: '300px', overflow: 'auto', border: '1px solid #ddd', borderRadius: '4px', backgroundColor: 'white' }}>
        {items.map((item, index) => (
          <div
            key={item.id}
            ref={index === items.length - 1 ? lastItemRef : null}
            style={{ 
              padding: '15px', 
              borderBottom: '1px solid #eee',
              backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white'
            }}
          >
            {item.name}
          </div>
        ))}
        
        {loading && (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            Cargando más items...
          </div>
        )}
        
        {!hasMore && (
          <div style={{ padding: '20px', textAlign: 'center', color: '#28a745' }}>
            ✓ Todos los items cargados
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export default function CustomHooksChallenge() {
  return (
    <div className="desafio">
      <h2>Desafío: Custom Hooks Avanzados</h2>
      
      <div style={{ display: 'grid', gap: '20px' }}>
        <PaginationDemo />
        <InfiniteScrollDemo />
      </div>
      
      {/* Solución */}
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h4>Solución: usePagination</h4>
        <pre style={{ 
          backgroundColor: '#1e1e1e', 
          color: '#d4d4d4', 
          padding: '15px', 
          borderRadius: '4px', 
          overflow: 'auto', 
          fontSize: '12px',
          maxHeight: '300px'
        }}>{`function usePagination({ totalItems, itemsPerPage = 10 }) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const goToPage = useCallback((page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);
  
  const nextPage = useCallback(() => goToPage(currentPage + 1), [currentPage, goToPage]);
  const prevPage = useCallback(() => goToPage(currentPage - 1), [currentPage, goToPage]);
  
  const getPageItems = useCallback((items) => {
    const start = (currentPage - 1) * itemsPerPage;
    return items.slice(start, start + itemsPerPage);
  }, [currentPage, itemsPerPage]);
  
  return {
    currentPage, totalPages, goToPage, nextPage, prevPage,
    getPageItems, hasNext: currentPage < totalPages, hasPrev: currentPage > 1
  };
}`}</pre>
      </div>
      
      <div className="explicacion">
        <h3>Desglose:</h3>
        <ul>
          <li><strong>usePagination:</strong> Lógica completa de paginación encapsulada</li>
          <li><strong>useCallback:</strong> Estabiliza funciones para evitar re-renders</li>
          <li><strong>Retorno:</strong> Objeto con valores y funciones útiles</li>
          <li><strong>Reutilización:</strong> Funciona con cualquier lista de items</li>
          <li><strong>useInfiniteScroll:</strong> IntersectionObserver para lazy loading</li>
        </ul>
      </div>
    </div>
  );
}